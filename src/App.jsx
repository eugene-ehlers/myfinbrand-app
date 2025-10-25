import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

// use your existing components
import Header from "./components/Header";
import Footer from "./components/Footer";

// temporary page stubs (swap to your real ones as you go)
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
function Results() { return <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
  <h1 className="text-xl font-semibold mb-2">Results</h1>
  <p className="opacity-80">Raw snippet, summary, risk score, and downloads.</p>
</section>; }
function Admin() { return <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
  <h1 className="text-xl font-semibold mb-2">Admin</h1>
  <p className="opacity-80">User management and settings.</p>
</section>; }

// Layout now uses your Header + Footer
function MainLayout({ children }) {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-[rgb(var(--bg))] text-[rgb(var(--ink))]">
      <Header />
      <main className="container py-6">{children}</main>
      <Footer />
    </div>
  );
}

// Simple auth gate (stub)
function ProtectedRoute({ isAuthed, children }) {
  if (!isAuthed) {
    window.location.assign("/");
    return null;
  }
  return children;
}

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
