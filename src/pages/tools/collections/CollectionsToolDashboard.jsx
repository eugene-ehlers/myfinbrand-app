// src/pages/tools/CollectionsToolDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  Upload,
  Settings2,
  Gauge,
  BadgeCheck,
  Users,
  PhoneCall,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import SiteHeader from "../../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../../components/layout/SiteFooter.jsx";


const CARDS = [
  {
    title: "Collections Strategy",
    description:
      "Upload a portfolio and run the full collections decisioning flow (segmentation, scorecards, channel and treatment selection).",
    icon: Layers,
    to: "/tools/collections/strategy/upload",
    cta: "Run strategy",
  },
  {
    title: "Strategy Rules & Gates",
    description:
      "View and update the rules that drive segmentation, channels, treatments, and output streams.",
    icon: Settings2,
    to: "/tools/collections/strategy/rules",
    cta: "Edit rules",
  },
];

const SCORECARDS = [
  {
    key: "behaviour",
    title: "Behaviour Scorecard",
    description:
      "Calculate behaviour_score and behaviour_score_band from delinquency and repayment behaviour inputs.",
    icon: Gauge,
  },
  {
    key: "affordability",
    title: "Affordability Scorecard",
    description:
      "Calculate affordability_score and affordability_score_band using income/expense and obligation proxies.",
    icon: BadgeCheck,
  },
  {
    key: "ptp",
    title: "Propensity to Pay (PTP)",
    description: "Calculate ptp_score and ptp_band using payment and engagement signals.",
    icon: Users,
  },
  {
    key: "contactability",
    title: "Contactability Scorecard",
    description: "Calculate contactability_score and resolve preferred_channel using contact fields.",
    icon: PhoneCall,
  },
  {
    key: "vulnerability",
    title: "Vulnerability Scorecard",
    description: "Calculate vulnerable_flag and restricted_channels based on vulnerability indicators.",
    icon: ShieldAlert,
  },
];

function ToolCard({ title, description, icon: Icon, to, cta }) {
  return (
    <Link
      to={to}
      className="group rounded-3xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-2xl border bg-slate-50 flex items-center justify-center">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
        <div className="min-w-0">
          <div className="text-base font-semibold tracking-tight">{title}</div>
          <div className="mt-1 text-sm text-slate-600">{description}</div>
        </div>
      </div>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-700 group-hover:text-slate-900">
        <span>{cta}</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}

export default function CollectionsToolDashboard() {
  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <SiteHeader />

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
              <Upload className="h-6 w-6" />
              Collections – Tools
            </h1>
            <p className="text-sm text-slate-600 mt-2">
              Run the full Collections Strategy, or execute individual scorecards for clients
              that only require a specific scoring component. Each tool accepts a CSV/Excel
              upload and produces downloadable outputs.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-2xl border bg-white px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Pipeline ready (dev)
            </span>
          </div>
        </div>

        {/* Strategy cards */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-600" />
            <h2 className="text-sm font-semibold text-slate-800">
              Strategy execution
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CARDS.map((c) => (
              <ToolCard
                key={c.to}
                title={c.title}
                description={c.description}
                icon={c.icon}
                to={c.to}
                cta={c.cta}
              />
            ))}
          </div>
        </section>

        {/* Scorecards */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-slate-600" />
            <h2 className="text-sm font-semibold text-slate-800">
              Scorecards (run individually)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SCORECARDS.map((s) => (
              <ToolCard
                key={s.key}
                title={s.title}
                description={s.description}
                icon={s.icon}
                to={`/tools/collections/scorecards/${encodeURIComponent(
                  s.key
                )}/upload`}
                cta="Open scorecard"
              />
            ))}
          </div>

          <div className="rounded-2xl border bg-white p-4 text-xs text-slate-600">
            <div className="font-semibold text-slate-800">Notes</div>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                Scorecard tools require only the minimum fields for that scorecard; the
                upload page will show required columns and an example format.
              </li>
              <li>
                Strategy execution runs the end-to-end pipeline and can produce channel output
                files (SMS, Email, Dialler, Suppressed), depending on your backend wiring.
              </li>
              <li>
                All outputs are delivered as secure, pre-signed downloads on the relevant
                results page.
              </li>
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

