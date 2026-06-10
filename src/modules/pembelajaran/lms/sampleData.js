/**
 * Data CONTOH untuk pratinjau visual kerangka (akses dengan ?demo=1).
 * BUKAN data nyata — hanya agar struktur SPADA & ikon per tipe bisa dinilai di browser
 * tanpa perlu backend tersinkron. Akan dihapus/diabaikan saat data asli dipakai.
 */
export const SAMPLE_SECTIONS = [
  {
    id: "demo-s1",
    pertemuan: 1,
    title: "Pengenalan & Kontrak Kuliah",
    description: "Topik pembuka: aturan, silabus, dan rencana pembelajaran semester.",
    is_published: true,
    content_items: [
      {
        id: "d1",
        type: "page",
        title: "Sambutan & Kontrak Perkuliahan",
        is_published: true,
        payload: {
          html: "<h2>Selamat Datang</h2><p>Mata kuliah ini membahas <strong>Pemrograman Berorientasi Objek</strong>. Harap perhatikan aturan berikut:</p><ul><li>Kehadiran minimal 75%.</li><li>Tugas dikumpulkan tepat waktu.</li><li>Diskusi aktif di forum.</li></ul><p>Tautan referensi: <a href=\"https://uika-bogor.ac.id\" target=\"_blank\">UIKA Bogor</a>.</p>",
        },
      },
      { id: "d2", type: "pdf", title: "RPS Pemrograman Berorientasi Objek.pdf", is_published: true, payload: { file_name: "RPS-OOP.pdf" } },
      { id: "d3", type: "url", title: "Grup Diskusi WhatsApp Kelas", is_published: true, payload: { url: "https://chat.whatsapp.com/contoh", label: "Grup WhatsApp Kelas TI-3A", open_in_new_tab: true } },
      { id: "d4", type: "forum", title: "Perkenalan Mahasiswa", is_published: true },
    ],
  },
  {
    id: "demo-s2",
    pertemuan: 2,
    title: "Konsep Dasar Objek & Kelas",
    description: "",
    is_published: true,
    content_items: [
      { id: "d5", type: "ppt", title: "Slide - Class, Object, Atribut.pptx", is_published: true, payload: { file_name: "Slide-Class-Object.pptx" } },
      { id: "d6", type: "video", title: "Video: OOP dalam 10 Menit", is_published: true, payload: { video_id: "pTB0EiLXUC8", title: "OOP dalam 10 Menit" } },
      { id: "d7", type: "assignment", title: "Tugas 1 - Membuat Diagram Kelas", is_published: false },
    ],
  },
  {
    id: "demo-s3",
    pertemuan: 3,
    title: "Encapsulation (belum terbit)",
    description: "",
    is_published: false,
    content_items: [],
  },
];
