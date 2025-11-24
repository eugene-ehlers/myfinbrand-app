// src/pages/solutions/OurDecisionEngine.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Cpu,
  Settings2,
  Activity,
  Gauge,
  ShieldCheck,
  Network,
  Boxes,
  BrainCircuit,
} from "lucide-react";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

export default function OurDecisionEngine() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="Our Decision Engine | The Smart Decision Group"
        description="Our agentic-ready decision engine helps organisations make fast, governed, audit-ready decisions across credit, onboarding, collections, pricing, and customer management."
        canonical="https://www.tsdg.co.za/solutions/our-decision-engine"
        ogType="article"
      />

      <SiteHeader />

      <main className="page-container max-w-5xl mx-auto px-4 pb-16 pt-10">
        {/* Breadcrumb */}
        <p className="text-xs text-slate-500 mb-3">
          <Link to="/" className="underline underline-offset-2">
            Home
          </Link>{" "}
          / <span className="text-slate-600">Solutions: Our Decision Engine</span>
        </p>

        {/* HERO */}
        <section className="mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Our Decision Engine
          </h1>
          <p className="mt-3 text-slate-700 text-lg max-w-3xl">
            Make complex decisions simple, fast, and aligned with your business —
            across originations, onboarding, insurance, collections, investment
            restructuring, and personalised customer journeys.
          </p>
          <p className="mt-2 text-sm text-slate-500 max-w-3xl">
            This page is written for executives, product owners, risk leaders,
            and data teams who want a practical, production-ready decision
            platform — not just another slide deck about decisioning theory.
          </p>
        </section>

        {/* WHO / CONTEXT */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <div className="p-5 rounded-2xl border bg-slate-50">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-600">
              What Our Decision Engine Is
            </h2>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              A cloud-hosted, agentic-ready decision platform that combines rules,
              scorecards, ML models, and external services into governed decision
              flows. It is configurable by business users, and robust enough for
              technical teams who care about SLAs, monitoring, and integration.
            </p>
          </div>

          <div className="p-5 rounded-2xl border bg-white">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-600">
              Where it is typically used
            </h2>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Credit originations & onboarding.</li>
              <li>• Collections & restructuring strategies.</li>
              <li>• Fraud & verification orchestration.</li>
              <li>• Pricing & offer optimisation.</li>
              <li>• KYC/FICA decisioning and governance.</li>
              <li>• Ongoing customer management & retention.</li>
            </ul>
          </div>
        </section>

        {/* INTRO: WHY DIFFERENT */}
        <section className="mb-10">
          <div className="p-5 rounded-2xl border bg-white">
            <h2 className="text-xl font-semibold tracking-tight">
              Why “Our Decision Engine” and not just another rules engine?
            </h2>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              Many organisations already have a rules engine somewhere. What they
              often lack is a <strong>governed decision layer</strong> that:
            </p>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Business users can safely change without developers.</li>
              <li>• Combines rules, scorecards, ML models, and external services.</li>
              <li>• Keeps full versioning, approval flows, and audit trails.</li>
              <li>• Is ready for agentic and AI-driven workflows.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              Our Decision Engine is designed from the ground up to meet those
              needs. It has the <strong>potential</strong> to shorten change
              cycles, reduce operational dependency on IT, and improve alignment
              between risk, product, and compliance — while keeping outcomes
              explainable.
            </p>
          </div>
        </section>

        {/* WHAT MAKES IT DIFFERENT – 1–4 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold tracking-tight mb-4">
            What Makes Our Decision Engine Different
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* 1. Non-technical rule changes */}
            <div className="p-5 rounded-2xl border bg-white">
              <Settings2 className="h-6 w-6 text-slate-700" />
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">
                1. Non-technical users can change rules — safely
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Business teams can modify segments, scorecards, thresholds, risk
                rules, product rules, and pricing logic directly from a clean,
                modern console. Typical users include credit analysts, product
                owners, and operations teams.
              </p>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                They can:
              </p>
              <ul className="mt-2 text-sm text-slate-700 space-y-1">
                <li>• Create or refine customer segments.</li>
                <li>• Turn services on or off.</li>
                <li>• Edit product, pricing, and credit rules.</li>
                <li>• Adjust scorecard cut-offs and exposure limits.</li>
                <li>• Configure offers and treatment strategies.</li>
                <li>• Track rule histories and versioning.</li>
              </ul>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                All without touching code — with guardrails and approval flows in
                place.
              </p>
            </div>

            {/* 2. Instant, controlled deployment */}
            <div className="p-5 rounded-2xl border bg-white">
              <Gauge className="h-6 w-6 text-slate-700" />
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">
                2. Instant, controlled deployment of changes
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Changes made through the console follow a governed approval
                process. Once approved, they can go live in your production
                environment the same day, depending on your internal controls.
              </p>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                This has the potential to reduce dependency on IT teams, shrink
                development backlogs, and give your organisation an operational
                agility advantage — while still respecting risk and compliance
                gates.
              </p>
            </div>

            {/* 3. Transparency & audit */}
            <div className="p-5 rounded-2xl border bg-white">
              <ShieldCheck className="h-6 w-6 text-slate-700" />
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">
                3. Full transparency and auditability
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Every change is automatically logged and versioned. Your team can
                answer questions like:
              </p>
              <ul className="mt-2 text-sm text-slate-700 space-y-1">
                <li>• What rule was used for a specific customer decision?</li>
                <li>• When was that rule changed, and by whom?</li>
                <li>• Which version of a scorecard or product rule was live?</li>
              </ul>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                This supports compliance, dispute resolution, internal audit, and
                board-level oversight of model and decision risk.
              </p>
            </div>

            {/* 4. Cloud-native & scalable */}
            <div className="p-5 rounded-2xl border bg-white">
              <Network className="h-6 w-6 text-slate-700" />
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">
                4. Built for scale: cloud-hosted, secure, cost-efficient
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Our engine is fully cloud-deployed and can be hosted in your
                infrastructure, in our managed environment, or within a partner
                such as a bureau. Typical characteristics include:
              </p>
              <ul className="mt-2 text-sm text-slate-700 space-y-1">
                <li>• High availability and reliability.</li>
                <li>• Low operating cost compared to bespoke builds.</li>
                <li>• Rapid setup with minimal infrastructure overhead.</li>
                <li>• Built-in security, encryption, and modern authentication.</li>
                <li>• Elastic scaling for peak demand periods.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* WHAT MAKES IT DIFFERENT – 5–8 */}
        <section className="mb-10">
          <div className="grid gap-6 md:grid-cols-2">
            {/* 5. Ecosystem integration */}
            <div className="p-5 rounded-2xl border bg-white">
              <Boxes className="h-6 w-6 text-slate-700" />
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">
                5. Works with your entire ecosystem
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                You can plug in a wide range of internal and external services:
              </p>
              <ul className="mt-2 text-sm text-slate-700 space-y-1">
                <li>• Credit bureaus and alternative data providers.</li>
                <li>• Identity, biometric, and fraud services.</li>
                <li>• Income and employment verification tools.</li>
                <li>• Banking integrations and payment systems.</li>
                <li>• Internal behavioural and transactional data.</li>
                <li>• Machine-learning models and scoring services.</li>
              </ul>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                The engine orchestrates these in real time, calling the right
                services at the right stage of each decision flow.
              </p>
            </div>

            {/* 6. Rules + scorecards + ML */}
            <div className="p-5 rounded-2xl border bg-white">
              <Cpu className="h-6 w-6 text-slate-700" />
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">
                6. Supports rules, scorecards, ML models &amp; hybrids
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Your decisioning can be as simple or advanced as needed:
              </p>
              <ul className="mt-2 text-sm text-slate-700 space-y-1">
                <li>• Simple if–then rules and matrices.</li>
                <li>• Traditional scorecards with clear cut-offs.</li>
                <li>• ML-driven risk or propensity scores.</li>
                <li>• Hybrid Champion / Challenger setups.</li>
                <li>• Dynamic pricing and product eligibility.</li>
                <li>• Multi-step origination and collections flows.</li>
              </ul>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Our focus is on interpretability and governance, not black-box
                behaviour.
              </p>
            </div>

            {/* 7. Segment-based decisioning */}
            <div className="p-5 rounded-2xl border bg-white">
              <Activity className="h-6 w-6 text-slate-700" />
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">
                7. Segment-based decisioning for personalised treatment
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Customer segments can be built on combinations of:
              </p>
              <ul className="mt-2 text-sm text-slate-700 space-y-1">
                <li>• Customer type (repeat, new-to-provider, new-to-credit).</li>
                <li>• Income type and stability.</li>
                <li>• Origination channel and geography.</li>
                <li>• Payment frequency and behaviour.</li>
                <li>• Risk characteristics and FPD history.</li>
                <li>• Engagement and collections response.</li>
              </ul>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Each segment can have its own scorecards, rules, offers, and
                treatment strategies, enabling more precise risk and value
                management.
              </p>
            </div>

            {/* 8. Agentic-ready */}
            <div className="p-5 rounded-2xl border bg-white">
              <BrainCircuit className="h-6 w-6 text-slate-700" />
              <h3 className="mt-3 font-semibold text-slate-900 text-sm">
                8. Built for agentic automation
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Our engine is agentic-ready: it can be used by automated agents
                and AI systems that, subject to your governance, can:
              </p>
              <ul className="mt-2 text-sm text-slate-700 space-y-1">
                <li>• Trigger rule changes under controlled workflows.</li>
                <li>• Evaluate Challenger models and strategies.</li>
                <li>• Optimise pricing or offer rules on defined segments.</li>
                <li>• Auto-generate recommendations for human approval.</li>
                <li>• Connect with ML pipelines and monitoring.</li>
              </ul>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Agents bring flexibility and exploration; the decision engine
                keeps final decisions consistent, compliant, and auditable.
              </p>
            </div>
          </div>
        </section>

        {/* BUSINESS IMPACT */}
        <section className="mb-10">
          <div className="p-5 rounded-2xl border bg-slate-50">
            <h2 className="text-xl font-semibold tracking-tight">
              What this can mean for your business
            </h2>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              Because every organisation starts from a different place, we do not
              promise specific uplift numbers. However, implementing a governed,
              agentic-ready decision engine like this typically has the{" "}
              <strong>potential</strong> to:
            </p>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>
                • Reduce time-to-market for new products, pricing, and rules
                changes.
              </li>
              <li>
                • Lower operational load on IT by putting controlled power in the
                hands of business teams.
              </li>
              <li>
                • Improve governance through clear versioning, approvals, and
                audit trails.
              </li>
              <li>
                • Support better customer experiences via instant, consistent
                decisions and personalised treatments.
              </li>
              <li>
                • Create a foundation for learning — improving data, models, and
                strategies over time.
              </li>
            </ul>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              The sooner you start running decisions through a structured engine
              and capturing outcomes, the sooner you can begin iterating on
              strategy, improving data quality, and refining your models and
              campaigns.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 p-6 rounded-2xl border bg-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Explore whether Our Decision Engine is a fit
            </h2>
            <p className="mt-2 text-sm text-slate-700 max-w-xl">
              If you&apos;re considering how to modernise decisioning — whether in
              credit, collections, onboarding, or broader customer journeys —
              we can help you assess where a decision engine creates the most
              value first.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="mailto:contact@tsdg.co.za?subject=Our%20Decision%20Engine%20-%20discovery%20discussion"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium"
              style={{
                background: "rgb(var(--primary))",
                color: "rgb(var(--primary-fg))",
              }}
            >
              Email us about Our Decision Engine
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
