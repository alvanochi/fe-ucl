/**
 * Prefix wajib untuk aset statis (`<img>`, dsb) di public/ — Next.js hanya auto-prefix
 * basePath untuk next/image, next/link, dan chunk JS/CSS miliknya sendiri, BUKAN <img>
 * biasa. Pakai `asset("/img/x.png")` alih-alih hardcode string supaya konsisten dgn
 * basePath yang aktif (lihat next.config.js).
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const asset = (path) => `${BASE_PATH}${path}`;
