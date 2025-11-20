// src/pages/solutions/CustomerManagement.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Repeat,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

export default function CustomerManagement() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="Customer Management & Retention | The Smart Decision Group"
        description="How decision engines and ML scorecards can support limit management, renewals, and retention strategies across the lifecycle."
        canonical="https://www.tsdg.co.za/solutions/customer-management"
        ogType="article"
      />

      <SiteHeader />

      <main className="page-container max-w-5xl mx-auto px-4 pb-16 pt-10">
        {/* Breadcrumb */}
        <p className="text-xs text-slate-500 mb-3">
          <Link to="/" className="underline underline-offset-2">
            Home
          </Link>{" "}
          /{" "}
          <span className="text-slate-600">
            Solutions: Customer Management &amp; Retention
          </span>
        </p>

        {/* Hero */}
        <section className="mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Customer Management &amp; Retention
          </h1>
          <p className="mt-3 text-slate-700 text-lg max-w-3xl">
            Using decision intelligence to manage existing customers —
            renewals, limit changes, reactivation, and retention — in a more
            consistent and transparent way.
          </p>
          <p className="mt-2 text-sm text-slate-500 max-w-3xl">
            This page is for executives managing portfolios over time, not just
            at origination. It outlines how a decision engine can help run
            customer management strategies, without promising specific upsell or
            retention rates.
          </p>
        </section>

        {/* Who / challenges */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <div className="p-5 rounded-2xl border bg-slate-50">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-600">
              Who this is for
            </h2>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Lenders with revolving or repeat-use products.</li>
              <li>• Providers offering renewals, top-ups, or cross-sell.</li>
              <li>• Teams running periodic limit reviews.</li>
              <li>• Organisations wanting clearer lifecycle strategies.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border bg-white">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-600">
              Typical challenges we see
            </h2>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Ad-hoc campaigns with limited learning across cycles.</li>
              <li>• Manual decisioning on limit changes and renewals.</li>
              <li>• Unclear link between customer value and treatment.</li>
              <li>• Little visibility of interactions across channels.</li>
            </ul>
          </div>
        </section>

        {/* Lifecycle intelligence */}
        <section className="mb-10">
          <div className="p-5 rounded-2xl border bg-white">
            <h2 className="text-xl font-semibold tracking-tight">
              From one-off campaigns to lifecycle strategies
            </h2>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              Many organisations treat existing customer management as a series
              of campaigns: a limit increase here, a renewal offer there, a
              reactivation push once a year. A decision engine allows you to
              think in terms of <strong>lifecycle strategies</strong>:
            </p>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Who qualifies for which limit or renewal options, and why.</li>
              <li>• How risk, behaviour and value affect future treatment.</li>
              <li>• How to align offers with collections behaviour and FPD history.</li>
              <li>• How to avoid over-contacting or confusing customers.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              ML models and scorecards can help identify which customers are
              likely to respond well to offers, but the engine remains the place
              where decisions are <strong>governed and explained</strong>.
            </p>
          </div>
        </section>

        {/* Pillars */}
        <section className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="p-5 rounded-2xl border bg-white">
            <CreditCard className="h-6 w-6 text-slate-700" />
            <h3 className="mt-3 font-semibold text-slate-900">
              Limit &amp; exposure management
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              We help define and encode rules for limit increases, decreases,
              and freezes based on risk, behaviour, and regulatory constraints,
              with clear reason codes and audit trails.
            </p>
          </div>

          <div className="p-5 rounded-2xl border bg-white">
            <Repeat className="h-6 w-6 text-slate-700" />
            <h3 className="mt-3 font-semibold text-slate-900">
              Renewals &amp; reactivation
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              For repeat or closed-book customers, we design decision flows that
              determine who is eligible for renewal offers, under what terms,
              and via which channels — subject to your risk appetite and policy.
            </p>
          </div>

          <div className="p-5 rounded-2xl border bg-white">
            <TrendingUp className="h-6 w-6 text-slate-700" />
            <h3 className="mt-3 font-semibold text-slate-900">
              Value, risk &amp; treatment alignment
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              We combine customer value indicators, payment behaviour, and
              affordability information to align treatment with long-term
              relationship potential — not just short-term spend.
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
              Structured customer management and retention strategies have the{" "}
              <strong>potential</strong> to:
            </p>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Improve the proportion of value generated from existing customers.</li>
              <li>• Reduce churn or dormancy in specific segments.</li>
              <li>• Provide clearer evidence about which treatments work best.</li>
              <li>• Reduce operational noise and unstructured one-off campaigns.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              As always, outcomes depend on product, customer base, and execution.
              Our role is to provide a decisioning and data structure that lets
              you learn and improve over time.
            </p>
          </div>
        </section>

        {/* How we work */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold tracking-tight mb-3">
            How we typically support customer management
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="p-5 rounded-2xl border bg-white">
              <Users className="h-6 w-6 text-slate-700" />
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">
                1. Portfolio & lifecycle mapping
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                We map key customer segments, lifecycle stages, and existing
                treatments, together with basic performance indicators.
              </p>
            </div>
            <div className="p-5 rounded-2xl border bg-white">
              <Repeat className="h-6 w-6 text-slate-700" />
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">
                2. Initial engine-driven strategies
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                We encode a small number of high-impact strategies in the
                decision engine — for example, a structured limit review or
                renewal process — and monitor outcomes from the start.
              </p>
            </div>
            <div className="p-5 rounded-2xl border bg-white">
              <TrendingUp className="h-6 w-6 text-slate-700" />
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">
                3. Gradual expansion & learning
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                As you gain confidence, we expand to more segments and
                treatments, using Champion / Challenger approaches to refine
                strategies over time.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 p-6 rounded-2xl border bg-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Turn customer management into a strategic capability
            </h2>
            <p className="mt-2 text-sm text-slate-700 max-w-xl">
              If your existing customer strategies feel reactive or campaign-led,
              we can help you build a more deliberate, engine-driven approach
              that aligns risk, value, and customer experience.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="mailto:contact@tsdg.co.za?subject=Customer%20management%20and%20retention%20discussion"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium"
              style={{
                background: "rgb(var(--primary))",
                color: "rgb(var(--primary-fg))",
              }}
            >
              Email us about customer management
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
