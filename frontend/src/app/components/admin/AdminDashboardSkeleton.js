function Skeleton({ className = "" }) {
  return (
    <div
      className={`bg-border animate-pulse rounded ${className}`}
      aria-hidden="true"
    />
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-surface rounded-xl border p-5 shadow-2xs"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-7 w-12" />
                <Skeleton className="h-3 w-24" />
              </div>

              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Bookings */}
        <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-2xs lg:col-span-2">
          {/* Header */}
          <div className="border-border flex items-center justify-between border-b px-6 py-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-3 w-72 max-w-full" />
            </div>

            <Skeleton className="h-4 w-16" />
          </div>

          {/* Rows */}
          <div className="divide-border divide-y">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-6 px-6 py-4"
              >
                <div className="space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>

                <Skeleton className="h-3 w-20" />

                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-border bg-background/50 border-t p-4">
            <Skeleton className="mx-auto h-3 w-48" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Partnerships */}
          <div className="border-border bg-surface space-y-4 rounded-xl border p-6 shadow-2xs">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>

            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="border-border bg-background rounded-lg border p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inquiries */}
          <div className="border-border bg-surface space-y-4 rounded-xl border p-6 shadow-2xs">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>

            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="border-border bg-background space-y-3 rounded-lg border p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>

                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardSkeleton;
