import { ROLE_ID_DOSEN, ROLE_ID_MAHASISWA, ROLE_ID_ADMIN } from "./role";

export const APP_MENU = [
  {
    label: "Dashboard",
    url: "/",
    icon: "material-symbols:space-dashboard-rounded",
    allowedRoles: [
      ROLE_ID_ADMIN,
      ROLE_ID_DOSEN,
      ROLE_ID_MAHASISWA,
      ROLE_ID_ADMIN,
    ],
    submenus: [],
  },
  {
    label: "Profil",
    url: "/profil",
    icon: "mdi:user-circle",
    allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
    submenus: [
      {
        label: "Kependudukan",
        url: "#kependudukan",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
      },
      {
        label: "Alamat dan Kontak",
        url: "#alamat-dan-kontak",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
      },
      {
        label: "Keluarga",
        url: "#keluarga",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
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
    label: "Pelaksanaan Pendidikan",
    url: "/pelaksanaan-pendidikan",
    icon: "mdi:bookshelf",
    allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
    submenus: [
      {
        label: "Bimbingan Mahasiswa",
        url: "#bimbingan",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN],
      },
      {
        label: "Bahan Ajar",
        url: "#bahan-ajar",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN],
      },
      {
        label: "IP",
        url: "#ip",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_MAHASISWA],
      },
    ],
  },
  {
    label: "Pelaksanaan Penelitian",
    url: "/pelaksanaan-penelitian",
    icon: "fa:flask",
    allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
    submenus: [
      {
        label: "Penelitian",
        url: "#penelitian",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
      },
      {
        label: "Publikasi Karya",
        url: "#publikasi-karya",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
      },
      {
        label: "HKI",
        url: "#hki",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
      },
    ],
  },
  {
    label: "Pelaksanaan Pengabdian",
    url: "/pelaksanaan-pengabdian",
    icon: "fa6-solid:hand-holding-hand",
    allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
    submenus: [
      {
        label: "Pengabdian",
        url: "#pengabdian",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
      },
      {
        label: "Pembicara",
        url: "#pembicara",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
      },
    ],
  },
  {
    label: "Penunjang",
    url: "/penunjang",
    icon: "solar:users-group-two-rounded-bold-duotone",
    allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
    submenus: [
      {
        label: "Anggota Profesi",
        url: "#anggota-profesi",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
      },
      {
        label: "Penghargaan",
        url: "#penghargaan",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
      },
    ],
  },
  {
    label: "Kompetensi",
    url: "/kompetensi",
    icon: "icon-park-outline:certificate",
    allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
    submenus: [
      {
        label: "Sertifikasi",
        url: "#sertifikasi",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
      },
      {
        label: "Test",
        url: "#test",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
      },
    ],
  },
  {
    label: "Kualifikasi",
    url: "/kualifikasi",
    icon: "iconoir:graduation-cap",
    allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
    submenus: [
      {
        label: "Pendidikan Formal",
        url: "#pendidikan-formal",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
      },
      {
        label: "Riwayat Pekerjaan",
        url: "#riwayat-pekerjaan",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
      },
    ],
  },
  {
    label: "Jafung Dosen",
    url: "/dosenOnly",
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
    label: "Kategori Gamify",
    url: "/gamify",
    icon: "iconoir:gamepad",
    allowedRoles: [ROLE_ID_ADMIN],
    submenus: [
      {
        label: "Sertifikasi",
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
    ],
  },
  {
    label: "Users",
    url: "/users",
    icon: "iconoir:user",
    allowedRoles: [ROLE_ID_ADMIN],
    submenus: [
      {
        label: "Mahasiswa",
        url: "#list-mhs",
        allowedRoles: [ROLE_ID_ADMIN],
      },
      {
        label: "Dosen",
        url: "#list-dosen",
        allowedRoles: [ROLE_ID_ADMIN],
      },
    ],
  },
  {
    label: "Setting",
    url: "/setting",
    icon: "ant-design:setting-filled",
    allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
    submenus: [
      {
        label: "Ganti Password",
        url: "#change-password",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
      },
      {
        label: "Akun",
        url: "#akun",
        allowedRoles: [ROLE_ID_ADMIN, ROLE_ID_DOSEN, ROLE_ID_MAHASISWA],
      },
    ],
  },
];
