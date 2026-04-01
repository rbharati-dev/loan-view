import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-[radial-gradient(60%_50%_at_50%_0%,rgba(34,211,238,0.18),rgba(0,0,0,0))] px-6 py-16">
      <main className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur">
        <div className="p-10">
          <p className="text-xs font-medium tracking-[0.2em] text-zinc-500">
            LOANVIEW
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-50">
            Benchmark alternative financing quotes
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
            A minimalist analytics cockpit for SMEs: store historical lender
            quotes, then score a new quote against comparable businesses.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Link
              href="/quotes/new"
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <p className="text-sm font-medium text-zinc-100">Add quote</p>
              <p className="mt-2 text-sm text-zinc-400">
                Capture underwriting factors + terms.
              </p>
              <p className="mt-4 text-xs font-medium text-cyan-300">
                Write to database →
              </p>
            </Link>
            <Link
              href="/assess"
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <p className="text-sm font-medium text-zinc-100">Score quote</p>
              <p className="mt-2 text-sm text-zinc-400">
                Good / ok / bad relative to comparables.
              </p>
              <p className="mt-4 text-xs font-medium text-cyan-300">
                Get benchmark →
              </p>
            </Link>
            <Link
              href="/quotes"
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <p className="text-sm font-medium text-zinc-100">Quotes table</p>
              <p className="mt-2 text-sm text-zinc-400">
                Browse stored records.
              </p>
              <p className="mt-4 text-xs font-medium text-cyan-300">
                View data →
              </p>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              SQLite + Prisma
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              kNN benchmark scoring
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              underwriting-factor form
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
