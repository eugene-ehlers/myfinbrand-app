import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const base = "px-2 py-1 rounded";
  const active = ({ isActive }) => `${base} ${isActive ? "font-semibold underline" : ""}`;

  return (
    <header className="site-header">
      <div className="container flex items-center justify-between py-3">
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
