import {
  ROLE_ID_DOSEN,
  ROLE_ID_MAHASISWA,
  ROLE_ID_ADMIN,
  ROLE_ID_DEMO,
  ROLE_ID_DOSEN_EXT,
  ROLE_ID_PEGAWAI,
} from "./role";

export const APP_MENU = [
  {
    label: "Dashboard",
    url: "/",
    group: "Main",
    icon: "material-symbols:space-dashboard-rounded",
    allowedRoles: [
      ROLE_ID_ADMIN,
      ROLE_ID_DOSEN,
      ROLE_ID_MAHASISWA,
      ROLE_ID_ADMIN,
      ROLE_ID_DEMO,
      ROLE_ID_DOSEN_EXT,
      ROLE_ID_PEGAWAI,
    ],
    submenus: [],
  },
  {
    label: "Profil",
    group: "Main",
    url: "/profil",
    icon: "mdi:user-circle",
    allowedRoles: [
      ROLE_ID_ADMIN,
      ROLE_ID_DOSEN,
      ROLE_ID_MAHASISWA,
      ROLE_ID_DEMO,
      ROLE_ID_DOSEN_EXT,
      ROLE_ID_PEGAWAI,
    ],
    submenus: [
      {
        label: "Kependudukan",
        url: "#kependudukan",
        allowedRoles: [
          ROLE_ID_ADMIN,
          ROLE_ID_DOSEN,
          ROLE_ID_MAHASISWA,
          ROLE_ID_DEMO,
          ROLE_ID_DOSEN_EXT,
          ROLE_ID_PEGAWAI,
        ],
      },
      {
        label: "Alamat dan Kontak",
        url: "#alamat-dan-kontak",
        allowedRoles: [
          ROLE_ID_ADMIN,
          ROLE_ID_DOSEN,
          ROLE_ID_MAHASISWA,
          ROLE_ID_DEMO,
          ROLE_ID_DOSEN_EXT,
          ROLE_ID_PEGAWAI,
        ],
      },
      {
        label: "Keluarga",
        url: "#keluarga",
        allowedRoles: [
          ROLE_ID_ADMIN,
          ROLE_ID_DOSEN,
          ROLE_ID_MAHASISWA,
          ROLE_ID_DEMO,
          ROLE_ID_PEGAWAI,
        ],
      },
      {
        label: "Wali",
        url: "#wali",
        allowedRoles: [ROLE_ID_MAHASISWA],
      },
      {
        label: "Lainya",
        url: "#lainya",
        allowedRoles: [ROLE_ID_DOSEN, ROLE_ID_MAHASISWA, ROLE_ID_DOSEN_EXT],
      },
      {
        label: "Kepangkatan",
        url: "#kepangkatan",
        allowedRoles: [ROLE_ID_DOSEN],
      },
      {
        label: "Jabatan Fungsional",
        url: "#jabatan-fungsional",
        allowedRoles: [ROLE_ID_DOSEN],
      },
    ],
  },
  {
    label: "Presensi",
    url: "/absen",
    icon: "mdi:account-card-details",
    group: "Tri Dharma Plus",
    allowedRoles: [ROLE_ID_DOSEN, ROLE_ID_ADMIN],
    submenus: [
      {
        label: "Daftar Hadir",
        url: "#daftar-hadir",
        allowedRoles: [ROLE_ID_DOSEN],
      },
      {
        label: "Rekap Kehadiran",
        url: "#rekap-kehadiran",
        allowedRoles: [ROLE_ID_DOSEN],
      },
      {
        label: "Rekap Presensi",
        url: "#rekap-absensi",
        allowedRoles: [ROLE_ID_ADMIN],
      },
    ],
  },
  {
    label: "Jadwal Kegiatan",
    url: "/jadwal-rapat",
    icon: "mdi-clock-fast",
    group: "Kegiatan",
    allowedRoles: [
      ROLE_ID_ADMIN,
      ROLE_ID_DOSEN,
      ROLE_ID_MAHASISWA,
      ROLE_ID_DEMO,
    ],
    submenus: [],
  },
  {
    label: "Pelaksanaan Pendidikan",
    url: "/pelaksanaan-pendidikan",
    group: "Tri Dharma Plus",
    icon: "mdi:bookshelf",
    allowedRoles: [
      ROLE_ID_ADMIN,
      ROLE_ID_DOSEN,
      ROLE_ID_MAHASISWA,
      ROLE_ID_DOSEN_EXT,
    ],
    submenus: [
      {
        label: "IP",
        url: "#ip",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA],
      },
      {
        label: "Perkuliahan",
        url: "#perkuliahan",
        allowedRoles: [ROLE_ID_MAHASISWA],
      },
      {
        label: "Tugas Akhir",
        url: "#tugas-akhir",
        allowedRoles: [
          ROLE_ID_ADMIN,
          ROLE_ID_MAHASISWA,
          ROLE_ID_DOSEN,
          ROLE_ID_DOSEN_EXT,
        ],
      },
      {
        label: "B-Akademik",
        url: "#akademik",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA, ROLE_ID_DOSEN],
      },
      {
        label: "Bimbingan",
        url: "#bimbingan",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
      },
    ],
  },
  {
    label: "Pelaksanaan Penelitian",
    url: "/pelaksanaan-penelitian",
    group: "Tri Dharma Plus",
    icon: "fa:flask",
    allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA, ROLE_ID_DOSEN],
    submenus: [
      {
        label: "Penelitian",
        url: "#penelitian",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN],
      },
      {
        label: "Publikasi Karya",
        url: "#publikasi-karya",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA, ROLE_ID_DOSEN],
      },
      {
        label: "HKI",
        url: "#hki",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA, ROLE_ID_DOSEN],
      },
    ],
  },
  {
    label: "Pelaksanaan Pengabdian",
    url: "/pelaksanaan-pengabdian",
    icon: "fa6-solid:hand-holding-hand",
    group: "Tri Dharma Plus",
    allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA, ROLE_ID_DOSEN],
    submenus: [
      {
        label: "Pengabdian",
        url: "#pengabdian",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA, ROLE_ID_DOSEN],
      },
      {
        label: "Pembicara",
        url: "#pembicara",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA, ROLE_ID_DOSEN],
      },
    ],
  },
  {
    label: "Penunjang",
    url: "/penunjang",
    group: "Tri Dharma Plus",
    icon: "solar:users-group-two-rounded-bold-duotone",
    allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA],
    submenus: [
      {
        label: "Anggota Profesi",
        url: "#anggota-profesi",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA],
      },
      {
        label: "Penghargaan",
        url: "#penghargaan",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA],
      },
    ],
  },
  {
    label: "Kompetensi",
    url: "/kompetensi",
    group: "Tri Dharma Plus",
    icon: "icon-park-outline:certificate",
    allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA],
    submenus: [
      {
        label: "Sertifikasi",
        url: "#sertifikasi",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA],
      },
      {
        label: "Test",
        url: "#test",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA],
      },
    ],
  },
  {
    label: "Kualifikasi",
    url: "/kualifikasi",
    group: "Tri Dharma Plus",
    icon: "iconoir:graduation-cap",
    allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA],
    submenus: [
      {
        label: "Pendidikan Formal",
        url: "#pendidikan-formal",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA],
      },
      {
        label: "Riwayat Pekerjaan",
        url: "#riwayat-pekerjaan",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA],
      },
    ],
  },
  {
    label: "Jafung Dosen",
    url: "/dosenOnly",
    group: "Tri Dharma Plus",
    icon: "iconoir:reports-solid",
    allowedRoles: [ROLE_ID_ADMIN],
    submenus: [
      {
        label: "Kepangkatan Dosen",
        url: "#kepangkatan",
        allowedRoles: [ROLE_ID_ADMIN],
      },
      {
        label: "Jabatan Fungsional",
        url: "#jabatan-fungsional",
        allowedRoles: [ROLE_ID_ADMIN],
      },
    ],
  },
  {
    label: "Berita",
    url: "/berita",
    icon: "iconoir:rss-feed-tag",
    group: "Kegiatan",
    allowedRoles: [ROLE_ID_ADMIN],
    submenus: [
      {
        label: "Tantangan",
        url: "#tantangan",
        allowedRoles: [ROLE_ID_ADMIN],
      },
      {
        label: "Event",
        url: "#event",
        allowedRoles: [ROLE_ID_ADMIN],
      },
    ],
  },
  {
    label: "E-Voting",
    url: "/e-voting",
    group: "Kegiatan",
    icon: "ic:twotone-how-to-vote",
    allowedRoles: [ROLE_ID_ADMIN],
    submenus: [
      {
        label: "voting",
        url: "#voting",
        allowedRoles: [ROLE_ID_ADMIN],
      },
    ],
  },
  {
    label: "Laporan",
    url: "/laporan",
    group: "Laporan Lapangan",
    icon: "ic:outline-report",
    allowedRoles: [ROLE_ID_ADMIN],
    submenus: [
      {
        label: "Laporan",
        url: "#laporan",
        allowedRoles: [ROLE_ID_ADMIN],
      },
      {
        label: "Statistik",
        url: "#laporan-statistik",
        allowedRoles: [ROLE_ID_ADMIN],
      },
      {
        label: "Sebaran",
        url: "#laporan-sebaran",
        allowedRoles: [ROLE_ID_ADMIN],
      },
    ],
  },
  {
    label: "Gamify",
    url: "/gamify-tias",
    icon: "iconoir:gamepad",
    allowedRoles: [ROLE_ID_ADMIN],
    group: "Gamifikasi",
    submenus: [],
  },
  {
    label: "Kategori Gamify",
    url: "/gamify",
    group: "Gamifikasi",
    icon: "iconoir:gamepad",
    allowedRoles: [ROLE_ID_ADMIN],
    submenus: [
      {
        label: "Kompetensi",
        url: "#kategori-sertifikasi",
        allowedRoles: [ROLE_ID_ADMIN],
      },
      {
        label: "Publikasi",
        url: "#kategori-publikasi",
        allowedRoles: [ROLE_ID_ADMIN],
      },
      {
        label: "Profesi",
        url: "#kategori-profesi",
        allowedRoles: [ROLE_ID_ADMIN],
      },
      {
        label: "Prestasi",
        url: "#kategori-prestasi",
        allowedRoles: [ROLE_ID_ADMIN],
      },
      {
        label: "HKI",
        url: "#kategori-hki",
        allowedRoles: [ROLE_ID_ADMIN],
      },
      {
        label: "IP",
        url: "#kategori-ip",
        allowedRoles: [ROLE_ID_ADMIN],
      },
      {
        label: "Rekomendasi",
        url: "#kategori-rekomendasi",
        allowedRoles: [ROLE_ID_ADMIN],
      },
    ],
  },
  {
    label: "Users",
    url: "/users",
    group: "Master",
    icon: "flowbite:users-solid",
    allowedRoles: [ROLE_ID_ADMIN],
    submenus: [
      {
        label: "Mahasiswa",
        url: "#list-mhs",
        allowedRoles: [ROLE_ID_ADMIN],
      },
      {
        label: "Mahasiswa Beasiswa",
        url: "#list-mhs-beasiswa",
        allowedRoles: [ROLE_ID_ADMIN],
      },
      {
        label: "Dosen",
        url: "#list-dosen",
        allowedRoles: [ROLE_ID_ADMIN],
      },
      {
        label: "Dosen External",
        url: "#list-dosen-ext",
        allowedRoles: [ROLE_ID_ADMIN],
      },
    ],
  },
  {
    label: "Rekomendasi Mahasiswa",
    url: "/rek-mhs",
    group: "Gamifikasi",
    icon: "mdi-certificate",
    allowedRoles: [ROLE_ID_DOSEN],
    submenus: [],
  },
  {
    label: "Group",
    url: "/group",
    icon: "fa6-solid:users",
    group: "Kegiatan",
    allowedRoles: [ROLE_ID_ADMIN],
    submenus: [
      {
        label: "Group",
        url: "#group",
        allowedRoles: [ROLE_ID_ADMIN],
      },
    ],
  },
  {
    label: "Jabatan",
    url: "/jabatan",
    icon: "fluent:position-to-back-24-regular",
    allowedRoles: [ROLE_ID_ADMIN],
    submenus: [
      {
        label: "Jabatan",
        url: "#jabatan",
        allowedRoles: [ROLE_ID_ADMIN],
      },
    ],
  },
  {
    label: "Jabatan Struktural",
    url: "/struktural-prodi",
    icon: "ph:tree-structure",
    allowedRoles: [ROLE_ID_ADMIN],
    submenus: [
      {
        label: "Struktural Prodi",
        url: "#struktural-prodi",
        allowedRoles: [ROLE_ID_ADMIN],
      },
    ],
  },
  {
    label: "kategori",
    url: "/kategori",
    group: "Master",
    icon: "mdi:category-outline",
    allowedRoles: [ROLE_ID_ADMIN],
    submenus: [
      {
        label: "Kategori Laporan",
        url: "#kategori-laporan",
        allowedRoles: [ROLE_ID_ADMIN],
      },
      {
        label: "Kategori Kegiatan",
        url: "#kategori-kegiatan",
        allowedRoles: [ROLE_ID_ADMIN],
      },
    ],
  },
  {
    label: "Ruang",
    url: "/ruang",
    group: "Kegiatan",
    icon: "fluent:conference-room-24-regular",
    allowedRoles: [ROLE_ID_ADMIN],
    submenus: [
      {
        label: "Ruang",
        url: "#ruang",
        allowedRoles: [ROLE_ID_ADMIN],
      },
    ],
  },
  {
    label: "Setting",
    url: "/setting",
    icon: "ant-design:setting-filled",
    allowedRoles: [
      ROLE_ID_ADMIN,
      ROLE_ID_DOSEN,
      ROLE_ID_MAHASISWA,
      ROLE_ID_DEMO,
      ROLE_ID_PEGAWAI,
    ],
    submenus: [
      {
        label: "Ganti Password",
        url: "#change-password",
        allowedRoles: [
          ROLE_ID_ADMIN,
          ROLE_ID_DOSEN,
          ROLE_ID_MAHASISWA,
          ROLE_ID_DEMO,
          ROLE_ID_PEGAWAI,
        ],
      },
      {
        label: "Akun",
        url: "#akun",
        allowedRoles: [
          ROLE_ID_ADMIN,
          ROLE_ID_DOSEN,
          ROLE_ID_MAHASISWA,
          ROLE_ID_DEMO,
          ROLE_ID_PEGAWAI,
        ],
      },
    ],
  },
];
