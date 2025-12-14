// src/components/layout/SiteHeader.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Linkedin } from "lucide-react";

export default function SiteHeader() {
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const solutionsRef = useRef(null);
  const resourcesRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdowns on route change
  useEffect(() => {
    setSolutionsOpen(false);
    setResourcesOpen(false);
  }, [location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const onClickOutside = (e) => {
      if (solutionsRef.current && !solutionsRef.current.contains(e.target)) {
        setSolutionsOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(e.target)) {
        setResourcesOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Close dropdowns on Escape key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setSolutionsOpen(false);
        setResourcesOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  /**
   * Ensure hash navigation works from any route.
   * - If already on "/", just set window.location.hash.
   * - If not on "/", navigate to "/#hash".
   */
  const goToHomeAnchor = (hash) => {
    setSolutionsOpen(false);
    setResourcesOpen(false);

    const clean = String(hash || "").replace(/^#/, "");
    if (!clean) return;

    if (location.pathname === "/") {
      window.location.hash = `#${clean}`;
      return;
    }

    navigate(`/#${clean}`);
  };

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
          <div className="relative" ref={solutionsRef}>
            <button
              type="button"
              onClick={() => {
                setSolutionsOpen((open) => !open);
                setResourcesOpen(false);
              }}
              className="header-cta flex items-center gap-1"
              aria-haspopup="menu"
              aria-expanded={solutionsOpen}
            >
              How we help
              <span className="text-[10px]">▾</span>
            </button>

            {solutionsOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl border bg-white shadow-lg text-sm z-30"
                role="menu"
              >
                {/* Overview on the home page */}
                <button
                  type="button"
                  className="block w-full text-left px-4 py-2 hover:bg-slate-50 rounded-t-xl"
                  style={{ color: "rgb(15 23 42)" }}
                  onClick={() => goToHomeAnchor("capabilities")}
                  role="menuitem"
                >
                  Overview: What we do
                </button>

                {/* Core platform */}
                <div className="px-4 pt-2 pb-1 text-[11px] uppercase tracking-wide text-slate-400">
                  Core platform
                </div>
                <Link
                  to="/solutions/our-decision-engine"
                  className="block px-4 py-2 hover:bg-slate-50"
                  style={{ color: "rgb(15 23 42)" }}
                  onClick={() => setSolutionsOpen(false)}
                  role="menuitem"
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
                  role="menuitem"
                >
                  Collections optimisation
                </Link>
                <Link
                  to="/solutions/originations"
                  className="block px-4 py-2 hover:bg-slate-50"
                  style={{ color: "rgb(15 23 42)" }}
                  onClick={() => setSolutionsOpen(false)}
                  role="menuitem"
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
                  role="menuitem"
                >
                  Fraud &amp; verification
                </Link>
                <Link
                  to="/solutions/kyc-fica"
                  className="block px-4 py-2 hover:bg-slate-50"
                  style={{ color: "rgb(15 23 42)" }}
                  onClick={() => setSolutionsOpen(false)}
                  role="menuitem"
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
                  role="menuitem"
                >
                  Pricing &amp; offer optimisation
                </Link>
                <Link
                  to="/solutions/customer-management"
                  className="block px-4 py-2 hover:bg-slate-50 rounded-b-xl"
                  style={{ color: "rgb(15 23 42)" }}
                  onClick={() => setSolutionsOpen(false)}
                  role="menuitem"
                >
                  Customer management &amp; retention
                </Link>
              </div>
            )}
          </div>

          {/* Resources dropdown (Library + Tools + Insights) */}
          <div className="relative" ref={resourcesRef}>
            <button
              type="button"
              onClick={() => {
                setResourcesOpen((open) => !open);
                setSolutionsOpen(false);
              }}
              className="header-cta flex items-center gap-1"
              aria-haspopup="menu"
              aria-expanded={resourcesOpen}
            >
              Resources
              <span className="text-[10px]">▾</span>
            </button>

            {resourcesOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl border bg-white shadow-lg text-sm z-30"
                role="menu"
              >
                <div className="px-4 pt-2 pb-1 text-[11px] uppercase tracking-wide text-slate-400">
                  Browse
                </div>

                <Link
                  to="/library"
                  className="block px-4 py-2 hover:bg-slate-50 rounded-t-xl"
                  style={{ color: "rgb(15 23 42)" }}
                  onClick={() => setResourcesOpen(false)}
                  role="menuitem"
                >
                  Library (private advisory notes)
                </Link>

                <Link
                  to="/tools"
                  className="block px-4 py-2 hover:bg-slate-50"
                  style={{ color: "rgb(15 23 42)" }}
                  onClick={() => setResourcesOpen(false)}
                  role="menuitem"
                >
                  Tools &amp; calculators
                </Link>

                <Link
                  to="/insights"
                  className="block px-4 py-2 hover:bg-slate-50 rounded-b-xl"
                  style={{ color: "rgb(15 23 42)" }}
                  onClick={() => setResourcesOpen(false)}
                  role="menuitem"
                >
                  Insights &amp; white papers
                </Link>
              </div>
            )}
          </div>

          <Link to="/founder" className="header-cta">
            Founder
          </Link>

          {/* Contact anchor (works from any route) */}
          <button
            type="button"
            onClick={() => goToHomeAnchor("contact")}
            className="header-cta"
          >
            Contact
          </button>

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
