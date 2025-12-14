import React from "react";
import { Link } from "react-router-dom";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t bg-white">
      <div className="page-container mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand / Trust */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-md"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(2,6,23,.9) 0%, rgba(43,212,224,.35) 100%)",
                }}
              />
              <strong className="text-slate-900">The Smart Decision Group</strong>
            </div>

            <p className="mt-3 text-sm text-slate-600 max-w-md leading-relaxed">
              Decision intelligence, scorecards, and governed decision automation for
              credit, onboarding, fraud, pricing, and operational decisioning.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <a
                href="mailto:contact@tsdg.co.za"
                className="inline-flex items-center rounded-xl px-4 py-2"
                style={{
                  background: "rgb(var(--primary))",
                  color: "rgb(var(--primary-fg))",
                }}
              >
                Email us
              </a>

              <a
                href="https://www.linkedin.com/in/eugene-ehlers-2b644b64/"
                target="_blank"
                rel="noreferrer"
                className="text-slate-700 underline underline-offset-2"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Resources */}
          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Resources
            </div>
            <div className="mt-3 grid gap-2 text-sm">
              <Link
                to="/tools"
                className="text-slate-700 hover:text-slate-900 underline-offset-2 hover:underline"
              >
                Tools &amp; calculators
              </Link>
              <Link
                to="/insights"
                className="text-slate-700 hover:text-slate-900 underline-offset-2 hover:underline"
              >
                Insights &amp; white papers
              </Link>
              <Link
                to="/library"
                className="text-slate-700 hover:text-slate-900 underline-offset-2 hover:underline"
              >
                Library
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Company
            </div>
            <div className="mt-3 grid gap-2 text-sm">
              <Link
                to="/founder"
                className="text-slate-700 hover:text-slate-900 underline-offset-2 hover:underline"
              >
                Founder
              </Link>
              <a
                href="/#contact"
                className="text-slate-700 hover:text-slate-900 underline-offset-2 hover:underline"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Trust & Governance */}
          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Trust &amp; governance
            </div>
            <div className="mt-3 grid gap-2 text-sm">
              <Link
                to="/privacy"
                className="text-slate-700 hover:text-slate-900 underline-offset-2 hover:underline"
              >
                Privacy notice
              </Link>
              <Link
                to="/terms"
                className="text-slate-700 hover:text-slate-900 underline-offset-2 hover:underline"
              >
                Terms of use
              </Link>
              <Link
                to="/disclaimer"
                className="text-slate-700 hover:text-slate-900 underline-offset-2 hover:underline"
              >
                Disclaimer
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t pt-6">
          <div className="text-xs text-slate-500">
            © {year} The Smart Decision Group. All rights reserved.
          </div>

          <div className="text-xs text-slate-500">
            Tools and calculators are illustrative and do not constitute financial,
            credit, or legal advice.
          </div>
        </div>
      </div>
    </footer>
  );
}
