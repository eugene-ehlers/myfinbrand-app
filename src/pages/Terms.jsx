// src/pages/Terms.jsx

import React from "react";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

export default function Terms() {
  return (
    <div className="min-h-screen text-slate-900" style={{ background: "rgb(var(--surface))" }}>
      <Seo
        title="Terms of Use | The Smart Decision Group"
        description="Terms governing use of this website and its content."
        canonical="https://www.tsdg.co.za/terms"
        ogType="website"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-4xl px-4 pt-12 pb-16">
        <h1 className="text-3xl font-semibold tracking-tight">Terms of Use</h1>

        <div className="mt-6 rounded-2xl border bg-white p-6 text-slate-700 leading-relaxed">
          <p>
            By accessing or using this website, you agree to these Terms of Use.
            If you do not agree, please do not use the site.
          </p>

          <h2 className="mt-6 text-lg font-semibold text-slate-900">Use of content</h2>
          <p className="mt-2">
            Website content (including tools, calculators, articles, and documents) is provided for informational
            purposes only. You may view and share links to public pages. You may not reproduce or redistribute
            content for commercial purposes without permission.
          </p>

          <h2 className="mt-6 text-lg font-semibold text-slate-900">No warranties</h2>
          <p className="mt-2">
            We provide the site “as is” without warranties of any kind, including accuracy, completeness,
            or fitness for a particular purpose.
          </p>

          <h2 className="mt-6 text-lg font-semibold text-slate-900">Limitation of liability</h2>
          <p className="mt-2">
            To the maximum extent permitted by law, TSDG will not be liable for any loss or damage arising
            from use of the site or reliance on its content.
          </p>

          <h2 className="mt-6 text-lg font-semibold text-slate-900">Governing law</h2>
          <p className="mt-2">
            These terms are governed by the laws of South Africa.
          </p>

          <p className="mt-6 text-sm text-slate-500">
            Last updated: 2025-12-14
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
