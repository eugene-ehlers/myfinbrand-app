// src/pages/articles/BuildingPredictiveModelsInHouse.jsx
import React from "react";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

export default function BuildingPredictiveModelsInHouse() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="Building Predictive Models In-House: What Your Business Needs"
        description="Executive guide to what a business needs to build, deploy, and govern its own predictive models, and when to use bureau, specialist, or scorecard-as-a-service alternatives."
        canonical="https://www.tsdg.co.za/insights/building-predictive-models-in-house"
        ogType="article"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-4xl px-4 py-12">
        <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
          White Paper • Predictive Models & Scorecards
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Building Predictive Models In-House: What Your Business Needs
        </h1>
        <p className="mt-3 text-slate-600">
          A business-level guide to the skills, data, infrastructure and governance
          required to build your own ML or logistic regression models — and how this
          compares to bureau, specialist, and scorecard-as-a-service options.
        </p>

        <div className="mt-8 p-6 border rounded-2xl bg-slate-50">
          <h2 className="text-xl font-semibold">Download the white paper</h2>
          <p className="mt-2 text-slate-700">
            The full white paper is available as a print-friendly PDF for executive
            use, ExCo packs, and board discussions.
          </p>

          <a
            href="/docs/building-predictive-models-in-house-v1-nov25.pdf"
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
