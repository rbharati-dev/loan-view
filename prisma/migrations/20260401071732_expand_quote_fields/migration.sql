-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "industry" TEXT NOT NULL,
    "subIndustry" TEXT,
    "businessModel" TEXT,
    "entityType" TEXT,
    "state" TEXT,
    "annualRevenue" REAL NOT NULL,
    "monthlyRevenue" REAL,
    "avgBankBalance" REAL,
    "avgMonthlyDeposits" REAL,
    "grossMarginPct" REAL,
    "arDays" REAL,
    "yearsInBusiness" REAL NOT NULL,
    "monthsInBusiness" INTEGER,
    "timeInBusinessSameOwnerYears" REAL,
    "creditScore" INTEGER,
    "personalGuarantee" BOOLEAN NOT NULL DEFAULT false,
    "bankruptciesLast7y" BOOLEAN NOT NULL DEFAULT false,
    "taxLiens" BOOLEAN NOT NULL DEFAULT false,
    "judgments" BOOLEAN NOT NULL DEFAULT false,
    "nsfLast90Days" INTEGER,
    "existingDebtMonthlyPayments" REAL,
    "existingAdvancesOutstanding" REAL,
    "dscr" REAL,
    "topCustomerPct" REAL,
    "top3CustomersPct" REAL,
    "customerCount" INTEGER,
    "customerCreditQuality" TEXT,
    "invoiceVolumeMonthly" REAL,
    "averageInvoiceSize" REAL,
    "amount" REAL,
    "termMonths" INTEGER,
    "factorRate" REAL NOT NULL,
    "advanceRatePct" REAL,
    "discountRatePct" REAL,
    "feeFlat" REAL,
    "feePct" REAL,
    "minFee" REAL,
    "originationFee" REAL,
    "dueDiligenceFee" REAL,
    "wireFee" REAL,
    "lockboxFee" REAL,
    "terminationFee" REAL,
    "recourse" BOOLEAN,
    "reservePct" REAL,
    "lenderName" TEXT,
    "productType" TEXT,
    "source" TEXT,
    "notes" TEXT
);
INSERT INTO "new_Quote" ("amount", "annualRevenue", "createdAt", "creditScore", "factorRate", "id", "industry", "monthlyRevenue", "notes", "termMonths", "yearsInBusiness") SELECT "amount", "annualRevenue", "createdAt", "creditScore", "factorRate", "id", "industry", "monthlyRevenue", "notes", "termMonths", "yearsInBusiness" FROM "Quote";
DROP TABLE "Quote";
ALTER TABLE "new_Quote" RENAME TO "Quote";
CREATE INDEX "Quote_industry_idx" ON "Quote"("industry");
CREATE INDEX "Quote_annualRevenue_idx" ON "Quote"("annualRevenue");
CREATE INDEX "Quote_yearsInBusiness_idx" ON "Quote"("yearsInBusiness");
CREATE INDEX "Quote_factorRate_idx" ON "Quote"("factorRate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
