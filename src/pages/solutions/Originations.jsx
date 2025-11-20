// src/pages/solutions/Originations.jsx
import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, LineChart, Bot, Sparkles, Shield } from "lucide-react";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

const Section = ({ id, className = "", children }) => (
  <section
    id={id}
    className={`w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
  >
    {children}
  </section>
);

const ListItem = ({ children }) => (
  <li className="flex items-start gap-3">
    <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-800" />
    <span className="text-slate-700 leading-relaxed">{children}</span>
  </li>
);

export default function Originations() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="Originations & Onboarding Optimisation | The Smart Decision Group"
        description="Modernise originations and onboarding with decision engines and scorecards that balance growth, risk, and regulatory expectations."
        canonical="https://www.tsdg.co.za/solutions/originations"
        ogType="website"
      />

      <SiteHeader />

      {/* HERO */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-70"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(2,6,23,0.75) 0%, rgba(2,6,23,0.0) 70%)",
            }}
          />
          <div
            className="absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-70"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(43,212,224,0.35) 0%, rgba(43,212,224,0.0) 70%)",
            }}
          />
        </div>

        <div
          className="w-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(2,6,23,0.9) 0%, rgba(2,6,23,0.75) 40%, rgba(2,6,23,0.3) 100%)",
            color: "rgb(var(--cream))",
          }}
        >
          <Section className="pt-16 md:pt-20 pb-12">
            <div className="grid md:grid-cols-12 gap-10 items-center relative">
              <div className="md:col-span-7">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                  style={{
                    background: "rgba(43,212,224,0.12)",
                    border: "1px solid rgba(43,212,224,0.3)",
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Originations & onboarding optimisation</span>
                </div>
                <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                  Grow approvals without losing control of risk.
                </h1>
                <p className="mt-4 text-lg leading-relaxed max-w-2xl opacity-90">
                  We help lenders and subscription businesses design
                  data-driven originations and onboarding flows that balance
                  growth, risk, regulation, and customer experience—powered by
                  decision engines and scorecards.
                </p>
                <p className="mt-3 text-sm max-w-2xl opacity-80">
                  Designed for executives who want more good customers, fewer
                  surprises in the back book, and clear governance from the
                  very first decision.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#approach"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl shadow text-sm font-medium"
                    style={{
                      background: "rgb(var(--primary))",
                      color: "rgb(var(--primary-fg))",
                    }}
                  >
                    See the originations framework
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium"
                    style={{
                      background: "rgba(15,23,42,0.12)",
                      borderColor: "rgba(148,163,184,0.6)",
                    }}
                  >
                    Talk about your onboarding flow
                  </a>
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="rounded-3xl border bg-white/95 shadow-sm p-5 text-slate-900">
                  <h2 className="text-sm font-semibold tracking-wide text-slate-600 uppercase">
                    At a glance
                  </h2>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="rounded-2xl border p-3">
                      <div className="text-xs text-slate-500">
                        Approval uplift (good risk)
                      </div>
                      <div className="mt-1 text-xl font-semibold">5–15%</div>
                    </div>
                    <div className="rounded-2xl border p-3">
                      <div className="text-xs text-slate-500">
                        Reduction in manual reviews
                      </div>
                      <div className="mt-1 text-xl font-semibold">30–60%</div>
                    </div>
                    <div className="rounded-2xl border p-3">
                      <div className="text-xs text-slate-500">
                        Time-to-decision
                      </div>
                      <div className="mt-1 text-xl font-semibold">
                        Seconds, not minutes
                      </div>
                    </div>
                    <div className="rounded-2xl border p-3">
                      <div className="text-xs text-slate-500">
                        Built for
                      </div>
                      <div className="mt-1 text-sm font-medium">
                        Credit, subscriptions, and KYC-heavy products
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-3 text-xs text-slate-600">
                    <Shield className="h-4 w-4 mt-0.5" />
                    <p>
                      Every decision is logged with reason codes, policy
                      versions, and model versions—supporting compliance and
                      internal audit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </header>

      <main className="pb-16">
        {/* WHY ORIGINATIONS UNDERPERFORM */}
        <Section className="pt-10 md:pt-14">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Why originations and onboarding often fall short
              </h2>
              <p className="mt-3 text-slate-700">
                Many organisations still rely on manual underwriting, static
                scorecards, and paper-based policies. This slows down onboarding,
                frustrates good customers, and lets avoidable risk into the book.
              </p>
            </div>
            <div className="md:col-span-6">
              <ul className="space-y-2 text-sm">
                <ListItem>
                  Same policy for all customers, regardless of channel,
                  behaviour, or long-term value.
                </ListItem>
                <ListItem>
                  Slow, inconsistent manual decisions—especially where income,
                  affordability, or KYC checks are complex.
                </ListItem>
                <ListItem>
                  Limited feedback from collections back into originations, so
                  the same patterns repeat.
                </ListItem>
                <ListItem>
                  Difficulty explaining decisions to customers, regulators, or
                  internal audit.
                </ListItem>
                <ListItem>
                  Experiments and “growth ideas” happen in slides, not in
                  production.
                </ListItem>
              </ul>
              <p className="mt-3 text-sm text-slate-600">
                We help you move to an automated, governed originations engine
                that is fast for good customers and strict where it needs to be.
              </p>
            </div>
          </div>
        </Section>

        {/* APPROACH OVERVIEW */}
        <Section id="approach" className="pt-10 md:pt-14">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center">
            A decision-first approach to originations
          </h2>
          <p className="mt-3 max-w-3xl mx-auto text-center text-slate-700">
            Instead of hard-coding policies into applications and spreadsheets,
            we centralise your rules, scorecards, and workflows into a governed
            decision engine—so every application is treated fairly and
            consistently.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl border bg-white">
              <h3 className="text-lg font-semibold">1. Clarify strategy</h3>
              <p className="mt-2 text-sm text-slate-700">
                Define where you want to grow, what risk you can accept, and how
                to treat different customer segments (new vs existing, channel,
                product, etc.).
              </p>
            </div>
            <div className="p-6 rounded-2xl border bg-white">
              <h3 className="text-lg font-semibold">2. Build the decision flow</h3>
              <p className="mt-2 text-sm text-slate-700">
                Turn policies, scorecards, and checks into a structured flow:
                from application and data collection through KYC, affordability,
                risk scoring, and final decision.
              </p>
            </div>
            <div className="p-6 rounded-2xl border bg-white">
              <h3 className="text-lg font-semibold">3. Automate & test</h3>
              <p className="mt-2 text-sm text-slate-700">
                Deploy into a decision engine, integrate with your systems or
                bureau partners, and use Champion–Challenger testing to prove
                improvements before scaling.
              </p>
            </div>
          </div>
        </Section>

        {/* DATA & SCORECARDS */}
        <Section className="pt-10 md:pt-14">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                Use data and scorecards where they matter most
              </h2>
              <p className="mt-3 text-slate-700">
                For many lenders, the question is not whether to use scorecards,
                but how to combine expert rules, bureau data, and models in a
                way that is practical, auditable, and commercially sensible.
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <ListItem>Credit risk scores and affordability indicators.</ListItem>
                <ListItem>Fraud and identity checks, including bureau and third-party data.</ListItem>
                <ListItem>Existing-customer behaviour and previous performance.</ListItem>
                <ListItem>Channel and product differences (branch, USSD, web, app, agent).</ListItem>
              </ul>
            </div>
            <div className="md:col-span-6">
              <div className="rounded-3xl border bg-white p-5 shadow-sm text-sm">
                <div className="flex items-center gap-3">
                  <LineChart className="h-5 w-5" />
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Scorecards & models
                    </div>
                    <div className="font-semibold">
                      Build, rent, or combine with bureau models
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-slate-700">
                  We can work with your existing scorecards, build new ones from
                  your data, or combine both with bureau models and rules. The
                  key is that they are all orchestrated by a single decision
                  engine with clear governance around when and how each is used.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* FIRST-PAYMENT FEEDBACK LOOP */}
        <Section className="pt-10 md:pt-14">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                Close the loop between originations and first-payment performance
              </h2>
              <p className="mt-3 text-slate-700">
                In our collections framework, first-payment default (FPD) is a
                critical signal. Here, we feed that signal back into
                originations so you can continuously improve your cut-offs,
                rules, and product design.
              </p>
            </div>
            <div className="md:col-span-6">
              <ul className="space-y-2 text-sm">
                <ListItem>
                  Identify which channels, products, or agents produce higher
                  FPD.
                </ListItem>
                <ListItem>
                  Adjust score thresholds or additional checks for higher-risk
                  combinations.
                </ListItem>
                <ListItem>
                  Detect affordability stress patterns early and update policies.
                </ListItem>
                <ListItem>
                  Use Champion–Challenger to test safer strategies on a small
                  share of traffic before scaling.
                </ListItem>
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Result: fewer surprises in early collections and a cleaner,
                more resilient book.
              </p>
            </div>
          </div>
        </Section>

        {/* CUSTOMER JOURNEY & BEHAVIOUR */}
        <Section className="pt-10 md:pt-14">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                Customer-friendly journeys, policy-driven decisions
              </h2>
              <p className="mt-3 text-slate-700">
                We design originations journeys that feel simple to customers,
                while the complexity of policy, risk, and governance lives
                inside the decision engine—not in long forms or confusing
                processes.
              </p>
            </div>
            <div className="md:col-span-7">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-2xl border bg-white">
                  <h3 className="font-semibold">Fewer, smarter questions</h3>
                  <p className="mt-1 text-slate-700">
                    Ask only the questions you genuinely need, when you need
                    them. The engine decides what&apos;s required for each
                    segment.
                  </p>
                </div>
                <div className="p-4 rounded-2xl border bg-white">
                  <h3 className="font-semibold">Progressive checks</h3>
                  <p className="mt-1 text-slate-700">
                    Light-touch checks for low-risk cases, deeper verification
                    where risk, amount, or regulation demands it.
                  </p>
                </div>
                <div className="p-4 rounded-2xl border bg-white">
                  <h3 className="font-semibold">Channel-aware flows</h3>
                  <p className="mt-1 text-slate-700">
                    Different flows for branch, call centre, field agents or
                    digital channels, while sharing the same central policies.
                  </p>
                </div>
                <div className="p-4 rounded-2xl border bg-white">
                  <h3 className="font-semibold">Clear decision outcomes</h3>
                  <p className="mt-1 text-slate-700">
                    Approve, decline, refer, or ask for more information—with
                    clear reason codes for both customers and internal teams.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* AUTOMATION & GOVERNANCE */}
        <Section className="pt-10 md:pt-14">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                Automate decisions without losing governance
              </h2>
              <p className="mt-3 text-slate-700">
                The decision engine doesn&apos;t replace governance—it enforces
                it. Every automated decision follows your approved policies and
                leaves a complete audit trail.
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <ListItem>Policy rules and limits managed centrally.</ListItem>
                <ListItem>Scorecard versions and cut-offs are tracked over time.</ListItem>
                <ListItem>Every decision has a timestamp, reason codes, and inputs.</ListItem>
                <ListItem>Refer paths ensure humans stay in the loop where needed.</ListItem>
              </ul>
            </div>
            <div className="md:col-span-6">
              <div className="rounded-3xl border bg-white p-5 shadow-sm text-sm">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5" />
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      For executives & boards
                    </div>
                    <div className="font-semibold">
                      Explainable, audit-ready originations decisions
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-slate-700">
                  When regulators, auditors, or customer champions ask
                  &quot;Why did we approve this customer?&quot; you can answer
                  with clear, structured evidence—not anecdote or guesswork.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* CHAMPION/CHALLENGER & EXPERIMENTS */}
        <Section className="pt-10 md:pt-14">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                Champion–Challenger for safer growth experiments
              </h2>
              <p className="mt-3 text-slate-700">
                Growth ideas no longer need to be &quot;all or nothing&quot;.
                Use Champion–Challenger testing to try new policies, cut-offs,
                or offers on a controlled slice of traffic and let results guide
                your next move.
              </p>
            </div>
            <div className="md:col-span-6">
              <div className="rounded-3xl border bg-white p-5 shadow-sm text-sm">
                <div className="flex items-center gap-3">
                  <LineChart className="h-5 w-5" />
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Practical examples
                    </div>
                    <div className="font-semibold">
                      From PowerPoint idea to proven strategy
                    </div>
                  </div>
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  <ListItem>Test higher limits for low-risk existing customers.</ListItem>
                  <ListItem>Compare stricter affordability checks on high-risk channels.</ListItem>
                  <ListItem>Try alternative offers (for example, smaller amounts or shorter terms).</ListItem>
                  <ListItem>Evaluate new bureau data sources or scorecards before full rollout.</ListItem>
                </ul>
                <p className="mt-2 text-slate-700">
                  The winning strategy becomes the new standard. The process
                  repeats, giving you a structured way to innovate.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* RESULTS + WHO FOR */}
        <Section className="pt-10 md:pt-14">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                What results can you expect?
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                <ListItem>Higher approval rates for good-risk customers.</ListItem>
                <ListItem>Reduced manual workload and faster onboarding times.</ListItem>
                <ListItem>Fewer early-stage arrears and first-payment defaults.</ListItem>
                <ListItem>More consistent decisions across channels and teams.</ListItem>
                <ListItem>Clearer evidence for regulators, auditors, and boards.</ListItem>
              </ul>
            </div>
            <div className="md:col-span-6">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                Who is this for?
              </h2>
              <p className="mt-3 text-slate-700">
                Our originations and onboarding framework is designed for:
              </p>
              <ul className="mt-2 space-y-2 text-sm">
                <ListItem>Banks, micro-lenders, and retail credit providers.</ListItem>
                <ListItem>Fintech and subscription businesses with recurring billing.</ListItem>
                <ListItem>Telcos, insurers, and utilities with KYC requirements.</ListItem>
                <ListItem>
                  Organisations planning to modernise or rebuild their onboarding
                  stack.
                </ListItem>
              </ul>
              <p className="mt-3 text-sm text-slate-600">
                We can integrate with your existing systems, deploy in your
                cloud, or work via bureau partners—depending on your IT and data
                strategy.
              </p>
            </div>
          </div>
        </Section>

        {/* RELATED INSIGHTS */}
        <Section className="pt-10 md:pt-14">
          <div className="rounded-3xl border bg-slate-50 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Want to explore the technical side?
                </h2>
                <p className="mt-1 text-sm text-slate-700 max-w-xl">
                  Our Insights section includes white papers and briefings on
                  decision engines, scorecards, ML vs traditional models, and
                  building &quot;originations-ready&quot; data pipelines.
                </p>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <Link
                  to="/insights"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-slate-100"
                >
                  Browse insights on originations &amp; decisioning
                </Link>
              </div>
            </div>
          </div>
        </Section>

        {/* CONTACT / CTA */}
        <Section id="contact" className="pt-10 md:pt-16">
          <div className="rounded-3xl border bg-white p-6 md:p-8 shadow-sm">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Let&apos;s talk about your originations and onboarding
                </h2>
                <p className="mt-3 text-slate-700 max-w-2xl">
                  Whether you are refreshing scorecards, rebuilding onboarding
                  journeys, or planning a decision engine rollout, we can start
                  with a focused, practical review of your current flow and
                  target metrics.
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  The outcome is a short, board-friendly view of where to use
                  automation, where humans should stay in the loop, and how to
                  phase the work.
                </p>
              </div>
              <div className="md:col-span-5">
                <div className="rounded-2xl border bg-slate-50 p-5 text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-semibold">
                      Suggested next step for executives
                    </span>
                  </div>
                  <p className="mt-2 text-slate-700">
                    Share a brief outline of your current originations process
                    and main pain points (for example, high FPD, slow decisions,
                    or manual checks). We&apos;ll respond with a written view of
                    how a decision engine and scorecards could help.
                  </p>
                  <a
                    href="mailto:contact@tsdg.co.za?subject=Originations%20and%20onboarding%20optimisation%20enquiry"
                    className="mt-4 inline-flex w-full justify-center items-center gap-2 px-4 py-2.5 rounded-xl border bg-white hover:bg-slate-100 font-medium"
                  >
                    Email contact@tsdg.co.za
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
