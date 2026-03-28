/** Skeleton while dashboard routes load (slow networks). */
export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <div className="bg-muted h-8 w-44 rounded-md" />
        <div className="bg-muted h-4 max-w-md rounded-md" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-muted h-36 rounded-xl border border-transparent" />
        <div className="bg-muted h-36 rounded-xl border border-transparent" />
        <div className="bg-muted h-36 rounded-xl border border-transparent" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-muted h-40 rounded-xl border border-transparent" />
        <div className="bg-muted h-40 rounded-xl border border-transparent" />
      </div>
    </div>
  );
}
