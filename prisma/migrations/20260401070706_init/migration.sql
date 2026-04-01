-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "industry" TEXT NOT NULL,
    "annualRevenue" REAL NOT NULL,
    "yearsInBusiness" REAL NOT NULL,
    "amount" REAL,
    "termMonths" INTEGER,
    "factorRate" REAL NOT NULL,
    "monthlyRevenue" REAL,
    "creditScore" INTEGER,
    "notes" TEXT
);

-- CreateIndex
CREATE INDEX "Quote_industry_idx" ON "Quote"("industry");

-- CreateIndex
CREATE INDEX "Quote_annualRevenue_idx" ON "Quote"("annualRevenue");

-- CreateIndex
CREATE INDEX "Quote_yearsInBusiness_idx" ON "Quote"("yearsInBusiness");

-- CreateIndex
CREATE INDEX "Quote_factorRate_idx" ON "Quote"("factorRate");
