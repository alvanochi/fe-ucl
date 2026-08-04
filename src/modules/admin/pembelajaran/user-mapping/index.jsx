import { useState } from "react";
import classNames from "classnames";
import DosenTab from "./DosenTab";
import MahasiswaTab from "./MahasiswaTab";

export default function UserMappingModule() {
  const [tab, setTab] = useState("dosen");

  return (
    <div className="my-8">
      <p className="mb-4 text-sm text-gray-500">
        Tautkan akun dosen/mahasiswa TIAS ke identitas SIAK ketika pencocokan otomatis
        (NIDN/NPM) tidak berhasil. Ini bukan sekadar &quot;isian data&quot; — otorisasi LMS (kelas
        mana yang boleh dilihat/dikelola) bergantung pada tautan ini.
      </p>
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        {[
          { key: "dosen", label: "Dosen belum ter-link" },
          { key: "mahasiswa", label: "Mahasiswa belum ter-link" },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={classNames(
              "px-4 py-2 text-sm font-semibold border-b-2 -mb-px",
              tab === t.key ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "dosen" && <DosenTab />}
      {tab === "mahasiswa" && <MahasiswaTab />}
    </div>
  );
}
