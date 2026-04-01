import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 font-sans">
      <main className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-zinc-500">LoanView</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              Factoring quote benchmark
            </h1>
            <p className="mt-3 text-zinc-600">
              Import historical quotes, then score a new lender quote as{" "}
              <span className="font-medium text-zinc-900">good</span>,{" "}
              <span className="font-medium text-zinc-900">ok</span>, or{" "}
              <span className="font-medium text-zinc-900">bad</span> relative to
              comparable businesses.
            </p>
          </div>
          <div className="hidden rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 sm:block">
            <p className="font-medium text-zinc-900">Data status</p>
            <p className="mt-1">
              Import a CSV to populate your benchmark dataset.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/import"
            className="rounded-2xl border border-zinc-200 p-5 transition hover:bg-zinc-50"
          >
            <p className="text-sm font-medium text-zinc-900">1) Import quotes</p>
            <p className="mt-1 text-sm text-zinc-600">
              Upload a CSV of past factoring quotes to build your benchmark.
            </p>
          </Link>
          <Link
            href="/assess"
            className="rounded-2xl border border-zinc-200 p-5 transition hover:bg-zinc-50"
          >
            <p className="text-sm font-medium text-zinc-900">2) Score a quote</p>
            <p className="mt-1 text-sm text-zinc-600">
              Enter business details + factor rate to see where it lands.
            </p>
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-700">
          <p className="font-medium text-zinc-900">CSV columns (minimum)</p>
          <p className="mt-1 font-mono text-xs">
            industry, annualRevenue, yearsInBusiness, factorRate
          </p>
        </div>
      </main>
    </div>
  );
}
