// src/data/toolsContent.js
export const TOOL_CATEGORIES = [
  "ROI & Business Case",
  "Operations & Cost",
  "Credit & Risk",
  "Governance",
  "Profitability",
];

export const TOOL_TYPES = ["Calculator", "Assessment", "Explorer"];

export const TOOLS = [
  {
    slug: "decision-engine-roi",
    title: "Decision Engine ROI & Payback Calculator",
    summary:
      "Estimate ROI, payback period, and value drivers from decision automation (cost-to-serve, conversion uplift, and loss reduction).",
    path: "/tools/decision-engine-roi",
    date: "2025-12-13",
    read: "2–3 min",
    tags: ["ROI", "Decision Automation", "Executive"],
    category: "ROI & Business Case",
    type: "Calculator",
    featured: true,
    // optional: recommended download(s) to show on the tool page
    relatedInsights: ["decision-engines-101", "ai-driven-business-advantage"],
  },
  {
    slug: "manual-underwriting-cost",
    title: "Manual Underwriting Cost & Capacity Calculator",
    summary:
      "Translate volumes and handling time into FTE, monthly cost, and SLA risk under peak demand.",
    path: "/tools/manual-underwriting-cost",
    date: "2025-12-13",
    read: "2 min",
    tags: ["Operations", "Cost-to-Serve", "Capacity"],
    category: "Operations & Cost",
    type: "Calculator",
    featured: true,
    relatedInsights: ["decision-engines-101"],
  },
  {
    slug: "build-vs-rent-models",
    title: "Build vs Rent: Predictive Model TCO Comparator",
    summary:
      "Compare 3-year TCO and timeline for in-house models vs models-as-a-service, including governance and monitoring overhead.",
    path: "/tools/build-vs-rent-models",
    date: "2025-12-13",
    read: "3 min",
    tags: ["TCO", "MLOps", "Governance"],
    category: "Credit & Risk",
    type: "Calculator",
    featured: true,
    relatedInsights: ["building-predictive-models-in-house"],
  },
];
