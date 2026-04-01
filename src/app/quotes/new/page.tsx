"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CreateQuoteInput } from "@/lib/schemas";

type Status =
  | { type: "idle" }
  | { type: "saving" }
  | { type: "error"; message: string }
  | { type: "done"; id: string };

function Field(props: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-zinc-300">{props.label}</span>
      {props.hint ? (
        <span className="ml-2 text-[11px] text-zinc-500">{props.hint}</span>
      ) : null}
      <div className="mt-2">{props.children}</div>
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100",
        "placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/30",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100",
        "outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/30",
        props.className ?? "",
      ].join(" ")}
    >
      {props.children}
    </select>
  );
}

function Checkbox(props: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => props.onChange(!props.checked)}
      className={[
        "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
        props.checked
          ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-100"
          : "border-white/10 bg-white/5 text-zinc-200",
      ].join(" ")}
    >
      <span
        className={[
          "h-4 w-4 rounded border",
          props.checked
            ? "border-cyan-300 bg-cyan-300/20"
            : "border-white/20 bg-transparent",
        ].join(" ")}
      />
      {props.label}
    </button>
  );
}

export default function NewQuotePage() {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const [form, setForm] = useState<CreateQuoteInput>({
    industry: "saas",
    annualRevenue: 1200000,
    yearsInBusiness: 3,
    factorRate: 1.22,
    personalGuarantee: false,
    bankruptciesLast7y: false,
    taxLiens: false,
    judgments: false,
  });

  const canSubmit =
    form.industry.trim().length > 0 &&
    Number.isFinite(form.annualRevenue) &&
    Number.isFinite(form.yearsInBusiness) &&
    Number.isFinite(form.factorRate);

  const sectionBadge = useMemo(
    () => (
      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-zinc-300">
        stored in Quotes table
      </span>
    ),
    [],
  );

  function set<K extends keyof CreateQuoteInput>(key: K, value: CreateQuoteInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    setStatus({ type: "saving" });
    const res = await fetch("/api/quotes/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ quote: form }),
    });
    const json = (await res.json().catch(() => ({}))) as
      | { id?: string; error?: string }
      | undefined;
    if (!res.ok) {
      setStatus({ type: "error", message: json?.error ?? "Save failed." });
      return;
    }
    const id = json?.id;
    setStatus({ type: "done", id: typeof id === "string" ? id : "" });
  }

  return (
    <div className="min-h-[calc(100vh-0px)] bg-[radial-gradient(60%_50%_at_50%_0%,rgba(34,211,238,0.18),rgba(0,0,0,0))]">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-medium tracking-wide text-zinc-500">
              LOANVIEW
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
              Add a historical quote
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Capture underwriting factors and the resulting quote terms. This is
              the training/benchmark dataset your scoring uses.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/quotes"
              className="text-sm font-medium text-zinc-300 hover:text-zinc-100"
            >
              Quotes table
            </Link>
            <Link
              href="/assess"
              className="text-sm font-medium text-zinc-300 hover:text-zinc-100"
            >
              Score
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-zinc-300 hover:text-zinc-100"
            >
              Home
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-zinc-200">
                Business profile
              </p>
              {sectionBadge}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Industry" hint="required">
                <Input
                  value={form.industry}
                  onChange={(e) => set("industry", e.target.value)}
                  placeholder="e.g. trucking, staffing, saas"
                />
              </Field>
              <Field label="Sub-industry">
                <Input
                  value={form.subIndustry ?? ""}
                  onChange={(e) => set("subIndustry", e.target.value)}
                  placeholder="e.g. healthcare staffing"
                />
              </Field>
              <Field label="Business model">
                <Select
                  value={form.businessModel ?? ""}
                  onChange={(e) => set("businessModel", e.target.value)}
                >
                  <option value="">—</option>
                  <option value="b2b">B2B</option>
                  <option value="b2c">B2C</option>
                  <option value="mixed">Mixed</option>
                </Select>
              </Field>
              <Field label="Entity type">
                <Select
                  value={form.entityType ?? ""}
                  onChange={(e) => set("entityType", e.target.value)}
                >
                  <option value="">—</option>
                  <option value="llc">LLC</option>
                  <option value="s-corp">S-Corp</option>
                  <option value="c-corp">C-Corp</option>
                  <option value="sole-prop">Sole prop</option>
                  <option value="other">Other</option>
                </Select>
              </Field>
              <Field label="State">
                <Input
                  value={form.state ?? ""}
                  onChange={(e) => set("state", e.target.value)}
                  placeholder="e.g. CA"
                />
              </Field>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Field label="Annual revenue (ARR)" hint="required">
                <Input
                  value={String(form.annualRevenue)}
                  onChange={(e) => set("annualRevenue", Number(e.target.value))}
                  inputMode="decimal"
                  placeholder="1200000"
                />
              </Field>
              <Field label="Years in business" hint="required">
                <Input
                  value={String(form.yearsInBusiness)}
                  onChange={(e) =>
                    set("yearsInBusiness", Number(e.target.value))
                  }
                  inputMode="decimal"
                  placeholder="3"
                />
              </Field>
              <Field label="Months in business">
                <Input
                  value={form.monthsInBusiness?.toString() ?? ""}
                  onChange={(e) =>
                    set("monthsInBusiness", e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  inputMode="numeric"
                  placeholder="36"
                />
              </Field>
              <Field label="Monthly revenue">
                <Input
                  value={form.monthlyRevenue?.toString() ?? ""}
                  onChange={(e) =>
                    set("monthlyRevenue", e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  inputMode="decimal"
                  placeholder="100000"
                />
              </Field>
              <Field label="Avg monthly deposits">
                <Input
                  value={form.avgMonthlyDeposits?.toString() ?? ""}
                  onChange={(e) =>
                    set("avgMonthlyDeposits", e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  inputMode="decimal"
                  placeholder="95000"
                />
              </Field>
              <Field label="Avg bank balance">
                <Input
                  value={form.avgBankBalance?.toString() ?? ""}
                  onChange={(e) =>
                    set("avgBankBalance", e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  inputMode="decimal"
                  placeholder="40000"
                />
              </Field>
              <Field label="Gross margin %" hint="0-100">
                <Input
                  value={form.grossMarginPct?.toString() ?? ""}
                  onChange={(e) =>
                    set("grossMarginPct", e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  inputMode="decimal"
                  placeholder="35"
                />
              </Field>
              <Field label="Avg AR days">
                <Input
                  value={form.arDays?.toString() ?? ""}
                  onChange={(e) =>
                    set("arDays", e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  inputMode="decimal"
                  placeholder="45"
                />
              </Field>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-zinc-200">
                Owner / credit & risk signals
              </p>
              {sectionBadge}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Field label="Credit score (FICO)">
                <Input
                  value={form.creditScore?.toString() ?? ""}
                  onChange={(e) =>
                    set("creditScore", e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  inputMode="numeric"
                  placeholder="720"
                />
              </Field>
              <Field label="NSF (last 90 days)">
                <Input
                  value={form.nsfLast90Days?.toString() ?? ""}
                  onChange={(e) =>
                    set("nsfLast90Days", e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  inputMode="numeric"
                  placeholder="0"
                />
              </Field>
              <Field label="DSCR">
                <Input
                  value={form.dscr?.toString() ?? ""}
                  onChange={(e) => set("dscr", e.target.value === "" ? undefined : Number(e.target.value))}
                  inputMode="decimal"
                  placeholder="1.35"
                />
              </Field>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Checkbox
                label="Personal guarantee"
                checked={!!form.personalGuarantee}
                onChange={(v) => set("personalGuarantee", v)}
              />
              <Checkbox
                label="Bankruptcies (last 7y)"
                checked={!!form.bankruptciesLast7y}
                onChange={(v) => set("bankruptciesLast7y", v)}
              />
              <Checkbox
                label="Tax liens"
                checked={!!form.taxLiens}
                onChange={(v) => set("taxLiens", v)}
              />
              <Checkbox
                label="Judgments"
                checked={!!form.judgments}
                onChange={(v) => set("judgments", v)}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-zinc-200">
                Concentration & invoices (factoring)
              </p>
              {sectionBadge}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Field label="Invoice volume (monthly)">
                <Input
                  value={form.invoiceVolumeMonthly?.toString() ?? ""}
                  onChange={(e) =>
                    set("invoiceVolumeMonthly", e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  inputMode="decimal"
                  placeholder="150000"
                />
              </Field>
              <Field label="Avg invoice size">
                <Input
                  value={form.averageInvoiceSize?.toString() ?? ""}
                  onChange={(e) =>
                    set("averageInvoiceSize", e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  inputMode="decimal"
                  placeholder="8500"
                />
              </Field>
              <Field label="Customer count">
                <Input
                  value={form.customerCount?.toString() ?? ""}
                  onChange={(e) =>
                    set("customerCount", e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  inputMode="numeric"
                  placeholder="12"
                />
              </Field>
              <Field label="Top customer %" hint="0-100">
                <Input
                  value={form.topCustomerPct?.toString() ?? ""}
                  onChange={(e) =>
                    set("topCustomerPct", e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  inputMode="decimal"
                  placeholder="35"
                />
              </Field>
              <Field label="Top 3 customers %" hint="0-100">
                <Input
                  value={form.top3CustomersPct?.toString() ?? ""}
                  onChange={(e) =>
                    set("top3CustomersPct", e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  inputMode="decimal"
                  placeholder="65"
                />
              </Field>
              <Field label="Customer credit quality">
                <Select
                  value={form.customerCreditQuality ?? ""}
                  onChange={(e) => set("customerCreditQuality", e.target.value)}
                >
                  <option value="">—</option>
                  <option value="strong">Strong</option>
                  <option value="mixed">Mixed</option>
                  <option value="weak">Weak</option>
                </Select>
              </Field>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-zinc-200">Quote terms</p>
              {sectionBadge}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Field label="Lender name">
                <Input
                  value={form.lenderName ?? ""}
                  onChange={(e) => set("lenderName", e.target.value)}
                  placeholder="e.g. BlueSky Capital"
                />
              </Field>
              <Field label="Product type">
                <Select
                  value={form.productType ?? "factoring"}
                  onChange={(e) => set("productType", e.target.value)}
                >
                  <option value="factoring">Factoring</option>
                  <option value="mca">MCA</option>
                  <option value="loc">Line of credit</option>
                  <option value="rbl">Revenue-based</option>
                  <option value="">Other</option>
                </Select>
              </Field>
              <Field label="Amount">
                <Input
                  value={form.amount?.toString() ?? ""}
                  onChange={(e) => set("amount", e.target.value === "" ? undefined : Number(e.target.value))}
                  inputMode="decimal"
                  placeholder="100000"
                />
              </Field>
              <Field label="Term (months)">
                <Input
                  value={form.termMonths?.toString() ?? ""}
                  onChange={(e) =>
                    set("termMonths", e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  inputMode="numeric"
                  placeholder="6"
                />
              </Field>
              <Field label="Factor rate" hint="required">
                <Input
                  value={String(form.factorRate)}
                  onChange={(e) => set("factorRate", Number(e.target.value))}
                  inputMode="decimal"
                  placeholder="1.22"
                />
              </Field>
              <Field label="Advance rate %" hint="0-100">
                <Input
                  value={form.advanceRatePct?.toString() ?? ""}
                  onChange={(e) =>
                    set("advanceRatePct", e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  inputMode="decimal"
                  placeholder="85"
                />
              </Field>
              <Field label="Discount rate %" hint="if quoted separately">
                <Input
                  value={form.discountRatePct?.toString() ?? ""}
                  onChange={(e) =>
                    set("discountRatePct", e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  inputMode="decimal"
                  placeholder="3"
                />
              </Field>
              <Field label="Fee %">
                <Input
                  value={form.feePct?.toString() ?? ""}
                  onChange={(e) => set("feePct", e.target.value === "" ? undefined : Number(e.target.value))}
                  inputMode="decimal"
                  placeholder="1.5"
                />
              </Field>
              <Field label="Flat fee">
                <Input
                  value={form.feeFlat?.toString() ?? ""}
                  onChange={(e) => set("feeFlat", e.target.value === "" ? undefined : Number(e.target.value))}
                  inputMode="decimal"
                  placeholder="500"
                />
              </Field>
              <Field label="Recourse">
                <Select
                  value={
                    form.recourse === undefined || form.recourse === null
                      ? ""
                      : form.recourse
                        ? "yes"
                        : "no"
                  }
                  onChange={(e) => {
                    const v = e.target.value;
                    set("recourse", v === "" ? undefined : v === "yes");
                  }}
                >
                  <option value="">—</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Select>
              </Field>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={!canSubmit || status.type === "saving"}
                onClick={submit}
                className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-black hover:bg-cyan-300 disabled:opacity-50"
              >
                {status.type === "saving" ? "Saving…" : "Save quote"}
              </button>
              <Link
                href="/quotes"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-zinc-200 hover:bg-white/10"
              >
                View table
              </Link>
              {status.type === "error" ? (
                <p className="text-sm text-red-300">{status.message}</p>
              ) : null}
              {status.type === "done" ? (
                <p className="text-sm text-emerald-300">
                  Saved. ID: <span className="font-mono">{status.id}</span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

