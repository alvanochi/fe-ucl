import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import { toastAlert } from "../../../../lib/sweetalert";
import useDebounce from "../../../../hooks/useDebounce";

const SYNC_BASE = () => `${process.env.NEXT_PUBLIC_API_URL}/siak-sync`;

async function postMapping(tiasUserId, siakUserUuid) {
  return axios.post(`${SYNC_BASE()}/user-mappings`, {
    tias_user_id: tiasUserId,
    siak_user_uuid: siakUserUuid,
  });
}

// Baris sendiri (bukan inline di .map()) supaya state combobox pencarian manual
// (`selected`/`manualOptions`) jadi lokal milik baris ini — tidak ikut dibuat ulang
// tiap kali baris LAIN atau state pencarian/paginasi di tab ini berubah. Itu yang
// bikin pilihan combobox sempat tidak "nempel" pada percobaan sebelumnya.
function MahasiswaRow({ row, checked, onToggleSelect, onLinked }) {
  const [manualOptions, setManualOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [linking, setLinking] = useState(false);

  const searchManual = async (term) => {
    if (!term || term.trim().length < 2) return;
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/list-users`, {
        params: { search: term, limit: 10, filter: "role", filterValue: "Mahasiswa" },
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

  const link = async (tiasUserId) => {
    if (!tiasUserId) return toastAlert("error", "Pilih akun TIAS terlebih dahulu.");
    setLinking(true);
    try {
      await postMapping(tiasUserId, row.siak_mahasiswa_id);
      toastAlert("success", `${row.nama_siak} berhasil ditautkan.`);
      onLinked(row.siak_mahasiswa_id);
    } catch (error) {
      toastAlert("error", error?.response?.data?.responseMessage || "Gagal menautkan.");
    } finally {
      setLinking(false);
    }
  };

  return (
    <tr>
      <td className="text-sm border-2 border-white bg-gray-50">
        {row.match_status === "npm_match" && (
          <Form.Checkbox checked={checked} onChange={() => onToggleSelect(row.siak_mahasiswa_id)} />
        )}
      </td>
      <td className="text-sm border-2 border-white bg-gray-50">{row.nama_siak || "-"}</td>
      <td className="text-sm border-2 border-white bg-gray-50">{row.npm || "-"}</td>
      <td className="text-sm border-2 border-white bg-gray-50">{row.jumlah_kelas}</td>
      <td className="text-sm border-2 border-white bg-gray-50">
        {row.match_status === "npm_match" ? (
          <span className="text-emerald-600">
            Match NPM: {row.nama_tias} ({row.tias_email})
          </span>
        ) : (
          <span className="text-gray-400">Tidak ada match NPM</span>
        )}
      </td>
      <td className="text-sm border-2 border-white bg-gray-50">
        {row.match_status === "npm_match" ? (
          <Button.Icon
            variant="primary"
            icon={<Icon icon="ic:baseline-link" width={18} height={18} />}
            disabled={linking}
            onClick={() => link(row.tias_user_id)}
          />
        ) : (
          <div className="flex min-w-[260px] items-center gap-2">
            <div className="flex-1">
              <Form.Combobox
                placeholder="Cari nama/NPM TIAS…"
                value={selected}
                options={manualOptions}
                onSearch={searchManual}
                onChange={(e) => {
                  const found = manualOptions.find((o) => o.value === e.target.value) || null;
                  setSelected(found);
                }}
              />
            </div>
            <Button.Icon
              variant="primary"
              icon={<Icon icon="ic:baseline-link" width={18} height={18} />}
              disabled={linking || !selected}
              onClick={() => link(selected?.value)}
            />
          </div>
        )}
      </td>
    </tr>
  );
}

export default function MahasiswaTab() {
  const { debounce } = useDebounce();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [selected, setSelected] = useState(new Set()); // siak_mahasiswa_id (npm_match saja)
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SYNC_BASE()}/user-mappings/unmatched`, {
        params: { scope: "mahasiswa", mahasiswa_search: search, mahasiswa_page: page, mahasiswa_limit: 25 },
      });
      const data = res.data?.data?.mahasiswa;
      setRows(data?.rows || []);
      setTotalPage(data?.total_page || 1);
    } catch (error) {
      toastAlert("error", error?.response?.data?.responseMessage || "Gagal memuat daftar mahasiswa belum ter-link.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedLoad = debounce(load, 400);

  useEffect(() => {
    debouncedLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  useEffect(() => {
    setSelected(new Set());
  }, [rows]);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleLinked = (siakId) => {
    setRows((prev) => prev.filter((r) => r.siak_mahasiswa_id !== siakId));
  };

  const npmMatchRows = rows.filter((r) => r.match_status === "npm_match");
  const allNpmMatchSelected = npmMatchRows.length > 0 && npmMatchRows.every((r) => selected.has(r.siak_mahasiswa_id));

  const toggleSelectAll = () => {
    setSelected(allNpmMatchSelected ? new Set() : new Set(npmMatchRows.map((r) => r.siak_mahasiswa_id)));
  };

  const confirmSelected = async () => {
    const pairs = rows
      .filter((r) => selected.has(r.siak_mahasiswa_id))
      .map((r) => ({ tias_user_id: r.tias_user_id, siak_user_uuid: r.siak_mahasiswa_id }));
    if (!pairs.length) return;

    setBulkSubmitting(true);
    try {
      const res = await axios.post(`${SYNC_BASE()}/user-mappings/bulk`, { pairs });
      const { created_count, failed_count } = res.data?.data || {};
      toastAlert(
        failed_count ? "info" : "success",
        `${created_count} mapping berhasil dibuat${failed_count ? `, ${failed_count} gagal (kemungkinan sudah ter-link duluan).` : "."}`
      );
      load();
    } catch (error) {
      toastAlert("error", error?.response?.data?.responseMessage || "Gagal konfirmasi mapping terpilih.");
    } finally {
      setBulkSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Form.Input
          type="text"
          placeholder="Cari nama/NPM…"
          style={{ width: "320px" }}
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        {selected.size > 0 && (
          <Button variant="primary" disabled={bulkSubmitting} onClick={confirmSelected}>
            {bulkSubmitting ? "Memproses…" : `Konfirmasi Terpilih (${selected.size})`}
          </Button>
        )}
      </div>

      <table className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto" cellPadding={10}>
        <thead>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">
              <Form.Checkbox checked={allNpmMatchSelected} onChange={toggleSelectAll} disabled={!npmMatchRows.length} />
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">Nama (SIAK)</th>
            <th className="text-sm border-2 border-white bg-gray-200">NPM</th>
            <th className="text-sm border-2 border-white bg-gray-200">Kelas</th>
            <th className="text-sm border-2 border-white bg-gray-200">Status</th>
            <th className="text-sm border-2 border-white bg-gray-200">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="6" className="text-sm border-2 border-white bg-gray-50 text-center">Memuat…</td>
            </tr>
          )}
          {!loading && !rows.length && (
            <tr>
              <td colSpan="6" className="text-sm border-2 border-white bg-gray-50 text-center">
                Tidak ada mahasiswa belum ter-link.
              </td>
            </tr>
          )}
          {!loading &&
            rows.map((row) => (
              <MahasiswaRow
                key={row.siak_mahasiswa_id}
                row={row}
                checked={selected.has(row.siak_mahasiswa_id)}
                onToggleSelect={toggleSelect}
                onLinked={handleLinked}
              />
            ))}
        </tbody>
      </table>

      <div className="flex mt-4">
        <div className="flex gap-1 ml-auto">
          <Button.Icon
            variant="outline-primary"
            icon={<Icon icon="material-symbols:chevron-left" width={20} height={20} />}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            pill
          />
          <Button
            variant="primary"
            icon={<Icon icon="material-symbols:chevron-right" width={20} height={20} />}
            iconPosition="right"
            onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
            disabled={page >= totalPage}
            pill
          >
            Halaman {page}/{totalPage}
          </Button>
        </div>
      </div>
    </div>
  );
}
