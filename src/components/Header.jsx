import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const linkBase = "px-2 py-1 rounded";
  const linkClass = ({ isActive }) =>
    `${linkBase} ${isActive ? "active font-semibold underline" : ""}`;

  return (
    <header className="site-header">
      <div className="page-container flex items-center justify-between py-3">
        <Link to="/" className="text-lg font-semibold">MyFinBrand</Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/results" className={linkClass}>Results</NavLink>
          <NavLink to="/admin" className={linkClass}>Admin</NavLink>
          <button className="header-cta">Sign in</button>
        </nav>
      </div>
    </header>
  );
}

