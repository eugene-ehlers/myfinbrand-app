// src/pages/solutions/Fraud.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Search,
  FileWarning,
  Brain,
} from "lucide-react";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

export default function Fraud() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="Fraud & Verification Intelligence | The Smart Decision Group"
        description="How decision engines and ML scorecards can support better fraud detection, verification, and governance — without turning every customer into a suspect."
        canonical="https://www.tsdg.co.za/solutions/fraud"
        ogType="article"
      />

      <SiteHeader />

      <main className="page-container max-w-5xl mx-auto px-4 pb-16 pt-10">
        {/* Breadcrumb */}
        <p className="text-xs text-slate-500 mb-3">
          <Link to="/" className="underline underline-offset-2">
            Home
          </Link>{" "}
          / <span className="text-slate-600">Solutions: Fraud & Verification</span>
        </p>

        {/* Hero */}
        <section className="mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Fraud & Verification Intelligence
          </h1>
          <p className="mt-3 text-slate-700 text-lg max-w-3xl">
            Helping executives balance fraud risk, customer experience, and
            regulatory expectations using governed decision flows and
            data-driven signals — not just more friction.
          </p>
          <p className="mt-2 text-sm text-slate-500 max-w-3xl">
            This page is written for CEOs, CROs, COOs, and fraud leaders. It
            outlines what is possible with decision engines and ML scorecards in
            fraud and verification, and where they typically help, without
            promising guaranteed reductions. Real outcomes depend on your data,
            channels, and fraud landscape.
          </p>
        </section>

        {/* Who this is for / challenges */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <div className="p-5 rounded-2xl border bg-slate-50">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-600">
              Who this is for
            </h2>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Lenders with digital or semi-digital onboarding.</li>
              <li>• Organisations exposed to identity, application or account fraud.</li>
              <li>• Teams struggling to balance friction and risk.</li>
              <li>• Executives worried about fraud losses and reputational damage.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border bg-white">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-600">
              Typical challenges we see
            </h2>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• One-size-fits-all verification flows that frustrate good customers.</li>
              <li>• Manual checks that don’t scale and are hard to audit.</li>
              <li>• Multiple vendors and tools, but no single decision view.</li>
              <li>• Difficulty explaining why certain cases were flagged or missed.</li>
            </ul>
          </div>
        </section>

        {/* Fraud as a decision problem */}
        <section className="mb-10">
          <div className="p-5 rounded-2xl border bg-white">
            <h2 className="text-xl font-semibold tracking-tight">
              Fraud is a decision problem, not just a tools problem
            </h2>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              Many organisations accumulate fraud tools: device intelligence,
              bureau alerts, watchlists, document checks, biometrics, and more.
              What is often missing is a single, governed place where all of
              these signals are interpreted and turned into a clear decision:
            </p>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Proceed as normal.</li>
              <li>• Apply extra verification steps.</li>
              <li>• Refer to a human fraud analyst.</li>
              <li>• Decline and record the reason.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              Our decision engine sits above your tools and data sources,
              orchestrating them into <strong>consistent, explainable fraud
              decisions</strong> — with ML models and scorecards as optional
              inputs, not opaque black boxes.
            </p>
          </div>
        </section>

        {/* Key pillars */}
        <section className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="p-5 rounded-2xl border bg-white">
            <Search className="h-6 w-6 text-slate-700" />
            <h3 className="mt-3 font-semibold text-slate-900">
              Risk-based verification
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              Not every application needs maximum friction. We help design
              risk-based flows where low-risk customers experience fewer steps,
              while higher-risk signals trigger additional checks, referrals, or
              rejections — all encoded in governed rules.
            </p>
          </div>

          <div className="p-5 rounded-2xl border bg-white">
            <Brain className="h-6 w-6 text-slate-700" />
            <h3 className="mt-3 font-semibold text-slate-900">
              ML & behavioural signals
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              Where data is sufficient, ML models can support fraud scoring or
              anomaly detection. Where data is limited, we start with simpler
              rules and evolve as more decisions and outcomes are captured over
              time.
            </p>
          </div>

          <div className="p-5 rounded-2xl border bg-white">
            <ShieldAlert className="h-6 w-6 text-slate-700" />
            <h3 className="mt-3 font-semibold text-slate-900">
              POPIA and customer trust
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              Fraud controls inevitably rely on personal information and
              sometimes sensitive signals. We design flows that consider POPIA
              principles and help you show that data is used with purpose,
              minimisation and clear governance in mind.
            </p>
          </div>
        </section>

        {/* Potential impact */}
        <section className="mb-10">
          <div className="p-5 rounded-2xl border bg-slate-50">
            <h2 className="text-xl font-semibold tracking-tight">
              What kind of impact is realistic?
            </h2>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              Fraud patterns differ widely by product, channel, and time. No
              responsible partner can promise a specific reduction in fraud
              losses upfront. However, putting a decision engine over your
              fraud stack has the <strong>potential</strong> to:
            </p>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Make verification flows more consistent and auditable.</li>
              <li>• Reduce unnecessary friction for clearly low-risk customers.</li>
              <li>• Improve collaboration between fraud, credit and product teams.</li>
              <li>
                • Provide clearer evidence about which rules, signals, and tools
                actually help.
              </li>
            </ul>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              These benefits depend heavily on how much you already have in
              place, the quality of your vendor integrations, and how quickly
              teams can act on insights. The earlier you start capturing
              structured decisions and outcomes, the faster you can learn.
            </p>
          </div>
        </section>

        {/* How we fit into your fraud stack */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold tracking-tight mb-3">
            How the TSDG decision engine fits into your fraud stack
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="p-5 rounded-2xl border bg-white">
              <h3 className="font-semibold text-slate-900 text-sm">
                Orchestration layer
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                We orchestrate calls to bureaus, watchlists, document and
                biometric services, and internal systems — then apply business
                logic and models to derive a clear decision and reason codes.
              </p>
            </div>
            <div className="p-5 rounded-2xl border bg-white">
              <h3 className="font-semibold text-slate-900 text-sm">
                Referral & workflow routing
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                High-risk or ambiguous cases can be routed to specialist queues
                with all the underlying evidence attached, reducing manual
                triage and rework.
              </p>
            </div>
            <div className="p-5 rounded-2xl border bg-white">
              <h3 className="font-semibold text-slate-900 text-sm">
                Champion / Challenger rules
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                You can test refined rules or additional signals on small
                percentages of traffic before rolling them out more broadly,
                helping avoid over-reactions to isolated incidents.
              </p>
            </div>
            <div className="p-5 rounded-2xl border bg-white">
              <h3 className="font-semibold text-slate-900 text-sm">
                Audit & regulatory support
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Every fraud-related decision can be logged with the rules,
                models, and data used at the time — useful for internal audit,
                external assurance, and board-level risk discussions.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 p-6 rounded-2xl border bg-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Explore a governed fraud & verification layer
            </h2>
            <p className="mt-2 text-sm text-slate-700 max-w-xl">
              If your fraud controls feel fragmented, opaque, or too heavy on
              good customers, we can help you design a decisioning approach that
              brings structure without losing flexibility.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="mailto:contact@tsdg.co.za?subject=Fraud%20and%20verification%20discussion"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium"
              style={{
                background: "rgb(var(--primary))",
                color: "rgb(var(--primary-fg))",
              }}
            >
              Email us about fraud & verification
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/insights"
              className="text-xs text-slate-600 underline underline-offset-2 text-center"
            >
              Or browse related executive briefings
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
