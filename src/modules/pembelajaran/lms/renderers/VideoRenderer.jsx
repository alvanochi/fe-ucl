/**
 * Renderer tipe Video (SPEC v6 §5.4) — payload { youtube_url, video_id, title }.
 * Embed via youtube-nocookie (privasi), rasio 16:9 responsif, lazy-load.
 * `video_id` sudah diturunkan & divalidasi server-side.
 */
export default function VideoRenderer({ item }) {
  const { video_id, title } = item.payload || {};

  if (!video_id) {
    return <p className="text-sm text-gray-400">Video belum diisi / id tidak valid.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="relative w-full overflow-hidden rounded-xl bg-black" style={{ paddingTop: "56.25%" }}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${video_id}`}
          title={title || item.title || "Video"}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {title && <p className="text-sm text-gray-500">{title}</p>}
    </div>
  );
}
