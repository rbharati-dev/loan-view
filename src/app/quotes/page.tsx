import Link from "next/link";
import { prisma } from "@/lib/prisma";

function fmtMoney(n: number | null) {
  if (n === null) return "—";
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtNum(n: number | null, digits = 2) {
  if (n === null) return "—";
  return n.toFixed(digits);
}

export default async function QuotesPage() {
  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      createdAt: true,
      lenderName: true,
      industry: true,
      annualRevenue: true,
      yearsInBusiness: true,
      factorRate: true,
      amount: true,
      termMonths: true,
      advanceRatePct: true,
      recourse: true,
    },
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_50%_at_50%_0%,rgba(34,211,238,0.18),rgba(0,0,0,0))]">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-medium tracking-wide text-zinc-500">
              LOANVIEW
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
              Quotes table
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Latest 100 records stored in SQLite.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/quotes/new"
              className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-black hover:bg-cyan-300"
            >
              Add quote
            </Link>
            <Link
              href="/assess"
              className="text-sm font-medium text-zinc-300 hover:text-zinc-100"
            >
              Score
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-zinc-300 hover:text-zinc-100"
            >
              Home
            </Link>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Created</th>
                  <th className="px-5 py-4 font-medium">Lender</th>
                  <th className="px-5 py-4 font-medium">Industry</th>
                  <th className="px-5 py-4 font-medium">Revenue</th>
                  <th className="px-5 py-4 font-medium">Years</th>
                  <th className="px-5 py-4 font-medium">Factor</th>
                  <th className="px-5 py-4 font-medium">Amount</th>
                  <th className="px-5 py-4 font-medium">Term</th>
                  <th className="px-5 py-4 font-medium">Advance %</th>
                  <th className="px-5 py-4 font-medium">Recourse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {quotes.map((q) => (
                  <tr key={q.id} className="text-zinc-200">
                    <td className="px-5 py-4 text-zinc-400">
                      {q.createdAt.toISOString().slice(0, 10)}
                    </td>
                    <td className="px-5 py-4">
                      {q.lenderName ?? <span className="text-zinc-500">—</span>}
                    </td>
                    <td className="px-5 py-4 font-medium">{q.industry}</td>
                    <td className="px-5 py-4 font-mono text-zinc-100">
                      {fmtMoney(q.annualRevenue)}
                    </td>
                    <td className="px-5 py-4 font-mono">
                      {fmtNum(q.yearsInBusiness, 1)}
                    </td>
                    <td className="px-5 py-4 font-mono">{fmtNum(q.factorRate)}</td>
                    <td className="px-5 py-4 font-mono">{fmtMoney(q.amount)}</td>
                    <td className="px-5 py-4 font-mono">
                      {q.termMonths ?? "—"}
                    </td>
                    <td className="px-5 py-4 font-mono">
                      {q.advanceRatePct ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      {q.recourse === null || q.recourse === undefined
                        ? "—"
                        : q.recourse
                          ? "Yes"
                          : "No"}
                    </td>
                  </tr>
                ))}
                {quotes.length === 0 ? (
                  <tr>
                    <td className="px-5 py-10 text-zinc-400" colSpan={10}>
                      No quotes yet. Add one at{" "}
                      <Link className="text-cyan-300 hover:underline" href="/quotes/new">
                        /quotes/new
                      </Link>
                      .
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

