// src/pages/Founder.jsx
import React from "react";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

export default function Founder() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="Founder | The Smart Decision Group"
        description="Learn more about Eugene Ehlers — founder of The Smart Decision Group and industry expert in decision engines, machine learning scorecards, and credit risk strategy."
        canonical="https://www.tsdg.co.za/founder"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">
          Meet the Founder
        </h1>
        <p className="mt-2 text-slate-600 text-lg">
          Insights, strategy and innovation led by{" "}
          <strong>Eugene Ehlers</strong>.
        </p>

        {/* BIO CARD */}
        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">About Eugene</h2>
          <p className="mt-4 text-slate-700 leading-relaxed">
            Eugene is an experienced analytics and decision-science
            practitioner with more than 15 years in credit risk, advanced
            modelling, and decision-engine design. He has led enterprise
            transformations across leading South African lenders, insurers,
            fintechs and credit bureaux — specialising in the intersection of
            analytics, automation, and business strategy.
          </p>

          <p className="mt-4 text-slate-700 leading-relaxed">
            His work spans the full value chain: credit strategy, scorecard
            development, ML model deployment, affordability, fraud decisioning,
            agentic-AI readiness, and enterprise automation. Eugene has built
            both traditional logistic-regression scorecards and modern ML-based
            models, and has developed and deployed multiple decision engines in
            production environments, including bureau-hosted platforms.
          </p>

          <p className="mt-4 text-slate-700 leading-relaxed">
            At The Smart Decision Group, Eugene combines his modelling and
            decision-engine expertise to help organisations modernise their
            risk strategies, deploy agentic-ready architecture, and achieve
            tangible ROI from data-driven decisions.
          </p>
        </div>

        {/* CORE EXPERTISE */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold">Core Expertise</h2>
          <ul className="mt-4 space-y-2 text-slate-700 leading-relaxed">
            <li>• Decision engines & automated risk workflows</li>
            <li>• Logistic regression & ML scorecard development</li>
            <li>• Champion–challenger strategies</li>
            <li>• Real-time credit decisioning architectures</li>
            <li>• Agentic-AI integration for risk and policy workflows</li>
            <li>• Bureau data integration (multiple bureaux + XDS)</li>
            <li>• Pricing, affordability and policy rule design</li>
            <li>• Model governance, monitoring & documentation</li>
            <li>• Executive strategy for analytics & transformation</li>
          </ul>
        </div>

        {/* WHY FOLLOW EUGENE */}
        <div className="mt-12 rounded-2xl border bg-slate-50 p-6">
          <h2 className="text-xl font-semibold">What You’ll Learn From Eugene</h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            Through articles, white papers, and ongoing industry commentary,
            Eugene provides clarity on topics that matter to executives:
          </p>
          <ul className="mt-3 space-y-2 text-slate-700">
            <li>• When to use ML vs traditional scorecards</li>
            <li>• How to modernise legacy decision engines</li>
            <li>• How agentic AI enhances (but does not replace) decisioning</li>
            <li>• How to implement champion–challenger safely</li>
            <li>• How to reduce risk, improve approvals, and increase ROI</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl shadow border"
            style={{
              background: "rgb(var(--primary))",
              color: "rgb(var(--primary-fg))",
            }}
          >
            Contact Eugene
          </a>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
