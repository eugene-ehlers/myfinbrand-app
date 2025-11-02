export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-accent"></div>
      <div className="container py-6 text-sm">
        © {new Date().getFullYear()} MyFinBrand. All rights reserved.
      </div>
    </footer>
  );
}


