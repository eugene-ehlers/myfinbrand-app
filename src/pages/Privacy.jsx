import React from "react";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

export default function Privacy() {
  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <Seo
        title="Privacy Notice | The Smart Decision Group"
        description="Privacy notice for The Smart Decision Group website."
        canonical="https://www.tsdg.co.za/privacy"
        ogType="website"
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-3xl px-4 pt-10 pb-16">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy notice</h1>
        <p className="mt-3 text-slate-700 leading-relaxed">
          This is a placeholder privacy notice. Replace with your final POPIA-aligned
          privacy notice covering analytics, forms, cookies, and contact processing.
        </p>
        <p className="mt-6 text-xs text-slate-500">Last updated: December 14, 2025</p>
      </main>

      <SiteFooter />
    </div>
  );
}
