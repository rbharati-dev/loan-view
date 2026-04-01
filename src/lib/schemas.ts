import { z } from "zod";

const OptionalNumber = z.preprocess((v) => {
  if (v === "" || v === null || v === undefined) return undefined;
  return v;
}, z.coerce.number().finite());

const OptionalInt = z.preprocess((v) => {
  if (v === "" || v === null || v === undefined) return undefined;
  return v;
}, z.coerce.number().int().finite());

export const CreateQuoteSchema = z.object({
  // Business profile
  industry: z.string().min(1),
  subIndustry: z.string().optional(),
  businessModel: z.string().optional(),
  entityType: z.string().optional(),
  state: z.string().optional(),

  annualRevenue: z.coerce.number().finite().nonnegative(),
  monthlyRevenue: OptionalNumber.optional(),
  avgBankBalance: OptionalNumber.optional(),
  avgMonthlyDeposits: OptionalNumber.optional(),
  grossMarginPct: OptionalNumber.optional(),
  arDays: OptionalNumber.optional(),

  yearsInBusiness: z.coerce.number().finite().nonnegative(),
  monthsInBusiness: OptionalInt.optional(),
  timeInBusinessSameOwnerYears: OptionalNumber.optional(),

  // Owner / credit
  creditScore: z.coerce.number().int().finite().min(300).max(900).optional(),
  personalGuarantee: z.coerce.boolean().optional(),
  bankruptciesLast7y: z.coerce.boolean().optional(),
  taxLiens: z.coerce.boolean().optional(),
  judgments: z.coerce.boolean().optional(),
  nsfLast90Days: OptionalInt.optional(),

  // Existing obligations
  existingDebtMonthlyPayments: OptionalNumber.optional(),
  existingAdvancesOutstanding: OptionalNumber.optional(),
  dscr: OptionalNumber.optional(),

  // Concentration / customer quality
  topCustomerPct: OptionalNumber.optional(),
  top3CustomersPct: OptionalNumber.optional(),
  customerCount: OptionalInt.optional(),
  customerCreditQuality: z.string().optional(),
  invoiceVolumeMonthly: OptionalNumber.optional(),
  averageInvoiceSize: OptionalNumber.optional(),

  // Quote terms
  lenderName: z.string().optional(),
  productType: z.string().optional(),
  amount: OptionalNumber.optional(),
  termMonths: OptionalInt.optional(),
  factorRate: z.coerce.number().finite().positive(),
  advanceRatePct: OptionalNumber.optional(),
  discountRatePct: OptionalNumber.optional(),
  feeFlat: OptionalNumber.optional(),
  feePct: OptionalNumber.optional(),
  minFee: OptionalNumber.optional(),
  originationFee: OptionalNumber.optional(),
  dueDiligenceFee: OptionalNumber.optional(),
  wireFee: OptionalNumber.optional(),
  lockboxFee: OptionalNumber.optional(),
  terminationFee: OptionalNumber.optional(),
  recourse: z.coerce.boolean().optional(),
  reservePct: OptionalNumber.optional(),

  source: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateQuoteInput = z.infer<typeof CreateQuoteSchema>;

export const CreateQuoteRequestSchema = z.object({
  quote: CreateQuoteSchema,
});

export const AssessRequestSchema = z.object({
  business: z.object({
    industry: z.string().min(1),
    annualRevenue: z.coerce.number().finite().nonnegative(),
    yearsInBusiness: z.coerce.number().finite().nonnegative(),
  }),
  quote: z.object({
    factorRate: z.coerce.number().finite().positive(),
  }),
});

