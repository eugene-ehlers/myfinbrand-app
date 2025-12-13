// src/pages/library/LibraryItem.jsx
import React, { useMemo } from "react";
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

  const canonical = `https://www.tsdg.co.za/library/${item.kind}/${item.slug}`;
  const title = `${item.title} | TSDG Library`;

  // JSON-LD (SEO)
  const jsonLd = useMemo(() => {
    const published = item.date ? `${item.date}T00:00:00+02:00` : undefined;

    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: item.title,
      description: item.summary,
      mainEntityOfPage: canonical,
      datePublished: published,
      author: {
        "@type": "Organization",
        name: "The Smart Decision Group",
      },
      publisher: {
        "@type": "Organization",
        name: "The Smart Decision Group",
        url: "https://www.tsdg.co.za",
      },
      about: (item.tags || []).map((t) => ({ "@type": "Thing", name: t })),
      articleSection: item.category,
      keywords: (item.tags || []).join(", "),
    };
  }, [item, canonical]);

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <Seo
        title={title}
        description={item.summary}
        canonical={canonical}
        ogType="article"
      />

      {/* Structured data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      <SiteHeader />

      <header className="page-container mx-auto max-w-5xl px-4 pt-10 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {item.type} {item.read ? `• ${item.read}` : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/library" className="text-sm rounded-xl border px-3 py-2">
              Back to Library
            </Link>
            <Link to="/tools" className="text-sm rounded-xl border px-3 py-2">
              Tools
            </Link>
            <Link to="/insights" className="text-sm rounded-xl border px-3 py-2">
              Insights
            </Link>
          </div>
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {item.title}
        </h1>
        <p className="mt-2 text-slate-600 max-w-3xl">{item.summary}</p>

        {item.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <span
                key={t}
                className="text-xs rounded-full border px-2 py-0.5 bg-white"
              >
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

          {/* Low-pressure next steps (discovery + conversion) */}
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border p-5 bg-slate-50">
              <div className="text-sm font-semibold">Quantify impact</div>
              <p className="mt-1 text-sm text-slate-700">
                Use a calculator to convert uncertainty into a business case.
              </p>
              <div className="mt-3">
                <Link
                  to="/tools"
                  className="text-sm font-medium underline underline-offset-2"
                >
                  Explore Tools
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border p-5 bg-slate-50">
              <div className="text-sm font-semibold">Read the formal view</div>
              <p className="mt-1 text-sm text-slate-700">
                White papers and executive summaries with more structure.
              </p>
              <div className="mt-3">
                <Link
                  to="/insights"
                  className="text-sm font-medium underline underline-offset-2"
                >
                  Explore Insights
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border p-5 bg-slate-50">
              <div className="text-sm font-semibold">Ask privately</div>
              <p className="mt-1 text-sm text-slate-700">
                A short question is enough. No public comments, no “training”.
              </p>
              <div className="mt-3">
                <a
                  href="mailto:contact@tsdg.co.za?subject=Library%20question"
                  className="text-sm font-medium underline underline-offset-2"
                >
                  Email us
                </a>
              </div>
            </div>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
