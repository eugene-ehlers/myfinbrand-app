// src/pages/Insights.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";
import ResourcesHeader from "../components/resources/ResourcesHeader.jsx";
import { INSIGHTS, CATEGORIES, TYPES } from "../data/insightsContent";

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
    const matchCategory =
      category === "All" ||
      item.category === category ||
      (Array.isArray(item.category) && item.category.includes(category));

    const matchType = type === "All" || item.type === type;
    return matchCategory && matchType;
  });

  // Optional: honour featuredRank if present, else stable fallback (same pattern as Tools.jsx)
  const featuredInsights = useMemo(() => {
    return sortedInsights
      .filter((i) => i.featured)
      .sort((a, b) => {
        const ar = Number.isFinite(a.featuredRank) ? a.featuredRank : 9999;
        const br = Number.isFinite(b.featuredRank) ? b.featuredRank : 9999;
        return ar - br || (b.date || "").localeCompare(a.date || "");
      });
  }, [sortedInsights]);

  // Decide if this item is a static document (PDF) rather than an internal article route
  const isDocument = (item) =>
    typeof item.path === "string" &&
    (item.path.endsWith(".pdf") || item.path.startsWith("/docs/"));

  const Filters = (
    <div className="flex flex-wrap gap-4 items-center">
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
              type === t ? "bg-slate-900 text-white" : "bg-white text-slate-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <Seo
        title="Insights | The Smart Decision Group"
        description="White papers and practical guides on AI strategy, decision engines, credit strategy, and analytics ROI."
        canonical="https://www.tsdg.co.za/insights"
        ogType="website"
        rssHref="https://www.tsdg.co.za/feed.xml"
      />

      <SiteHeader />

      <ResourcesHeader
        title="Insights"
        description="Research notes, white papers, and practical guides for executives, risk leaders, credit teams, and data teams modernising their decisioning."
        helper={
          <>
            Prefer quick estimates?{" "}
            <Link to="/tools" className="underline underline-offset-2">
              Try our calculators
            </Link>
            . Prefer plain-language guidance?{" "}
            <Link to="/library" className="underline underline-offset-2">
              Visit the Library
            </Link>
            .
          </>
        }
        featured={featuredInsights}
        isDocument={isDocument}
        filters={Filters}
      />

      <main className="page-container mx-auto max-w-5xl px-4 pb-16 pt-8">
        {/* Lightweight discovery block (keeps page clean, improves internal linking/SEO) */}
        <section className="rounded-2xl border bg-white p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Also in Resources
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border p-4 bg-slate-50">
              <div className="text-sm font-semibold">Tools & calculators</div>
              <p className="mt-1 text-sm text-slate-700">
                Quantify impact: ROI, operating cost, and scorecard economics.
              </p>
              <div className="mt-3">
                <Link
                  to="/tools"
                  className="text-sm font-medium underline underline-offset-2"
                >
                  Go to Tools
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border p-4 bg-slate-50">
              <div className="text-sm font-semibold">Library (plain-language)</div>
              <p className="mt-1 text-sm text-slate-700">
                Short, practical guidance for operators and executives who want
                clarity without “training”.
              </p>
              <div className="mt-3">
                <Link
                  to="/library"
                  className="text-sm font-medium underline underline-offset-2"
                >
                  Go to Library
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8">
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-500">
              No insights match these filters yet.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {filtered.map((a) => {
                const doc = isDocument(a);
                const Wrapper = doc ? "a" : Link;
                const wrapperProps = doc
                  ? { href: a.path, target: "_blank", rel: "noopener noreferrer" }
                  : { to: a.path };

                return (
                  <Wrapper
                    key={a.slug || a.path}
                    {...wrapperProps}
                    className="rounded-2xl border bg-white p-5 hover:shadow transition-shadow"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {a.date} {a.read ? `• ${a.read}` : null}
                      </span>
                      <div className="flex items-center gap-1">
                        {a.category && (
                          <span className="hidden sm:inline text-[10px] rounded-full border px-2 py-0.5">
                            {Array.isArray(a.category)
                              ? a.category[0]
                              : a.category}
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
                  </Wrapper>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
