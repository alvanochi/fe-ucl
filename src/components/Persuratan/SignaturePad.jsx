import { useRef, useState, useEffect } from "react";
import { Icon } from "@iconify-icon/react";

function cropCanvasToSignature(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let minX = width, minY = height, maxX = 0, maxY = 0;
  let hasPixel = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 0) {
        hasPixel = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!hasPixel) return canvas.toDataURL("image/png");

  const PAD = 12;
  minX = Math.max(0, minX - PAD);
  minY = Math.max(0, minY - PAD);
  maxX = Math.min(width, maxX + PAD);
  maxY = Math.min(height, maxY + PAD);

  const cropW = maxX - minX;
  const cropH = maxY - minY;

  const cropped = document.createElement("canvas");
  cropped.width = cropW;
  cropped.height = cropH;
  cropped.getContext("2d").drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

  return cropped.toDataURL("image/png");
}

export default function SignaturePad({ onEnd, onClear, label = "Tanda Tangan Digital" }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set high resolution for retina displays
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000000";
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const dataUrl = cropCanvasToSignature(canvas);
    if (onEnd) onEnd(dataUrl);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (onClear) onClear();
    if (onEnd) onEnd(null);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-2">
        <label className="font-bold text-gray-700 text-sm flex items-center gap-2">
          <Icon icon="mdi:draw-pen" width={18} />
          {label}
        </label>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-2 py-1 rounded"
        >
          <Icon icon="mdi:delete-sweep-outline" width={16} /> Hapus TTD
        </button>
      </div>
      <div className="relative w-full border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 hover:bg-white transition-colors">
        <canvas
          ref={canvasRef}
          className="w-full h-[200px] cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
          <Icon icon="mdi:fountain-pen" width={64} className="text-gray-400" />
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-2 text-center">
        Gunakan mouse atau jari Anda untuk menggambar tanda tangan di atas garis batas.
      </p>
    </div>
  );
}
