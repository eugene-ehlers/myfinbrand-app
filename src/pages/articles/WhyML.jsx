// src/pages/articles/WhyML.jsx
import React from "react";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

export default function WhyML() {
  const pdfHref = "/docs/why_ml_v1_nov25.pdf";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="Why Machine Learning? | The Smart Decision Group"
        description="An executive overview of why machine learning matters, how it evolved from traditional scorecards, and when simpler models are still the right choice."
        canonical="https://www.tsdg.co.za/insights/why-ml"
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
          Why Machine Learning? From Manual Decisions to Modern Models
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          White Paper • For Executives & Senior Management
        </p>

        <p className="mt-4 text-slate-700 leading-relaxed">
          This white paper gives leaders a concise, practical view of why
          machine learning has become so important in credit, risk, and
          customer decisioning—without losing sight of the fact that simpler,
          well-governed models often outperform complex technology in real
          business environments.
        </p>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">What this paper covers</h2>
          <ul className="list-disc pl-5 text-slate-700 space-y-2 text-sm">
            <li>
              The evolution from manual decisions and expert judgement to
              traditional statistical scorecards.
            </li>
            <li>
              How logistic regression models use correlations in data to predict
              outcomes like default, response, or churn.
            </li>
            <li>
              Why modern machine learning can capture more complex patterns,
              non-linear effects, and interactions.
            </li>
            <li>
              How advances in data infrastructure and compute have enabled more
              scalable ML deployment.
            </li>
            <li>
              When a simpler, transparent model is still the best answer for
              governance, speed, and business adoption.
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Who it’s for</h2>
          <p className="text-slate-700 text-sm leading-relaxed">
            This paper is designed for executives, senior managers, and
            decision-makers who need to understand{" "}
            <em>why</em> ML matters strategically, without diving into heavy
            mathematics. It’s also useful for risk and analytics leaders who
            want language to explain trade-offs to non-technical stakeholders.
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
            Opens as a PDF. You can save or share it with your risk, analytics,
            and IT teams.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
