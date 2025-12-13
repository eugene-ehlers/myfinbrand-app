// src/pages/Tools.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";
import ResourcesHeader from "../components/resources/ResourcesHeader.jsx";
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

  // Optional: honour featuredRank if present, else stable fallback
  const featuredTools = useMemo(() => {
    return sortedTools
      .filter((i) => i.featured)
      .sort((a, b) => {
        const ar = Number.isFinite(a.featuredRank) ? a.featuredRank : 9999;
        const br = Number.isFinite(b.featuredRank) ? b.featuredRank : 9999;
        return ar - br || (b.date || "").localeCompare(a.date || "");
      });
  }, [sortedTools]);

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

      <ResourcesHeader
        title="Tools & Calculators"
        description="Practical calculators for executives, risk leaders, and credit teams evaluating ROI, operating cost, scorecard economics, and decision automation opportunities."
        helper={
          <>
            Prefer reading first?{" "}
            <Link to="/insights" className="underline underline-offset-2">
              Explore Insights &amp; white papers
            </Link>
            .
          </>
        }
        featured={featuredTools}
        isDocument={isDocument}
        filters={Filters}
      />

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
                ? { href: a.path, target: "_blank", rel: "noopener noreferrer" }
                : { to: a.path };

              return (
                <Wrapper
                  key={a.slug || a.path}
                  {...wrapperProps}
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

                  {a.note ? (
                    <p className="mt-3 text-sm text-slate-500">{a.note}</p>
                  ) : null}

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

                  {a.ctaLabel ? (
                    <div className="mt-4 text-sm font-medium underline underline-offset-2">
                      {a.ctaLabel}
                    </div>
                  ) : null}
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
