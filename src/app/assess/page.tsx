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
      const msg =
        json && "error" in json && typeof json.error === "string" && json.error
          ? json.error
          : "Assessment failed.";
      setStatus({
        type: "error",
        message: msg,
      });
      return;
    }
    setStatus({ type: "done", data: json as AssessResponse });
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_50%_at_50%_0%,rgba(34,211,238,0.18),rgba(0,0,0,0))]">
      <div className="mx-auto w-full max-w-3xl p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-wide text-zinc-500">
            LOANVIEW
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            Score a factoring quote
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/quotes/new"
            className="text-sm font-medium text-zinc-300 hover:text-zinc-100"
          >
            Add quote
          </Link>
          <Link
            href="/quotes"
            className="text-sm font-medium text-zinc-300 hover:text-zinc-100"
          >
            Table
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-zinc-300 hover:text-zinc-100"
          >
            Home
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-zinc-300">
            Industry
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/30"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="e.g. saas, trucking, healthcare"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300">
            Annual revenue (ARR)
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/30"
            value={annualRevenue}
            onChange={(e) => setAnnualRevenue(e.target.value)}
            inputMode="decimal"
            placeholder="1200000"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300">
            Years in business
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/30"
            value={yearsInBusiness}
            onChange={(e) => setYearsInBusiness(e.target.value)}
            inputMode="decimal"
            placeholder="3"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-zinc-300">
            Lender factor rate (e.g. 1.22)
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/30"
            value={factorRate}
            onChange={(e) => setFactorRate(e.target.value)}
            inputMode="decimal"
            placeholder="1.22"
          />
        </div>

        <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
          <button
            className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-black hover:bg-cyan-300 disabled:opacity-50"
            onClick={submit}
            disabled={status.type === "loading"}
          >
            {status.type === "loading" ? "Scoring…" : "Score quote"}
          </button>
          <p className="text-xs text-zinc-500">
            Tip: the more stored quotes, the tighter your benchmark becomes.
          </p>
        </div>
      </div>

      {status.type === "error" && (
        <div className="mt-4 rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">
          {status.message}
        </div>
      )}

      {status.type === "done" && (
        <div className="mt-4 rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-zinc-200">Result</p>
            {pill ? (
              <span
                className={[
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  status.data.benchmark.label === "good"
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                    : status.data.benchmark.label === "bad"
                      ? "border-red-400/20 bg-red-400/10 text-red-200"
                      : "border-amber-400/20 bg-amber-400/10 text-amber-200",
                ].join(" ")}
              >
                {pill.text}
              </span>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-medium text-zinc-500">P25</p>
              <p className="mt-1 font-mono text-lg text-zinc-50">
                {fmt(status.data.benchmark.p25)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-medium text-zinc-500">Median (P50)</p>
              <p className="mt-1 font-mono text-lg text-zinc-50">
                {fmt(status.data.benchmark.p50)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-medium text-zinc-500">P75</p>
              <p className="mt-1 font-mono text-lg text-zinc-50">
                {fmt(status.data.benchmark.p75)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-200">
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
    </div>
  );
}

