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
    // Route to the article page (with PDF download link inside)
    path: "/insights/decision-engines-101",
    date: "2025-11-10",
    read: "8 min read",
    tags: ["Decision Automation", "Credit", "Risk"],
    category: "Decision Automation & Use Cases",
    type: "White Paper",
    audience: "Risk & Operations",
  },

  {
    slug: "ai-driven-business-advantage",
    title: "From Buzzword to Bottom Line: AI-Driven Business Advantage",
    summary:
      "A step-by-step executive framework to align AI investments with strategy and ROI.",
    // Route to the article page (with PDF download link inside)
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
    summary: "...",
    path: "/insights/building-predictive-models-in-house",
    // ...
  },

  {
    slug: "agentic-vs-decision-engines",
    title: "Agentic AI vs Decision Engines: Why You Still Need a Governed Core",
    summary: "...",
    path: "/insights/agentic-vs-decision-engine",
    // ...
  },
  {
    slug: "why-machine-learning",
    title: "Why Machine Learning? From Manual Decisions to Modern Models",
    summary: "...",
    path: "/insights/why-ml",
    // ...
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
