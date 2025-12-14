//src/pages/Privacy.jsx

import React from "react";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

export default function Privacy() {
  return (
    <div className="min-h-screen text-slate-900" style={{ background: "rgb(var(--surface))" }}>
      <Seo
        title="Privacy Notice | The Smart Decision Group"
        description="Privacy notice describing how we collect and use data, including anonymised analytics."
        canonical="https://www.tsdg.co.za/privacy"
        ogType="website"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-4xl px-4 pt-12 pb-16">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy Notice</h1>

        <div className="mt-6 rounded-2xl border bg-white p-6 text-slate-700 leading-relaxed">
          <p>
            This privacy notice explains how The Smart Decision Group (“TSDG”) collects and uses information
            when you visit this website.
          </p>

          <h2 className="mt-6 text-lg font-semibold text-slate-900">Analytics</h2>
          <p className="mt-2">
            We use anonymised analytics to understand how visitors use the site (for example: pages visited,
            approximate location/country, device type, and referral source). This helps us improve content,
            usability, and performance. We do not intentionally collect personally identifiable information
            through analytics.
          </p>

          <h2 className="mt-6 text-lg font-semibold text-slate-900">Cookies</h2>
          <p className="mt-2">
            Analytics may set cookies or similar identifiers in your browser. You can manage cookies in your
            browser settings. If you block cookies, some analytics functionality may be limited.
          </p>

          <h2 className="mt-6 text-lg font-semibold text-slate-900">Contact forms and email</h2>
          <p className="mt-2">
            If you contact us (for example, via email or a website form), we will use the details you provide
            to respond and to manage the enquiry. We do not sell your information.
          </p>

          <h2 className="mt-6 text-lg font-semibold text-slate-900">Your rights</h2>
          <p className="mt-2">
            You may request access, correction, or deletion of personal information you have provided to us.
            To do so, contact us using the details on the website.
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
