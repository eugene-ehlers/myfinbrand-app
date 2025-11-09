// src/pages/Landing.jsx
import React from "react";
import { ArrowRight, CheckCircle2, LineChart, Shield, Layers, Bot, Gauge, Building2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Section = ({ id, className = "", children }) => (
  <section id={id} className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</section>
);

const Pillar = ({ icon: Icon, title, text }) => (
  <div className="p-6 rounded-2xl border bg-white/70 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
      <div className="p-2 rounded-xl bg-sky-50 border border-sky-100">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-slate-600 mt-1 leading-relaxed">{text}</p>
      </div>
    </div>
  </div>
);

const Stat = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-bold tracking-tight">{value}</div>
    <div className="text-slate-600 mt-1">{label}</div>
  </div>
);

const ListItem = ({ children }) => (
  <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5" /><span className="text-slate-700 leading-relaxed">{children}</span></li>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900">
      {/* HERO */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_top,white,transparent_70%)]">
          <div className="absolute -top-40 -right-40 h-[36rem] w-[36rem] rounded-full bg-sky-100 blur-3xl opacity-60" />
          <div className="absolute -bottom-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-indigo-100 blur-3xl opacity-60" />
        </div>
        <Section className="pt-20 md:pt-28 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-12 gap-10 items-center"
          >
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-white shadow-sm text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Decision intelligence for modern enterprises</span>
              </div>
              <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                Empowering Businesses with Intelligent, Data-Driven Decisions
              </h1>
              <p className="mt-4 text-lg text-slate-700 leading-relaxed max-w-2xl">
                We help organisations across industries turn data into a strategic asset—using advanced analytics and decision automation to drive growth, reduce risk, and achieve operational excellence.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#capabilities"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[rgb(var(--primary))] text-[rgb(var(--primary-fg))] hover:brightness-95 shadow"
                >
                  Explore how we help you grow <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border bg-white hover:bg-slate-50"
                >
                  Request a consultation
                </a>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-6">
                <Stat value="2.5×–4×" label="Typical ROI uplift" />
                <Stat value="3–4 min" label="Automated decision cycles" />
                <Stat value="90+ days" label="Value in weeks, not years" />
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative">
                <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-sky-100 via-indigo-100 to-white rounded-3xl blur-2xl" />
                <div className="rounded-3xl border bg-white shadow-sm p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border bg-slate-50">
                      <LineChart className="h-6 w-6" />
                      <p className="mt-2 font-medium">Predictive Analytics</p>
                      <p className="text-sm text-slate-600">Forecast, segment, and price with confidence.</p>
                    </div>
                    <div className="p-4 rounded-2xl border bg-slate-50">
                      <Bot className="h-6 w-6" />
                      <p className="mt-2 font-medium">Decision Automation</p>
                      <p className="text-sm text-slate-600">Fast, governed, audit-ready decisions.</p>
                    </div>
                    <div className="p-4 rounded-2xl border bg-slate-50">
                      <Layers className="h-6 w-6" />
                      <p className="mt-2 font-medium">Data Integration</p>
                      <p className="text-sm text-slate-600">Unify silos into a single source of truth.</p>
                    </div>
                    <div className="p-4 rounded-2xl border bg-slate-50">
                      <Shield className="h-6 w-6" />
                      <p className="mt-2 font-medium">Governance & Risk</p>
                      <p className="text-sm text-slate-600">Policies, monitoring, and compliance baked-in.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Section>
      </header>

      {/* TRUST / INDUSTRIES */}
      <Section className="py-10 md:py-14">
        <div className="grid items-center gap-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="text-xl font-semibold">Built for leaders across industries</h2>
            <p className="mt-2 text-slate-600">We partner with executives in finance, retail, logistics, telecoms, insurance, and the public sector to turn data into competitive advantage.</p>
          </div>
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {["Finance", "Retail", "Logistics", "Telecoms", "Insurance", "Healthcare", "Public Sector", "Technology"].map((i) => (
              <div key={i} className="px-4 py-3 rounded-xl border bg-white text-center text-sm font-medium">{i}</div>
            ))}
          </div>
        </div>
      </Section>

      {/* CAPABILITIES */}
      <Section id="capabilities" className="py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">What We Do</h2>
          <p className="mt-3 text-slate-700">From strategy to production: analytics, decision engines, and managed platforms that deliver measurable value within months.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Pillar icon={Layers} title="Analytics & Data Integration" text="Design governed data platforms and unify operational silos into a single source of truth." />
          <Pillar icon={LineChart} title="Predictive & Prescriptive Models" text="Score risk, forecast demand, optimise pricing, and prioritise actions that move the needle." />
          <Pillar icon={Bot} title="Decision-Engine Automation" text="Automate approvals, pricing, routing, and policies—fast, consistent, and audit-ready." />
          <Pillar icon={Shield} title="Governance & Compliance" text="Model monitoring, MRM, and policy controls embedded into every workflow." />
        </div>
      </Section>

      {/* OUTCOMES / ROI */}
      <Section className="py-12 md:py-16">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-6">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Outcomes Executives Care About</h2>
            <ul className="mt-6 space-y-3">
              <ListItem>Decision cycles reduced from minutes to seconds without compromising governance.</ListItem>
              <ListItem>Fraud and bad-debt losses reduced with consistent, explainable models.</ListItem>
              <ListItem>Conversion improved through personalised offers and intelligent routing.</ListItem>
              <ListItem>Predictable operating cost via managed platforms and automation.</ListItem>
            </ul>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border">
                <div className="text-sm text-slate-600">Typical monthly return</div>
                <div className="text-2xl font-semibold mt-1">2.5×–4×</div>
              </div>
              <div className="p-5 rounded-2xl border">
                <div className="text-sm text-slate-600">Automated decision cycle</div>
                <div className="text-2xl font-semibold mt-1">3–4 minutes → seconds</div>
              </div>
            </div>
          </div>
          <div className="md:col-span-6">
            <div className="rounded-3xl border bg-white shadow-sm p-6">
              <h3 className="text-lg font-semibold">From Manual to Data-Driven</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-600">
                      <th className="py-2 pr-4">Before</th>
                      <th className="py-2 pr-4">After</th>
                      <th className="py-2">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    <tr className="border-t">
                      <td className="py-3 pr-4">Manual reviews & siloed data</td>
                      <td className="py-3 pr-4">Automated, model-driven decisions</td>
                      <td className="py-3">Speed & consistency</td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-3 pr-4">Flat rules, limited insight</td>
                      <td className="py-3 pr-4">Predictive & prescriptive analytics</td>
                      <td className="py-3">Higher approvals / lower risk</td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-3 pr-4">Ad-hoc governance</td>
                      <td className="py-3 pr-4">Audit trails & model monitoring</td>
                      <td className="py-3">Regulatory confidence</td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-3 pr-4">Unpredictable operating costs</td>
                      <td className="py-3 pr-4">Managed platforms & SLAs</td>
                      <td className="py-3">Lower TCO</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* APPROACH */}
      <Section className="py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Our Approach</h2>
          <p className="mt-3 text-slate-700">A pragmatic roadmap that meets you where you are and compounds value over time.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-4 gap-5">
          {[{t:"Foundation",d:"Data audit, architecture, governance, unified reporting."},{t:"Enablement",d:"Predictive models, decision engine, integrations."},{t:"Optimisation",d:"Dynamic pricing, personalisation, automation at scale."},{t:"Scale",d:"Multi-country roll-out, continuous improvement."}].map((s, i) => (
            <div key={i} className="p-6 rounded-2xl border bg-white/70">
              <div className="text-sm font-medium text-slate-600">Phase {i+1}</div>
              <div className="mt-1 text-lg font-semibold">{s.t}</div>
              <p className="mt-2 text-slate-600 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CONTACT / CTA */}
      <Section id="contact" className="py-14 md:py-20">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Ready to modernise your decisions?</h2>
            <p className="mt-3 text-slate-700 max-w-2xl">Let’s discuss where analytics and automation can create measurable advantage in your organisation. We’ll start with a short assessment and a practical plan.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:info@tsdg.co.za"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[rgb(var(--primary))] text-[rgb(var(--primary-fg))] hover:brightness-95 shadow"
              >
                Email us <ArrowRight className="h-5 w-5" />
              </a>
              <a href="#" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border bg-white hover:bg-slate-50">
                Download company profile
              </a>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Gauge className="h-6 w-6" />
                <div>
                  <div className="font-semibold">Executive Quick Check</div>
                  <div className="text-slate-600 text-sm">5 questions → readiness snapshot</div>
                </div>
              </div>
              <form className="mt-4 grid gap-3">
                <input className="px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-300" placeholder="Your name" />
                <input className="px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-300" placeholder="Company" />
                <input type="email" className="px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-300" placeholder="Email" />
                <button
                  type="button"
                  className="mt-1 inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-[rgb(var(--primary))] text-[rgb(var(--primary-fg))] hover:brightness-95"
                >
                  Get my readiness snapshot <ArrowRight className="h-5 w-5" />
                </button>
                <p className="text-xs text-slate-500">By submitting, you agree to our privacy notice.</p>
              </form>
            </div>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <Section className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <span className="font-semibold">The Smart Decision Group</span>
          </div>
          <div className="text-sm text-slate-600">© {new Date().getFullYear()} TSDG • All rights reserved</div>
          <div className="text-sm">
            <a href="#" className="hover:underline">Privacy</a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:underline">Terms</a>
          </div>
        </Section>
      </footer>
    </div>
  );
}
