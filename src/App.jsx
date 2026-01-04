// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";


// Core pages
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Admin from "./pages/Admin.jsx";
import Insights from "./pages/Insights.jsx";
import Founder from "./pages/Founder.jsx";
import Results from "./pages/Results.jsx";

// Solutions
import Collections from "./pages/solutions/Collections.jsx";
import Originations from "./pages/solutions/Originations.jsx";
import Fraud from "./pages/solutions/Fraud.jsx";
import KycFica from "./pages/solutions/KycFica.jsx";
import PricingOptimisation from "./pages/solutions/PricingOptimisation.jsx";
import CustomerManagement from "./pages/solutions/CustomerManagement.jsx";
import OurDecisionEngine from "./pages/solutions/OurDecisionEngine.jsx";

// Articles
import DecisionEngines101 from "./pages/articles/DecisionEngines101.jsx";
import AIDrivenBusinessAdvantage from "./pages/articles/AIDrivenBusinessAdvantage.jsx";
import BuildingPredictiveModelsInHouse from "./pages/articles/BuildingPredictiveModelsInHouse.jsx";
import WhyML from "./pages/articles/WhyML.jsx";
import AgenticVsDecisionEngine from "./pages/articles/AgenticVsDecisionEngine.jsx";

// Tools hub + calculators
import Tools from "./pages/Tools.jsx";
import ScorecardProfitImpact from "./pages/tools/ScorecardProfitImpact.jsx";
import DecisioningFitReadiness from "./pages/tools/DecisioningFitReadiness";
import DecisionTradeoffPrioritiser from "./pages/tools/DecisionTradeoffPrioritiser";
import RepeatVsNewEconomics from "./pages/tools/RepeatVsNewEconomics";
import RuleChangeLearningHygiene from "./pages/tools/RuleChangeLearningHygiene";
import DecisionOwnershipControlMap from "./pages/tools/DecisionOwnershipControlMap";
import ScorecardCompareProfit from "./pages/tools/ScorecardCompareProfit.jsx";

// Collections Tools (NEW structure)
import CollectionsToolDashboard from "./pages/tools/collections/CollectionsToolDashboard.jsx";

// Strategy pages under Tools
import CollectionsUploadTool from "./pages/tools/collections/strategy/upload/CollectionsUpload.jsx";
import CollectionsStrategyTool from "./pages/tools/collections/strategy/rules/CollectionsStrategy.jsx";
import CollectionsResultsTool from "./pages/tools/collections/strategy/results/CollectionsResults.jsx";

// Scorecards under Tools
import CollectionsScorecardRunner from "./pages/tools/collections/scorecards/:scorecardKey/upload/CollectionsScorecardRunner.jsx";
import CollectionsScorecardOutcome from "./pages/tools/collections/scorecards/:scorecardKey/outcome/CollectionsScorecardOutcome.jsx";

// Legal + library + cookie
import CookieNotice from "./components/CookieNotice.jsx";
import Disclaimer from "./pages/Disclaimer.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import Library from "./pages/Library.jsx";
import LibraryArticle from "./pages/LibraryArticle.jsx";

export default function App() {
  return (
    <>
      <CookieNotice />

      <Routes>
        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Founder */}
        <Route path="/founder" element={<Founder />} />

        {/* Core */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/results" element={<Results />} />

        {/* =========================
            Tools (existing)
           ========================= */}
        <Route path="/tools" element={<Tools />} />
        <Route
          path="/tools/scorecard-profit-impact"
          element={<ScorecardProfitImpact />}
        />
        <Route
          path="/tools/decisioning-fit-readiness"
          element={<DecisioningFitReadiness />}
        />
        <Route
          path="/tools/decision-tradeoff-prioritiser"
          element={<DecisionTradeoffPrioritiser />}
        />
        <Route
          path="/tools/scorecard-compare-profit"
          element={<ScorecardCompareProfit />}
        />
        <Route
          path="/tools/repeat-vs-new-customer-economics"
          element={<RepeatVsNewEconomics />}
        />
        <Route
          path="/tools/rule-change-learning-hygiene"
          element={<RuleChangeLearningHygiene />}
        />
        <Route
          path="/tools/decision-ownership-control-map"
          element={<DecisionOwnershipControlMap />}
        />

        {/* =========================
            Tools - Collections (NEW)
           ========================= */}
        <Route path="/tools/collections" element={<CollectionsToolDashboard />} />

        {/* Tools - Collections Strategy */}
        <Route
          path="/tools/collections/strategy/upload"
          element={<CollectionsUploadTool />}
        />
        <Route
          path="/tools/collections/strategy/rules"
          element={<CollectionsStrategyTool />}
        />
        <Route
          path="/tools/collections/strategy/results"
          element={<CollectionsResultsTool />}
        />

        {/* Tools - Collections Scorecards */}
        <Route
          path="/tools/collections/scorecards/:scorecardKey/upload"
          element={<CollectionsScorecardRunner />}
        />
        <Route
          path="/tools/collections/scorecards/:scorecardKey/outcome"
          element={<CollectionsScorecardOutcome />}
        />

        {/* =========================
            Legacy Collections routes
            (Optional: keep for backwards compatibility)
           ========================= */}
        <Route path="/collections-upload" element={<CollectionsUploadTool />} />
        <Route path="/collections-results" element={<CollectionsResultsTool />} />
        <Route path="/collections-strategy" element={<CollectionsStrategyTool />} />

        {/* =========================
            Solutions
           ========================= */}
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

        {/* =========================
            Insights + Articles
           ========================= */}
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

        {/* =========================
            Library
           ========================= */}
        <Route path="/library" element={<Library />} />
        <Route path="/library/:kind/:slug" element={<LibraryArticle />} />

        {/* =========================
            Legal
           ========================= */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclaimer" element={<Disclaimer />} />

        {/* Fallback (must be last) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
