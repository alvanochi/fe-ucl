/**
 * Skeleton loading untuk daftar topik — menggantikan spinner polos agar terasa lebih cepat
 * & rapi (mengurangi layout shift saat data tiba).
 */
export default function TopicSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="h-14 animate-pulse bg-gradient-to-r from-primary-600/80 to-primary-700/80" />
          <div className="space-y-3 px-4 py-4">
            {Array.from({ length: 3 }).map((__, j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
                  <div className="h-2.5 w-1/5 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
