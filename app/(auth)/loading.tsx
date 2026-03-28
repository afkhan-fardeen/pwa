/** Lightweight placeholder while auth route segment loads (no heavy animation). */
export default function AuthLoading() {
  return (
    <div
      className="mx-auto w-full max-w-[440px] animate-pulse rounded-2xl border border-stone-200/80 bg-white/95 p-8 shadow-sm dark:border-stone-700/80 dark:bg-stone-900/90"
      aria-hidden
    >
      <div className="mx-auto mb-6 h-9 w-52 rounded-lg bg-stone-200 dark:bg-stone-700" />
      <div className="mb-4 h-4 w-full rounded bg-stone-100 dark:bg-stone-800" />
      <div className="mb-8 h-4 w-4/5 rounded bg-stone-100 dark:bg-stone-800" />
      <div className="h-12 w-full rounded-xl bg-stone-200 dark:bg-stone-700" />
    </div>
  );
}
