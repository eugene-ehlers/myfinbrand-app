// src/pages/Tools.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";
import { TOOLS, TOOL_CATEGORIES, TOOL_TYPES } from "../data/toolsContent";

export default function Tools() {
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");

  const sortedTools = useMemo(() => {
    return [...TOOLS].sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return b.date.localeCompare(a.date);
    });
  }, []);

  const filtered = sortedTools.filter((item) => {
    const matchCategory =
      category === "All" ||
      item.category === category ||
      (Array.isArray(item.category) && item.category.includes(category));

    const matchType = type === "All" || item.type === type;
    return matchCategory && matchType;
  });

  const featuredTools = sortedTools.filter((i) => i.featured);

  const isDocument = (item) =>
    typeof item.path === "string" &&
    (item.path.endsWith(".pdf") || item.path.startsWith("/docs/"));

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="Tools & Calculators | The Smart Decision Group"
        description="Free calculators and assessments for executives, risk leaders, and credit teams evaluating decision automation, ROI, and operating cost."
        canonical="https://www.tsdg.co.za/tools"
        ogType="website"
      />

      <SiteHeader />

      <header className="page-container mx-auto max-w-5xl px-4 pt-10 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Tools</h1>
        <p className="mt-2 text-slate-600">
          Quick calculators and assessments to estimate ROI, operating cost, and
          governance impact in under 3 minutes.
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Start with the recommended tools below, then filter by category or
          type.
        </p>

        {/* Featured row */}
        {featuredTools.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
              Recommended starting points
            </h2>
            <div className="mt-3 grid gap-4 md:grid-cols-3">
              {featuredTools.map((a) => {
                const doc = isDocument(a);
                const Wrapper = doc ? "a" : Link;
                const wrapperProps = doc
                  ? {
                      href: a.path,
                      target: "_blank",
                      rel: "noopener noreferrer",
                    }
                  : { to: a.path };

                return (
                  <Wrapper
                    key={a.slug || a.path}
                    {...wrapperProps}
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
                  </Wrapper>
                );
              })}
            </div>
          </section>
        )}

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-4 items-center">
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
            {TOOL_CATEGORIES.map((c) => (
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
            {TOOL_TYPES.map((t) => (
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
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">
            No tools match these filters yet.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {filtered.map((a) => {
              const doc = isDocument(a);
              const Wrapper = doc ? "a" : Link;
              const wrapperProps = doc
                ? {
                    href: a.path,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  }
                : { to: a.path };

              return (
                <Wrapper
                  key={a.slug || a.path}
                  {...wrapperProps}
                  className="rounded-2xl border p-5 hover:shadow transition-shadow"
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
      </main>

      <SiteFooter />
    </div>
  );
}
