// src/pages/articles/AgenticVsDecisionEngine.jsx
import React from "react";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

export default function AgenticVsDecisionEngine() {
  const pdfHref = "/docs/Agentic-vs-decisionengine-v1-Nov25.pdf";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="Agentic AI vs Decision Engines | The Smart Decision Group"
        description="Why agentic AI agents are powerful orchestrators, but still need a governed, deterministic decision engine at the core of regulated decisioning."
        canonical="https://www.tsdg.co.za/insights/agentic-vs-decision-engine"
        ogType="article"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-3xl px-4 py-10">
        <Link
          to="/insights"
          className="text-xs text-slate-500 hover:underline"
        >
          ← Back to Insights
        </Link>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Agentic AI vs Decision Engines: Why You Still Need a Governed Core
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          White Paper • For Executives, Risk, and Compliance Leaders
        </p>

        <p className="mt-4 text-slate-700 leading-relaxed">
          Agentic AI systems can break goals down into tasks, call tools, and
          orchestrate complex workflows. But when it comes to regulated,
          high-stakes decisions—credit approvals, pricing, fraud, KYC/AML,
          policy enforcement—they cannot replace a deterministic, governed
          decision engine.
        </p>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">
            What this paper helps you clarify
          </h2>
          <ul className="list-disc pl-5 text-slate-700 space-y-2 text-sm">
            <li>
              What agentic AI is good at: orchestration, interpretation,
              process automation.
            </li>
            <li>
              What decision engines are good at: repeatability, governance,
              auditability, and policy enforcement.
            </li>
            <li>
              Why stochastic, prompt-sensitive systems cannot be your system of
              record for regulated decisions.
            </li>
            <li>
              How agents can complement—not replace—your decision engine,
              especially for monitoring, analysis, and challenger design.
            </li>
            <li>
              Practical architecture patterns for being “agentic-ready” without
              becoming “agentic-dependent.”
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">
            Use this paper in leadership conversations
          </h2>
          <p className="text-slate-700 text-sm leading-relaxed">
            The paper is written for boards, executives, and risk/compliance
            stakeholders who are hearing a lot of hype about agentic AI and
            need a grounded view of what can safely be delegated to agents—vs.
            what must remain under tight governance in a decision engine.
          </p>
        </section>

        <section className="mt-10">
          <a
            href={pdfHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl shadow text-sm font-medium"
            style={{
              background: "rgb(var(--primary))",
              color: "rgb(var(--primary-fg))",
            }}
          >
            Download the white paper (PDF)
          </a>
          <p className="mt-2 text-xs text-slate-500">
            Ideal for sharing with IT, Risk, and Compliance to align on an
            “agentic-ready” architecture.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
