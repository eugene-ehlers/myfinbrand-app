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
          White Paper • Decision Automation & Governance
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Decision Engines 101: From Rules to ROI
        </h1>

        <p className="mt-3 text-slate-600">
          As organisations automate more of their credit, onboarding, and risk
          processes, spreadsheets and hard-coded rules quickly reach their
          limits. Decision engines sit at the centre of modern, governed
          decisioning — turning data, models, and policies into consistent,
          auditable outcomes.
        </p>

        {/* Key sections / teaser */}
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">What this white paper covers</h2>
          <ul className="list-disc pl-5 text-slate-700 space-y-2 text-sm">
            <li>
              How decisions evolved from manual reviews and static scorecards to
              governed decision engines.
            </li>
            <li>
              The core building blocks of a decision engine: data, rules,
              models, workflows, and audit trails.
            </li>
            <li>
              Where engines fit alongside core systems, channels, and credit
              bureaus — including XDS and other external services.
            </li>
            <li>
              Governance requirements: transparency, adverse action reasons,
              champion/challenger testing, and model monitoring.
            </li>
            <li>
              A practical 90-day rollout pattern, from pilot use case to
              production deployment.
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Who it’s for</h2>
          <p className="text-slate-700 text-sm leading-relaxed">
            This paper is written for executives, risk leaders, and operations
            teams who are:
          </p>
          <ul className="list-disc pl-5 text-slate-700 space-y-2 text-sm">
            <li>Replacing manual or spreadsheet-based credit decisions.</li>
            <li>
              Considering building a custom rules engine inside core systems.
            </li>
            <li>
              Comparing bureau-hosted decisioning with bringing an engine into
              their own environment.
            </li>
            <li>
              Preparing for more advanced analytics and agentic AI, but needing
              a governed decision layer first.
            </li>
          </ul>
        </section>

        {/* Download block */}
        <section className="mt-10 p-6 border rounded-2xl bg-slate-50">
          <h2 className="text-xl font-semibold">Download the white paper</h2>
          <p className="mt-2 text-slate-700 text-sm leading-relaxed">
            Download the full PDF to share with your risk, operations, and
            technology teams, or to use as a reference when planning your next
            decisioning roadmap.
          </p>

          <a
            href="/docs/decision-engines-101.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl shadow text-sm font-medium"
            style={{
              background: "rgb(var(--primary))",
              color: "rgb(var(--primary-fg))",
            }}
          >
            Download PDF
          </a>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
