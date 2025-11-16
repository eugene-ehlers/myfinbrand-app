// src/components/layout/SiteHeader.jsx
import { Link } from "react-router-dom";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="page-container flex items-center justify-between py-3">
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

        <nav className="hidden md:flex items-center gap-2">
          <Link to="/" className="header-cta">
            Home
          </Link>

          <a href="#capabilities" className="header-cta">
            Solutions
          </a>

          {/* New productised offers in the nav */}
          <a href="#decision-engine" className="header-cta">
            Decision Engine
          </a>
          <a href="#models-as-a-service" className="header-cta">
            Models-as-a-Service
          </a>

          <a href="#contact" className="header-cta">
            Contact
          </a>
          <Link to="/insights" className="header-cta">
            Insights
          </Link>
          <a href="mailto:eugeneehl@outlook.com" className="header-cta">
            Get in touch
          </a>
        </nav>
      </div>
    </header>
  );
}
