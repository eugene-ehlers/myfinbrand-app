// src/pages/solutions/KycFica.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  IdCard,
  FileCheck,
  ShieldCheck,
  Layers,
} from "lucide-react";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

export default function KycFica() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="KYC & FICA Orchestration | The Smart Decision Group"
        description="How decision engines can help standardise, orchestrate, and evidence KYC/FICA processes without adding unnecessary friction."
        canonical="https://www.tsdg.co.za/solutions/kyc-fica"
        ogType="article"
      />

      <SiteHeader />

      <main className="page-container max-w-5xl mx-auto px-4 pb-16 pt-10">
        {/* Breadcrumb */}
        <p className="text-xs text-slate-500 mb-3">
          <Link to="/" className="underline underline-offset-2">
            Home
          </Link>{" "}
          / <span className="text-slate-600">Solutions: KYC &amp; FICA</span>
        </p>

        {/* Hero */}
        <section className="mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            KYC &amp; FICA Orchestration and Governance
          </h1>
          <p className="mt-3 text-slate-700 text-lg max-w-3xl">
            Turning KYC and FICA checks into a clear, auditable decision flow —
            not a collection of scattered documents, emails and manual
            workarounds.
          </p>
          <p className="mt-2 text-sm text-slate-500 max-w-3xl">
            This page is written for executives and compliance leaders. It
            describes how a decision engine can support KYC/FICA obligations in
            a structured way. It does not replace legal advice or formal
            regulatory interpretation.
          </p>
        </section>

        {/* Who / challenges */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <div className="p-5 rounded-2xl border bg-slate-50">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-600">
              Who this is for
            </h2>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Accountable institutions under FICA.</li>
              <li>• Lenders with remote or hybrid onboarding.</li>
              <li>• Institutions working with multiple KYC service providers.</li>
              <li>• Executives wanting better oversight of KYC/FICA risk.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border bg-white">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-600">
              Typical challenges we see
            </h2>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Multiple versions of KYC checklists scattered across teams.</li>
              <li>• Heavy reliance on individual staff experience and memory.</li>
              <li>• Difficulty proving that specific customers were treated correctly.</li>
              <li>• Limited linkage between KYC outcomes and later risk events.</li>
            </ul>
          </div>
        </section>

        {/* KYC/FICA as a decision flow */}
        <section className="mb-10">
          <div className="p-5 rounded-2xl border bg-white">
            <h2 className="text-xl font-semibold tracking-tight">
              From “checklists in people’s heads” to a governed decision flow
            </h2>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              KYC and FICA are often implemented as checklists: collect ID,
              proof of address, business documents, and then “use judgment”. In
              practice, this leads to:
            </p>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Variation between branches, agents, or teams.</li>
              <li>• Customers being asked for more than is strictly required.</li>
              <li>• Poor traceability when questions arise later.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              A decision engine allows you to turn KYC/FICA into a structured
              flow:
            </p>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• What type of customer is this (person, business, trust, etc.)?</li>
              <li>• What risk category applies?</li>
              <li>• Which documents or data sources are required?</li>
              <li>• What happens when information is missing, inconsistent or high-risk?</li>
            </ul>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              The result is not “automatic compliance”, but a clearer mapping
              between policy, actual practice, and the evidence you have for
              each customer.
            </p>
          </div>
        </section>

        {/* Pillars */}
        <section className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="p-5 rounded-2xl border bg-white">
            <IdCard className="h-6 w-6 text-slate-700" />
            <h3 className="mt-3 font-semibold text-slate-900">
              Customer type & risk categorisation
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              Different categories (natural person, SME, complex entity) need
              different documents and checks. The engine helps encode these
              distinctions so staff don’t have to remember every detail.
            </p>
          </div>

          <div className="p-5 rounded-2xl border bg-white">
            <Layers className="h-6 w-6 text-slate-700" />
            <h3 className="mt-3 font-semibold text-slate-900">
              Orchestrating external services
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              Where you use external KYC providers, we can sequence and combine
              them — ID verification, address lookups, sanctions and PEP
              screening — and bring their results into a single decision.
            </p>
          </div>

          <div className="p-5 rounded-2xl border bg-white">
            <ShieldCheck className="h-6 w-6 text-slate-700" />
            <h3 className="mt-3 font-semibold text-slate-900">
              Evidence and audit trails
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              For each customer, you can see which checks were required, which
              were completed, and on what basis a decision was made — useful for
              internal audit, external reviews, and dealing with escalations.
            </p>
          </div>
        </section>

        {/* Impact framing */}
        <section className="mb-10">
          <div className="p-5 rounded-2xl border bg-slate-50">
            <h2 className="text-xl font-semibold tracking-tight">
              What impact is realistic?
            </h2>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              Decision engines do not change the law and cannot remove KYC/FICA
              obligations. What they <strong>can</strong> do is help you apply
              your obligations more consistently and transparently. In many
              organisations, this has the <strong>potential</strong> to:
            </p>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Reduce unnecessary document requests for low-risk customers.</li>
              <li>• Provide clearer evidence that required checks were performed.</li>
              <li>• Make it easier to update practice when policies or rules change.</li>
              <li>• Improve collaboration between compliance, risk and operations.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              As with all governance work, the actual impact depends on how
              faithfully the flows are implemented and maintained. The sooner
              you start capturing structured decisions and outcomes, the easier
              it becomes to demonstrate that practice matches policy.
            </p>
          </div>
        </section>

        {/* Engagement approach */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold tracking-tight mb-3">
            How we typically support KYC & FICA modernisation
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="p-5 rounded-2xl border bg-white">
              <FileCheck className="h-6 w-6 text-slate-700" />
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">
                1. Policy & process mapping
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                We map existing KYC/FICA policies and the real-world processes
                used by teams, highlighting gaps, variations, and quick wins.
              </p>
            </div>
            <div className="p-5 rounded-2xl border bg-white">
              <Layers className="h-6 w-6 text-slate-700" />
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">
                2. Minimal viable decision flow
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                We implement a first version of the KYC/FICA decision logic in
                the engine — focused on one or two customer types — and align it
                with your compliance team’s view.
              </p>
            </div>
            <div className="p-5 rounded-2xl border bg-white">
              <ShieldCheck className="h-6 w-6 text-slate-700" />
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">
                3. Roll-out and refinement
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Once everyone is comfortable, we expand to more customer types
                and scenarios, adding monitoring and reporting that speak to
                both operational and compliance needs.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 p-6 rounded-2xl border bg-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Bring structure to KYC &amp; FICA without over-complicating it
            </h2>
            <p className="mt-2 text-sm text-slate-700 max-w-xl">
              If your KYC/FICA processes feel fragmented or hard to evidence, we
              can help you design a clearer, engine-driven flow that supports
              both your teams and your compliance obligations.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="mailto:contact@tsdg.co.za?subject=KYC%20and%20FICA%20decisioning%20discussion"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium"
              style={{
                background: "rgb(var(--primary))",
                color: "rgb(var(--primary-fg))",
              }}
            >
              Email us about KYC &amp; FICA
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
