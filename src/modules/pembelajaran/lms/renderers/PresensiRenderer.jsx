import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Icon } from "@iconify-icon/react";
import { toastAlert } from "../../../../lib/sweetalert";
import {
  useLmsSections,
  useCurrentAttendanceSession,
  useAttendanceSessionRecords,
  openAttendanceSession,
  closeAttendanceSession,
  resolveAttendanceToken,
  submitAttendance,
} from "../../../../repo/lms";

/**
 * Renderer tipe "attendance" — presensi via token + lokasi (kalau kelas offline) +
 * verifikasi wajah, dikonsumsi dari tias-backend `/lms/attendance/*` (lihat
 * controllers/lms/attendanceController.js). Payload item ini SELALU kosong — state sesi
 * hidup di tabel lms_attendance_sessions, dikunci kelasKuliahId+pertemuan_ke.
 *
 * `manage` (dari ContentItemViewer, sama pola dgn ExamRenderer/AssignmentRenderer) yang
 * membedakan panel dosen (buka/tutup sesi, roster live) vs mahasiswa (submit presensi) —
 * BUKAN role dari useUser(), supaya konsisten dgn tipe lain yang sudah ada.
 *
 * Tidak ada scan-QR kamera di v1 (butuh library baru) — mahasiswa input token manual, sama
 * seperti pola lama di aplikasi mobile. Tidak ada fallback upload-file-galeri untuk foto
 * wajah — itu celah bypass verifikasi, kontradiksi tujuan fitur ini.
 */
export default function PresensiRenderer({ item, manage = false, demo = false }) {
  if (demo) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 py-10 text-center">
        <Icon icon="mdi:qrcode-scan" width={44} height={44} className="text-cyan-600" />
        <p className="text-sm text-gray-400">Presensi memerlukan backend (mode contoh).</p>
      </div>
    );
  }
  return manage ? <DosenPanel item={item} /> : <MahasiswaPanel />;
}

function DosenPanel({ item }) {
  const router = useRouter();
  const kelasKuliahId = router.query.kelasKuliahId;
  const { sections } = useLmsSections(kelasKuliahId);
  const section = sections.find((s) => s.id === item.section_id);
  const pertemuanKe = section?.pertemuan;

  const { session, isLoading, mutate } = useCurrentAttendanceSession(kelasKuliahId, pertemuanKe, {
    pollMs: 8000,
  });
  const { records } = useAttendanceSessionRecords(session?.id);
  const [opening, setOpening] = useState(false);
  const [closing, setClosing] = useState(false);

  const getBestEffortLocation = () =>
    new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy_m: pos.coords.accuracy,
          }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });

  const handleOpen = async () => {
    if (!kelasKuliahId || !pertemuanKe) {
      toastAlert("error", "Tidak bisa menentukan kelas/pertemuan untuk aktivitas ini.");
      return;
    }
    setOpening(true);
    try {
      // Best-effort: kalau kelas ternyata offline & GPS memang wajib, backend yang menolak
      // dgn pesan jelas — dosen tak perlu tahu dulu apakah kelasnya offline/online.
      const loc = await getBestEffortLocation();
      const res = await openAttendanceSession({
        kelasKuliahId,
        pertemuan_ke: pertemuanKe,
        session_date: new Date().toISOString().slice(0, 10),
        ...(loc || {}),
      });
      if (res?.isSuccess === false) {
        toastAlert("error", res.responseMessage || "Gagal membuka sesi presensi.");
        return;
      }
      toastAlert("success", "Sesi presensi dibuka.");
      mutate();
    } catch (err) {
      toastAlert("error", err?.response?.data?.responseMessage || "Gagal membuka sesi presensi.");
    } finally {
      setOpening(false);
    }
  };

  const handleClose = async () => {
    setClosing(true);
    try {
      await closeAttendanceSession(session.id);
      toastAlert("success", "Sesi presensi ditutup.");
      mutate();
    } catch (err) {
      toastAlert("error", err?.response?.data?.responseMessage || "Gagal menutup sesi.");
    } finally {
      setClosing(false);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-gray-500">Memuat status sesi…</p>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-10 text-center">
        <Icon icon="mdi:qrcode-scan" width={44} height={44} className="text-cyan-600" />
        <p className="text-sm text-gray-500">Belum ada sesi presensi dibuka untuk pertemuan ini.</p>
        <button
          type="button"
          onClick={handleOpen}
          disabled={opening}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700 disabled:opacity-60"
        >
          {opening && <Icon icon="mdi:loading" className="animate-spin" width={18} height={18} />}
          Buka Sesi Presensi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl bg-cyan-50 px-4 py-3">
        <span className="text-sm text-cyan-700">Token presensi:</span>
        <span className="font-mono text-xl font-bold tracking-widest text-cyan-800">{session.token}</span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(session.token);
            toastAlert("success", "Token disalin");
          }}
          className="ml-auto shrink-0 text-sm font-semibold text-cyan-700 underline"
        >
          Salin
        </button>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Sudah presensi ({records.length}):</p>
        {records.length === 0 ? (
          <p className="text-sm text-gray-400">Belum ada yang presensi.</p>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-100">
            {records.map((r) => (
              <li key={r.id} className="flex items-center justify-between px-3 py-2 text-sm">
                <span>
                  {r.nama || "-"} <span className="text-gray-400">({r.npm || "-"})</span>
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(r.submitted_at).toLocaleTimeString("id-ID")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={handleClose}
        disabled={closing}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
      >
        {closing && <Icon icon="mdi:loading" className="animate-spin" width={16} height={16} />}
        Tutup Sesi
      </button>
    </div>
  );
}

// input_token -> resolving -> (capturing_location ->) capturing_photo -> submitting -> success/error
function MahasiswaPanel() {
  const [step, setStep] = useState("input_token");
  const [token, setToken] = useState("");
  const [sessionInfo, setSessionInfo] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [photoBlob, setPhotoBlob] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  // Lepas kamera kalau komponen unmount di tengah proses (pindah halaman dll).
  useEffect(() => () => stopCamera(), []);

  const handleCheckToken = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;
    setStep("resolving");
    setErrorMsg("");
    try {
      const res = await resolveAttendanceToken(token.trim());
      if (res?.isSuccess === false) {
        setErrorMsg(res.responseMessage || "Token tidak valid.");
        setStep("input_token");
        return;
      }
      setSessionInfo(res.data);
      setStep(res.data.is_offline ? "capturing_location" : "capturing_photo");
    } catch (err) {
      setErrorMsg(err?.response?.data?.responseMessage || "Gagal memeriksa token.");
      setStep("input_token");
    }
  };

  const handleCaptureLocation = () => {
    setErrorMsg("");
    if (!navigator.geolocation) {
      setErrorMsg("Browser ini tidak mendukung lokasi. Gunakan browser lain.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy_m: pos.coords.accuracy,
        });
        setStep("capturing_photo");
      },
      () => {
        setErrorMsg(
          "Izin lokasi ditolak/gagal didapat. Lokasi wajib untuk kelas offline — aktifkan izin lokasi di browser lalu coba lagi."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Nyalakan kamera begitu masuk step capturing_photo (dan belum ada foto tersimpan).
  useEffect(() => {
    if (step !== "capturing_photo" || photoBlob) return;
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setErrorMsg("Tidak bisa mengakses kamera. Izinkan akses kamera di browser lalu coba lagi."));
    return () => {
      cancelled = true;
    };
  }, [step, photoBlob]);

  const handleTakePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        setPhotoBlob(blob);
        setPhotoPreviewUrl(URL.createObjectURL(blob));
        stopCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  const handleRetakePhoto = () => {
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoBlob(null);
    setPhotoPreviewUrl(null);
  };

  const handleSubmit = async () => {
    setStep("submitting");
    setErrorMsg("");
    try {
      const fd = new FormData();
      fd.append("token", token.trim());
      if (location) {
        fd.append("lat", location.lat);
        fd.append("lng", location.lng);
        fd.append("accuracy_m", location.accuracy_m);
      }
      fd.append("image", photoBlob, "presensi.jpg");
      const res = await submitAttendance(fd);
      if (res?.isSuccess === false) {
        setErrorMsg(res.responseMessage || "Presensi ditolak.");
        setStep("error");
        return;
      }
      setStep("success");
    } catch (err) {
      setErrorMsg(err?.response?.data?.responseMessage || "Gagal mengirim presensi.");
      setStep("error");
    }
  };

  // Token & lokasi (kalau ada) tetap dipakai — mahasiswa cukup foto ulang, tidak perlu
  // ulang dari awal (kecuali errornya memang soal token/lokasi, ditangani step masing-masing).
  const handleRetryAfterError = () => {
    handleRetakePhoto();
    setErrorMsg("");
    setStep("capturing_photo");
  };

  if (step === "input_token" || step === "resolving") {
    return (
      <form onSubmit={handleCheckToken} className="space-y-3">
        <p className="text-sm text-gray-600">Masukkan token presensi yang diberikan dosen.</p>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Token"
          disabled={step === "resolving"}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-center font-mono text-lg tracking-widest"
        />
        {errorMsg && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMsg}</p>}
        <button
          type="submit"
          disabled={step === "resolving" || !token.trim()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700 disabled:opacity-60"
        >
          {step === "resolving" && <Icon icon="mdi:loading" className="animate-spin" width={18} height={18} />}
          Cek Token
        </button>
      </form>
    );
  }

  if (step === "capturing_location") {
    return (
      <div className="space-y-3 text-center">
        <p className="text-sm text-gray-600">Kelas ini offline — lokasi Anda perlu diverifikasi.</p>
        {errorMsg && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMsg}</p>}
        <button
          type="button"
          onClick={handleCaptureLocation}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
        >
          <Icon icon="mdi:map-marker" width={18} height={18} />
          Bagikan Lokasi
        </button>
      </div>
    );
  }

  if (step === "capturing_photo" || step === "submitting") {
    return (
      <div className="space-y-3">
        {sessionInfo && (
          <p className="text-sm text-gray-600">
            {sessionInfo.nama_matakuliah} — Pertemuan {sessionInfo.pertemuan_ke}
          </p>
        )}
        {errorMsg && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMsg}</p>}

        {!photoBlob ? (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-xl bg-black" />
            <button
              type="button"
              onClick={handleTakePhoto}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
            >
              <Icon icon="mdi:camera" width={18} height={18} />
              Ambil Foto
            </button>
          </>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoPreviewUrl} alt="Pratinjau foto presensi" className="w-full rounded-xl" />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRetakePhoto}
                disabled={step === "submitting"}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
              >
                Ulangi
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={step === "submitting"}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700 disabled:opacity-60"
              >
                {step === "submitting" && <Icon icon="mdi:loading" className="animate-spin" width={18} height={18} />}
                Kirim Presensi
              </button>
            </div>
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl bg-emerald-50 py-8 text-center">
        <Icon icon="mdi:check-circle" width={44} height={44} className="text-emerald-600" />
        <p className="font-medium text-emerald-700">Presensi berhasil dicatat.</p>
      </div>
    );
  }

  // step === "error" — pesan dari backend sudah manusiawi (wajah tidak cocok, di luar
  // radius, sudah presensi, dst), TIDAK ada fallback manual, sesuai tujuan fitur ini.
  return (
    <div className="space-y-3 text-center">
      <div className="flex flex-col items-center gap-2 rounded-xl bg-red-50 py-6">
        <Icon icon="mdi:alert-circle" width={40} height={40} className="text-red-600" />
        <p className="text-sm text-red-700">{errorMsg}</p>
      </div>
      <button
        type="button"
        onClick={handleRetryAfterError}
        className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
      >
        Coba Lagi
      </button>
    </div>
  );
}
