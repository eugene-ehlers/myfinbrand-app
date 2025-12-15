// src/data/toolsContent.js

export const TOOL_CATEGORIES = [
  "ROI & Business Case",
  "Operations & Cost",
  "Credit & Risk",
  "Governance",
  "Profitability",
  "Calculator",
  "Assessment",
  "Strategy",
  "Operations",
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
    featuredRank: 1,
    relatedInsights: ["decision-engines-101", "ai-driven-business-advantage"],
    accent: "teal",
    ctaLabel: "Calculate ROI",
    note: "Best for: investment cases and executive ROI conversations.",
  },
  {
    slug: "manual-underwriting-cost",
    title: "Manual Underwriting Cost & Capacity Calculator",
    summary:
      "Translate decision volumes and handling time into FTE, monthly cost, and peak-demand capacity risk.",
    path: "/tools/manual-underwriting-cost",
    date: "2025-12-13",
    read: "2 min",
    tags: ["Operations", "Cost-to-Serve", "Capacity"],
    category: "Operations & Cost",
    type: "Calculator",
    featured: true,
    featuredRank: 2,
    relatedInsights: ["decision-engines-101"],
    accent: "slate",
    ctaLabel: "Estimate cost",
    note: "Best for: ops leaders sizing teams, SLAs, and peak demand.",
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
    featuredRank: 3,
    relatedInsights: ["building-predictive-models-in-house"],
    accent: "navy",
    ctaLabel: "Compare options",
    note: "Best for: deciding whether to build internally or rent proven models.",
  },
  {
    slug: "scorecard-profit-impact",
    title: "Scorecard Profit Impact Calculator",
    summary:
      "Translate scorecard performance into real profit and loss using a confusion-matrix-based economic model.",
    path: "/tools/scorecard-profit-impact",
    date: "2025-12-13",
    read: "3 min",
    tags: ["Scorecards", "Profitability", "Credit Strategy"],
    category: "Credit & Risk",
    type: "Calculator",
    featured: true,
    featuredRank: 4,
    relatedInsights: ["decision-cohesion", "five-decisions", "why-ml"],
    accent: "teal",
    ctaLabel: "Model profit impact",
    note: "Best for: connecting technical uplift to business profit outcomes.",
  },
  {
  slug: "scorecard-compare-profit",
  title: "Scorecard Champion vs Challenger Profit Comparator",
  summary:
    "Compare a current scorecard vs a new scorecard (or cut-off) using both operational metrics and profit impact — approvals, bads booked, and net profit.",
  path: "/tools/scorecard-compare-profit",
  date: "2025-12-13",
  read: "3–4 min",
  tags: ["Scorecards", "Champion/Challenger", "Profitability", "Credit Strategy"],
  category: "Credit & Risk",
  type: "Calculator",
  featured: true,
  // Optional discovery helpers for your ResourcesHeader
  accent: "teal",
  ctaLabel: "Compare two scorecards →",
  // Optional: if/when you wire these into the UI later
  relatedInsights: ["decision-cohesion", "decision-engines-101"],
},

  {
  slug: "decisioning-fit-readiness",
  path: "/tools/decisioning-fit-readiness",
  title: "Decisioning Fit & Readiness Self-Assessment",
  summary:
    "A calm self-assessment to help operators understand whether their current way of making decisions still fits their business.",
  date: "2025-01-29",
  read: "4–5 min",
  category: ["Strategy", "Operations"],
  type: "Assessment",
  tags: [
    "Readiness",
    "Decision ownership",
    "Manual decisions",
    "Control",
  ],
  featured: true,
  featuredRank: 1,
  accent: "slate",
  ctaLabel: "Start assessment",
},

{
  slug: "decision-tradeoff-prioritiser",
  path: "/tools/decision-tradeoff-prioritiser",
  title: "Decision Trade-off Prioritiser",
  summary:
    "Clarify what your business is really optimising for when decisions involve trade-offs between profit, risk, speed, effort, and fairness.",
  date: "2025-01-30",
  read: "3–4 min",
  category: ["Strategy", "Operations"],
  type: "Assessment",
  tags: [
    "Trade-offs",
    "Optimisation",
    "Profit",
    "Cost-to-serve",
    "Decision clarity",
  ],
  featured: true,
  featuredRank: 2,
  accent: "slate",
  ctaLabel: "Prioritise trade-offs",
}



];
