export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container py-4 text-sm opacity-90 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Financial OCR</span>
        <nav className="flex gap-3">
          <a href="mailto:support@myfinbrand.com" className="px-2 py-1 rounded-md">
            Support
          </a>
          <a href="#" className="px-2 py-1 rounded-md">
            Privacy
          </a>
          <a href="#" className="px-2 py-1 rounded-md">
            Terms
          </a>
        </nav>
      </div>
      <div className="footer-accent"></div>
    </footer>
  );
}
