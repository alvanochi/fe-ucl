import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import SignaturePad from "./SignaturePad";

export default function SignatureModal({ show, onClose, onSubmit, title, subtitle, submitText = "Simpan Tanda Tangan" }) {
  const [ttd, setTtd] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!show) return null;

  const handleSubmit = async () => {
    if (!ttd) return;
    setIsSubmitting(true);
    await onSubmit(ttd);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-gray-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="font-bold text-gray-800">{title || "Tanda Tangan Digital"}</h3>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors outline-none">
            <Icon icon="mdi:close" width={20} />
          </button>
        </div>
        <div className="p-6">
          <SignaturePad onEnd={setTtd} onClear={() => setTtd(null)} />
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={!ttd || isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Icon icon="mdi:loading" className="animate-spin" width={18} /> : <Icon icon="mdi:check-circle-outline" width={18} />}
              {submitText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
