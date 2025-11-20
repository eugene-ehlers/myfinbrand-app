// src/pages/solutions/Collections.jsx
import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, LineChart, Bot, Sparkles } from "lucide-react";
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

export default function Collections() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="Collections Optimisation | The Smart Decision Group"
        description="Improve recoveries, reduce cost-to-collect, and remove guesswork from your collections strategies with decision engines and ML-driven segmentation."
        canonical="https://www.tsdg.co.za/solutions/collections"
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
                  <span>Collections optimisation for lenders & debt collectors</span>
                </div>
                <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                  Improve recoveries. Reduce cost. Remove guesswork.
                </h1>
                <p className="mt-4 text-lg leading-relaxed max-w-2xl opacity-90">
                  We help micro-lenders, credit providers, and collections teams
                  move from manual, agent-driven strategies to
                  data-driven, automated collections built on decision engines
                  and ML scorecards.
                </p>
                <p className="mt-3 text-sm max-w-2xl opacity-80">
                  Designed for executives who need measurable uplift in
                  recoveries and cost-to-collect—without having to become
                  technical experts.
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
                    See how the framework works
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium"
                    style={{
                      background: "rgba(15,23,42,0.12)",
                      borderColor: "rgba(148,163,184,0.6)",
                    }}
                  >
                    Talk about your collections book
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
                        Typical recovery uplift
                      </div>
                      <div className="mt-1 text-xl font-semibold">10–30%</div>
                    </div>
                    <div className="rounded-2xl border p-3">
                      <div className="text-xs text-slate-500">
                        Cost-to-collect reduction
                      </div>
                      <div className="mt-1 text-xl font-semibold">20–40%</div>
                    </div>
                    <div className="rounded-2xl border p-3">
                      <div className="text-xs text-slate-500">
                        Time to first results
                      </div>
                      <div className="mt-1 text-xl font-semibold">≈ 60 days</div>
                    </div>
                    <div className="rounded-2xl border p-3">
                      <div className="text-xs text-slate-500">
                        Works with
                      </div>
                      <div className="mt-1 text-sm font-medium">
                        In-house or outsourced collections
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-3 text-xs text-slate-600">
                    <LineChart className="h-4 w-4 mt-0.5" />
                    <p>
                      We start with a focused portfolio (for example, first-payment
                      defaulters) and expand as results are proven.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </header>

      <main className="pb-16">
        {/* WHY COLLECTIONS FAIL */}
        <Section className="pt-10 md:pt-14">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Why modern collections underperform
              </h2>
              <p className="mt-3 text-slate-700">
                Most collections operations still depend on manual work, agent
                intuition, and one-size-fits-all strategies. That creates
                inconsistency, higher costs, and unnecessary friction for
                customers and agents.
              </p>
            </div>
            <div className="md:col-span-6">
              <ul className="space-y-2 text-sm">
                <ListItem>All customers are treated the same, regardless of behaviour.</ListItem>
                <ListItem>Agents decide who to call, when, and how hard to push.</ListItem>
                <ListItem>First-payment defaulters are not managed as a distinct, high-risk segment.</ListItem>
                <ListItem>Settlement and restructuring decisions vary by agent and mood.</ListItem>
                <ListItem>No controlled way to test strategies and prove what actually works.</ListItem>
              </ul>
              <p className="mt-3 text-sm text-slate-600">
                Our framework replaces this with a governed, test-and-learn
                system that consistently chooses the next best action for each
                customer.
              </p>
            </div>
          </div>
        </Section>

        {/* APPROACH OVERVIEW */}
        <Section id="approach" className="pt-10 md:pt-14">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center">
            A scientific framework for collections optimisation
          </h2>
          <p className="mt-3 max-w-3xl mx-auto text-center text-slate-700">
            We combine advanced segmentation, behavioural insight, decision
            engines, and scorecards into a single framework that improves
            recoveries while reducing cost-to-collect.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl border bg-white">
              <h3 className="text-lg font-semibold">1. Segment intelligently</h3>
              <p className="mt-2 text-sm text-slate-700">
                Separate customers by risk, behaviour, and intent to pay. In
                South Africa, we pay particular attention to first-payment
                defaulters (FPD), where early intervention has the biggest
                impact.
              </p>
            </div>
            <div className="p-6 rounded-2xl border bg-white">
              <h3 className="text-lg font-semibold">2. Automate workflows</h3>
              <p className="mt-2 text-sm text-slate-700">
                Use a decision engine to decide the right channel, timing,
                offer, and escalation path for each segment—while keeping full
                control over policy and compliance.
              </p>
            </div>
            <div className="p-6 rounded-2xl border bg-white">
              <h3 className="text-lg font-semibold">3. Prove what works</h3>
              <p className="mt-2 text-sm text-slate-700">
                Champion–Challenger testing is built in. Instead of guessing,
                you see which strategy actually performs better, and promote the
                winner.
              </p>
            </div>
          </div>
        </Section>

        {/* FIRST PAYMENT DEFAULT */}
        <Section className="pt-10 md:pt-14">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                First-Payment Default: the most important warning signal
              </h2>
              <p className="mt-3 text-slate-700">
                In the South African micro-lending market, the first scheduled
                payment is crucial. Customers who miss it are several times more
                likely to become long-term non-payers.
              </p>
              <p className="mt-2 text-slate-700">
                We treat first-payment defaulters as a dedicated segment, not
                just &quot;early-stage arrears&quot;.
              </p>
            </div>
            <div className="md:col-span-6">
              <ul className="space-y-2 text-sm">
                <ListItem>Separate technical FPD (wrong date, bank issues) from true risk.</ListItem>
                <ListItem>Trigger immediate, tailored workflows to rescue viable customers.</ListItem>
                <ListItem>Identify affordability problems and potential reckless-lending risk early.</ListItem>
                <ListItem>Feed insights back into originations to avoid repeating the same patterns.</ListItem>
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Result: fewer loans rolling into late-stage collections and a
                cleaner, more profitable book.
              </p>
            </div>
          </div>
        </Section>

        {/* BEHAVIOURAL / PSYCHOLOGICAL SEGMENTATION */}
        <Section className="pt-10 md:pt-14">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                Behaviour-aware strategies: different customers, different
                treatment
              </h2>
              <p className="mt-3 text-slate-700">
                Not every customer responds to the same tone or channel. We add
                a behavioural layer on top of risk segmentation to reflect
                differences in intent, organisation, and emotional response to
                debt.
              </p>
            </div>
            <div className="md:col-span-7">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-2xl border bg-white">
                  <h3 className="font-semibold">The Willing Payer</h3>
                  <p className="mt-1 text-slate-700">
                    Wants to pay, may have timing or admin issues. Responds to
                    friendly reminders and clear options.
                  </p>
                </div>
                <div className="p-4 rounded-2xl border bg-white">
                  <h3 className="font-semibold">The Chaotic Payer</h3>
                  <p className="mt-1 text-slate-700">
                    Disorganised but not malicious. Needs structure, nudges, and
                    simple next steps.
                  </p>
                </div>
                <div className="p-4 rounded-2xl border bg-white">
                  <h3 className="font-semibold">The Anxious Avoider</h3>
                  <p className="mt-1 text-slate-700">
                    Avoids calls and conflict. More responsive to low-pressure
                    digital channels and reassurance.
                  </p>
                </div>
                <div className="p-4 rounded-2xl border bg-white">
                  <h3 className="font-semibold">The Strategic Non-Payer</h3>
                  <p className="mt-1 text-slate-700">
                    Pays only when pressure is applied. Needs firm consequences
                    and faster escalation.
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Your decision engine uses these segments to route customers to
                the right workflows, agents, and offers.
              </p>
            </div>
          </div>
        </Section>

        {/* AUTOMATION + WORKFLOWS */}
        <Section className="pt-10 md:pt-14">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                Automated workflows: right action, right time, lower cost
              </h2>
              <p className="mt-3 text-slate-700">
                Once segments are defined, the decision engine orchestrates the
                next best action for each customer—across channels and teams.
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <ListItem>Choose the cheapest effective channel (WhatsApp, SMS, email, call).</ListItem>
                <ListItem>Assign to an agent or keep in digital self-service.</ListItem>
                <ListItem>Control tone and frequency based on behaviour.</ListItem>
                <ListItem>Escalate to legal only when thresholds are met.</ListItem>
              </ul>
            </div>
            <div className="md:col-span-6">
              <div className="rounded-3xl border bg-white p-5 shadow-sm text-sm">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5" />
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      For executives
                    </div>
                    <div className="font-semibold">
                      Automation with governance, not a black box
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-slate-700">
                  You stay in control of who may receive which offers, which
                  customers should never be pressured aggressively, and where
                  compliance limits sit. The engine makes fast, consistent
                  decisions within the boundaries you approve.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* SETTLEMENT & RESTRUCTURING */}
        <Section className="pt-10 md:pt-14">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
            Settlement and restructuring decisions that protect value
          </h2>
          <p className="mt-3 text-slate-700 max-w-3xl">
            Every settlement or restructuring decision has a direct impact on
            your P&amp;L. We help you offer the right terms to the right
            customers—preserving good relationships while maximising recovery
            from risky accounts.
          </p>
          <div className="mt-6 grid md:grid-cols-3 gap-5 text-sm">
            <div className="p-5 rounded-2xl border bg-white">
              <h3 className="font-semibold">Protect good customers</h3>
              <p className="mt-2 text-slate-700">
                Offer early settlement, short-term relief, or restructured plans
                to customers with strong long-term value, without teaching them
                to default.
              </p>
            </div>
            <div className="p-5 rounded-2xl border bg-white">
              <h3 className="font-semibold">Optimise risky cases</h3>
              <p className="mt-2 text-slate-700">
                For low-probability payers, favour settlements that maximise
                cash today and reduce wasted effort—within clear policy limits.
              </p>
            </div>
            <div className="p-5 rounded-2xl border bg-white">
              <h3 className="font-semibold">Ensure consistency & compliance</h3>
              <p className="mt-2 text-slate-700">
                Prevent over-discounting and policy breaches by constraining
                agents to approved options, with full audit trails and reason
                codes.
              </p>
            </div>
          </div>
        </Section>

        {/* CAMPAIGNS + CHAMPION/CHALLENGER */}
        <Section className="pt-10 md:pt-14">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                Campaign management: a collections &quot;flight deck&quot;
              </h2>
              <p className="mt-3 text-slate-700">
                We structure collections as a series of targeted campaigns—for
                example FPD rescue, payday alignment, settlement drives, or
                re-engagement of dormant accounts.
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <ListItem>Define clear entry and exit rules for each campaign.</ListItem>
                <ListItem>Automate timing, channels, and escalation logic.</ListItem>
                <ListItem>Measure performance in a way executives can read in minutes.</ListItem>
              </ul>
            </div>
            <div className="md:col-span-6">
              <div className="rounded-3xl border bg-white p-5 shadow-sm text-sm">
                <div className="flex items-center gap-3">
                  <LineChart className="h-5 w-5" />
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Champion–Challenger
                    </div>
                    <div className="font-semibold">
                      Stop debating strategies—let the data decide
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-slate-700">
                  For any given segment, we can run two strategies in parallel:
                  a Champion (current approach) and a Challenger (new idea). After
                  an agreed period, we promote the winner based on clear metrics.
                </p>
                <p className="mt-2 text-slate-700">
                  This turns collections improvement into a repeatable, low-risk
                  process instead of a once-off project.
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
                <ListItem>10–30% uplift in recoveries on targeted portfolios.</ListItem>
                <ListItem>20–40% reduction in cost-to-collect, especially where manual calling dominates.</ListItem>
                <ListItem>Lower roll-rates from early to late buckets.</ListItem>
                <ListItem>Higher settlement acceptance with more controlled discounting.</ListItem>
                <ListItem>Better agent productivity and morale through clearer focus.</ListItem>
                <ListItem>Fewer surprises for Exco: transparent dashboards and audit-ready reports.</ListItem>
              </ul>
            </div>
            <div className="md:col-span-6">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                Who is this for?
              </h2>
              <p className="mt-3 text-slate-700">
                Our collections framework is designed for:
              </p>
              <ul className="mt-2 space-y-2 text-sm">
                <ListItem>Micro-lenders and short-term credit providers.</ListItem>
                <ListItem>Retailers with in-house credit books.</ListItem>
                <ListItem>Banks and fintech lenders.</ListItem>
                <ListItem>External debt collectors managing placements.</ListItem>
                <ListItem>Organisations that currently rely on spreadsheets and manual call lists.</ListItem>
              </ul>
              <p className="mt-3 text-sm text-slate-600">
                We can deploy the decisioning in your environment, in our
                managed cloud, or via bureau partners—depending on your scale
                and IT strategy.
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
                  Want to go a level deeper?
                </h2>
                <p className="mt-1 text-sm text-slate-700 max-w-xl">
                  We&apos;re building a set of executive briefings and technical
                  notes on collections segmentation, decision engines, and
                  scorecards. These live in our Insights section.
                </p>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <Link
                  to="/insights"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-slate-100"
                >
                  Browse insights on decisioning &amp; collections
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
                  Let&apos;s talk about your collections book
                </h2>
                <p className="mt-3 text-slate-700 max-w-2xl">
                  Whether you run a micro-lending portfolio, a retail credit
                  book, or an outsourced collections panel, we can start with a
                  focused diagnostic on your existing strategies and data—and
                  design a practical roadmap from there.
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  No buzzwords, no black boxes: just a clear view of where
                  segmentation, automation, and Champion–Challenger testing can
                  move the needle.
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
                    Share a brief description of your collections setup and
                    target portfolio (for example, first-payment defaulters or
                    M1–M3 arrears). We&apos;ll respond with a short, written
                    view of where this framework could apply.
                  </p>
                  <a
                    href="mailto:contact@tsdg.co.za?subject=Collections%20optimisation%20enquiry"
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
