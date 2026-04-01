"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type AssessResponse = {
  benchmark: {
    sampleSize: number;
    p25: number;
    p50: number;
    p75: number;
    percentile: number;
    label: "good" | "ok" | "bad";
  };
  comparablePoolSize: number;
  comparableIndustrySize: number;
};

function fmt(n: number, digits = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(digits);
}

export default function AssessPage() {
  const [industry, setIndustry] = useState("saas");
  const [annualRevenue, setAnnualRevenue] = useState("1200000");
  const [yearsInBusiness, setYearsInBusiness] = useState("3");
  const [factorRate, setFactorRate] = useState("1.22");

  const [status, setStatus] = useState<
    | { type: "idle" }
    | { type: "loading" }
    | { type: "error"; message: string }
    | { type: "done"; data: AssessResponse }
  >({ type: "idle" });

  const pill = useMemo(() => {
    if (status.type !== "done") return null;
    const label = status.data.benchmark.label;
    if (label === "good")
      return { text: "Good deal", cls: "bg-emerald-50 text-emerald-800 border-emerald-200" };
    if (label === "bad")
      return { text: "Bad deal", cls: "bg-red-50 text-red-800 border-red-200" };
    return { text: "In range", cls: "bg-amber-50 text-amber-800 border-amber-200" };
  }, [status]);

  async function submit() {
    setStatus({ type: "loading" });
    const res = await fetch("/api/assess", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        business: { industry, annualRevenue, yearsInBusiness },
        quote: { factorRate },
      }),
    });
    const json = (await res.json().catch(() => ({}))) as
      | AssessResponse
      | { error?: string }
      | undefined;
    if (!res.ok) {
      setStatus({
        type: "error",
        message: (json && "error" in json && json.error) ?? "Assessment failed.",
      });
      return;
    }
    setStatus({ type: "done", data: json as AssessResponse });
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">LoanView</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
            Score a factoring quote
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/import" className="text-sm font-medium text-zinc-700 hover:underline">
            Import
          </Link>
          <Link href="/" className="text-sm font-medium text-zinc-700 hover:underline">
            Home
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-zinc-900">
            Industry
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="e.g. saas, trucking, healthcare"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-900">
            Annual revenue (ARR)
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
            value={annualRevenue}
            onChange={(e) => setAnnualRevenue(e.target.value)}
            inputMode="decimal"
            placeholder="1200000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-900">
            Years in business
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
            value={yearsInBusiness}
            onChange={(e) => setYearsInBusiness(e.target.value)}
            inputMode="decimal"
            placeholder="3"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-zinc-900">
            Lender factor rate (e.g. 1.22)
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
            value={factorRate}
            onChange={(e) => setFactorRate(e.target.value)}
            inputMode="decimal"
            placeholder="1.22"
          />
        </div>

        <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
          <button
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            onClick={submit}
            disabled={status.type === "loading"}
          >
            {status.type === "loading" ? "Scoring…" : "Score quote"}
          </button>
          <p className="text-xs text-zinc-500">
            Tip: import at least ~30 quotes per industry for stable benchmarks.
          </p>
        </div>
      </div>

      {status.type === "error" && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          {status.message}
        </div>
      )}

      {status.type === "done" && (
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-zinc-900">Result</p>
            {pill ? (
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${pill.cls}`}>
                {pill.text}
              </span>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-medium text-zinc-500">P25</p>
              <p className="mt-1 font-mono text-lg text-zinc-900">
                {fmt(status.data.benchmark.p25)}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-medium text-zinc-500">Median (P50)</p>
              <p className="mt-1 font-mono text-lg text-zinc-900">
                {fmt(status.data.benchmark.p50)}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-medium text-zinc-500">P75</p>
              <p className="mt-1 font-mono text-lg text-zinc-900">
                {fmt(status.data.benchmark.p75)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
            <p>
              Your factor rate is at about{" "}
              <span className="font-mono">
                {fmt(status.data.benchmark.percentile, 0)}th
              </span>{" "}
              percentile (higher = more expensive) among{" "}
              <span className="font-mono">{status.data.benchmark.sampleSize}</span>{" "}
              nearest comparable quotes.
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              Pool: {status.data.comparableIndustrySize} quotes in this industry
              · {status.data.comparablePoolSize} total quotes available
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

