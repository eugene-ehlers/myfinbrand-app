import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-2 font-semibold">
          <img src="/logo.svg" alt="Logo" className="w-7 h-7" />
          <span>Financial OCR</span>
        </div>

        <nav className="flex gap-2">
          <Link to="/" className="px-3 py-2 rounded-md">Home</Link>
          <Link to="/dashboard" className="px-3 py-2 rounded-md">Dashboard</Link>
          <Link to="/results" className="px-3 py-2 rounded-md">Results</Link>
          <Link to="/admin" className="px-3 py-2 rounded-md">Admin</Link>
        </nav>

        <button className="header-cta">Sign in</button>
      </div>
      <div className="footer-accent"></div>
    </header>
  );
}
