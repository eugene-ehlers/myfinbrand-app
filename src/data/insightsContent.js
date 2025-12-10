// src/data/insightsContent.js

export const CATEGORIES = [
  "Strategy & Transformation",
  "Decision Automation & Use Cases",
  "Technology & Implementation",
  "Decisioning",
  "AI Strategy",
  "Credit & Risk",
  "Decision Architecture",
  "Credit Strategy",
  "Profitability",
  "Governance",
  "Automation",
];

export const TYPES = [
  "White Paper",
  "Executive Briefing",
  "Article",
];

export const INSIGHTS = [
  {
    slug: "decision-engines-101",
    title: "Decision Engines 101: From Rules to ROI",
    summary:
      "A practical primer on decision automation for credit and risk leaders: core concepts, architecture building blocks, governance requirements, and a 90-day rollout pattern from pilot to production.",
    // Route to the article page (with PDF download link inside)
    path: "/insights/decision-engines-101",
    date: "2025-11-10",
    read: "12 min read",
    tags: ["Decision Automation", "Credit", "Risk", "Architecture"],
    category: "Decision Automation & Use Cases",
    type: "White Paper",
    audience: "Risk & Operations",
  },

  {
    slug: "ai-driven-business-advantage",
    title: "From Buzzword to Bottom Line: AI-Driven Business Advantage",
    summary:
      "An executive framework to move from AI buzzwords to measurable business value: prioritising use cases, aligning with strategy, and setting up the right foundations for analytics and decisioning.",
    // Route to the article page (with PDF download link inside)
    path: "/insights/ai-driven-business-advantage",
    date: "2025-11-11",
    read: "10 min read",
    tags: ["AI Strategy", "Transformation", "ROI", "Executive"],
    category: "Strategy & Transformation",
    type: "White Paper",
    audience: "Executives & Boards",
  },

  {
    slug: "building-predictive-models-in-house",
    title: "Building Predictive Models In-House: What Your Business Needs",
    summary:
      "A practical guide to what it really takes to build and host your own scorecards and ML models – skills, data, tooling, infrastructure, governance – and how this compares to bureau models or models-as-a-service.",
    path: "/insights/building-predictive-models-in-house",
    date: "2025-11-15",
    read: "9 min read",
    tags: ["Predictive Models", "Scorecards", "Analytics", "Operating Model"],
    category: "Technology & Implementation",
    type: "White Paper",
    audience: "Risk, Data & IT Leaders",
  },

  {
    slug: "agentic-vs-decision-engines",
    title: "Agentic AI vs Decision Engines: Why You Still Need a Governed Core",
    summary:
      "Explores the strengths of agentic AI for orchestration and analysis, and explains why high-stakes, regulated decisions still require a deterministic, governed decision engine at the core.",
    path: "/insights/agentic-vs-decision-engine",
    date: "2025-11-16",
    read: "11 min read",
    tags: ["Agentic AI", "Decision Engines", "Governance", "Compliance"],
    category: "Technology & Implementation",
    type: "White Paper",
    audience: "Executives, Risk & Compliance",
  },

  {
    slug: "why-machine-learning",
    title: "Why Machine Learning? From Manual Decisions to Modern Models",
    summary:
      "An executive overview of how decisioning evolved from manual judgement to scorecards and now machine learning – and when simpler, transparent models still outperform complex technology in practice.",
    path: "/insights/why-ml",
    date: "2025-11-17",
    read: "8 min read",
    tags: ["Machine Learning", "Scorecards", "Risk Models", "Executive"],
    category: "Strategy & Transformation",
    type: "White Paper",
    audience: "Executives & Senior Management",
  },

  {
  title: "The Five Decisions Every Organisation Must Clarify Before Using AI",
  slug: "five-decisions",
  path: "/docs/Five-decisions.pdf",
  date: "2025-12-01",
  summary: "A practical framework for clarifying fixed, flexible, and judgement-based decisions before layering in AI, automation, or decision engines.",
  category: "Decision Architecture",
  type: "White Paper",
  tags: ["AI Strategy", "Decisioning", "Governance", "Automation"],
  featured: true,
  read: "6 min read"
},

  {
  title: "Decision Cohesion: Balancing Risk, Revenue, and Growth",
  slug: "decision-cohesion",
  path: "/docs/Three-curves.pdf",
  date: "2025-12-05",
  summary: "Explores how risk, sales, and finance optimise different curves — and how a unified decision engine aligns them around profitable, sustainable growth.",
  category: ["Credit Strategy","Profitability", "Credit & Risk", "Decisioning"]
  type: "White Paper",
  tags: ["Credit & Risk", "Profitability", "Decisioning"],
  featured: false,
  read: "7 min read"
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
