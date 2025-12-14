import React from "react";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

export default function Terms() {
  return (
    <div className="min-h-screen text-slate-900" style={{ background: "rgb(var(--surface))" }}>
      <Seo
        title="Terms of Use | The Smart Decision Group"
        description="Terms governing the use of The Smart Decision Group website."
        canonical="https://www.tsdg.co.za/terms"
        ogType="website"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-3xl px-4 pt-10 pb-16">
        <h1 className="text-3xl font-semibold tracking-tight">Terms of use</h1>

        <p className="mt-4 text-slate-700 leading-relaxed">
          By accessing or using this website, you agree to these Terms of Use.
          If you do not agree, please do not use the site.
        </p>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Permitted use</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            Content on this website is provided for general information and
            educational purposes. You may view, download, and print content
            for internal business use only.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Intellectual property</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            All content, models, calculators, and materials remain the
            intellectual property of The Smart Decision Group unless otherwise
            stated.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">No reliance</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            You agree not to rely on any information or tools on this website
            as a substitute for professional advice, validation, or governance
            approval.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Availability</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            We may modify, suspend, or discontinue the website or any content
            at any time without notice.
          </p>
        </section>

        <p className="mt-8 text-xs text-slate-500">
          Last updated: December 2025
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
