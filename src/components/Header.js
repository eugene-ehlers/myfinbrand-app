export default function Header() {
  return (
    <header className="site-header">
      <div className="container h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-[26px] h-[26px] rounded-[12px]"
            style={{ background: 'linear-gradient(135deg,#B3532D,#2BD4E0)' }}
          />
          <span className="font-bold tracking-tight">MyFinBrand</span>
        </div>
        <nav className="flex items-center gap-3">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#docs">Docs</a>
          <button className="header-cta">Sign in</button>
        </nav>
      </div>
    </header>
  );
}

