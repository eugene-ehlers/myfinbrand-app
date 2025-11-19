// src/components/layout/SiteHeader.jsx
import { Link } from "react-router-dom";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="page-container flex items-center justify-between py-3">
        {/* Logo + Brand */}
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

        {/* Nav: visible on mobile + desktop, just changes size/wrapping */}
        <nav className="flex flex-wrap items-center justify-end gap-2 text-sm md:text-base">
          <Link to="/" className="header-cta">
            Home
          </Link>

          <a href="#capabilities" className="header-cta">
            Solutions
          </a>

          {/* Productised offers */}
          <a href="#decision-engine" className="header-cta">
            Decision Engine
          </a>
          <a href="#models-as-a-service" className="header-cta">
            Models-as-a-Service
          </a>

          <Link to="/insights" className="header-cta">
            Insights
          </Link>

          <Link to="/founder" className="header-cta">
            Founder
          </Link>

          <a href="#contact" className="header-cta">
            Contact
          </a>

          <a href="mailto:contact@tsdg.co.za" className="header-cta">
            Get in touch
          </a>
        </nav>
      </div>
    </header>
  );
}
