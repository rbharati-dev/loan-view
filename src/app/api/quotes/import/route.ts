import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ImportQuotesRequestSchema } from "@/lib/schemas";

function normalizeIndustry(industry: string) {
  return industry.trim().toLowerCase();
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = ImportQuotesRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data.quotes.map((q) => ({
    industry: normalizeIndustry(q.industry),
    annualRevenue: q.annualRevenue,
    yearsInBusiness: q.yearsInBusiness,
    factorRate: q.factorRate,
    amount: q.amount ?? null,
    termMonths: q.termMonths ?? null,
    monthlyRevenue: q.monthlyRevenue ?? null,
    creditScore: q.creditScore ?? null,
    notes: q.notes ?? null,
  }));

  const result = await prisma.quote.createMany({ data });
  return NextResponse.json({ inserted: result.count });
}

