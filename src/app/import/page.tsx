"use client";

import Papa from "papaparse";
import { useMemo, useState } from "react";
import Link from "next/link";
import { QuoteImportRowSchema, type QuoteImportRow } from "@/lib/schemas";

type ImportResult =
  | { type: "idle" }
  | { type: "parsing" }
  | { type: "error"; message: string }
  | { type: "ready"; quotes: QuoteImportRow[]; warnings: string[] }
  | { type: "uploading"; quotes: QuoteImportRow[]; warnings: string[] }
  | { type: "done"; inserted: number; warnings: string[] };

function coerceEmptyToUndefined(v: unknown) {
  if (typeof v !== "string") return v;
  const t = v.trim();
  return t === "" ? undefined : t;
}

export default function ImportPage() {
  const [result, setResult] = useState<ImportResult>({ type: "idle" });

  const stats = useMemo(() => {
    if (result.type === "ready" || result.type === "uploading") {
      return { rows: result.quotes.length, warnings: result.warnings.length };
    }
    if (result.type === "done") {
      return { rows: result.inserted, warnings: result.warnings.length };
    }
    return null;
  }, [result]);

  async function upload(quotes: QuoteImportRow[], warnings: string[]) {
    setResult({ type: "uploading", quotes, warnings });
    const res = await fetch("/api/quotes/import", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ quotes }),
    });
    const json = (await res.json().catch(() => ({}))) as
      | { inserted?: number; error?: string }
      | undefined;
    if (!res.ok) {
      setResult({
        type: "error",
        message: json?.error ?? "Import failed.",
      });
      return;
    }
    setResult({
      type: "done",
      inserted: typeof json.inserted === "number" ? json.inserted : 0,
      warnings,
    });
  }

  function onFile(file: File) {
    setResult({ type: "parsing" });
    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      skipEmptyLines: "greedy",
      transform: (value) => coerceEmptyToUndefined(value),
      complete: (res) => {
        const warnings: string[] = [];
        if (res.errors?.length) {
          warnings.push(
            ...res.errors.slice(0, 10).map((e) => `Row ${e.row}: ${e.message}`),
          );
        }
        const quotes: QuoteImportRow[] = [];
        const rows = Array.isArray(res.data) ? res.data : [];
        rows.forEach((row, idx) => {
          const parsed = QuoteImportRowSchema.safeParse(row);
          if (!parsed.success) {
            warnings.push(`Row ${idx + 2}: failed validation (skipped)`);
            return;
          }
          quotes.push(parsed.data);
        });

        if (quotes.length === 0) {
          setResult({
            type: "error",
            message:
              "No valid rows found. Make sure the CSV has headers like industry, annualRevenue, yearsInBusiness, factorRate.",
          });
          return;
        }
        setResult({ type: "ready", quotes, warnings });
      },
      error: (e) => setResult({ type: "error", message: e.message }),
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">LoanView</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
            Import historical quotes
          </h1>
        </div>
        <Link href="/" className="text-sm font-medium text-zinc-700 hover:underline">
          Home
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <p className="text-sm font-medium text-zinc-900">CSV template</p>
        <p className="mt-1 text-sm text-zinc-600">
          Download and fill in your historical quotes, then upload it here.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <a
            href="/quotes-template.csv"
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            Download template
          </a>
          <Link
            href="/assess"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Go to scoring
          </Link>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <label className="block text-sm font-medium text-zinc-900">
          Upload CSV
        </label>
        <input
          className="mt-2 block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800"
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />

        {result.type === "parsing" && (
          <p className="mt-3 text-sm text-zinc-600">Parsing…</p>
        )}

        {result.type === "error" && (
          <p className="mt-3 text-sm text-red-600">{result.message}</p>
        )}

        {(result.type === "ready" || result.type === "uploading") && (
          <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm">
            <p className="font-medium text-zinc-900">Ready to import</p>
            <p className="mt-1 text-zinc-700">
              Valid rows: <span className="font-mono">{result.quotes.length}</span>
              {result.warnings.length > 0 ? (
                <>
                  {" "}
                  · warnings:{" "}
                  <span className="font-mono">{result.warnings.length}</span>
                </>
              ) : null}
            </p>
            <button
              className="mt-3 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
              disabled={result.type === "uploading"}
              onClick={() => upload(result.quotes, result.warnings)}
            >
              {result.type === "uploading" ? "Importing…" : "Import into database"}
            </button>

            {result.warnings.length > 0 ? (
              <details className="mt-3">
                <summary className="cursor-pointer text-zinc-800">
                  View warnings
                </summary>
                <ul className="mt-2 list-disc pl-5 text-xs text-zinc-700">
                  {result.warnings.slice(0, 20).map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </details>
            ) : null}
          </div>
        )}

        {result.type === "done" && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
            <p className="font-medium text-emerald-900">Import complete</p>
            <p className="mt-1 text-emerald-800">
              Inserted: <span className="font-mono">{result.inserted}</span>
            </p>
            <div className="mt-3 flex gap-3">
              <Link
                href="/assess"
                className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
              >
                Score a quote
              </Link>
              <button
                className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50"
                onClick={() => setResult({ type: "idle" })}
              >
                Import another CSV
              </button>
            </div>
          </div>
        )}

        {stats ? (
          <p className="mt-3 text-xs text-zinc-500">
            Rows processed:{" "}
            <span className="font-mono">{stats.rows}</span>
            {stats.warnings ? (
              <>
                {" "}
                · warnings: <span className="font-mono">{stats.warnings}</span>
              </>
            ) : null}
          </p>
        ) : null}
      </div>
    </div>
  );
}

