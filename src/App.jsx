// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// Existing pages (keep yours)
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Admin from "./pages/Admin.jsx";
import Collections_Upload from "./pages/CollectionsUpload.jsx";
import Collections_Results from "./pages/CollectionsResults.jsx";
import Collections_Strategy from "./pages/CollectionsStrategy.jsx";
import Insights from "./pages/Insights.jsx";
import Founder from "./pages/Founder.jsx";
import Results from "./pages/Results.jsx";

// Solutions (keep yours)
import Collections from "./pages/solutions/Collections.jsx";
import Originations from "./pages/solutions/Originations.jsx";
import Fraud from "./pages/solutions/Fraud.jsx";
import KycFica from "./pages/solutions/KycFica.jsx";
import PricingOptimisation from "./pages/solutions/PricingOptimisation.jsx";
import CustomerManagement from "./pages/solutions/CustomerManagement.jsx";
import OurDecisionEngine from "./pages/solutions/OurDecisionEngine.jsx";

// Articles (keep yours)
import DecisionEngines101 from "./pages/articles/DecisionEngines101.jsx";
import AIDrivenBusinessAdvantage from "./pages/articles/AIDrivenBusinessAdvantage.jsx";
import BuildingPredictiveModelsInHouse from "./pages/articles/BuildingPredictiveModelsInHouse.jsx";
import WhyML from "./pages/articles/WhyML.jsx";
import AgenticVsDecisionEngine from "./pages/articles/AgenticVsDecisionEngine.jsx";

// Tools hub + calculators (adjust to your actual paths)
import Tools from "./pages/Tools.jsx";
import ScorecardProfitImpact from "./pages/tools/ScorecardProfitImpact.jsx";
// If you have compare page:
// import ScorecardCompareProfit from "./pages/tools/ScorecardCompareProfit.jsx";

// NEW: legal + library + cookie
import CookieNotice from "./components/CookieNotice.jsx";
import Disclaimer from "./pages/Disclaimer.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import Library from "./pages/Library.jsx";

export default function App() {
  return (
    <>
      {/* Cookie banner shows site-wide */}
      <CookieNotice />

      <Routes>
        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Founder page */}
        <Route path="/founder" element={<Founder />} />

        {/* Existing routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />

        {/* Results */}
        <Route path="/results" element={<Results />} />

        {/* Collections demo routes */}
        <Route path="/collections-upload" element={<Collections_Upload />} />
        <Route path="/collections-results" element={<Collections_Results />} />
        <Route path="/collections-strategy" element={<Collections_Strategy />} />

        {/* Solutions */}
        <Route path="/solutions/collections" element={<Collections />} />
        <Route path="/solutions/originations" element={<Originations />} />
        <Route path="/solutions/fraud" element={<Fraud />} />
        <Route path="/solutions/kyc-fica" element={<KycFica />} />
        <Route
          path="/solutions/pricing-optimisation"
          element={<PricingOptimisation />}
        />
        <Route
          path="/solutions/customer-management"
          element={<CustomerManagement />}
        />
        <Route
          path="/solutions/our-decision-engine"
          element={<OurDecisionEngine />}
        />

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

        {/* Tools */}
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/scorecard-profit-impact" element={<ScorecardProfitImpact />} />
        {/* If you have compare page:
        <Route path="/tools/scorecard-compare-profit" element={<ScorecardCompareProfit />} />
        */}

        {/* Library */}
        <Route path="/library" element={<Library />} />

        {/* Legal */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclaimer" element={<Disclaimer />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
