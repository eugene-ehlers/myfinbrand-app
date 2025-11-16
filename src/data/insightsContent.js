// src/data/insightsContent.js

export const CATEGORIES = [
  "Strategy & Transformation",
  "Decision Automation & Use Cases",
  "Technology & Implementation",
];

export const TYPES = ["White Paper", "Article"];

export const INSIGHTS = [
  {
    slug: "decision-engines-101",
    title: "Decision Engines 101: From Rules to ROI",
    summary:
      "A practical primer on decision automation: architecture, governance, and a 90-day rollout plan.",
    path: "/insights/decision-engines-101",
    date: "2025-11-10",
    read: "8 min read",
    tags: ["Decision Automation", "Credit", "Risk"],
    category: "Decision Automation & Use Cases",
    type: "White Paper",          // 💡 you can distinguish white papers here
    audience: "Risk & Operations",
  },
  {
    slug: "ai-driven-business-advantage",
    title: "From Buzzword to Bottom Line: AI-Driven Business Advantage",
    summary:
      "A step-by-step executive framework to align AI investments with strategy and ROI.",
    path: "/insights/ai-driven-business-advantage",
    date: "2025-11-11",
    read: "10 min read",
    tags: ["AI Strategy", "Transformation", "ROI"],
    category: "Strategy & Transformation",
    type: "White Paper",
    audience: "Executives & Boards",
  },
{
  slug: "building-predictive-models-in-house",
  title: "Building Predictive Models In-House: What Your Business Needs",
  summary:
    "A practical executive guide covering skills, infrastructure, model governance, and alternative options such as bureau models and scorecard rental.",
  path: "/docs/building-predictive-models-in-house-v1-nov25.pdf",
  date: "2025-11-15",
  read: "8 min read",
  tags: ["Predictive Models", "Scorecards", "Analytics"],
  category: "Technology & Implementation",
  type: "White Paper",
  audience: "Risk, Data & IT Leaders",
},

  // Example of a future technical guide:
  // {
  //   slug: "decision-engine-architecture",
  //   title: "Inside a Modern Decision Engine Architecture",
  //   summary: "Technical overview for architects and CTOs.",
  //   path: "/insights/decision-engine-architecture",
  //   date: "2025-12-01",
  //   read: "12 min read",
  //   tags: ["Architecture", "APIs"],
  //   category: "Technology & Implementation",
  //   type: "Article",
  //   audience: "Architects & Engineering",
  // },
];
