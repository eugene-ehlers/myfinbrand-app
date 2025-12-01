// src/components/layout/SiteHeader.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";

export default function SiteHeader() {
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="page-container flex items-center justify-between py-3">
        {/* Logo + brand */}
        <Link to="/" className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-md"
            style={{
              background:
                "linear-gradient(135deg, rgba(2,6,23,.9) 0%, rgba(43,212,224,.35) 100%)",
            }}
          />
          <strong>The Smart Decision Group</strong>
        </Link>

        {/* Main navigation */}
        <nav className="flex items-center gap-2 text-sm relative">
          <Link to="/" className="header-cta">
            Home
          </Link>

          {/* How we help dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSolutionsOpen((open) => !open)}
              className="header-cta flex items-center gap-1"
            >
              How we help
              <span className="text-[10px]">▾</span>
            </button>

            {solutionsOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border bg-white shadow-lg text-sm z-30">
                {/* Overview on the home page */}
                <a
                  href="/#capabilities"
                  className="block px-4 py-2 hover:bg-slate-50 rounded-t-xl"
                  style={{ color: "rgb(15 23 42)" }}
                  onClick={() => setSolutionsOpen(false)}
                >
                  Overview: What we do
                </a>

                {/* Core platform */}
                <div className="px-4 pt-2 pb-1 text-[11px] uppercase tracking-wide text-slate-400">
                  Core platform
                </div>
                <Link
                  to="/solutions/our-decision-engine"
                  className="block px-4 py-2 hover:bg-slate-50"
                  style={{ color: "rgb(15 23 42)" }}
                  onClick={() => setSolutionsOpen(false)}
                >
                  Our Decision Engine
                </Link>

                <div className="px-4 pt-2 pb-1 text-[11px] uppercase tracking-wide text-slate-400">
                  Credit lifecycle
                </div>
                <Link
                  to="/solutions/collections"
                  className="block px-4 py-2 hover:bg-slate-50"
                  style={{ color: "rgb(15 23 42)" }}
                  onClick={() => setSolutionsOpen(false)}
                >
                  Collections optimisation
                </Link>
                <Link
                  to="/solutions/originations"
                  className="block px-4 py-2 hover:bg-slate-50"
                  style={{ color: "rgb(15 23 42)" }}
                  onClick={() => setSolutionsOpen(false)}
                >
                  Originations &amp; onboarding
                </Link>

                <div className="px-4 pt-2 pb-1 text-[11px] uppercase tracking-wide text-slate-400">
                  Risk &amp; compliance
                </div>
                <Link
                  to="/solutions/fraud"
                  className="block px-4 py-2 hover:bg-slate-50"
                  style={{ color: "rgb(15 23 42)" }}
                  onClick={() => setSolutionsOpen(false)}
                >
                  Fraud &amp; verification
                </Link>
                <Link
                  to="/solutions/kyc-fica"
                  className="block px-4 py-2 hover:bg-slate-50"
                  style={{ color: "rgb(15 23 42)" }}
                  onClick={() => setSolutionsOpen(false)}
                >
                  KYC &amp; FICA orchestration
                </Link>

                <div className="px-4 pt-2 pb-1 text-[11px] uppercase tracking-wide text-slate-400">
                  Growth &amp; portfolio value
                </div>
                <Link
                  to="/solutions/pricing-optimisation"
                  className="block px-4 py-2 hover:bg-slate-50"
                  style={{ color: "rgb(15 23 42)" }}
                  onClick={() => setSolutionsOpen(false)}
                >
                  Pricing &amp; offer optimisation
                </Link>
                <Link
                  to="/solutions/customer-management"
                  className="block px-4 py-2 hover:bg-slate-50 rounded-b-xl"
                  style={{ color: "rgb(15 23 42)" }}
                  onClick={() => setSolutionsOpen(false)}
                >
                  Customer management &amp; retention
                </Link>
              </div>
            )}
          </div>

          <Link to="/insights" className="header-cta">
            Insights
          </Link>

          <Link to="/founder" className="header-cta">
            Founder
          </Link>

          <a href="/#contact" className="header-cta">
            Contact
          </a>

          {/* LinkedIn (open in new tab) */}
          <a
            href="https://www.linkedin.com/in/eugene-ehlers-2b644b64/"
            target="_blank"
            rel="noreferrer"
            className="header-cta flex items-center gap-1"
          >
            <Linkedin className="h-4 w-4" />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>

          {/* Primary CTA */}
          <a href="mailto:contact@tsdg.co.za" className="ml-2 header-cta">
            Email us
          </a>
        </nav>
      </div>
    </header>
  );
}
