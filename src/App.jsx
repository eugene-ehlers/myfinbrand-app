import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";


export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--bg))] text-[rgb(var(--ink))]">
      <Header />
      <main className="container flex-1 py-10">
        <h1 className="text-2xl font-semibold">MyFinBrand</h1>
        <p className="mt-2 text-[rgb(var(--ink-dim))]">
          Vite + React + Tailwind deployed via S3/CloudFront.
        </p>
      </main>
      <Footer />
    </div>
  );
}
