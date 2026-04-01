import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const take = Math.min(100, Math.max(1, Number(url.searchParams.get("take") ?? 50)));

  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
    take,
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

  return NextResponse.json({ quotes });
}

