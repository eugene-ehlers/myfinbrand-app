export default function Header() {
  return (
    <header className="site-header">
      <div className="container flex items-center justify-between py-3">
        <a href="/" className="text-lg font-semibold">MyFinBrand</a>
        <nav className="flex items-center gap-2">
          <a href="/docs">Docs</a>
          <a href="/pricing">Pricing</a>
          <button className="header-cta">Sign in</button>
        </nav>
      </div>
    </header>
  );
}
