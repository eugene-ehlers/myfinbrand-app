// src/pages/LibraryArticle.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";
import { getLibraryItem } from "../data/libraryContent";

export default function LibraryArticle() {
  const { kind, slug } = useParams();
  const article = getLibraryItem(kind, slug);

  if (!article) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="page-container py-16">
          <p className="text-slate-500">This article could not be found.</p>
          <Link to="/library" className="underline underline-offset-2">
            Back to Library
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <Seo
        title={`${article.title} | Library`}
        description={article.summary}
        canonical={`https://www.tsdg.co.za/library/${kind}/${slug}`}
        ogType="article"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-5xl px-4 pb-16 pt-8">
        {/* 🔹 Breadcrumb / Meta */}
        <div className="mb-6 text-sm text-slate-500">
          <Link
            to="/library"
            className="underline underline-offset-2 hover:text-slate-700"
          >
            Library
          </Link>
          {" / "}
          <span>{article.category}</span>
          {article.read && (
            <>
              {" "}
              • <span>{article.read} read</span>
            </>
          )}
        </div>

        {/* 🔹 Title */}
        <h1 className="text-3xl font-semibold leading-tight">
          {article.title}
        </h1>

        {/* 🔹 Optional summary under title */}
        {article.summary && (
          <p className="mt-4 text-lg text-slate-700 max-w-3xl">
            {article.summary}
          </p>
        )}

        {/* 🔹 Article body */}
        <article className="article mt-10">
          {article.body?.sections?.map((section, idx) => (
            <section key={idx}>
              {section.heading && <h2>{section.heading}</h2>}

              {section.paragraphs &&
                section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}

              {section.bullets && (
                <ul className="list-disc pl-6 space-y-2">
                  {section.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        {/* 🔹 Back to Library (end, gentle) */}
        <div className="mt-16 text-sm">
          <Link
            to="/library"
            className="underline underline-offset-2 text-slate-600 hover:text-slate-900"
          >
            ← Back to Library
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

