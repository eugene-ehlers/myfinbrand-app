// src/pages/Library.jsx

// src/pages/Library.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";
import ResourcesHeader from "../components/resources/ResourcesHeader.jsx";

import {
  LIBRARY,
  LIBRARY_CATEGORIES,
  LIBRARY_TYPES,
} from "../data/libraryContent";

export default function Library() {
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");

  const sorted = useMemo(() => {
    return [...(LIBRARY || [])].sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return b.date.localeCompare(a.date);
    });
  }, []);

  const filtered = sorted.filter((item) => {
    const matchCategory =
      category === "All" ||
      item.category === category ||
      (Array.isArray(item.category) && item.category.includes(category));

    const matchType = type === "All" || item.type === type;
    return matchCategory && matchType;
  });

  // 🔑 FEATURED ITEMS MUST HAVE A PATH
  const featured = useMemo(() => {
    return sorted
      .filter((i) => i.featured)
      .sort((a, b) => {
        const ar = Number.isFinite(a.featuredRank) ? a.featuredRank : 9999;
        const br = Number.isFinite(b.featuredRank) ? b.featuredRank : 9999;
        return ar - br || (b.date || "").localeCompare(a.date || "");
      })
      .map((item) => ({
        ...item,
        path: `/library/${item.kind}/${item.slug}`,
      }));
  }, [sorted]);

  const isDocument = (item) =>
    typeof item.path === "string" &&
    (item.path.endsWith(".pdf") || item.path.startsWith("/docs/"));

  const Filters = (
    <div className="flex flex-wrap gap-4 items-center">
      {/* Category */}
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
        {LIBRARY_CATEGORIES.map((c) => (
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

      {/* Type */}
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
        {LIBRARY_TYPES.map((t) => (
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
  );

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <Seo
        title="Library | The Smart Decision Group"
        description="A quiet advisory library: practical decisioning guidance for operators modernising credit, onboarding, and risk responsibly."
        canonical="https://www.tsdg.co.za/library"
        ogType="website"
      />

      <SiteHeader />

      <ResourcesHeader
        title="Library"
        description="This is a quiet, practical space for operators. No training. No judgement. Just clear decisioning guidance for people who run real businesses."
        helper={
          <>
            Prefer calculators?{" "}
            <Link to="/tools" className="underline underline-offset-2">
              Explore Tools &amp; calculators
            </Link>
            .
          </>
        }
        featured={featured}
        isDocument={isDocument}
        filters={Filters}
      />

      <main className="page-container mx-auto max-w-5xl px-4 pb-16 pt-8">
        {/* Intro */}
        <section className="rounded-2xl border bg-white p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                What this is
              </h2>
              <ul className="mt-3 space-y-2 text-slate-700">
                <li>Confidential-style advisory notes</li>
                <li>Plain business language</li>
                <li>No vendor buzzwords</li>
                <li>Lessons from real delivery</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                What this is not
              </h2>
              <ul className="mt-3 space-y-2 text-slate-700">
                <li>Not a course</li>
                <li>Not benchmarking</li>
                <li>Not a place to look smart</li>
                <li>Not regulatory advice</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border bg-slate-50 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Confidentiality note
            </h3>
            <p className="mt-2 text-sm text-slate-700">
              Notes avoid client-identifying details and support thinking and
              discussion. They are not a substitute for portfolio-level analysis.
            </p>
          </div>
        </section>

        {/* Library grid */}
        <section className="mt-6">
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-500">
              No library notes match these filters yet.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {filtered.map((a) => (
                <Link
                  key={a.slug}
                  to={`/library/${a.kind}/${a.slug}`}
                  className="rounded-2xl border bg-white p-5 hover:shadow transition-shadow"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {a.date} {a.read ? `• ${a.read}` : null}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] rounded-full border px-2 py-0.5">
                        {a.type}
                      </span>
                    </div>
                  </div>

                  <h2 className="mt-2 text-xl font-semibold">{a.title}</h2>
                  <p className="mt-2 text-slate-700">{a.summary}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
