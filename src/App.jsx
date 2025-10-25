import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

// --- Layout ---
function MainLayout({ children }) {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-[rgb(var(--bg))] text-[rgb(var(--ink))]">
      <header className="site-header">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-2 font-semibold">
            <img src="/logo.svg" alt="Logo" className="w-7 h-7" />
            <span>Financial OCR</span>
          </div>
          <nav className="flex gap-2">
            <a href="/" className="px-3 py-2 rounded-md">Home</a>
            <a href="/dashboard" className="px-3 py-2 rounded-md">Dashboard</a>
          </nav>
          <button className="header-cta">Sign in</button>
        </div>
        <div className="footer-accent"></div>
      </header>

      <main className="container py-6">{children}</main>

      <footer className="site-footer">
        <div className="container py-4 text-sm opacity-90">
          © {new Date().getFullYear()} Financial OCR
        </div>
      </footer>
    </div>
  );
}

// --- Simple auth gate (stub) ---
function ProtectedRoute({ isAuthed, children }) {
  if (!isAuthed) {
    window.location.assign("/"); // simple redirect for now
    return null;
  }
  return children;
}

// --- Pages ---
function Landing() {
  return (
    <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
      <h1 className="text-xl font-semibold mb-2">Welcome</h1>
      <p className="opacity-80">
        Upload financial statements, run OCR, and view risk metrics.
      </p>
      <div className="mt-4">
        <a href="/dashboard" className="btn-primary inline-flex items-center px-3 py-2 rounded-lg">
          Go to Dashboard
        </a>
      </div>
    </section>
  );
}

function Dashboard() {
  return (
    <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
      <h1 className="text-xl font-semibold mb-2">Dashboard (Signed-in Landing)</h1>
      <p className="opacity-80">
        Start a one-by-one OCR intake: select document, upload, and process.
      </p>
    </section>
  );
}

function Results() {
  return (
    <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
      <h1 className="text-xl font-semibold mb-2">Results</h1>
      <p className="opacity-80">Raw snippet, summary, risk score, and downloads.</p>
    </section>
  );
}

function Admin() {
  return (
    <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
      <h1 className="text-xl font-semibold mb-2">Admin</h1>
      <p className="opacity-80">User management and settings.</p>
    </section>
  );
}

// --- App ---
export default function App() {
  const isAuthed = false; // TODO: replace with Cognito session check
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute isAuthed={isAuthed}><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/results"
            element={<ProtectedRoute isAuthed={isAuthed}><Results /></ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute isAuthed={isAuthed}><Admin /></ProtectedRoute>}
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
