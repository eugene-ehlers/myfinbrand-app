// src/pages/Insights.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";
import { INSIGHTS, CATEGORIES, TYPES } from "../data/insightsContent";
// import FounderBio from "../components/FounderBio.jsx";

export default function Insights() {
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");

  // Sort newest → oldest
  const sortedInsights = useMemo(() => {
    return [...INSIGHTS].sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return b.date.localeCompare(a.date);
    });
  }, []);

  const filtered = sortedInsights.filter((item) => {
    const matchCategory = category === "All" || item.category === category;
    const matchType = type === "All" || item.type === type;
    return matchCategory && matchType;
  });

  const featuredInsights = sortedInsights.filter((i) => i.featured);

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
          Research notes, white papers, and practical guides for executives,
          risk leaders, and data teams modernising their decisioning.
        </p>
        <p className="mt-1 text-sm text-slate-500">
          If you arrived here from LinkedIn, start with the featured pieces
          below and then explore by category or type.
        </p>

        {/* Featured row */}
        {featuredInsights.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
              Recommended starting points
            </h2>
            <div className="mt-3 grid gap-4 md:grid-cols-3">
              {featuredInsights.map((a) => (
                <Link
                  key={a.slug}
                  to={a.path}
                  className="rounded-2xl border p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>{a.type}</span>
                    <span>{a.date}</span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold leading-snug">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-700 line-clamp-4">
                    {a.summary}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-4 items-center">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs uppercase tracking-wide text-slate-500">
              Category
            </span>
            <button
              type="button"
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
                type="button"
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

          {/* Type filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs uppercase tracking-wide text-slate-500">
              Type
            </span>
            <button
              type="button"
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
                type="button"
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
        {/* Dynamic insight cards */}
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">
            No insights match these filters yet.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {filtered.map((a) => (
              <Link
                key={a.slug || a.path}
                to={a.path}
                className="rounded-2xl border p-5 hover:shadow transition-shadow"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {a.date} {a.read ? `• ${a.read}` : null}
                  </span>
                  <div className="flex items-center gap-1">
                    {a.category && (
                      <span className="hidden sm:inline text-[10px] rounded-full border px-2 py-0.5">
                        {a.category}
                      </span>
                    )}
                    {a.type && (
                      <span className="text-[10px] rounded-full border px-2 py-0.5">
                        {a.type}
                      </span>
                    )}
                  </div>
                </div>
                <h2 className="mt-2 text-xl font-semibold">{a.title}</h2>
                <p className="mt-2 text-slate-700">{a.summary}</p>
                {a.tags && a.tags.length > 0 && (
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
                )}
              </Link>
            ))}
          </div>
        )}

        {/* STATIC SECTION: Decision white papers you mentioned */}
        <section className="mt-12">
          <h2 className="text-lg font-semibold tracking-tight">
            Decision Guides & White Papers
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Download concise, practitioner-led white papers on decision
            architecture, AI, and modern credit strategy.
          </p>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {/* Five Decisions white paper */}
            <a
              href="/docs/Five-decisions.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border p-5 hover:shadow transition-shadow block"
            >
              <div className="text-xs text-slate-500 flex items-center justify-between">
                <span>White Paper</span>
                <span>2025-12</span>
              </div>
              <h3 className="mt-2 text-lg font-semibold">
                The Five Decisions Every Organisation Must Clarify Before Using
                AI
              </h3>
              <p className="mt-2 text-sm text-slate-700">
                A practical framework for clarifying fixed, flexible, and
                judgement-based decisions before layering in AI, automation, or
                decision engines.
              </p>
            </a>

            {/* Three Curves / Decision Cohesion paper */}
            <a
              href="/docs/Three-curves.docx"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border p-5 hover:shadow transition-shadow block"
            >
              <div className="text-xs text-slate-500 flex items-center justify-between">
                <span>White Paper</span>
                <span>2025-12</span>
              </div>
              <h3 className="mt-2 text-lg font-semibold">
                Decision Cohesion: Balancing Risk, Revenue, and Growth
              </h3>
              <p className="mt-2 text-sm text-slate-700">
                Explores how risk, sales, and finance often optimise different
                curves, and how a unified decision architecture and decision
                engine align them around profitable, sustainable growth.
              </p>
            </a>
          </div>
        </section>

        {/* Optional: bring your founder credibility in here later */}
        {/* <div className="mt-12">
          <FounderBio />
        </div> */}
      </main>

      <SiteFooter />
    </div>
  );
}
