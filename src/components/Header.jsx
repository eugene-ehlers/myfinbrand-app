import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const base = "px-2 py-1 rounded";
  const active = ({ isActive }) => `${base} ${isActive ? "font-semibold underline" : ""}`;

  return (
    <header className="site-header">
      // App.jsx / Header.jsx / pages/*
        <main className="page-container flex-1 py-10">…</main>
        <div className="page-container flex items-center …">…</div>

        <Link to="/" className="text-lg font-semibold">MyFinBrand</Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "active" : ""}>Dashboard</NavLink>
          <NavLink to="/results" className={active}>Results</NavLink>
          <NavLink to="/admin" className={active}>Admin</NavLink>
          <button className="header-cta">Sign in</button>
        </nav>
      </div>
    </header>
  );
}
