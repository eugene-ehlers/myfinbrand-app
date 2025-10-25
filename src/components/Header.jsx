// src/components/Header.jsx
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-[26px] h-[26px] rounded-[12px]"
            style={{ background: "linear-gradient(135deg,#B3532D,#2BD4E0)" }}
          />
          <span className="font-bold tracking-tight">MyFinBrand</span>
        </div>

        <nav className="flex items-center gap-3">
          {/* Internal routes use Link (SPA, no full reload) */}
          <Link to="/" className="px-2 py-1 rounded-md">Home</Link>
          <Link to="/dashboard" className="px-2 py-1 rounded-md">Dashboard</Link>
          <Link to="/results" className="px-2 py-1 rounded-md">Results</Link>
          <Link to="/admin" className="px-2 py-1 rounded-md">Admin</Link>

          {/* In-page anchors on the Landing page can stay plain <a> */}
          <a href="/#features" className="px-2 py-1 rounded-md">Features</a>
          <a href="/#pricing" className="px-2 py-1 rounded-md">Pricing</a>
          <a href="/#docs" className="px-2 py-1 rounded-md">Docs</a>

          <button className="header-cta">Sign in</button>
        </nav>
      </div>
      <div className="footer-accent" />
    </header>
  );
}

