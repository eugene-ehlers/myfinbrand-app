// src/pages/Library.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";
import ResourcesHeader from "../components/resources/ResourcesHeader.jsx";
import { LIBRARY, LIBRARY_CATEGORIES, LIBRARY_TYPES, getFeaturedLibrary } from "../data/libraryContent";

export default function Library() {
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");

  const sorted = useMemo(() => {
    return [...LIBRARY].sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return b.date.localeCompare(a.date);
    });
  }, []);

  const featured = useMemo(() => getFeaturedLibrary(), []);

  const filtered = sorted.filter((item) => {
    const matchCategory =
      category === "All" ||
      item.category === category ||
      (Array.isArray(item.category) && item.category.includes(category));

    const matchType = type === "All" || item.type === type;
    return matchCategory && matchType;
  });

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
        {LIBRARY_TYPES.map((t) => (
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

  const accentClass = (a) =>
    a?.accent === "teal"
      ? "border-t-4 border-t-cyan-400"
      : a?.accent === "navy"
      ? "border-t-4 border-t-slate-900"
      : a?.accent === "slate"
      ? "border-t-4 border-t-slate-300"
      : "";

  const isDocument = () => false; // Library is internal content for v1

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <Seo
        title="Library | The Smart Decision Group"
        description="A private advisory library: situations, questions, briefings, and field notes for leaders modernising credit decisioning and operations."
        canonical="https://www.tsdg.co.za/library"
        ogType="website"
      />

      <SiteHeader />

      <ResourcesHeader
        title="Library"
        description="A quiet advisory space—situations, questions, and field notes to help you modernise decisioning without needing to be a technical specialist."
        helper={
          <>
            Prefer calculators?{" "}
            <Link to="/tools" className="underline underline-offset-2">
              Use Tools &amp; calculators
            </Link>
            . Prefer formal papers?{" "}
            <Link to="/insights" className="underline underline-offset-2">
              Explore Insights
            </Link>
            .
          </>
        }
        featured={featured}
        isDocument={isDocument}
        filters={Filters}
      />

      <main className="page-container mx-auto max-w-5xl px-4 pb-16 pt-8">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">
            No library items match these filters yet.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {filtered.map((a) => (
              <Link
                key={`${a.kind}:${a.slug}`}
                to={`/library/${a.kind}/${a.slug}`}
                className={`rounded-2xl border bg-white p-5 hover:shadow transition-shadow ${accentClass(
                  a
                )}`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {a.date} {a.read ? `• ${a.read}` : null}
                  </span>
                  <div className="flex items-center gap-1">
                    {a.category && (
                      <span className="hidden sm:inline text-[10px] rounded-full border px-2 py-0.5">
                        {Array.isArray(a.category) ? a.category[0] : a.category}
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
      </main>

      <SiteFooter />
    </div>
  );
}
