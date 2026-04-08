export default function Loading() {
  return (
    <main className="mx-auto max-w-[1400px] space-y-4 p-6">
      <div className="h-20 animate-pulse rounded-2xl bg-slate-200" />
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
    </main>
  );
}
