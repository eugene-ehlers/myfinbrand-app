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
        description="An executive framework to align AI initiatives with strategy, governance, and measurable business value."
        canonical="https://www.tsdg.co.za/insights/ai-driven-business-advantage"
        ogType="article"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-4xl px-4 py-12">
        <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
          White Paper • AI Strategy & Transformation
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          From Buzzword to Bottom Line: AI-Driven Business Advantage
        </h1>

        <p className="mt-3 text-slate-600">
          AI is everywhere in board discussions — but many organisations still
          struggle to turn pilots and proofs-of-concept into real, repeatable
          business value. This white paper provides a practical framework to
          move from experimentation to governed, ROI-focused deployment.
        </p>

        {/* What the paper covers */}
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">What this white paper covers</h2>
          <ul className="list-disc pl-5 text-slate-700 space-y-2 text-sm">
            <li>
              The evolution from manual decisioning to scorecards, machine
              learning, and now agentic AI — and what has actually changed.
            </li>
            <li>
              How to align AI initiatives with business strategy, risk appetite,
              and regulatory expectations.
            </li>
            <li>
              Where to start: prioritising use cases in credit, onboarding,
              fraud, and operations.
            </li>
            <li>
              Designing an operating model: roles for business, risk, data,
              IT/architecture, and external partners.
            </li>
            <li>
              Why a governed decision engine and robust data foundations are
              still essential, even in an agentic AI world.
            </li>
          </ul>
        </section>

        {/* Who it's for */}
        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Who it’s for</h2>
          <p className="text-slate-700 text-sm leading-relaxed">
            This paper is aimed at executives, board members, and senior leaders
            who need to:
          </p>
          <ul className="list-disc pl-5 text-slate-700 space-y-2 text-sm">
            <li>
              Understand where AI genuinely creates competitive advantage (and
              where it does not).
            </li>
            <li>
              Avoid fragmented AI experiments that never reach production or
              governance sign-off.
            </li>
            <li>
              Build confidence with regulators, auditors, and internal risk
              functions.
            </li>
            <li>
              Connect AI investments to measurable outcomes such as approval
              rates, loss ratios, fraud savings, and cost-to-serve.
            </li>
          </ul>
        </section>

        {/* How to use it */}
        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">How to use this white paper</h2>
          <p className="text-slate-700 text-sm leading-relaxed">
            Many organisations use this content as a common reference for
            executive workshops, strategy off-sites, or AI steering committees.
            It helps align stakeholders on language, priorities, and the
            practical steps required to move from “AI talk” to governed,
            production decisioning.
          </p>
        </section>

        {/* Download block */}
        <section className="mt-10 p-6 border rounded-2xl bg-slate-50">
          <h2 className="text-xl font-semibold">Download the white paper</h2>
          <p className="mt-2 text-slate-700 text-sm leading-relaxed">
            Download the full PDF to share with your leadership team or to
            support your next AI strategy conversation.
          </p>

          <a
            href="/docs/ai-driven-business-advantage.pdf"
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
