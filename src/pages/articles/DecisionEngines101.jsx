// src/pages/articles/DecisionEngines101.jsx
import React from "react";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

export default function DecisionEngines101() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="Decision Engines 101: From Rules to ROI"
        description="An executive primer on decision engines: what they are, how they compare to manual and coded approaches, and where they add the most value."
        canonical="https://www.tsdg.co.za/insights/decision-engines-101"
        ogType="article"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-4xl px-4 py-12">
        <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
          White Paper • Decision Automation
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Decision Engines 101: From Rules to ROI
        </h1>
        <p className="mt-3 text-slate-600">
          This white paper introduces decision engines as the governed “brain”
          behind automated approvals, pricing, fraud checks, and personalised
          offers across industries.
        </p>

        <div className="mt-8 p-6 border rounded-2xl bg-slate-50">
          <h2 className="text-xl font-semibold">Download the white paper</h2>
          <p className="mt-2 text-slate-700">
            Download the full PDF to share with your risk, operations, and
            technology teams.
          </p>

          <a
            href="/docs/decision-engines-101.pdf"
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
