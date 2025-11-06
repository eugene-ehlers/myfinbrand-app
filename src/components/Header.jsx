import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const linkBase = "px-2 py-1 rounded hover:underline";
  const active = ({ isActive }) =>
    `${linkBase} ${isActive ? "font-semibold underline" : ""}`;

  return (
    <header className="site-header">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="text-lg font-semibold">MyFinBrand</Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/docs" className={active}>Docs</NavLink>
          <NavLink to="/pricing" className={active}>Pricing</NavLink>
          <button className="header-cta">Sign in</button>
        </nav>
      </div>
    </header>
  );
}

