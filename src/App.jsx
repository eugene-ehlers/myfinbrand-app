import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// --- temporary pages to keep build green (replace with your real ones later) ---
function Home() {
  return (
    <main className="container flex-1 py-10">
      <h1 className="text-2xl font-semibold">MyFinBrand</h1>
      <p className="mt-2 text-[rgb(var(--ink-dim))]">
        Vite + React + Tailwind deployed via S3/CloudFront.
      </p>
    </main>
  );
}
function Docs() {
  return (
    <main className="container flex-1 py-10">
      <h2 className="text-xl font-semibold">Docs</h2>
      <p className="mt-2 text-[rgb(var(--ink-dim))]">Coming soon…</p>
    </main>
  );
}
function Pricing() {
  return (
    <main className="container flex-1 py-10">
      <h2 className="text-xl font-semibold">Pricing</h2>
      <p className="mt-2 text-[rgb(var(--ink-dim))]">Coming soon…</p>
    </main>
  );
}
// ------------------------------------------------------------------------------

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--bg))] text-[rgb(var(--ink))]">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/pricing" element={<Pricing />} />
        {/* fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

