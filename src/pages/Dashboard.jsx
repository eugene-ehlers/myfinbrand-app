// src/pages/Dashboard.jsx
import React from "react";

export default function Dashboard() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-[rgb(var(--ink-dim))]">
        Welcome back. Upload a statement or review recent cases.
      </p>

      {/* Example form (safe, balanced tags) */}
      <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-2">
          <label htmlFor="caseName" className="font-medium">Case name</label>
          <input
            id="caseName"
            name="caseName"
            type="text"
            className="border rounded-lg px-3 py-2 bg-[rgb(var(--surface))] border-[rgb(var(--border))] focus:outline-none"
            placeholder="e.g., ACME_2025_11_BankStmt"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="file" className="font-medium">Upload PDF/Images</label>
          <input
            id="file"
            name="file"
            type="file"
            accept=".pdf,image/*"
            className="block"
          />
        </div>

        <button
          type="submit"
          className="btn-primary rounded-lg px-4 py-2"
        >
          Start OCR
        </button>
      </form>
    </section>
  );
}
