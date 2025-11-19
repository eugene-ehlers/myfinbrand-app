// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Admin from "./pages/Admin.jsx";

// NEW: Insights hub + first article
import Insights from "./pages/Insights.jsx";

// Article pages
import DecisionEngines101 from "./pages/articles/DecisionEngines101.jsx";
import AIDrivenBusinessAdvantage from "./pages/articles/AIDrivenBusinessAdvantage.jsx";
import BuildingPredictiveModelsInHouse from "./pages/articles/BuildingPredictiveModelsInHouse.jsx";
import Founder from "./pages/Founder.jsx";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

            {/* Founder page */}
      <Route path="/founder" element={<Founder />} />

      {/* Existing routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<Admin />} />

      {/* NEW: Insights hub + article */}
      <Route path="/insights" element={<Insights />} />


            {/* Article detail pages */}
      <Route
        path="/insights/decision-engines-101"
        element={<DecisionEngines101 />}
      />
      <Route
        path="/insights/ai-driven-business-advantage"
        element={<AIDrivenBusinessAdvantage />}
      />
      <Route
        path="/insights/building-predictive-models-in-house"
        element={<BuildingPredictiveModelsInHouse />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


