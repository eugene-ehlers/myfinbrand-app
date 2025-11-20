// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Admin from "./pages/Admin.jsx";

import Insights from "./pages/Insights.jsx";

// Solutions
import Collections from "./pages/solutions/Collections.jsx";
import Originations from "./pages/solutions/Originations.jsx";

// Article pages
import DecisionEngines101 from "./pages/articles/DecisionEngines101.jsx";
import AIDrivenBusinessAdvantage from "./pages/articles/AIDrivenBusinessAdvantage.jsx";
import BuildingPredictiveModelsInHouse from "./pages/articles/BuildingPredictiveModelsInHouse.jsx";
import WhyML from "./pages/articles/WhyML.jsx";
import AgenticVsDecisionEngine from "./pages/articles/AgenticVsDecisionEngine.jsx";

import Founder from "./pages/Founder.jsx";

export default function App() {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<Landing />} />

      {/* Founder page */}
      <Route path="/founder" element={<Founder />} />

      {/* Existing routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<Admin />} />

      {/* Solutions */}
      <Route path="/solutions/collections" element={<Collections />} />
      <Route path="/solutions/originations" element={<Originations />} />

      {/* Insights hub + articles */}
      <Route path="/insights" element={<Insights />} />
      <Route path="/insights/why-ml" element={<WhyML />} />
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
      <Route
        path="/insights/agentic-vs-decision-engine"
        element={<AgenticVsDecisionEngine />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
