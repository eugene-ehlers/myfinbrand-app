// src/pages/articles/AIDrivenBusinessAdvantage.jsx
import React from "react";
import { Download } from "lucide-react";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

export default function AIDrivenBusinessAdvantage() {
  const pdfUrl = "/docs/from-buzzword-to-bottom-line.pdf";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="From Buzzword to Bottom Line: AI-Driven Business Advantage"
        description="A practical, executive-level framework to align AI initiatives with strategy and ROI, and prioritise high-impact opportunities."
        canonical="https://www.tsdg.co.za/insights/ai-driven-business-advantage"
        ogType="article"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-3xl px-4 py-10 pb-16">
        {/* Title + meta */}
        <header className="mb-8">
          <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
            White Paper • Strategy &amp; Transformation
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            From Buzzword to Bottom Line: AI-Driven Business Advantage
          </h1>
          <p className="mt-3 text-slate-600">
            AI is everywhere in the boardroom conversation—but not always in
            the P&amp;L. This white paper provides a practical framework for
            executives to connect AI investments directly to strategic
            objectives and measurable ROI.
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

        {/* You can keep this as a concise web version of the white paper */}
        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">Executive Summary</h2>
          <p>
            Many organisations are experimenting with AI, but relatively few
            achieve durable, measurable value. The gap is rarely about tools
            or models; it is about strategy. AI initiatives are often
            disconnected from core objectives, funded as experiments rather
            than treated as levers to improve growth, efficiency, risk, or
            customer outcomes.
          </p>
          <p>
            This white paper proposes a structured approach to move from
            “interesting AI projects” to an{" "}
            <strong>AI Opportunity Map</strong> that clearly shows where AI
            can deliver bottom-line impact within 12–24 months.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">1. The Strategic AI Gap</h2>
          <p>
            Most AI discussions start with technology: models, platforms,
            tooling. Most executive discussions start with outcomes: growth,
            operating cost, risk, compliance, and customer experience. The
            “AI gap” is what happens when these conversations never properly
            meet.
          </p>
          <p>
            To close that gap, AI must be framed as a{" "}
            <strong>multiplier on existing strategy</strong>, not a separate
            innovation track.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">
            2. A Framework for AI Opportunity Discovery
          </h2>
          <ol className="list-decimal ml-5 space-y-2 text-slate-700">
            <li>
              <strong>Clarify strategic objectives.</strong> Identify the
              3–5 metrics that matter most in the next 12–24 months (for example:
              NPLs, retention, operating cost per unit, claim cycle time).
            </li>
            <li>
              <strong>Map bottlenecks and friction.</strong> For each objective,
              find where process, data, or human constraints are blocking progress.
            </li>
            <li>
              <strong>Match to AI capabilities.</strong> Identify where predictive
              models, decision engines, NLP, computer vision, or workflow
              automation can relieve those bottlenecks.
            </li>
            <li>
              <strong>Assess data and feasibility.</strong> Evaluate whether you
              have the data, systems access, and change capacity to execute.
            </li>
            <li>
              <strong>Quantify value and prioritise.</strong> Estimate impact
              ranges (e.g. 8–15% uplift, 20–30% cycle-time reduction) and
              prioritise into an AI Opportunity Map.
            </li>
          </ol>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">3. Building an AI-Ready Organisation</h2>
          <p>
            The highest-performing organisations treat AI as a team sport. They
            create the conditions for AI initiatives to land and scale:
          </p>
          <ul className="list-disc ml-5 space-y-1 text-slate-700">
            <li>Executive sponsorship tied to clear outcomes, not experimentation.</li>
            <li>Cross-functional teams combining domain, data, and technology skills.</li>
            <li>Data governance that makes data discoverable, trusted, and usable.</li>
            <li>Delivery frameworks that move from pilot to production reliably.</li>
          </ul>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">4. Common Pitfalls</h2>
          <ul className="list-disc ml-5 space-y-1 text-slate-700">
            <li>Leading with tools instead of outcomes.</li>
            <li>Pursuing “AI for AI’s sake” with no baseline KPIs.</li>
            <li>Ignoring data readiness and underestimating integration work.</li>
            <li>Over-automating critical decisions without appropriate controls.</li>
          </ul>
        </section>

        <section className="space-y-3 mb-10">
          <h2 className="text-xl font-semibold">
            5. From Buzzword to Bottom Line
          </h2>
          <p>
            When AI is aligned with strategy, grounded in data reality, and
            delivered through repeatable patterns, it moves from buzzword to
            bottom line. The outcome is not “an AI project”; it is a sequence
            of initiatives that make decisions faster, smarter, and more
            consistent across your organisation.
          </p>
          <p>
            This white paper is designed to support board and executive
            discussions on where to start, how fast to move, and how to build
            the internal capabilities required to sustain the journey.
          </p>
        </section>

        <aside className="border-t pt-6 text-sm text-slate-600">
          <p className="font-semibold">Want to explore this for your business?</p>
          <p>
            We work with executives to build AI roadmaps, implement decision
            engines, and deliver measurable ROI within months—not years.
          </p>
          <p className="mt-2">
            Email:{" "}
            <a
              href="mailto:eugeneehl@outlook.com"
              className="underline"
            >
              eugeneehl@outlook.com
            </a>
          </p>
        </aside>
      </main>

      <SiteFooter />
    </div>
  );
}
