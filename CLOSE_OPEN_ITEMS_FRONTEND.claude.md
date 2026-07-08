# Task: Tutup Item Terbuka — fe-ucl

## ATURAN KETAT
- **JANGAN checkout branch lain, JANGAN merge, JANGAN reset.** Task ini
  investigasi + fix kecil di branch AKTIF SAAT INI saja.
- **Kalau branch aktif saat ini adalah `detached HEAD`** — STOP, laporkan
  saja, JANGAN buat branch baru sendiri. Ini butuh keputusan manusia (branch
  mana yang jadi sumber kebenaran).
- **JANGAN sentuh `next.config.js`** kecuali sesuai instruksi eksplisit di
  Item 1 — file ini gitignored dan gampang menyebabkan regresi kalau salah
  sentuh (sudah terbukti di sesi sebelumnya).
- Kerja di branch baru `chore/close-open-items-<tanggal>` (kecuali kondisi
  detached HEAD di atas terjadi), JANGAN push tanpa instruksi eksplisit.
- Pisahkan tegas: FAKTA TERKONFIRMASI vs PERLU KEPUTUSAN MANUSIA vs TIDAK
  BISA DIVERIFIKASI DARI SINI.

## Konteks
Frontend Next.js untuk UCL, deploy staging dengan `basePath: '/staging'` di
`next.config.js` (file ini gitignored, cuma hidup di disk server). Sesi
debugging sebelumnya menemukan next.config.js gampang tertimpa/hilang saat
ganti branch karena statusnya gitignored, dan modul persuratan sempat jadi
titik tabrakan tiga pihak berbeda.

## Item 1 — `next.config.js` sinkronisasi (HATI-HATI, baca dulu sebelum eksekusi)
```
git status
cat .gitignore | grep -i "next.config"
cat next.config.js
```
**JANGAN ubah file ini.** Cukup laporkan isinya persis apa adanya sekarang,
dan apakah field `basePath` ada dan bernilai `/staging`. Kalau `next.config.js`
tidak ada sama sekali di direktori ini, laporkan itu sebagai temuan kritis
(build akan gagal/salah tanpa file ini).

Sebagai rekomendasi TERPISAH (jangan dieksekusi, cuma laporkan sebagai
proposal): apakah repo ini cocok dipecah jadi `next.config.staging.js` +
`next.config.production.js` yang di-track git, dipilih via script build,
supaya tidak lagi bergantung pada file gitignored yang gampang hilang?
Tuliskan proposal singkat, JANGAN implementasikan.

## Item 2 — Konsistensi hardcode `/staging` di kode
```
grep -rn "'/staging'\|\"/staging\"" --include="*.js" --include="*.jsx" src/ | grep -v node_modules
```
Laporkan semua titik yang hardcode string `/staging` (bukan baca dari
`next.config.js` basePath secara otomatis oleh Next.js router, tapi ditulis
manual di kode — misal di `middleware.js`, `useUser.js`). Ini technical debt
yang diketahui (kalau kode ini dipakai untuk build prod, akan salah arah).
**Cukup laporkan daftarnya dengan file:baris, JANGAN diperbaiki** — perbaikan
butuh keputusan arsitektur (baca basePath dari env var vs cara lain), bukan
tambal manual.

## Item 3 — Sisa masalah casing import (Windows → Linux)
```
find src -type d -iname "persuratan"
```
Kalau ada LEBIH DARI SATU hasil dengan casing berbeda (`persuratan` dan
`Persuratan`), itu bug filesystem-case-sensitivity yang sudah pernah
ditemukan sekali. Cek:
```
grep -rn "from [\"'].*components/persuratan/" --include="*.jsx" src/ | grep -v node_modules
grep -rn "from [\"'].*components/Persuratan/" --include="*.jsx" src/ | grep -v node_modules
```
Kalau ADA import yang masih pakai casing lowercase (`persuratan`) padahal
foldernya `Persuratan` (atau sebaliknya) — **ini boleh langsung diperbaiki**
(ganti ke casing yang sesuai nama folder aktual), karena kalau tidak
diperbaiki, build akan sukses di Windows/Mac tapi gagal di server Linux.
Catat file mana yang diubah.

## Item 4 — Sisa `console.log` debug di kode production
```
grep -rn "console.log(\"RAW COOKIE\|console.log(\"MIDDLEWARE SESSION\|console.log(\"SESSION PASSWORD\|console.log(\"LOGIN RESPONSE" --include="*.js" --include="*.jsx" src/
```
File-file ini punya `console.log` debug yang sengaja ditambahkan saat
investigasi bug session sebelumnya. Laporkan lokasinya. **Boleh dihapus**
kalau kamu yakin bug session sudah terverifikasi selesai — tapi karena
verifikasi itu statusnya masih belum saya konfirmasi tuntas, **JANGAN hapus
otomatis, cukup laporkan daftarnya** dan tandai sebagai "menunggu konfirmasi
sebelum dibersihkan".

## Format laporan akhir
```markdown
## FAKTA TERKONFIRMASI
- [Item #] ...

## SUDAH DIPERBAIKI (di branch chore/close-open-items-<tanggal>)
- [Item #] file:baris — sebelum → sesudah

## PERLU KEPUTUSAN MANUSIA (jangan dieksekusi tanpa konfirmasi)
- [Item #] ...

## TIDAK BISA DIVERIFIKASI DARI SINI
- [Item #] alasan
```

Setelah laporan ini saya baca, saya akan beri instruksi eksplisit apakah
branch ini di-push atau ada perubahan tambahan.
