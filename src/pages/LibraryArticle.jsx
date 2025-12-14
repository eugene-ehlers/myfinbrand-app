import React, { useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";
import { getLibraryItem } from "../data/libraryContent";

const toText = (x) => (typeof x === "string" ? x : "");

export default function LibraryArticle() {
  const { kind, slug } = useParams();

  const item = useMemo(() => getLibraryItem(kind, slug), [kind, slug]);

  // If not found, go back to the library hub (keeps UX clean)
  if (!item) return <Navigate to="/library" replace />;

  const canonical = `https://www.tsdg.co.za/library/${encodeURIComponent(
    kind
  )}/${encodeURIComponent(slug)}`;

  const description =
    item.summary ||
    "A practical advisory note from The Smart Decision Group library.";

  const sections = item?.body?.sections || [];

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <Seo
        title={`${item.title} | Library | The Smart Decision Group`}
        description={description}
        canonical={canonical}
        ogType="article"
      />

      <SiteHeader />

      <header className="page-container mx-auto max-w-5xl px-4 pt-10 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-600">
            <Link to="/library" className="underline underline-offset-2">
              Library
            </Link>{" "}
            <span className="text-slate-400">/</span>{" "}
            <span className="text-slate-700">{item.category || "Note"}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/tools" className="text-sm rounded-xl border px-3 py-2 bg-white">
              Tools
            </Link>
            <Link
              to="/insights"
              className="text-sm rounded-xl border px-3 py-2 bg-white"
            >
              Insights
            </Link>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border bg-white p-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              {item.date} {item.read ? `• ${item.read}` : null}
            </span>
            <div className="flex items-center gap-1">
              {item.type ? (
                <span className="text-[10px] rounded-full border px-2 py-0.5">
                  {item.type}
                </span>
              ) : null}
              {item.category ? (
                <span className="hidden sm:inline text-[10px] rounded-full border px-2 py-0.5">
                  {item.category}
                </span>
              ) : null}
            </div>
          </div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {item.title}
          </h1>

          {item.summary ? (
            <p className="mt-3 text-slate-700 leading-relaxed">{item.summary}</p>
          ) : null}

          {item.tags?.length ? (
            <div className="mt-4 flex gap-2 flex-wrap">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs rounded-full border px-2 py-0.5 text-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <main className="page-container mx-auto max-w-5xl px-4 pb-16">
        <article className="rounded-2xl border bg-white p-6">
          {sections.length === 0 ? (
            <p className="text-slate-600">
              This note does not yet have content sections.
            </p>
          ) : (
            <div className="grid gap-8">
              {sections.map((s, idx) => (
                <section key={`${s.heading || "section"}-${idx}`}>
                  {s.heading ? (
                    <h2 className="text-xl font-semibold">{s.heading}</h2>
                  ) : null}

                  {Array.isArray(s.paragraphs) && s.paragraphs.length > 0 ? (
                    <div className="mt-3 grid gap-3 text-slate-700 leading-relaxed">
                      {s.paragraphs.map((p, i) => (
                        <p key={i}>{toText(p)}</p>
                      ))}
                    </div>
                  ) : null}

                  {Array.isArray(s.bullets) && s.bullets.length > 0 ? (
                    <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                      {s.bullets.map((b, i) => (
                        <li key={i}>{toText(b)}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          )}
        </article>

        <section className="mt-6 rounded-2xl border bg-slate-50 p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Confidentiality note
          </div>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            Notes here avoid client-identifying details and are provided to
            support thinking and discussion. They are not financial, legal, or
            regulatory advice, and are not a substitute for portfolio-level
            analysis.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
