// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Admin from "./pages/Admin.jsx";

// NEW: Insights hub + first article
import Insights from "./pages/Insights.jsx";
import DecisionEngines101 from "./pages/articles/DecisionEngines101.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Existing routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<Admin />} />

      {/* NEW: Insights hub + article */}
      <Route path="/insights" element={<Insights />} />
      <Route path="/insights/decision-engines-101" element={<DecisionEngines101 />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


