// src/pages/Landing.jsx
import React, { useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  LineChart,
  Shield,
  Layers,
  Bot,
  Gauge,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

const Section = ({ id, className = "", children }) => (
  <section
    id={id}
    className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
  >
    {children}
  </section>
);

const Pillar = ({ icon: Icon, title, text }) => (
  <div className="p-6 rounded-2xl border bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
      <div
        className="p-2 rounded-xl"
        style={{
          background: "rgba(43,212,224,0.08)",
          border: "1px solid rgba(43,212,224,0.18)",
        }}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-slate-700 mt-1 leading-relaxed">{text}</p>
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
  <li className="flex items-start gap-3">
    <CheckCircle2 className="mt-0.5 h-5 w-5" />
    <span className="text-slate-700 leading-relaxed">{children}</span>
  </li>
);

export default function Landing() {
  // ---- Formspree wiring ----
  const FORMSPREE_ID = "xwpakerq";
  const endpoint = `https://formspree.io/f/${FORMSPREE_ID}`;

  const formRef = useRef(null);
  const [status, setStatus] = useState({ state: "idle", msg: "" }); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus({ state: "loading", msg: "" });

    try {
      const formData = new FormData(formRef.current);
      formData.append(
        "_subject",
        `TSDG enquiry from ${formData.get("name") || "Website"}`
      );

      // honeypot
      if (formData.get("company_website")) {
        setStatus({
          state: "success",
          msg: "Thanks! If you’re human, we got your note 😊",
        });
        formRef.current.reset();
        return;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (res.ok) {
        setStatus({
          state: "success",
          msg: "Thanks! We’ll be in touch shortly.",
        });
        formRef.current.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        const errText =
          (data &&
            data.errors &&
            data.errors.map((x) => x.message).join(", ")) ||
          "Submission failed. Please try again or email eugeneehl@outlook.com.";
        setStatus({ state: "error", msg: errText });
      }
    } catch (err) {
      setStatus({
        state: "error",
        msg: "Network error. Please try again or email eugeneehl@outlook.com.",
      });
    }
  };

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <SiteHeader />

      {/* HERO with navy→teal contrast glow */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-40 -right-40 h-[36rem] w-[36rem] rounded-full blur-3xl opacity-70"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(2,6,23,0.65) 0%, rgba(2,6,23,0.0) 70%)",
            }}
          />
          <div
            className="absolute -bottom-40 -left-40 h-[36rem] w-[36rem] rounded-full blur-3xl opacity-70"
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
              "linear-gradient(180deg, rgba(2,6,23,0.88) 0%, rgba(2,6,23,0.72) 40%, rgba(2,6,23,0.25) 100%)",
            color: "rgb(var(--cream))",
          }}
        >
          <Section className="pt-16 md:pt-20 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="grid md:grid-cols-12 gap-10 items-center"
            >
              <div className="md:col-span-7">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(43,212,224,0.12)",
                    border: "1px solid rgba(43,212,224,0.30)",
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Decision intelligence for modern enterprises</span>
                </div>
                <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                  Empowering Businesses with Intelligent, Data-Driven Decisions
                </h1>
                <p className="mt-4 text-lg leading-relaxed max-w-2xl opacity-90">
                  We help organisations across industries turn data into a
                  strategic asset—using advanced analytics and decision
                  automation to drive growth, reduce risk, and achieve
                  operational excellence.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#capabilities"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl shadow"
                    style={{
                      background: "rgb(var(--primary))",
                      color: "rgb(var(--primary-fg))",
                    }}
                  >
                    Explore how we help you grow{" "}
                    <ArrowRight className="h-5 w-5" />
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border"
                    style={{
                      background: "rgba(252,250,247,0.08)",
                      borderColor: "rgba(255,255,255,0.35)",
                      color: "rgb(var(--cream))",
                    }}
                  >
                    Request a consultation
                  </a>
                </div>
                <div className="mt-10 grid grid-cols-3 gap-6 text-[rgb(var(--cream))]">
                  <Stat value="2.5×–4×" label="Typical ROI uplift" />
                  <Stat value="3–4 min" label="Automated decision cycles" />
                  <Stat value="90+ days" label="Value in weeks, not years" />
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="relative">
                  <div className="rounded-3xl border bg-white/95 shadow-sm p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className="p-4 rounded-2xl border"
                        style={{ background: "rgb(var(--surface))" }}
                      >
                        <LineChart className="h-6 w-6" />
                        <p className="mt-2 font-medium">Predictive Analytics</p>
                        <p className="text-sm text-slate-600">
                          Forecast, segment, and price with confidence.
                        </p>
                      </div>
                      <div
                        className="p-4 rounded-2xl border"
                        style={{ background: "rgb(var(--surface))" }}
                      >
                        <Bot className="h-6 w-6" />
                        <p className="mt-2 font-medium">Decision Automation</p>
                        <p className="text-sm text-slate-600">
                          Fast, governed, audit-ready decisions.
                        </p>
                      </div>
                      <div
                        className="p-4 rounded-2xl border"
                        style={{ background: "rgb(var(--surface))" }}
                      >
                        <Layers className="h-6 w-6" />
                        <p className="mt-2 font-medium">Data Integration</p>
                        <p className="text-sm text-slate-600">
                          Unify silos into a single source of truth.
                        </p>
                      </div>
                      <div
                        className="p-4 rounded-2xl border"
                        style={{ background: "rgb(var(--surface))" }}
                      >
                        <Shield className="h-6 w-6" />
                        <p className="mt-2 font-medium">Governance & Risk</p>
                        <p className="text-sm text-slate-600">
                          Policies, monitoring, and compliance baked-in.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Section>
        </div>
      </header>

      {/* INDUSTRIES */}
      <Section className="py-10 md:py-14">
        <div className="grid items-center gap-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="text-xl font-semibold">
              Built for leaders across industries
            </h2>
            <p className="mt-2 text-slate-700">
              We partner with executives in finance, retail, logistics,
              telecoms, insurance, and the public sector to turn data into
              competitive advantage.
            </p>
          </div>
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              "Finance",
              "Retail",
              "Logistics",
              "Telecoms",
              "Insurance",
              "Healthcare",
              "Public Sector",
              "Technology",
            ].map((i) => (
              <div
                key={i}
                className="px-4 py-3 rounded-xl border bg-white text-center text-sm font-medium"
              >
                {i}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CAPABILITIES */}
      <Section id="capabilities" className="py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            What We Do
          </h2>
          <p className="mt-3 text-slate-700">
            From strategy to production: analytics, decision engines, and
            managed platforms that deliver measurable value within months.
          </p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Pillar
            icon={Layers}
            title="Analytics & Data Integration"
            text="Design governed data platforms and unify operational silos into a single source of truth."
          />
          <Pillar
            icon={LineChart}
            title="Predictive & Prescriptive Models"
            text="Score risk, forecast demand, optimise pricing, and prioritise actions that move the needle."
          />
          <Pillar
            icon={Bot}
            title="Decision-Engine Automation"
            text="Automate approvals, pricing, routing, and policies—fast, consistent, and audit-ready."
          />
          <Pillar
            icon={Shield}
            title="Governance & Compliance"
            text="Model monitoring, MRM, and policy controls embedded into every workflow."
          />
        </div>
      </Section>

      {/* OUTCOMES */}
      <Section className="py-12 md:py-16">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-6">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Outcomes Executives Care About
            </h2>
            <ul className="mt-6 space-y-3">
              <ListItem>
                Decision cycles reduced from minutes to seconds without
                compromising governance.
              </ListItem>
              <ListItem>
                Fraud and bad-debt losses reduced with consistent, explainable
                models.
              </ListItem>
              <ListItem>
                Conversion improved through personalised offers and intelligent
                routing.
              </ListItem>
              <ListItem>
                Predictable operating cost via managed platforms and automation.
              </ListItem>
            </ul>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border bg-white">
                <div className="text-sm text-slate-600">
                  Typical monthly return
                </div>
                <div className="text-2xl font-semibold mt-1">2.5×–4×</div>
              </div>
              <div className="p-5 rounded-2xl border bg-white">
                <div className="text-sm text-slate-600">
                  Automated decision cycle
                </div>
                <div className="text-2xl font-semibold mt-1">
                  3–4 minutes → seconds
                </div>
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
                      <td className="py-3 pr-4">
                        Predictive & prescriptive analytics
                      </td>
                      <td className="py-3">Higher approvals / lower risk</td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-3 pr-4">Ad-hoc governance</td>
                      <td className="py-3 pr-4">
                        Audit trails & model monitoring
                      </td>
                      <td className="py-3">Regulatory confidence</td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-3 pr-4">Unpredictable operating costs</td>
                      <td className="py-3 pr-4">
                        Managed platforms & SLAs
                      </td>
                      <td className="py-3">Lower TCO</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CONTACT / CTA */}
      <Section id="contact" className="py-14 md:py-20">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Ready to modernise your decisions?
            </h2>
            <p className="mt-3 text-slate-700 max-w-2xl">
              Let’s discuss where analytics and automation can create measurable
              advantage in your organisation. We’ll start with a short assessment
              and a practical plan.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:eugeneehl@outlook.com"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl shadow"
                style={{
                  background: "rgb(var(--primary))",
                  color: "rgb(var(--primary-fg))",
                }}
              >
                Email us <ArrowRight className="h-5 w-5" />
              </a>
              {/*<a
                href="/company-profile.pdf"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border bg-white hover:bg-slate-50"
              >
                Download company profile
              </a>*/}
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Gauge className="h-6 w-6" />
                <div>
                  <div className="font-semibold">Executive Quick Check</div>
                  <div className="text-slate-600 text-sm">
                    5 questions → readiness snapshot
                  </div>
                </div>
              </div>

              {/* Hidden honeypot */}
              <style>
                {`.hp-field{position:absolute;left:-5000px;height:0;overflow:hidden}`}
              </style>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="mt-4 grid gap-3"
                noValidate
              >
                <input
                  name="name"
                  required
                  className="px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-300"
                  placeholder="Your name"
                />
                <input
                  name="company"
                  className="px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-300"
                  placeholder="Company"
                />
                <input
                  name="email"
                  required
                  type="email"
                  className="px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-300"
                  placeholder="Email"
                />
                <input
                  className="hp-field"
                  tabIndex="-1"
                  autoComplete="off"
                  name="company_website"
                  placeholder="Company website"
                />

                <button
                  type="submit"
                  disabled={status.state === "loading"}
                  className="mt-1 inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl disabled:opacity-60"
                  style={{
                    background: "rgb(var(--primary))",
                    color: "rgb(var(--primary-fg))",
                  }}
                >
                  {status.state === "loading"
                    ? "Submitting..."
                    : "Get my readiness snapshot"}{" "}
                  <ArrowRight className="h-5 w-5" />
                </button>

                {status.state === "success" && (
                  <p className="text-sm text-green-700">✅ {status.msg}</p>
                )}
                {status.state === "error" && (
                  <p className="text-sm text-red-700">❌ {status.msg}</p>
                )}
                {status.state === "idle" && (
                  <p className="text-xs text-slate-500">
                    By submitting, you agree to our privacy notice.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
