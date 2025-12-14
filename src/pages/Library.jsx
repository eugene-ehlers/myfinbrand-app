// src/pages/Library.jsx
import React from "react";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

export default function Library() {
  return (
    <div className="min-h-screen text-slate-900" style={{ background: "rgb(var(--surface))" }}>
      <Seo
        title="Library | The Smart Decision Group"
        description="Confidential advisory notes and practical thinking for leaders who want clarity without the training-room feel."
        canonical="https://www.tsdg.co.za/library"
        ogType="website"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-4xl px-4 pt-12 pb-16">
        <h1 className="text-3xl font-semibold tracking-tight">Library</h1>

        <p className="mt-4 text-slate-700 leading-relaxed max-w-3xl">
          This is a quiet, practical space for operators. No “training”. No judgement.
          Just clear decisioning guidance, written for people who run real businesses and
          want to modernise responsibly.
        </p>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold">What this is</h2>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-2">
              <li>Confidential-style advisory notes (no client identifiers)</li>
              <li>Simple explanations using “business language”</li>
              <li>Decision engine thinking without vendor buzzwords</li>
              <li>Practical lessons from real delivery</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold">What this is not</h2>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-2">
              <li>Not a course</li>
              <li>Not public benchmarking</li>
              <li>Not a place to “look smart”</li>
              <li>Not financial or regulatory advice</li>
            </ul>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Confidentiality note</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            Notes here avoid client-identifying details and are provided to support
            thinking and discussion. They are not a substitute for portfolio-level analysis.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
