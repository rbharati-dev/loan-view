import { z } from "zod";

export const QuoteImportRowSchema = z.object({
  industry: z.string().min(1),
  annualRevenue: z.coerce.number().finite().nonnegative(),
  yearsInBusiness: z.coerce.number().finite().nonnegative(),
  factorRate: z.coerce.number().finite().positive(),
  amount: z.coerce.number().finite().positive().optional(),
  termMonths: z.coerce.number().int().finite().positive().optional(),
  monthlyRevenue: z.coerce.number().finite().nonnegative().optional(),
  creditScore: z.coerce.number().int().finite().min(300).max(900).optional(),
  notes: z.string().optional(),
});

export type QuoteImportRow = z.infer<typeof QuoteImportRowSchema>;

export const ImportQuotesRequestSchema = z.object({
  quotes: z.array(QuoteImportRowSchema).min(1),
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

