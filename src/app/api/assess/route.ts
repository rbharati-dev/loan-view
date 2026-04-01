import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  computeBenchmark,
  pickNearestComparables,
  type Comparable,
} from "@/lib/scoring";
import { AssessRequestSchema } from "@/lib/schemas";

function normalizeIndustry(industry: string) {
  return industry.trim().toLowerCase();
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = AssessRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const industry = normalizeIndustry(parsed.data.business.industry);
  const annualRevenue = parsed.data.business.annualRevenue;
  const yearsInBusiness = parsed.data.business.yearsInBusiness;
  const userFactorRate = parsed.data.quote.factorRate;

  const sameIndustry = await prisma.quote.findMany({
    where: { industry },
    select: {
      factorRate: true,
      annualRevenue: true,
      yearsInBusiness: true,
      creditScore: true,
      monthlyRevenue: true,
      grossMarginPct: true,
      arDays: true,
      topCustomerPct: true,
    },
    take: 1500,
  });

  const pool: Comparable[] =
    sameIndustry.length >= 30
      ? sameIndustry
      : await prisma.quote.findMany({
          select: {
            factorRate: true,
            annualRevenue: true,
            yearsInBusiness: true,
            creditScore: true,
            monthlyRevenue: true,
            grossMarginPct: true,
            arDays: true,
            topCustomerPct: true,
          },
          take: 3000,
        });

  const nearest = pickNearestComparables({
    quotes: pool,
    annualRevenue,
    yearsInBusiness,
    k: 75,
  });

  const benchmark = computeBenchmark({
    comparableFactorRates: nearest.map((q) => q.factorRate),
    userFactorRate,
  });

  if (!Number.isFinite(benchmark.p50)) {
    return NextResponse.json(
      { error: "Not enough historical quotes to benchmark yet." },
      { status: 422 },
    );
  }

  return NextResponse.json({
    benchmark,
    comparablePoolSize: pool.length,
    comparableIndustrySize: sameIndustry.length,
  });
}

