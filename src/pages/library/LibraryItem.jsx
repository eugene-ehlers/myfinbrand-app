// src/pages/library/LibraryItem.jsx
import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";
import { getLibraryItem } from "../../data/libraryContent";

const Section = ({ heading, paragraphs, bullets }) => (
  <section className="mt-6">
    {heading ? (
      <h2 className="text-lg font-semibold tracking-tight">{heading}</h2>
    ) : null}

    {Array.isArray(paragraphs) && paragraphs.length > 0 ? (
      <div className="mt-2 grid gap-3 text-slate-700 leading-relaxed">
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>
    ) : null}

    {Array.isArray(bullets) && bullets.length > 0 ? (
      <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
        {bullets.map((b, idx) => (
          <li key={idx}>{b}</li>
        ))}
      </ul>
    ) : null}
  </section>
);

export default function LibraryItem() {
  const { kind, slug } = useParams();
  const item = getLibraryItem(kind, slug);

  if (!item) {
    return <Navigate to="/library" replace />;
  }

  const title = `${item.title} | TSDG Library`;

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <Seo
        title={title}
        description={item.summary}
        canonical={`https://www.tsdg.co.za/library/${item.kind}/${item.slug}`}
        ogType="article"
      />

      <SiteHeader />

      <header className="page-container mx-auto max-w-5xl px-4 pt-10 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {item.type} {item.read ? `• ${item.read}` : null}
          </div>
          <Link to="/library" className="text-sm rounded-xl border px-3 py-2">
            Back to Library
          </Link>
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {item.title}
        </h1>
        <p className="mt-2 text-slate-600 max-w-3xl">{item.summary}</p>

        {item.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <span key={t} className="text-xs rounded-full border px-2 py-0.5 bg-white">
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <main className="page-container mx-auto max-w-5xl px-4 pb-16">
        <article className="rounded-2xl border bg-white p-6">
          {item.body?.sections?.map((s, idx) => (
            <Section
              key={idx}
              heading={s.heading}
              paragraphs={s.paragraphs}
              bullets={s.bullets}
            />
          ))}

          <div className="mt-8 rounded-2xl border p-5 bg-slate-50">
            <div className="text-sm text-slate-700">
              Want to quantify impact instead of debating opinions?
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link to="/tools" className="text-sm rounded-xl border px-3 py-2 bg-white">
                Use Tools &amp; calculators
              </Link>
              <Link to="/insights" className="text-sm rounded-xl border px-3 py-2 bg-white">
                Read Insights
              </Link>
              <a
                href="mailto:contact@tsdg.co.za?subject=Library%20question"
                className="text-sm rounded-xl px-3 py-2"
                style={{
                  background: "rgb(var(--primary))",
                  color: "rgb(var(--primary-fg))",
                }}
              >
                Ask a private question
              </a>
            </div>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
