// src/pages/Dashboard.jsx
import React from "react";

export default function Dashboard() {
  return (
    <section className="container py-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-[rgb(var(--ink-dim))]">
        Signed-in landing page (per your doc). Replace this stub with real widgets once CI is green.
      </p>

      {/* Demo card */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-[rgb(var(--ink-dim))]">
            <li>Upload processed</li>
            <li>Invoice extracted</li>
            <li>Report generated</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="btn-primary rounded-xl px-4 py-2">New Upload</button>
            <button className="rounded-xl border px-4 py-2">View Results</button>
          </div>
        </div>
      </div>

      {/* Safe, self-contained form (no stray closing tags) */}
      <form className="mt-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
        <label className="block text-sm font-medium">Demo input</label>
        <input
          className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
          placeholder="Type something…"
        />
        <div className="mt-4">
          <button type="submit" className="btn-primary rounded-xl px-4 py-2">
            Submit
          </button>
        </div>
      </form>
    </section>
  );
}
