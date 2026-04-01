import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateQuoteRequestSchema } from "@/lib/schemas";

function normalizeIndustry(industry: string) {
  return industry.trim().toLowerCase();
}

function normalizeOptionalString(s: unknown) {
  if (typeof s !== "string") return null;
  const t = s.trim();
  return t === "" ? null : t;
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = CreateQuoteRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const q = parsed.data.quote;

  const created = await prisma.quote.create({
    data: {
      industry: normalizeIndustry(q.industry),
      subIndustry: normalizeOptionalString(q.subIndustry),
      businessModel: normalizeOptionalString(q.businessModel),
      entityType: normalizeOptionalString(q.entityType),
      state: normalizeOptionalString(q.state),

      annualRevenue: q.annualRevenue,
      monthlyRevenue: q.monthlyRevenue ?? null,
      avgBankBalance: q.avgBankBalance ?? null,
      avgMonthlyDeposits: q.avgMonthlyDeposits ?? null,
      grossMarginPct: q.grossMarginPct ?? null,
      arDays: q.arDays ?? null,

      yearsInBusiness: q.yearsInBusiness,
      monthsInBusiness: q.monthsInBusiness ?? null,
      timeInBusinessSameOwnerYears: q.timeInBusinessSameOwnerYears ?? null,

      creditScore: q.creditScore ?? null,
      personalGuarantee: q.personalGuarantee ?? false,
      bankruptciesLast7y: q.bankruptciesLast7y ?? false,
      taxLiens: q.taxLiens ?? false,
      judgments: q.judgments ?? false,
      nsfLast90Days: q.nsfLast90Days ?? null,

      existingDebtMonthlyPayments: q.existingDebtMonthlyPayments ?? null,
      existingAdvancesOutstanding: q.existingAdvancesOutstanding ?? null,
      dscr: q.dscr ?? null,

      topCustomerPct: q.topCustomerPct ?? null,
      top3CustomersPct: q.top3CustomersPct ?? null,
      customerCount: q.customerCount ?? null,
      customerCreditQuality: normalizeOptionalString(q.customerCreditQuality),
      invoiceVolumeMonthly: q.invoiceVolumeMonthly ?? null,
      averageInvoiceSize: q.averageInvoiceSize ?? null,

      lenderName: normalizeOptionalString(q.lenderName),
      productType: normalizeOptionalString(q.productType),
      amount: q.amount ?? null,
      termMonths: q.termMonths ?? null,
      factorRate: q.factorRate,
      advanceRatePct: q.advanceRatePct ?? null,
      discountRatePct: q.discountRatePct ?? null,
      feeFlat: q.feeFlat ?? null,
      feePct: q.feePct ?? null,
      minFee: q.minFee ?? null,
      originationFee: q.originationFee ?? null,
      dueDiligenceFee: q.dueDiligenceFee ?? null,
      wireFee: q.wireFee ?? null,
      lockboxFee: q.lockboxFee ?? null,
      terminationFee: q.terminationFee ?? null,
      recourse: q.recourse ?? null,
      reservePct: q.reservePct ?? null,

      source: normalizeOptionalString(q.source),
      notes: normalizeOptionalString(q.notes),
    },
    select: { id: true, createdAt: true },
  });

  return NextResponse.json({ id: created.id, createdAt: created.createdAt });
}

