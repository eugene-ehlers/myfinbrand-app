import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, LineChart, Target, ShieldCheck, RefreshCw } from "lucide-react";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

export default function LeadOptimisation() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="Intelligent Lead Optimisation & Portfolio Growth | The Smart Decision Group"
        description="How decision engines and ML scorecards can help lenders grow more intelligently – within POPIA constraints – by improving lead quality, targeting, and campaign learning."
        canonical="https://www.tsdg.co.za/solutions/lead-optimisation"
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
            Solutions: Lead Optimisation & Portfolio Growth
          </span>
        </p>

        {/* Hero */}
        <section className="mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Intelligent Lead Optimisation & Portfolio Growth
          </h1>
          <p className="mt-3 text-slate-700 text-lg max-w-3xl">
            A practical, POPIA-aware approach for executives who want to grow
            their portfolios more intelligently — by improving lead quality,
            targeting, and learning over time, not just buying more volume.
          </p>
          <p className="mt-2 text-sm text-slate-500 max-w-3xl">
            This page is written for CEOs, founders, and credit executives. It
            focuses on what is possible and where our decision engine and ML
            scorecards can help — without promising guaranteed uplift. In
            practice, outcomes depend on your data, processes, partners, and
            governance.
          </p>
        </section>

        {/* Who this is for */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <div className="p-5 rounded-2xl border bg-slate-50">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-600">
              Who this is for
            </h2>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Micro-lenders and niche credit providers</li>
              <li>• Established lenders with multiple lead sources</li>
              <li>• Fintechs and digital lenders using aggregators</li>
              <li>• Executives who are concerned about POPIA and data ethics</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border bg-white">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-600">
              Typical challenges we see
            </h2>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Rising cost per lead and variable quality.</li>
              <li>• Difficulty proving which channels really work.</li>
              <li>• Early-stage defaults from the “wrong” customers.</li>
              <li>
                • Concern about whether third-party leads are POPIA compliant.
              </li>
              <li>
                • Fragmented data — marketing, credit, and collections don’t
                share a single view.
              </li>
            </ul>
          </div>
        </section>

        {/* POPIA & the new reality of lead buying */}
        <section className="mb-10">
          <div className="p-5 rounded-2xl border bg-white">
            <h2 className="text-xl font-semibold tracking-tight">
              POPIA & the new reality of buying leads
            </h2>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              In South Africa, the Protection of Personal Information Act
              (POPIA) has fundamentally changed how organisations may collect,
              share, and use personal information. For lenders and
              lead-generating partners, this means:
            </p>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>
                • Consent must be specific, informed, and demonstrable — vague
                “marketing consent” is not enough.
              </li>
              <li>
                • Using third-party leads requires clarity about{" "}
                <strong>what the customer consented to</strong>,{" "}
                <strong>who may contact them</strong>, and{" "}
                <strong>for what purpose</strong>.
              </li>
              <li>
                • Data minimisation and purpose limitation are expected —
                keeping or enriching data “just in case” increases compliance
                risk.
              </li>
              <li>
                • Customers are more aware of their rights and more willing to
                complain if they feel harassed or misled.
              </li>
            </ul>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              The practical impact is that the “old” model of buying large
              lists and hammering them with calls or SMS campaigns is becoming
              less effective and more risky. This makes{" "}
              <strong>first-party data, consent-aware processes, and intelligent
              targeting</strong> more important than ever.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Note: nothing on this page is legal advice. We work alongside your
              legal and compliance teams to design decisioning and data flows
              that support your POPIA obligations.
            </p>
          </div>
        </section>

        {/* Three pillars */}
        <section className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="p-5 rounded-2xl border bg-white">
            <LineChart className="h-6 w-6 text-slate-700" />
            <h3 className="mt-3 font-semibold text-slate-900">
              1. Lead quality, not just volume
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              We use decision engines and ML scorecards to help you distinguish
              promising leads from weak ones, based on your own performance
              data. Over time, this can improve the mix of customers entering
              your funnel — but it does not replace the need for good product,
              pricing, and service.
            </p>
          </div>

          <div className="p-5 rounded-2xl border bg-white">
            <Target className="h-6 w-6 text-slate-700" />
            <h3 className="mt-3 font-semibold text-slate-900">
              2. Consent-aware targeting
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              The decision engine becomes the place where consent flags, lead
              source, and channel rules are enforced. This can help you respect
              POPIA while still running effective campaigns, and makes it easier
              to demonstrate to regulators and your board how leads are used.
            </p>
          </div>

          <div className="p-5 rounded-2xl border bg-white">
            <ShieldCheck className="h-6 w-6 text-slate-700" />
            <h3 className="mt-3 font-semibold text-slate-900">
              3. Measurable learning cycles
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              Champion / Challenger setups allow you to test different lead
              sources, campaigns, and targeting rules in a controlled way. The
              sooner you start this cycle, the faster you can improve data
              quality, predictions, and campaign tuning.
            </p>
          </div>
        </section>

        {/* Potential impact (carefully worded) */}
        <section className="mb-10">
          <div className="p-5 rounded-2xl border bg-slate-50">
            <h2 className="text-xl font-semibold tracking-tight">
              What impact is realistic?
            </h2>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              Every portfolio is different, and no responsible partner should
              promise specific uplifts in advance. What we can say is that, in
              many organisations, structured lead optimisation has the{" "}
              <strong>potential</strong> to:
            </p>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>
                • Reduce cost per booked account by improving the proportion of
                high-quality leads in your mix.
              </li>
              <li>
                • Stabilise early-stage performance by avoiding clearly
                unsuitable leads.
              </li>
              <li>
                • Provide much clearer evidence of which channels and partners
                perform best over time.
              </li>
              <li>
                • Support better conversations with regulators and boards about
                how personal information is used in marketing and onboarding.
              </li>
            </ul>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              These benefits are not automatic. They depend on the quality of
              your data, the willingness of teams to adapt, and the discipline
              with which you run the Champion / Challenger cycles.
            </p>
          </div>
        </section>

        {/* How our decision engine fits in */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold tracking-tight mb-3">
            How the TSDG decision engine supports POPIA-aware growth
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="p-5 rounded-2xl border bg-white">
              <h3 className="font-semibold text-slate-900 text-sm">
                Central place for lead rules
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Lead source, consent flags, channel eligibility, and basic
                risk/affordability checks are all applied in one place. This can
                reduce the risk of “side systems” making decisions without
                governance.
              </p>
            </div>
            <div className="p-5 rounded-2xl border bg-white">
              <h3 className="font-semibold text-slate-900 text-sm">
                Champion / Challenger baked in
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                We configure structured experiments — different cut-offs, offer
                strategies, or channel routing — and monitor them over time.
                Successful challengers can be promoted to new champions once
                there is enough evidence.
              </p>
            </div>
            <div className="p-5 rounded-2xl border bg-white">
              <h3 className="font-semibold text-slate-900 text-sm">
                Scorecards and ML uplift models
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Where there is enough data, we can build uplift or
                propensities-to-respond models. Where data is limited, we start
                with simpler business rules and scorecards and improve as data
                accumulates.
              </p>
            </div>
            <div className="p-5 rounded-2xl border bg-white">
              <h3 className="font-semibold text-slate-900 text-sm">
                Audit trails & transparency
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Every decision — which lead was contacted, through which
                channel, and why — can be logged with policy versions and
                explanation codes. This helps with internal audit, compliance,
                and board reporting.
              </p>
            </div>
          </div>
        </section>

        {/* Example engagement path */}
        <section className="mb-10">
          <div className="p-5 rounded-2xl border bg-white">
            <h2 className="text-xl font-semibold tracking-tight">
              A practical starting point (90–120 days)
            </h2>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              For most clients, we recommend starting small and focused, then
              expanding:
            </p>
            <ol className="mt-3 text-sm text-slate-700 space-y-2 list-decimal list-inside">
              <li>
                <strong>Lead & consent mapping:</strong> understand current
                lead sources, consent language, data flows, and basic
                performance.
              </li>
              <li>
                <strong>Minimal viable decision flow:</strong> implement a
                simple, POPIA-aware lead decision in the engine — including
                obvious “no-go” rules and routing.
              </li>
              <li>
                <strong>Champion version 1:</strong> deploy a baseline strategy
                and start collecting consistent decision and response data.
              </li>
              <li>
                <strong>First challenger:</strong> test one or two targeted
                changes (e.g. stricter rules for a weak channel, or better
                prioritisation for high-quality sources).
              </li>
              <li>
                <strong>Review & iterate:</strong> use simple dashboards to see
                what is happening and decide on the next challenger.
              </li>
            </ol>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              The earlier you start this cycle, the faster your data improves
              and the more reliable your models and campaigns become. Even if
              initial gains are modest, the learning compounds over time.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 p-6 rounded-2xl border bg-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Explore POPIA-aware growth for your portfolio
            </h2>
            <p className="mt-2 text-sm text-slate-700 max-w-xl">
              If you’re unsure where to start — or concerned about how POPIA
              affects your use of leads and campaigns — we can help you map the
              landscape and design a practical, governed decisioning approach.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="mailto:contact@tsdg.co.za?subject=Lead%20optimisation%20discussion"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium"
              style={{
                background: "rgb(var(--primary))",
                color: "rgb(var(--primary-fg))",
              }}
            >
              Email us about lead optimisation
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
