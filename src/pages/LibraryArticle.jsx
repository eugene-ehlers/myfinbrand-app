// src/pages/LibraryArticle.jsx

import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";
import { getLibraryItem } from "../data/libraryContent";
import { TOOLS } from "../data/toolsContent";

/**
 * LibraryArticle
 * Renders a single library article with optional related tools.
 * Tools are linked:
 *  - Explicitly via article.relatedTools (if present)
 *  - Otherwise automatically via shared tags
 */
export default function LibraryArticle() {
  const { kind, slug } = useParams();
  const article = getLibraryItem(kind, slug);

  if (!article) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="page-container mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-2xl font-semibold">Article not found</h1>
          <p className="mt-4 text-slate-600">
            The article you’re looking for does not exist or has been moved.
          </p>
          <div className="mt-6">
            <Link
              to="/library"
              className="text-sm font-medium underline underline-offset-2"
            >
              Back to Library
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  /**
   * Resolve related tools:
   * 1. Use explicit relatedTools if provided
   * 2. Else infer via overlapping tags
   */
  const relatedTools = useMemo(() => {
    // Explicit wins
    if (article.relatedTools && article.relatedTools.length > 0) {
      return article.relatedTools;
    }

    if (!article.tags || article.tags.length === 0) return [];

    const articleTags = article.tags.map((t) => t.toLowerCase());

    return TOOLS.filter((tool) => {
      if (!tool.tags) return false;
      return tool.tags.some((tt) =>
        articleTags.includes(tt.toLowerCase())
      );
    })
      .slice(0, 3) // calm, not aggressive
      .map((tool) => ({
        slug: tool.slug,
        path: tool.path,
        title: tool.title,
        description: tool.summary,
      }));
  }, [article]);

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <Seo
        title={`${article.title} | The Smart Decision Group`}
        description={article.summary}
        ogType="article"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-5xl px-4 pb-16 pt-10">
        {/* =========================
            Header
           ========================= */}
        <header className="mb-10">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            {article.category} • {article.type}
          </div>

          <h1 className="mt-3 text-3xl font-semibold leading-tight">
            {article.title}
          </h1>

          {article.summary && (
            <p className="mt-4 text-lg text-slate-700 max-w-3xl">
              {article.summary}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            {article.date && <span>{article.date}</span>}
            {article.read && <span>• {article.read}</span>}
            {article.tags?.map((t) => (
              <span
                key={t}
                className="rounded-full border px-2 py-0.5 text-[10px]"
              >
                {t}
              </span>
            ))}
          </div>
        </header>

        {/* =========================
            Body
           ========================= */}
        <article className="prose prose-slate max-w-none">
          {article.body?.sections?.map((section, idx) => (
            <section key={idx} className="mb-10">
              {section.heading && <h2>{section.heading}</h2>}

              {section.paragraphs?.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              {section.bullets && (
                <ul>
                  {section.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        {/* =========================
            Related tools (automatic)
           ========================= */}
        {relatedTools.length > 0 && (
          <section className="mt-14 rounded-2xl border bg-slate-50 p-6">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Practical tools related to this topic
            </div>

            <div className="mt-4 space-y-4">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.slug}
                  to={tool.path}
                  className="block rounded-xl border bg-white p-4 hover:shadow transition-shadow"
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {tool.title}
                  </div>
                  {tool.description && (
                    <p className="mt-1 text-sm text-slate-700">
                      {tool.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* =========================
            Back link
           ========================= */}
        <div className="mt-14">
          <Link
            to="/library"
            className="text-sm font-medium underline underline-offset-2"
          >
            ← Back to Library
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
