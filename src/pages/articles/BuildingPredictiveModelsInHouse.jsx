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
        description="An executive guide to the organisational capabilities, data, governance, and alternatives for building and running predictive models."
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
          This paper explains what it really takes to build, deploy, and maintain
          your own predictive models, and when it makes more sense to rely on
          bureau models, specialist providers, or scorecard-as-a-service.
        </p>

        <div className="mt-8 p-6 border rounded-2xl bg-slate-50">
          <h2 className="text-xl font-semibold">Download the white paper</h2>
          <p className="mt-2 text-slate-700">
            Download the print-ready PDF for executive and governance discussions.
          </p>

          <a
            href="/docs/building-predictive-models-in-house.pdf"
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
