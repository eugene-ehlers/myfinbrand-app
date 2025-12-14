// src/pages/Disclaimer.jsx


import React from "react";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

export default function Disclaimer() {
  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <Seo
        title="Disclaimer | The Smart Decision Group"
        description="Important disclaimer regarding the use of calculators, tools, and content published by The Smart Decision Group."
        canonical="https://www.tsdg.co.za/disclaimer"
        ogType="website"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-3xl px-4 pt-10 pb-16">
        <h1 className="text-3xl font-semibold tracking-tight">Disclaimer</h1>
        <p className="mt-3 text-slate-700 leading-relaxed">
          The Smart Decision Group provides information, calculators, and tools on
          this website for general guidance and educational purposes only.
        </p>

        <section className="mt-8 rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">No advice</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            Nothing on this website constitutes financial advice, credit advice,
            underwriting advice, legal advice, or regulatory advice. You should
            obtain professional advice appropriate to your circumstances before
            making business, credit, lending, risk, pricing, or operational
            decisions.
          </p>
        </section>

        <section className="mt-5 rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Calculators are illustrative</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            Our calculators (including ROI, cost, and scorecard profitability tools)
            provide indicative estimates based on the inputs you provide and the
            modelling assumptions shown. Results may differ materially from real
            outcomes due to portfolio characteristics, operational processes,
            pricing, recoveries, fraud, policy overlays, data quality, and economic
            conditions.
          </p>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed">
            Use these tools to compare scenarios and support discovery — not as a
            substitute for analysis, validation, governance approval, or financial
            modelling.
          </p>
        </section>

        <section className="mt-5 rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">No warranties</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            We make no representations or warranties of any kind, express or
            implied, about the completeness, accuracy, reliability, suitability, or
            availability of the information, tools, or related graphics on this
            website. Any reliance you place on such information is strictly at your
            own risk.
          </p>
        </section>

        <section className="mt-5 rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Limitation of liability</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            To the maximum extent permitted by law, The Smart Decision Group and its
            representatives will not be liable for any loss or damage (including,
            without limitation, indirect or consequential loss) arising from the use
            of, or inability to use, this website, its content, or its tools.
          </p>
        </section>

        <section className="mt-5 rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">External links</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            This website may include links to third-party websites. We do not
            control and are not responsible for the content, availability, or
            practices of those sites.
          </p>
        </section>

        <section className="mt-5 rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            If you would like us to validate assumptions or build a tailored business
            case based on your portfolio and operating model, contact{" "}
            <a
              className="underline underline-offset-2"
              href="mailto:contact@tsdg.co.za"
            >
              contact@tsdg.co.za
            </a>
            .
          </p>
        </section>

        <p className="mt-8 text-xs text-slate-500">
          Last updated: December 14, 2025
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
