"use client";

import Link from "next/link";

export default function ImportPage() {
  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">LoanView</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
            CSV import removed
          </h1>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-zinc-700 hover:underline"
        >
          Home
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <p className="text-sm font-medium text-zinc-900">
          Use the native quote form instead
        </p>
        <p className="mt-1 text-sm text-zinc-600">
          You asked for a fully native experience, so quotes are now entered
          through a form and stored directly in the database.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/quotes/new"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Add a quote
          </Link>
          <Link
            href="/quotes"
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            View quotes table
          </Link>
          <Link
            href="/assess"
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            Score a quote
          </Link>
        </div>
      </div>
    </div>
  );
}

