// src/components/layout/SiteHeader.jsx
import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";

export default function SiteHeader() {
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
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/" className="header-cta">
            Home
          </Link>

          <a href="#capabilities" className="header-cta">
            Solutions
          </a>

          <Link to="/solutions/collections" className="...">
            Collections
          </Link>


          <Link to="/insights" className="header-cta">
            Insights
          </Link>

          <Link to="/founder" className="header-cta">
            Founder
          </Link>

          <a href="#contact" className="header-cta">
            Contact
          </a>

          {/* LinkedIn (open in new tab) */}
          <a
            href="https://www.linkedin.com" // TODO: replace with your profile or company URL
            target="_blank"
            rel="noreferrer"
            className="header-cta flex items-center gap-1"
          >
            <Linkedin className="h-4 w-4" />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>

          {/* Primary CTA */}
          <a
            href="mailto:contact@tsdg.co.za"
            className="ml-2 header-cta"
          >
            Email us
          </a>
        </nav>
      </div>
    </header>
  );
}
