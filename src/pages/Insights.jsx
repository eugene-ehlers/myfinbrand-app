// src/pages/Insights.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";
import { INSIGHTS, CATEGORIES, TYPES } from "../data/insightsContent";

export default function Insights() {
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");

  const filtered = INSIGHTS.filter((item) => {
    const matchCategory = category === "All" || item.category === category;
    const matchType = type === "All" || item.type === type;
    return matchCategory && matchType;
  });

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="Insights | The Smart Decision Group"
        description="White papers and practical guides on AI strategy, decision engines, and analytics ROI."
        canonical="https://www.tsdg.co.za/insights"
        ogType="website"
        rssHref="https://www.tsdg.co.za/feed.xml"
      />

      <SiteHeader />

      <header className="page-container mx-auto max-w-5xl px-4 pt-10 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Insights</h1>
        <p className="mt-2 text-slate-600">
          Research notes, white papers, and how-tos for decision intelligence leaders.
        </p>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-3 items-center">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs uppercase tracking-wide text-slate-500">
              Category
            </span>
            <button
              onClick={() => setCategory("All")}
              className={`text-xs px-3 py-1 rounded-full border ${
                category === "All"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`text-xs px-3 py-1 rounded-full border ${
                  category === c
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs uppercase tracking-wide text-slate-500">
              Type
            </span>
            <button
              onClick={() => setType("All")}
              className={`text-xs px-3 py-1 rounded-full border ${
                type === "All"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700"
              }`}
            >
              All
            </button>
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`text-xs px-3 py-1 rounded-full border ${
                  type === t
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700"
                }`}
            >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="page-container mx-auto max-w-5xl px-4 pb-16">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">
            No insights match these filters yet.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {filtered.map((a) => (
              <Link
                key={a.slug}
                to={a.path}
                className="rounded-2xl border p-5 hover:shadow transition-shadow"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {a.date} • {a.read}
                  </span>
                  <span className="rounded-full border px-2 py-0.5">
                    {a.type}
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-semibold">{a.title}</h2>
                <p className="mt-2 text-slate-700">{a.summary}</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {a.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs rounded-full border px-2 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
