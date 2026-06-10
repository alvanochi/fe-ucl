import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import SortIcon from "../../components/SortIcon";
import Form from "../../components/Form";
import Modal from "../../components/Modal";
import Pagination from "../../components/Pagination";
import useModal from "../../hooks/useModal";
import useForm from "../../hooks/useForm";
import useUser from "../../hooks/useUser";
import { toastAlert } from "../../lib/sweetalert";

import PersuratanCreate from "./create";
import PersuratanDetail from "./detail";

function PersuratanFilter({ filter, handler, className }) {
  const { form, inputHandler, setForm } = useForm(filter);
  const { show, toggle, close } = useModal({
    onClose: () => {
      handler({});
      setForm({});
    },
  });

  const submitHandler = (event) => {
    event.preventDefault();
    handler(form);
    toggle();
  };

  return (
    <>
      <Button variant="primary" icon={<Icon icon="clarity:filter-line" width={20} height={20} />} onClick={toggle} pill className={className}>
        Filter Data
      </Button>
      <Modal title="Filter Berdasarkan" show={show} handler={toggle}>
        <Form onSubmit={submitHandler} className="grid grid-cols-1 gap-4">
          <Form.Group>
            <Form.Label>Tipe Surat</Form.Label>
            <Form.Select
              name="tipe"
              onChange={inputHandler}
              value={form?.tipe ?? ""}
              emptyStateLabel="Semua Tipe"
              options={[
                { label: "Surat Masuk (Inbox)", value: "Masuk" },
                { label: "Surat Keluar (Outbox)", value: "Keluar" },
              ]}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Kondisi Status</Form.Label>
            <Form.Select
              name="kondisi"
              onChange={inputHandler}
              value={form?.kondisi ?? ""}
              emptyStateLabel="Semua Kondisi"
              options={[
                { label: "Belum Dibalas (Sent/Read)", value: "Belum Dibalas" },
                { label: "Dibalas (Replied)", value: "Dibalas" },
                { label: "Open (Sedang Diproses)", value: "Open" },
                { label: "Closed (Selesai)", value: "Closed" },
              ]}
            />
          </Form.Group>
          <Form.Group className="flex gap-2 mt-4">
            <Button type="button" variant="secondary" onClick={close}>
              Kosongkan
            </Button>
            <Button type="submit" variant="primary" className="grow">
              Terapkan
            </Button>
          </Form.Group>
        </Form>
      </Modal>
    </>
  );
}

export default function PersuratanModule({ isPreview = false }) {
  const { user } = useUser({ redirectTo: "/login" });
  const [view, setView] = useState("index");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({});
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [suratList, setSuratList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" });
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const myUserId = user?.user_id || user?.id;

  useEffect(() => {
    if (view !== "index" || !user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/surat?mode=all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rows = res.data?.data?.rows || res.data?.rows || res.data?.data;
        if (rows) {
          setSuratList(rows);
        }
      } catch (err) {
        console.error("Gagal memuat data persuratan:", err);
        toastAlert("error", "Gagal mengambil data dari server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view, user]);

  const sortBy = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const getSortBy = (key) => (sortConfig.key === key ? sortConfig.direction : undefined);

  const processedSurat = useMemo(() => {
    let result = suratList.filter((s) => {
      const searchLower = search.toLowerCase();
      const perihal = s.form_data?.perihal?.toLowerCase() || "";
      const jenis = s.jenis_surat?.toLowerCase() || "";
      const namaMhs = s.Pengirim?.personal_data?.nama_lengkap?.toLowerCase() || "";
      const matchSearch = perihal.includes(searchLower) || namaMhs.includes(searchLower) || jenis.includes(searchLower);

      const isSuratMasuk = s.penerima_id === myUserId;
      let matchType = true;
      if (filter.tipe === "Masuk") matchType = isSuratMasuk;
      if (filter.tipe === "Keluar") matchType = !isSuratMasuk;

      let matchKondisi = true;
      if (filter.kondisi === "Belum Dibalas") matchKondisi = ["Sent", "Read"].includes(s.status);
      if (filter.kondisi === "Dibalas") matchKondisi = s.status === "Replied";
      if (filter.kondisi === "Open") matchKondisi = !["Selesai"].includes(s.status);
      if (filter.kondisi === "Closed") matchKondisi = ["Selesai"].includes(s.status);

      return matchSearch && matchType && matchKondisi;
    });

    result.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "nama_pengirim") {
        aValue = a.Pengirim?.personal_data?.nama_lengkap || "";
        bValue = b.Pengirim?.personal_data?.nama_lengkap || "";
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [suratList, search, filter, sortConfig, myUserId]);

  useEffect(() => {
    setPage(1);
  }, [search, filter, sortConfig]);

  const pageCount = Math.ceil(processedSurat.length / ITEMS_PER_PAGE);
  const paginatedSurat = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return processedSurat.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedSurat, page]);

  const handleGoDetail = async (s) => {
    if (loadingId) return;
    try {
      setLoadingId(s.id);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/surat/${s.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedData = res.data?.data || res.data;
      if (fetchedData) {
        setSelectedSurat(fetchedData);
        setView("detail");
      }
    } catch (err) {
      console.error("Gagal memuat detail surat:", err);
      toastAlert("error", "Gagal memuat detail surat.");
    } finally {
      setLoadingId(null);
    }
  };

  if (view === "create") return <PersuratanCreate onBack={() => setView("index")} />;
  if (view === "detail") return <PersuratanDetail onBack={() => setView("index")} surat={selectedSurat} isAdmin={isAdmin} />;

  const content = (
    <>
      <div className="w-full max-w-full overflow-hidden [&_h1]:text-xl [&_h1]:sm:text-2xl [&_h1]:md:text-3xl [&_h1]:font-black [&_h1]:tracking-tight">
        <PageHeader title="Manajemen Persuratan" icon="mdi:email-outline" />
      </div>

      <div className="my-6 lg:my-8">
        {/* SUMMARY CARDS */}
        <Card className="mb-8 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <Card.Header className="bg-primary-600 text-white text-center text-sm font-bold py-3 uppercase tracking-widest">Ringkasan Pengajuan Surat</Card.Header>
          <Card.Body className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <SummaryCard label="Surat Keluar" count={suratList.filter((s) => s.penerima_id !== myUserId).length} icon="mdi:email-send-outline" />
              <SummaryCard label="Belum Dibalas" count={suratList.filter((s) => ["Sent", "Read"].includes(s.status)).length} icon="mdi:email-alert-outline" />
              <SummaryCard label="Dibalas" count={suratList.filter((s) => s.status === "Replied").length} icon="mdi:email-check-outline" />
              <SummaryCard label="Open" count={suratList.filter((s) => !["Selesai"].includes(s.status)).length} icon="mdi:folder-open-outline" />
              <SummaryCard label="Closed" count={suratList.filter((s) => ["Selesai"].includes(s.status)).length} icon="mdi:folder-lock-outline" />
            </div>
          </Card.Body>
        </Card>

        {/* TOOLBAR */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={20} />
            <input
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
              placeholder="Cari perihal, jenis surat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <PersuratanFilter filter={filter} handler={setFilter} className="w-full sm:w-auto justify-center" />
            <Button onClick={() => setView("create")} variant="primary" className="w-full sm:w-auto justify-center" icon={<Icon icon="mdi:file-plus-outline" width={20} />} pill>
              Ajukan Surat
            </Button>
          </div>
        </div>

        <div className="flex items-start mb-4">
          <span className="text-sm text-gray-500">
            Total Data: <b>{processedSurat.length}</b>
          </span>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto shadow-sm rounded-2xl border border-gray-200">
          <table className="w-full border-collapse table-auto min-w-[900px]" cellPadding={12}>
            <thead>
              <tr className="bg-gray-200">
                <th className="text-sm border-2 border-white text-gray-700 w-12 text-center">No</th>
                <th className="text-sm border-2 border-white text-gray-700">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary-600" onClick={() => sortBy("created_at")}>
                    Tanggal & Waktu <SortIcon sort={getSortBy("created_at")} />
                  </div>
                </th>
                <th className="text-sm border-2 border-white text-gray-700">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary-600" onClick={() => sortBy("nama_pengirim")}>
                    Tipe & Pengirim <SortIcon sort={getSortBy("nama_pengirim")} />
                  </div>
                </th>
                <th className="text-sm border-2 border-white text-gray-700">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary-600" onClick={() => sortBy("jenis_surat")}>
                    Jenis & Perihal <SortIcon sort={getSortBy("jenis_surat")} />
                  </div>
                </th>
                <th className="text-sm border-2 border-white text-gray-700 text-center">
                  <div className="flex items-center justify-center gap-2 cursor-pointer" onClick={() => sortBy("status")}>
                    Status <SortIcon sort={getSortBy("status")} />
                  </div>
                </th>
                <th className="text-sm border-2 border-white text-gray-700 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 bg-gray-50 text-center">
                    <Icon icon="mdi:loading" className="animate-spin text-primary-500" width={32} />
                  </td>
                </tr>
              ) : paginatedSurat.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 bg-gray-50 text-center text-gray-400">
                    Tidak ada data persuratan.
                  </td>
                </tr>
              ) : (
                paginatedSurat.map((s, i) => {
                  const isSuratMasuk = s.penerima_id === myUserId;
                  const d = new Date(s.created_at);
                  const rowNumber = (page - 1) * ITEMS_PER_PAGE + i + 1;
                  const isDisposisi = !!s.form_data?.catatan_disposisi;

                  return (
                    <tr key={s.id} className="hover:bg-gray-100 transition-colors">
                      <td className="text-sm border-2 border-white bg-gray-50 text-center font-bold text-gray-400">{rowNumber}</td>
                      <td className="text-sm border-2 border-white bg-gray-50">
                        <p className="font-bold text-gray-800">{d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</p>
                        <p className="text-[11px] text-gray-500">{d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</p>
                      </td>
                      <td className="text-sm border-2 border-white bg-gray-50">
                        <div className="mb-1">
                          <span className={classNames("text-[9px] font-bold uppercase px-2 py-0.5 rounded", isSuratMasuk ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700")}>{isSuratMasuk ? "Masuk" : "Keluar"}</span>
                        </div>
                        <p className="font-bold text-gray-800 leading-tight">{s.Pengirim?.personal_data?.nama_lengkap || "N/A"}</p>
                        <p className="text-[10px] text-gray-400">{s.Pengirim?.npm || s.Pengirim?.nidn || "-"}</p>
                      </td>
                      <td className="text-sm border-2 border-white bg-gray-50">
                        {isDisposisi && (
                          <div className="mb-1">
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-600 shadow-sm">
                              <Icon icon="mdi:share-all" width={12} /> Disposisi
                            </span>
                          </div>
                        )}
                        <p className="font-bold text-gray-700 capitalize">{s.jenis_surat}</p>
                        <p className="text-xs text-primary-600 font-semibold truncate max-w-[250px]" title={s.form_data?.perihal || "-"}>
                          {s.form_data?.perihal || "-"}
                        </p>
                      </td>
                      <td className="text-sm border-2 border-white bg-gray-50 text-center">
                        <span
                          className={classNames("text-[10px] font-black uppercase px-3 py-1.5 rounded-full inline-block min-w-[85px]", {
                            "bg-blue-100 text-blue-700": s.status === "Sent",
                            "bg-yellow-100 text-yellow-700": s.status === "Read",
                            "bg-purple-100 text-purple-700": s.status === "Replied",
                            "bg-gray-200 text-gray-700": s.status === "Selesai",
                          })}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="text-sm border-2 border-white bg-gray-50 text-center">
                        <button
                          onClick={() => handleGoDetail(s)}
                          disabled={loadingId === s.id}
                          className="w-8 h-8 inline-flex items-center justify-center bg-white border border-gray-200 text-primary-600 rounded-lg hover:bg-primary-50 shadow-sm transition-all outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {/* Logika merubah Icon eye jadi muter kalau lg loading */}
                          {loadingId === s.id ? <Icon icon="mdi:loading" className="animate-spin text-primary-600" width={18} /> : <Icon icon="mdi:eye" width={18} />}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {processedSurat.length > 0 && (
          <div className="mt-8">
            <Pagination current={page} max={pageCount} handler={setPage} canPrev={page > 1} canNext={page < pageCount} />
          </div>
        )}
      </div>
    </>
  );

  return isPreview ? content : <Layout>{content}</Layout>;
}

const SummaryCard = ({ label, count, icon }) => (
  <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex flex-col hover:shadow-md transition-all group">
    <div className="inline-flex w-10 h-10 rounded-full bg-primary-600 mb-3 items-center justify-center text-white group-hover:scale-110 transition-transform">
      <Icon icon={icon} width={20} />
    </div>
    <p className="text-2xl font-black text-gray-800 leading-none mb-1">{count}</p>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
  </div>
);
