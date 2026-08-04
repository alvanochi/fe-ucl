import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import { toastAlert } from "../../../../lib/sweetalert";

const SYNC_BASE = () => `${process.env.NEXT_PUBLIC_API_URL}/siak-sync`;

export default function DosenTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState({}); // siak_dosen_id -> { value, label } | null
  const [manualOptions, setManualOptions] = useState({}); // siak_dosen_id -> options[]
  const [linking, setLinking] = useState(null); // siak_dosen_id yang sedang di-submit

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SYNC_BASE()}/user-mappings/unmatched`, { params: { scope: "dosen" } });
      const dosenRows = res.data?.data?.dosen?.rows || [];
      setRows(dosenRows);
      // Pre-pilih saran teratas kalau skornya cukup yakin, admin tetap bisa ganti.
      const initial = {};
      dosenRows.forEach((row) => {
        const best = row.name_suggestions?.[0];
        if (best && best.score >= 0.5) {
          initial[row.siak_dosen_id] = { value: best.tias_user_id, label: `${best.nama_tias} (${best.email})` };
        }
      });
      setSelections(initial);
    } catch (error) {
      toastAlert("error", error?.response?.data?.responseMessage || "Gagal memuat daftar dosen belum ter-link.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const searchManual = async (siakDosenId, term) => {
    if (!term || term.trim().length < 2) return;
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/list-users`, {
        params: { search: term, limit: 10, filter: "role", filterValue: "Dosen" },
      });
      const users = res.data?.data?.rows || [];
      setManualOptions((prev) => ({
        ...prev,
        [siakDosenId]: users.map((u) => ({
          value: u.user_id,
          label: `${u.personal_data?.nama_lengkap || u.email} (${u.email})`,
        })),
      }));
    } catch (_) {
      // biarkan dropdown kosong, admin bisa coba lagi
    }
  };

  const linkDosen = async (row) => {
    const selected = selections[row.siak_dosen_id];
    if (!selected?.value) return toastAlert("error", "Pilih dosen TIAS terlebih dahulu.");

    setLinking(row.siak_dosen_id);
    try {
      await axios.post(`${SYNC_BASE()}/user-mappings`, {
        tias_user_id: selected.value,
        siak_user_uuid: row.siak_dosen_id,
      });
      toastAlert("success", `${row.nama_siak} berhasil ditautkan.`);
      setRows((prev) => prev.filter((r) => r.siak_dosen_id !== row.siak_dosen_id));
    } catch (error) {
      toastAlert("error", error?.response?.data?.responseMessage || "Gagal menautkan dosen.");
    } finally {
      setLinking(null);
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Memuat…</p>;
  if (!rows.length) {
    return (
      <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        Semua dosen dari data SIAK sudah ter-link. Tidak ada yang perlu ditinjau.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        {rows.length} dosen dari data SIAK belum tertaut ke akun TIAS. Pilih saran nama (kalau ada &
        yakin), atau cari manual, lalu klik Tautkan.
      </p>
      {rows.map((row) => {
        const options = [
          ...(row.name_suggestions || []).map((s) => ({
            value: s.tias_user_id,
            label: `${s.nama_tias} (${s.email}) — skor ${(s.score * 100).toFixed(0)}%`,
          })),
          ...(manualOptions[row.siak_dosen_id] || []),
        ];
        return (
          <div key={row.siak_dosen_id} className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 p-4">
            <div className="min-w-[220px] flex-1">
              <p className="font-medium text-gray-800">{row.nama_siak || "(tanpa nama)"}</p>
              <p className="text-xs text-gray-400">
                NIDN SIAK: {row.nidn_siak || "-"} · {row.jumlah_kelas} kelas
              </p>
            </div>
            <div className="min-w-[280px] flex-1">
              <Form.Combobox
                placeholder="Pilih atau cari nama dosen TIAS…"
                value={selections[row.siak_dosen_id] || null}
                options={options}
                onSearch={(term) => searchManual(row.siak_dosen_id, term)}
                onChange={(e) => {
                  const found = options.find((o) => o.value === e.target.value);
                  setSelections((prev) => ({ ...prev, [row.siak_dosen_id]: found || null }));
                }}
              />
            </div>
            <Button
              variant="primary"
              disabled={linking === row.siak_dosen_id || !selections[row.siak_dosen_id]}
              onClick={() => linkDosen(row)}
              icon={<Icon icon="ic:baseline-link" width={18} height={18} />}
            >
              {linking === row.siak_dosen_id ? "Menautkan…" : "Tautkan"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
