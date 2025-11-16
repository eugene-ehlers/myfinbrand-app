// src/pages/articles/AIDrivenBusinessAdvantage.jsx
import React from "react";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

export default function AIDrivenBusinessAdvantage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="From Buzzword to Bottom Line: AI-Driven Business Advantage"
        description="A step-by-step executive framework to align AI investments with business strategy and measurable ROI."
        canonical="https://www.tsdg.co.za/insights/ai-driven-business-advantage"
        ogType="article"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-4xl px-4 py-12">
        <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
          White Paper • AI Strategy
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          From Buzzword to Bottom Line: AI-Driven Business Advantage
        </h1>
        <p className="mt-3 text-slate-600">
          This white paper provides an executive framework to move from AI
          experimentation to business value: aligning initiatives with strategy,
          governance, and financial outcomes.
        </p>

        <div className="mt-8 p-6 border rounded-2xl bg-slate-50">
          <h2 className="text-xl font-semibold">Download the white paper</h2>
          <p className="mt-2 text-slate-700">
            Download the print-optimised PDF for ExCo packs, board submissions,
            and strategy sessions.
          </p>

          <a
            href="/docs/ai-driven-business-advantage.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl shadow"
            style={{
              background: "rgb(var(--primary))",
              color: "rgb(var(--primary-fg))",
            }}
          >
            Download PDF
          </a>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
