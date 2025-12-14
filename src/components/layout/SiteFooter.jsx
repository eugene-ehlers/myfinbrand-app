import React from "react";
import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="page-container mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4 text-sm text-slate-700">
          {/* Brand & positioning */}
          <div>
            <div className="font-semibold text-slate-900">
              The Smart Decision Group
            </div>
            <p className="mt-2 text-slate-600 leading-relaxed">
              Independent advisory and decision-engine specialists helping
              organisations make better, governed, and economically rational
              decisions.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Confidential. Independent. Practitioner-led.
            </p>
          </div>

          {/* Services (kept minimal) */}
          <div>
            <div className="font-semibold text-slate-900">Services</div>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/solutions/originations" className="hover:underline">
                  Originations & onboarding
                </Link>
              </li>
              <li>
                <Link to="/solutions/collections" className="hover:underline">
                  Collections optimisation
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/our-decision-engine"
                  className="hover:underline"
                >
                  Decision engine platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="font-semibold text-slate-900">Resources</div>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/library" className="hover:underline">
                  Advisory library
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:underline">
                  Tools & calculators
                </Link>
              </li>
              <li>
                <Link to="/insights" className="hover:underline">
                  Insights & white papers
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & legal */}
          <div>
            <div className="font-semibold text-slate-900">Trust & governance</div>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/privacy" className="hover:underline">
                  Privacy notice
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:underline">
                  Terms of use
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:underline">
                  Disclaimer
                </Link>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/eugene-ehlers-2b644b64/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t pt-6 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} The Smart Decision Group. All rights
            reserved.
          </div>
          <div>
            Information provided on this site is illustrative and does not
            constitute financial, credit, or legal advice.
          </div>
        </div>
      </div>
    </footer>
  );
}
