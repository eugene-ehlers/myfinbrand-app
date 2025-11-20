// src/pages/solutions/PricingOptimisation.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  LineChart,
  Percent,
  BadgeDollarSign,
  Scale,
} from "lucide-react";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

export default function PricingOptimisation() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="Pricing & Offer Optimisation | The Smart Decision Group"
        description="How decision engines and ML scorecards can support more consistent pricing and offers — within risk, affordability, and regulatory constraints."
        canonical="https://www.tsdg.co.za/solutions/pricing-optimisation"
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
            Solutions: Pricing &amp; Offer Optimisation
          </span>
        </p>

        {/* Hero */}
        <section className="mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Pricing &amp; Offer Optimisation
          </h1>
          <p className="mt-3 text-slate-700 text-lg max-w-3xl">
            Aligning risk, affordability, and commercial goals through governed
            pricing and offer decisions — not ad-hoc exceptions.
          </p>
          <p className="mt-2 text-sm text-slate-500 max-w-3xl">
            This page is for executives, product owners, and risk leaders who
            want more structured pricing and offer decisions. It describes how a
            decision engine and ML models can help, without promising guaranteed
            improvements in yield or conversion.
          </p>
        </section>

        {/* Who / challenges */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <div className="p-5 rounded-2xl border bg-slate-50">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-600">
              Who this is for
            </h2>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Lenders offering multiple products or tiers.</li>
              <li>• Teams experimenting with risk-based pricing.</li>
              <li>• Organisations with many manual pricing overrides.</li>
              <li>• Executives wanting more predictable portfolio yield.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border bg-white">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-600">
              Typical challenges we see
            </h2>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• “Standard” price used for most customers, despite varying risk.</li>
              <li>• Complex pricing matrices embedded in spreadsheets.</li>
              <li>• Underwriters and agents making frequent exceptions.</li>
              <li>• Limited feedback loops between pricing and later behaviour.</li>
            </ul>
          </div>
        </section>

        {/* Pricing as part of the decision flow */}
        <section className="mb-10">
          <div className="p-5 rounded-2xl border bg-white">
            <h2 className="text-xl font-semibold tracking-tight">
              Pricing is a decision, not just a table
            </h2>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              Many organisations treat pricing and offers as a set of tables:
              risk bands, terms, and rates. In practice, real decisions depend
              on much more:
            </p>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Customer risk profile and affordability.</li>
              <li>• Product and channel strategy.</li>
              <li>• Regulatory and conduct expectations.</li>
              <li>• Competitive positioning and campaign strategy.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              A decision engine allows you to bring these elements together
              into a single, governed pricing and offer flow, with clear
              reason codes and version control — rather than scattered logic
              across systems and people.
            </p>
          </div>
        </section>

        {/* Pillars */}
        <section className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="p-5 rounded-2xl border bg-white">
            <Percent className="h-6 w-6 text-slate-700" />
            <h3 className="mt-3 font-semibold text-slate-900">
              Risk-based pricing rules
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              We help define pricing bands and offer structures that respond to
              risk and affordability — then encode them in the engine, so they
              are applied consistently and can be adjusted with governance.
            </p>
          </div>

          <div className="p-5 rounded-2xl border bg-white">
            <BadgeDollarSign className="h-6 w-6 text-slate-700" />
            <h3 className="mt-3 font-semibold text-slate-900">
              Offer strategies & counter-offers
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              For example: reduced limits or alternative terms when a customer
              does not qualify for their requested product; or structured
              settlement and early-settlement offers in collections contexts —
              always subject to your policy and conduct standards.
            </p>
          </div>

          <div className="p-5 rounded-2xl border bg-white">
            <Scale className="h-6 w-6 text-slate-700" />
            <h3 className="mt-3 font-semibold text-slate-900">
              Fairness & conduct considerations
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              We design pricing logic so that rules are explainable and
              defendable, with clear documentation and an ability to show that
              like customers are treated alike, subject to your policies and
              regulations.
            </p>
          </div>
        </section>

        {/* Potential impact */}
        <section className="mb-10">
          <div className="p-5 rounded-2xl border bg-slate-50">
            <h2 className="text-xl font-semibold tracking-tight">
              What impact is realistic?
            </h2>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              In many organisations, better-structured pricing and offer
              decisions have the <strong>potential</strong> to:
            </p>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Improve alignment between risk, return, and growth goals.</li>
              <li>• Reduce ad-hoc exceptions and manual overrides.</li>
              <li>
                • Provide clearer feedback on how pricing affects conversion and
                later performance.
              </li>
              <li>
                • Make it easier to adjust pricing strategies when market
                conditions change.
              </li>
            </ul>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              Actual results depend on starting position, competitive context,
              and how aggressively strategies are changed. We focus on building
              a <strong>repeatable pricing decision process</strong> rather than
              promising specific yield targets.
            </p>
          </div>
        </section>

        {/* How we work */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold tracking-tight mb-3">
            How we typically support pricing & offer optimisation
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="p-5 rounded-2xl border bg-white">
              <LineChart className="h-6 w-6 text-slate-700" />
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">
                1. Current state assessment
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                We map your existing pricing rules, override patterns, and basic
                performance by segment, to understand where structure is
                missing and where there is clear policy.
              </p>
            </div>
            <div className="p-5 rounded-2xl border bg-white">
              <Percent className="h-6 w-6 text-slate-700" />
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">
                2. Initial engine implementation
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                We implement a first version of your pricing and offer logic in
                the decision engine and connect it to originations or customer
                management flows, with monitoring from day one.
              </p>
            </div>
            <div className="p-5 rounded-2xl border bg-white">
              <BadgeDollarSign className="h-6 w-6 text-slate-700" />
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">
                3. Experiments & refinement
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                We help you design Champion / Challenger tests for pricing or
                offer strategies on carefully chosen segments, gradually
                building evidence before making larger changes.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 p-6 rounded-2xl border bg-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Bring more structure to pricing &amp; offers
            </h2>
            <p className="mt-2 text-sm text-slate-700 max-w-xl">
              If pricing decisions feel scattered or overly dependent on
              individual judgment, we can help you design an engine-driven
              approach that balances risk, return, and fairness.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="mailto:contact@tsdg.co.za?subject=Pricing%20and%20offer%20optimisation%20discussion"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium"
              style={{
                background: "rgb(var(--primary))",
                color: "rgb(var(--primary-fg))",
              }}
            >
              Email us about pricing &amp; offers
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
