import React from "react";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

export default function Disclaimer() {
  return (
    <div className="min-h-screen text-slate-900" style={{ background: "rgb(var(--surface))" }}>
      <Seo
        title="Disclaimer | The Smart Decision Group"
        description="Important disclaimer regarding the use of tools, calculators, and content published on this website."
        canonical="https://www.tsdg.co.za/disclaimer"
        ogType="website"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-4xl px-4 pt-12 pb-16">
        <h1 className="text-3xl font-semibold tracking-tight">Disclaimer</h1>

        <div className="mt-6 rounded-2xl border bg-white p-6 text-slate-700 leading-relaxed">
          <p>
            The information, calculators, tools, and other content provided on this website are for
            general informational purposes only. They are designed to support high-level discussion
            and scenario exploration, and do not constitute financial, credit, legal, regulatory, or
            professional advice.
          </p>

          <p className="mt-4">
            Outcomes produced by calculators depend entirely on the assumptions and inputs used.
            They are indicative only and should not be relied upon as forecasts or decision outcomes.
            You should validate results using your own portfolio data, operating model, and governance
            processes, and seek appropriate professional advice where required.
          </p>

          <p className="mt-4">
            While we aim to keep content accurate and current, we make no warranties regarding completeness,
            accuracy, reliability, or suitability for any purpose. Use of this website and its content is
            at your own risk.
          </p>

          <p className="mt-4">
            If you would like a tailored analysis, business case, or implementation plan based on your
            data and context, please contact us.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
