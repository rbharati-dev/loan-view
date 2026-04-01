export type Benchmark = {
  sampleSize: number;
  p25: number;
  p50: number;
  p75: number;
  percentile: number; // 0..100 of user's rate among comparables (higher = worse)
  label: "good" | "ok" | "bad";
};

function quantile(sorted: number[], q: number) {
  if (sorted.length === 0) return NaN;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  const a = sorted[base]!;
  const b = sorted[base + 1] ?? a;
  return a + rest * (b - a);
}

function percentileRank(sorted: number[], x: number) {
  if (sorted.length === 0) return NaN;
  // percent of values <= x
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid]! <= x) lo = mid + 1;
    else hi = mid;
  }
  return (lo / sorted.length) * 100;
}

export function computeBenchmark(params: {
  comparableFactorRates: number[];
  userFactorRate: number;
}): Benchmark {
  const arr = params.comparableFactorRates
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
  const p25 = quantile(arr, 0.25);
  const p50 = quantile(arr, 0.5);
  const p75 = quantile(arr, 0.75);
  const percentile = percentileRank(arr, params.userFactorRate);
  let label: Benchmark["label"] = "ok";
  if (Number.isFinite(p25) && params.userFactorRate <= p25) label = "good";
  else if (Number.isFinite(p75) && params.userFactorRate > p75) label = "bad";
  return {
    sampleSize: arr.length,
    p25,
    p50,
    p75,
    percentile,
    label,
  };
}

export type Comparable = {
  factorRate: number;
  annualRevenue: number;
  yearsInBusiness: number;
};

export function pickNearestComparables(params: {
  quotes: Comparable[];
  annualRevenue: number;
  yearsInBusiness: number;
  k: number;
}): Comparable[] {
  const targetLogRev = Math.log1p(Math.max(0, params.annualRevenue));
  const targetYears = Math.max(0, params.yearsInBusiness);

  const scored = params.quotes
    .filter(
      (q) =>
        Number.isFinite(q.factorRate) &&
        Number.isFinite(q.annualRevenue) &&
        Number.isFinite(q.yearsInBusiness),
    )
    .map((q) => {
      const logRev = Math.log1p(Math.max(0, q.annualRevenue));
      const years = Math.max(0, q.yearsInBusiness);
      const dRev = logRev - targetLogRev;
      const dYears = (years - targetYears) / 10; // years scale
      const dist = Math.hypot(dRev, dYears);
      return { q, dist };
    })
    .sort((a, b) => a.dist - b.dist);

  return scored.slice(0, Math.max(5, params.k)).map((s) => s.q);
}

