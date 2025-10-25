// src/pages/Landing.jsx
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
      <h1 className="text-2xl font-semibold mb-2">Financial OCR</h1>
      <p className="opacity-80">
        Upload financial statements, run OCR, and view risk metrics and summaries.
      </p>

      <div className="mt-5 flex gap-3">
        <Link
          to="/dashboard"
          className="btn-primary inline-flex items-center px-3 py-2 rounded-lg"
        >
          Go to Dashboard
        </Link>
        <Link
          to="/admin"
          className="inline-flex items-center px-3 py-2 rounded-lg border border-[rgb(var(--border))]"
        >
          Admin
        </Link>
      </div>
    </section>
  );
}

