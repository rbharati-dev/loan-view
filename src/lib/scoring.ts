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
  creditScore?: number | null;
  monthlyRevenue?: number | null;
  grossMarginPct?: number | null;
  arDays?: number | null;
  topCustomerPct?: number | null;
};

export function pickNearestComparables(params: {
  quotes: Comparable[];
  annualRevenue: number;
  yearsInBusiness: number;
  creditScore?: number | null;
  monthlyRevenue?: number | null;
  grossMarginPct?: number | null;
  arDays?: number | null;
  topCustomerPct?: number | null;
  k: number;
}): Comparable[] {
  const targetLogRev = Math.log1p(Math.max(0, params.annualRevenue));
  const targetYears = Math.max(0, params.yearsInBusiness);
  const targetCredit = params.creditScore ?? null;
  const targetMonthlyRev = params.monthlyRevenue ?? null;
  const targetGrossMargin = params.grossMarginPct ?? null;
  const targetArDays = params.arDays ?? null;
  const targetTopCust = params.topCustomerPct ?? null;

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

      // Optional features: only contribute if both sides are present.
      let dist2 = dRev * dRev + dYears * dYears;

      if (targetCredit !== null && q.creditScore != null) {
        const d = (q.creditScore - targetCredit) / 100;
        dist2 += d * d;
      }
      if (targetMonthlyRev !== null && q.monthlyRevenue != null) {
        const d =
          Math.log1p(Math.max(0, q.monthlyRevenue)) -
          Math.log1p(Math.max(0, targetMonthlyRev));
        dist2 += d * d;
      }
      if (targetGrossMargin !== null && q.grossMarginPct != null) {
        const d = (q.grossMarginPct - targetGrossMargin) / 20;
        dist2 += d * d;
      }
      if (targetArDays !== null && q.arDays != null) {
        const d = (q.arDays - targetArDays) / 30;
        dist2 += d * d;
      }
      if (targetTopCust !== null && q.topCustomerPct != null) {
        const d = (q.topCustomerPct - targetTopCust) / 30;
        dist2 += d * d;
      }

      const dist = Math.sqrt(dist2);
      return { q, dist };
    })
    .sort((a, b) => a.dist - b.dist);

  return scored.slice(0, Math.max(5, params.k)).map((s) => s.q);
}

