// src/pages/articles/DecisionEngines101.jsx
import React from "react";
import { Download } from "lucide-react";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

export default function DecisionEngines101() {
  const pdfUrl = "/docs/decision-engines-101.pdf";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="Decision Engines 101: Cross-Industry Guide to Automating Decisions"
        description="A practical white paper on decision engines: what they are, how they compare to manual and coded rules systems, and how to use them across lending, fraud, insurance, telecoms, retail, and the public sector."
        canonical="https://www.tsdg.co.za/insights/decision-engines-101"
        ogType="article"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-3xl px-4 py-10 pb-16">
        {/* Title + meta */}
        <header className="mb-8">
          <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
            White Paper • Decision Automation &amp; Use Cases
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Decision Engines 101: Cross-Industry Guide to Automating Decisions
          </h1>
          <p className="mt-3 text-slate-600">
            A practical introduction to decision engines: what they are, how
            they differ from manual decisions and hard-coded rules systems, and
            how to use them to automate approvals, pricing, routing, and
            personalisation across industries.
          </p>

          {/* Download CTA */}
          <div className="mt-5">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Download print-friendly PDF
            </a>
          </div>
        </header>

        {/* 1. What is a Decision Engine */}
        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">1. What is a Decision Engine?</h2>
          <p>
            A decision engine evaluates input data using{" "}
            <strong>business rules, scorecards, statistical models, or AI/ML</strong>{" "}
            to produce an outcome such as approve, decline, price, rank, or
            personalise. It is the governed “brain” that drives consistent,
            scalable decisions across products, channels, and business units. :contentReference[oaicite:1]{index=1}
          </p>
          <p className="text-slate-700">
            Key properties of a modern decision engine include:
          </p>
          <ul className="list-disc ml-5 space-y-1 text-slate-700">
            <li>Deterministic when required; probabilistic when beneficial.</li>
            <li>Transparent and auditable decisions with full evidence.</li>
            <li>
              Low-latency APIs for in-journey use and batch processing for
              analytics and operations.
            </li>
            <li>Versioning of logic, models, and configuration over time.</li>
          </ul>
        </section>

        {/* 2. Manual vs Coded Rules vs Decision Engine */}
        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">
            2. Manual Decisions vs Coded Rules vs Decision Engines
          </h2>
          <p>
            The white paper compares three approaches: manual decisions, hard-coded
            rules, and decision engines. :contentReference[oaicite:2]{index=2}
          </p>

          <h3 className="mt-2 font-semibold">Manual decisioning</h3>
          <ul className="list-disc ml-5 space-y-1 text-slate-700">
            <li>Humans review documents, policies, and customer data manually.</li>
            <li>Outcomes vary by agent, shift, and branch.</li>
            <li>Slow: minutes to days per decision.</li>
            <li>
              Weak auditability and higher error, bias, and fraud risk.
            </li>
          </ul>

          <h3 className="mt-3 font-semibold">Hard-coded rules systems</h3>
          <ul className="list-disc ml-5 space-y-1 text-slate-700">
            <li>Rules embedded directly into application code (Java, C#, Python).</li>
            <li>Faster and more consistent than manual processes.</li>
            <li>
              Changes depend on developers and release cycles → slow change. :contentReference[oaicite:3]{index=3}
            </li>
            <li>Limited visibility for business users; weak explainability.</li>
          </ul>

          <h3 className="mt-3 font-semibold">Decision engines</h3>
          <ul className="list-disc ml-5 space-y-1 text-slate-700">
            <li>
              Central platform for rules, scorecards, and AI models with{" "}
              <strong>business-editable logic</strong>.
            </li>
            <li>
              Full transparency, versioning, and automatic reason codes. :contentReference[oaicite:4]{index=4}
            </li>
            <li>
              Low-latency APIs and batch capabilities; easy integration with CRM,
              ERP, bureaus, fraud systems, and data sources.
            </li>
            <li>Support for experiments, A/B tests, and drift monitoring.</li>
          </ul>
        </section>

        {/* 3. Quantified improvements */}
        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">
            3. Quantified Example Improvements
          </h2>
          <p>
            The paper provides example metrics comparing manual, coded rules, and
            decision engines. :contentReference[oaicite:5]{index=5}
          </p>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm border border-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left">Metric</th>
                  <th className="px-3 py-2 text-left">Manual</th>
                  <th className="px-3 py-2 text-left">Coded Rules</th>
                  <th className="px-3 py-2 text-left">Decision Engine</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-3 py-2">Time-to-decision</td>
                  <td className="px-3 py-2">30 minutes – days</td>
                  <td className="px-3 py-2">2–10 seconds</td>
                  <td className="px-3 py-2">50–200 ms</td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2">
                    Consistency (variance for identical applicants)
                  </td>
                  <td className="px-3 py-2">±20–40%</td>
                  <td className="px-3 py-2">±5–10%</td>
                  <td className="px-3 py-2">&lt;1%</td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2">Change cycle duration</td>
                  <td className="px-3 py-2">Weeks – months</td>
                  <td className="px-3 py-2">2–6 weeks</td>
                  <td className="px-3 py-2">Minutes – hours</td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2">
                    Error / compliance exception rate
                  </td>
                  <td className="px-3 py-2">3–7%</td>
                  <td className="px-3 py-2">1–3%</td>
                  <td className="px-3 py-2">&lt;0.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Reference architecture */}
        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">4. Reference Architecture</h2>
          <p>
            A decision engine follows a layered architecture that separates
            decision logic from integration and data: :contentReference[oaicite:6]{index=6}
          </p>
          <ul className="list-disc ml-5 space-y-1 text-slate-700">
            <li>
              <strong>Input Layer</strong> — CRM, ERP, LMS, devices, bureaus,
              internal and external data sources.
            </li>
            <li>
              <strong>Rules &amp; Models</strong> — business rules, constraints,
              scorecards, ML models, optimisation.
            </li>
            <li>
              <strong>Decision Layer</strong> — combines evidence, calculates
              scores, assigns reason codes.
            </li>
            <li>
              <strong>Integration Layer</strong> — REST, GraphQL, events,
              pipelines into warehouses and downstream systems.
            </li>
            <li>
              <strong>Monitoring</strong> — drift, fairness, stability, latency,
              performance, and audit.
            </li>
          </ul>
        </section>

        {/* 5. Strategic benefits & use cases */}
        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">
            5. Strategic Benefits &amp; Real-World Applications
          </h2>
          <p>
            The paper highlights consistency, reduced time-to-decision, full
            auditability, and safer change cycles as key benefits of a modern
            decision engine. :contentReference[oaicite:7]{index=7}
          </p>
          <p className="text-slate-700">Example applications include:</p>
          <ul className="list-disc ml-5 space-y-1 text-slate-700">
            <li>Lending: origination, underwriting, and pricing.</li>
            <li>Fraud: KYC, sanctions, device risk, behavioural anomalies.</li>
            <li>Insurance: claims triage, adjudication, agent scoring.</li>
            <li>Telecoms: churn prevention, retention offers, fair-use controls.</li>
            <li>Retail: promotions, personalisation, recommender systems.</li>
            <li>
              Public sector: grants, tenders, permits, and benefits eligibility.
            </li>
          </ul>
        </section>

        {/* 6. Integrations, data & orchestration */}
        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">
            6. Integrations, Data, and Orchestration
          </h2>
          <p>
            The white paper covers common integrations (CRM, ERP, LMS, front-end
            systems, and data providers), data exchange patterns, and anti-fraud
            and tender-vetting examples, particularly in the South African
            context. :contentReference[oaicite:8]{index=8}
          </p>
          <p>
            It also outlines good feature-engineering practices and how to blend
            guardrail rules, scorecards, and pricing models into a single
            orchestrated decision.
          </p>
        </section>

        {/* 7. Implementation playbook */}
        <section className="space-y-3 mb-10">
          <h2 className="text-xl font-semibold">7. Implementation Playbook</h2>
          <p>
            Finally, the paper provides a concise playbook for implementing a
            decision engine: :contentReference[oaicite:9]{index=9}
          </p>
          <ol className="list-decimal ml-5 space-y-1 text-slate-700">
            <li>Define outcomes, constraints, KPIs, and reason codes.</li>
            <li>Map data sources and agree integration contracts.</li>
            <li>Build v1 rules and baseline models; implement CI/CD.</li>
            <li>Run pilots with A/B experiments and measure performance.</li>
            <li>Iterate using monitored insights and structured change requests.</li>
          </ol>
        </section>

        {/* Contact */}
        <aside className="border-t pt-6 text-sm text-slate-600">
          <p className="font-semibold">Contact</p>
          <p>The Smart Decision Group (TSDG)</p>
          <p>
            Email:{" "}
            <a href="mailto:eugeneehl@outlook.com" className="underline">
              eugeneehl@outlook.com
            </a>
          </p>
          <p>
            Web:{" "}
            <a href="https://www.tsdg.co.za" className="underline">
              www.tsdg.co.za
            </a>
          </p>
        </aside>
      </main>

      <SiteFooter />
    </div>
  );
}
