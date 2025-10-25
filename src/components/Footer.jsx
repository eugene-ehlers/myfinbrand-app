// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-accent" />
      <div className="container py-10 text-sm">
        <h4 className="font-semibold mb-2">About</h4>
        <p>© {new Date().getFullYear()} MyFinBrand — OCR Studio preview theme.</p>
      </div>
    </footer>
  );
}

