# LoanView

MVP web app to **import historical factoring quotes** and **benchmark a new quote** (good / ok / bad) against comparable businesses.

## Run locally

```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

Then open `http://localhost:3000`.

## Use

- **Add historical quotes**: go to `/quotes/new` and submit the underwriting + terms form (stored in SQLite).
- **Browse stored records**: go to `/quotes`.
- **Score a quote**: go to `/assess`, enter business details + the lender’s factor rate.

## Scoring (current MVP)

- Uses **nearest-neighbor comparables** (based on `annualRevenue` + `yearsInBusiness`, within industry when enough data exists).
- Computes **P25 / P50 / P75** factor-rate benchmarks and the quote’s **percentile** (higher = more expensive).

# loan-view