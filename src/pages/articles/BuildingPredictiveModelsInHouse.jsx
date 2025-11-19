// src/pages/articles/BuildingPredictiveModelsInHouse.jsx
import React from "react";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

export default function BuildingPredictiveModelsInHouse() {
  const pdfHref = "/docs/building-predictive-models-in-house.pdf";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="Building Predictive Models In-House | The Smart Decision Group"
        description="An executive guide to what it really takes to build and host your own scorecards and ML models – plus alternatives like bureau models and models-as-a-service."
        canonical="https://www.tsdg.co.za/insights/building-predictive-models-in-house"
        ogType="article"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-3xl px-4 py-10">
        <Link
          to="/insights"
          className="text-xs text-slate-500 hover:underline"
        >
          ← Back to Insights
        </Link>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Building Predictive Models In-House: What Your Business Needs
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          White Paper • For Risk, Data, and IT Leaders
        </p>

        <p className="mt-4 text-slate-700 leading-relaxed">
          Many organisations are asking whether they should build their own
          scorecards and ML models, rely on bureau models, or use a managed
          “models-as-a-service” approach. This white paper sets out the
          practical capabilities, infrastructure, and governance you need for
          each option.
        </p>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">
            Inside the in-house vs. outsourced decision
          </h2>
          <ul className="list-disc pl-5 text-slate-700 space-y-2 text-sm">
            <li>
              What an in-house modelling capability actually requires (skills,
              data, tooling, infrastructure, and governance).
            </li>
            <li>
              When a bureau general scorecard is sufficient—and where its
              limitations appear.
            </li>
            <li>
              Pros and cons of bureau-hosted and third-party customised
              scorecards.
            </li>
            <li>
              How “renting” scorecards or models works in a
              Champion/Challenger framework with managed monitoring.
            </li>
            <li>
              Practical migration paths: from external scorecards today to
              hybrid or in-house capabilities over time.
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Who should read this</h2>
          <p className="text-slate-700 text-sm leading-relaxed">
            This paper is aimed at credit risk, data, and IT leaders who need to
            advise Exco on whether to invest in internal modelling teams,
            partner with bureaus, or use managed model services — and how to
            structure governance in each case.
          </p>
        </section>

        <section className="mt-10">
          <a
            href={pdfHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl shadow text-sm font-medium"
            style={{
              background: "rgb(var(--primary))",
              color: "rgb(var(--primary-fg))",
            }}
          >
            Download the white paper (PDF)
          </a>
          <p className="mt-2 text-xs text-slate-500">
            Use this as a reference when planning your modelling roadmap or
            engaging with bureaus and third-party providers.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
