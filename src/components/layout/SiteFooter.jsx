// src/components/layout/SiteFooter.jsx
import { Building2 } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-accent" />
      <div className="page-container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <span className="font-semibold">The Smart Decision Group</span>
        </div>
        <div className="text-sm opacity-80">
          © {new Date().getFullYear()} TSDG • All rights reserved
        </div>
        <div className="text-sm">
          <a href="/privacy" className="hover:underline">
            Privacy
          </a>
          <span className="mx-2">•</span>
          <a href="/terms" className="hover:underline">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
