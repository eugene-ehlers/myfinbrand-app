import React from "react";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

export default function Privacy() {
  return (
    <div className="min-h-screen text-slate-900" style={{ background: "rgb(var(--surface))" }}>
      <Seo
        title="Privacy Notice | The Smart Decision Group"
        description="Privacy notice explaining how The Smart Decision Group collects and uses information."
        canonical="https://www.tsdg.co.za/privacy"
        ogType="website"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-3xl px-4 pt-10 pb-16">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy notice</h1>

        <p className="mt-4 text-slate-700 leading-relaxed">
          The Smart Decision Group (“we”, “us”, “our”) respects your privacy and is
          committed to protecting your personal information in accordance with the
          Protection of Personal Information Act (POPIA) and generally accepted
          privacy principles.
        </p>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Information we collect</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            We may collect limited personal information when you:
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
            <li>Submit a contact or enquiry form</li>
            <li>Email us directly</li>
            <li>Use calculators or tools on this site</li>
            <li>Browse the site (via analytics)</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">How we use information</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            Information is used only to:
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
            <li>Respond to enquiries</li>
            <li>Provide requested information or services</li>
            <li>Improve website content and usability</li>
            <li>Understand aggregate usage patterns</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Analytics</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            This website uses Google Analytics to collect anonymised usage
            statistics. IP addresses are anonymised where supported. No
            personally identifiable credit or financial data is collected.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Data sharing</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            We do not sell or trade personal information. Information is only
            shared where required to operate this website or where legally
            required.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Your rights</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            You may request access to, correction of, or deletion of your
            personal information by contacting us.
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
