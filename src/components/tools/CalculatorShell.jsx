// src/components/tools/CalculatorShell.jsx
import React from "react";
import SiteHeader from "../layout/SiteHeader.jsx";
import SiteFooter from "../layout/SiteFooter.jsx";

export default function CalculatorShell({
  seo,
  title,
  subtitle,
  meta, // e.g., "Calculator • 2–3 min"
  childrenLeft,
  childrenRight,
  assumptions,
  ctas,
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {seo}
      <SiteHeader />

      <header className="page-container mx-auto max-w-5xl px-4 pt-10 pb-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-xs text-slate-500">{meta}</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 text-slate-600 max-w-3xl">{subtitle}</p>
            ) : null}
          </div>

          {ctas?.topRight ? (
            <div className="hidden sm:flex items-center gap-2">
              {ctas.topRight}
            </div>
          ) : null}
        </div>
      </header>

      <main className="page-container mx-auto max-w-5xl px-4 pb-16">
        <div className="grid gap-5 lg:grid-cols-12 items-start">
          <section className="lg:col-span-7 rounded-2xl border p-5">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Inputs
            </div>
            <div className="mt-3">{childrenLeft}</div>
          </section>

          <aside className="lg:col-span-5 rounded-2xl border p-5 bg-slate-50">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Results
            </div>
            <div className="mt-3">{childrenRight}</div>
          </aside>
        </div>

        {assumptions ? (
          <section className="mt-6 rounded-2xl border p-5">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Assumptions & Notes
            </div>
            <div className="mt-3 text-sm text-slate-700 leading-relaxed">
              {assumptions}
            </div>
          </section>
        ) : null}

        {ctas?.bottom ? (
          <section className="mt-6 rounded-2xl border p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-slate-700">
                Want a tailored business case based on your portfolio and
                operating model?
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {ctas.bottom}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
