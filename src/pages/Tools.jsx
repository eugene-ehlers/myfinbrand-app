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

  // Sort newest → oldest
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

  // Decide if this item is a static document (PDF) rather than an internal tool route
  const isDocument = (item) =>
    typeof item.path === "string" &&
    (item.path.endsWith(".pdf") || item.path.startsWith("/docs/"));

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <Seo
        title="Tools & Calculators | The Smart Decision Group"
        description="Free calculators and assessments for executives, risk leaders, and credit teams evaluating decision automation, ROI, and operating cost."
        canonical="https://www.tsdg.co.za/tools"
        ogType="website"
      />

      <SiteHeader />

      {/* Branded header (subtle glow, consistent with Landing) */}
      <header className="relative overflow-hidden border-b bg-white/70 backdrop-blur">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-60"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(2,6,23,0.35) 0%, rgba(2,6,23,0.0) 70%)",
            }}
          />
          <div
            className="absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-60"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(43,212,224,0.28) 0%, rgba(43,212,224,0.0) 70%)",
            }}
          />
        </div>

        <div className="page-container mx-auto max-w-5xl px-4 pt-10 pb-6 relative">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs"
            style={{
              background: "rgba(43,212,224,0.10)",
              border: "1px solid rgba(43,212,224,0.22)",
              color: "rgb(15 23 42)",
            }}
          >
            Resources
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Tools &amp; Calculators
          </h1>

          <p className="mt-2 text-slate-700">
            Practical calculators for executives, risk leaders, and credit teams
            evaluating ROI, operating cost, scorecard economics, and decision
            automation opportunities.
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Prefer reading first?{" "}
            <Link to="/insights" className="underline underline-offset-2">
              Explore Insights &amp; white papers
            </Link>
            .
          </p>

          {/* Featured row */}
          {featuredTools.length > 0 && (
            <section className="mt-6 rounded-3xl border bg-white/70 backdrop-blur p-4">
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
                      className="rounded-2xl border bg-white p-4 hover:shadow-sm transition-shadow"
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
        </div>
      </header>

      <main className="page-container mx-auto max-w-5xl px-4 pb-16 pt-8">
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
                  className="rounded-2xl border bg-white p-5 hover:shadow transition-shadow"
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
