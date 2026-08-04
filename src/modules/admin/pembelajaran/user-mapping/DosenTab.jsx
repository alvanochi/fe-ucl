import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import { toastAlert } from "../../../../lib/sweetalert";

const SYNC_BASE = () => `${process.env.NEXT_PUBLIC_API_URL}/siak-sync`;

// react-select LANGSUNG, bukan lewat Form.Combobox — Form.Combobox menerjemahkan
// onChange jadi event sintetis {target:{value}} lalu re-derive `selected` dari situ
// lewat effect terpisah; pilihan sempat tidak "nempel" lewat jalur itu. Di sini
// `onChange` react-select langsung kasih objek option yang dipilih, disimpan
// apa adanya — tidak ada lapisan penerjemah yang bisa berantakan.
function DosenRow({ row, onLinked }) {
  const suggestionOptions = (row.name_suggestions || []).map((s) => ({
    value: s.tias_user_id,
    label: `${s.nama_tias} (${s.email}) — skor ${(s.score * 100).toFixed(0)}%`,
  }));
  const best = row.name_suggestions?.[0];

  const [selected, setSelected] = useState(
    best && best.score >= 0.5
      ? { value: best.tias_user_id, label: `${best.nama_tias} (${best.email}) — skor ${(best.score * 100).toFixed(0)}%` }
      : null
  );
  const [manualOptions, setManualOptions] = useState([]);
  const [linking, setLinking] = useState(false);

  const options = [...suggestionOptions, ...manualOptions];

  const searchManual = async (term) => {
    if (!term || term.trim().length < 2) return;
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/list-users`, {
        params: { search: term, limit: 10, filter: "role", filterValue: "Dosen" },
      });
      const users = res.data?.data?.rows || [];
      setManualOptions(
        users.map((u) => ({
          value: u.user_id,
          label: `${u.personal_data?.nama_lengkap || u.email} (${u.email})`,
        }))
      );
    } catch (_) {
      // biarkan dropdown kosong, admin bisa coba lagi
    }
  };

  const link = async () => {
    if (!selected?.value) return toastAlert("error", "Pilih dosen TIAS terlebih dahulu.");
    setLinking(true);
    try {
      await axios.post(`${SYNC_BASE()}/user-mappings`, {
        tias_user_id: selected.value,
        siak_user_uuid: row.siak_dosen_id,
      });
      toastAlert("success", `${row.nama_siak} berhasil ditautkan.`);
      onLinked(row.siak_dosen_id);
    } catch (error) {
      toastAlert("error", error?.response?.data?.responseMessage || "Gagal menautkan dosen.");
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 p-4">
      <div className="min-w-[220px] flex-1">
        <p className="font-medium text-gray-800">{row.nama_siak || "(tanpa nama)"}</p>
        <p className="text-xs text-gray-400">
          NIDN SIAK: {row.nidn_siak || "-"} · {row.jumlah_kelas} kelas
        </p>
      </div>
      <div className="min-w-[280px] flex-1">
        <Select
          placeholder="Pilih atau cari nama dosen TIAS…"
          value={selected}
          options={options}
          onChange={(option) => setSelected(option)}
          onInputChange={(term, meta) => {
            if (meta.action === "input-change") searchManual(term);
          }}
          isClearable
        />
      </div>
      <Button
        variant="primary"
        disabled={linking || !selected}
        onClick={link}
        icon={<Icon icon="ic:baseline-link" width={18} height={18} />}
      >
        {linking ? "Menautkan…" : "Tautkan"}
      </Button>
    </div>
  );
}

export default function DosenTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SYNC_BASE()}/user-mappings/unmatched`, { params: { scope: "dosen" } });
      setRows(res.data?.data?.dosen?.rows || []);
    } catch (error) {
      toastAlert("error", error?.response?.data?.responseMessage || "Gagal memuat daftar dosen belum ter-link.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleLinked = (siakDosenId) => {
    setRows((prev) => prev.filter((r) => r.siak_dosen_id !== siakDosenId));
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
      {rows.map((row) => (
        <DosenRow key={row.siak_dosen_id} row={row} onLinked={handleLinked} />
      ))}
    </div>
  );
}
