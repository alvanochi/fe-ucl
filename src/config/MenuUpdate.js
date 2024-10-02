import { data } from "autoprefixer";
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
    type: "menu",
    label: "Dashboard",
    url: "/",
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
    type: "menu",
    label: "Profil",
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
  // Tridharma Plus
  {
    type: "menu-group",
    label: "Tri Dharma Plus",
    icon: "zondicons:education",
    children: [
      {
        label: "Presensi",
        url: "/absen",
        allowedRoles: [ROLE_ID_DOSEN, ROLE_ID_ADMIN, ROLE_ID_DOSEN_EXT],
        submenus: [
          {
            label: "Daftar Hadir",
            url: "#daftar-hadir",
            allowedRoles: [ROLE_ID_DOSEN, ROLE_ID_DOSEN_EXT],
          },
          {
            label: "Rekap Kehadiran",
            url: "#rekap-kehadiran",
            allowedRoles: [ROLE_ID_DOSEN, ROLE_ID_DOSEN_EXT],
          },
          {
            label: "Rekap Presensi",
            url: "#rekap-absensi",
            allowedRoles: [ROLE_ID_ADMIN],
          },
        ],
      },
      {
        label: "Pelaksanaan Pendidikan",
        url: "/pelaksanaan-pendidikan",
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
    ],
  },

  {
    type: "menu",
    icon: "fluent-mdl2:functional-manager-dashboard",
    label: "Jafung Dosen",
    url: "/dosenOnly",
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
  // Kegiatan
  {
    type: "menu-group",
    label: "Kegiatan",
    icon: "mdi-clock-fast",
    children: [
      {
        label: "Jadwal Kegiatan",
        url: "/jadwal-rapat",
        allowedRoles: [
          ROLE_ID_ADMIN,
          ROLE_ID_DOSEN,
          ROLE_ID_MAHASISWA,
          ROLE_ID_DEMO,
        ],
        submenus: [],
      },
      {
        label: "Ketegori Kegiatan",
        url: "/kategori-kegiatan",
        allowedRoles: [ROLE_ID_ADMIN],
        submenus: [],
      },
      {
        label: "Ruang",
        url: "/ruang",
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
        label: "Group",
        url: "/group",
        allowedRoles: [ROLE_ID_ADMIN],
        submenus: [
          {
            label: "Group",
            url: "#group",
            allowedRoles: [ROLE_ID_ADMIN],
          },
        ],
      },
    ],
  },
  // Laporan Lapangan
  {
    type: "menu-group",
    label: "Laporan Lapangan",
    icon: "ic:outline-report",
    children: [
      {
        label: "Daftar Laporan",
        url: "/laporan",
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
        label: "Ketegori Laporan",
        url: "/kategori-laporan",
        allowedRoles: [ROLE_ID_ADMIN],
        submenus: [],
      },
    ],
  },
  // E-voting
  {
    type: "menu-group",
    label: "Survei/E-voting",
    icon: "ic:twotone-how-to-vote",
    children: [
      {
        label: "E-Voting",
        url: "/e-voting",
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
        label: "Group",
        url: "/group",
        allowedRoles: [ROLE_ID_ADMIN],
        submenus: [
          {
            label: "Group",
            url: "#group",
            allowedRoles: [ROLE_ID_ADMIN],
          },
        ],
      },
    ],
  },
  {
    type: "menu",
    label: "Berita",
    url: "/berita",
    icon: "iconoir:rss-feed-tag",
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
  // Gamifikasi
  {
    type: "menu-group",
    label: "Gamifikasi",
    icon: "iconoir:gamepad",
    children: [
      {
        label: "Tias Gamify",
        url: "/gamify-tias",
        allowedRoles: [ROLE_ID_ADMIN],
        submenus: [],
      },
      {
        label: "Kategori Gamify",
        url: "/gamify",
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
    ],
  },
  // Pengguna
  {
    type: "menu-group",
    label: "Pengguna",
    icon: "fa6-solid:users-gear",
    children: [
      {
        label: "Daftar Pengguna",
        url: "/users",
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
          {
            label: "Pegawai",
            url: "#list-pegawai",
            allowedRoles: [ROLE_ID_ADMIN],
          },
        ],
      },
      {
        label: "Jabatan Struktural",
        url: "/jabatan-struktural",
        allowedRoles: [ROLE_ID_ADMIN],
        submenus: [
          {
            label: "Jabatan Struktural",
            url: "#jabatan-struktural",
            allowedRoles: [ROLE_ID_ADMIN],
          },
        ],
      },
      {
        label: "Master Jabatan",
        url: "/jabatan",
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
        label: "Master Unit",
        url: "/unit",
        allowedRoles: [ROLE_ID_ADMIN],
        submenus: [
          {
            label: "Unit",
            url: "#unit",
            allowedRoles: [ROLE_ID_ADMIN],
          },
        ],
      },
      {
        label: "Group",
        url: "/group",
        allowedRoles: [ROLE_ID_ADMIN],
        submenus: [
          {
            label: "Group",
            url: "#group",
            allowedRoles: [ROLE_ID_ADMIN],
          },
        ],
      },
    ],
  },
  {
    type: "menu",
    label: "Pembelajaran",
    url: "/pembelajaran",
    icon: "fluent-mdl2:learning-tools",
    allowedRoles: [ROLE_ID_ADMIN],
    submenus: [
      {
        label: "Matakuliah",
        url: "#matakuliah",
        allowedRoles: [ROLE_ID_ADMIN],
      },
      {
        label: "Kurikulum",
        url: "#kurikulum",
        allowedRoles: [ROLE_ID_ADMIN],
      },
    ],
  },
  {
    type: "menu",
    icon: "fluent:hand-point-28-filled",
    label: "Rekomendasi Mahasiswa",
    url: "/rek-mhs",
    allowedRoles: [ROLE_ID_DOSEN],
    submenus: [],
  },
  {
    type: "menu",
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
