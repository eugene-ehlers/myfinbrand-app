// src/data/libraryContent.js

export const LIBRARY_CATEGORIES = [
  "Start here",
  "Situations",
  "Questions",
  "Field notes",
  "Briefings",
];

export const LIBRARY_TYPES = ["Situation", "Question", "Field Note", "Briefing"];

// Main list used by Library.jsx
export const LIBRARY = [
  {
    slug: "start-here-micro-lender-to-modern-decisions",
    kind: "briefings",
    title:
      "Start Here: From Excel & Rules to Modern Decisioning (Without Losing Control)",
    summary:
      "A respectful, practical pathway for small lenders and retailers moving from manual decisioning into repeatable, governed decisions—without big-bank complexity.",
    date: "2025-12-13",
    read: "4–5 min",
    tags: ["Micro lenders", "Retailers", "Rules", "Decisioning"],
    category: "Start here",
    type: "Briefing",
    featured: true,
    featuredRank: 1,
    accent: "teal",
    body: {
      sections: [
        {
          heading: "The real problem is not technology",
          paragraphs: [
            `Most small lenders do not lack software; they lack clarity. Decisions sit inside a loan management system (LMS) or somewhere “else”, as a mix of hidden rules, staff habits, and exceptions. That works—until volumes rise, staff change, fraud increases, or the regulator asks “why”.`,
            "A decision engine is not a ‘bank thing’. It is a way of making your rules and trade-offs explicit, testable, auditable, and improvable—without forcing you to become a data science shop.",
          ],
        },
        {
          heading: "The minimum viable modernisation (what to do first)",
          bullets: [
            "Write down your top 10 rules in plain business language (not system fields).",
            "Separate ‘policy’ from ‘process’ (who decides vs how the work flows).",
            "Measure 3 numbers: time-to-decision, approval rate, and bad rate by segment.",
            "Move decisioning out of ‘people memory’ into a governed rules layer.",
          ],
        },
        {
          heading: "Where scorecards fit (and why distrust is common)",
          paragraphs: [
            "If you’ve had a bad experience with bureau scores, you’re not alone. The mistake is treating a bureau score as ‘the decision’. It’s only one input. A practical path is to start with transparent rules, add verification steps, then introduce simple scorecarding as a controlled challenger—measured by profit, not only Gini.",
          ],
        },
      ],
    },
  },

  {
    slug: "situation-lms-does-everything",
    kind: "situations",
    title:
      "Situation: “Our LMS already does originations — why do we need anything else?”",
    summary:
      "How to explain the difference between an LMS workflow and a governed decision layer—using language operators recognise.",
    date: "2025-12-13",
    read: "3–4 min",
    tags: ["LMS", "Originations", "Rules", "Governance"],
    category: "Situations",
    type: "Situation",
    featured: true,
    featuredRank: 2,
    accent: "navy",
    body: {
      sections: [
        {
          heading: "What an LMS is great at",
          bullets: [
            "Capturing applications and documents",
            "Managing accounts and repayments",
            "Producing statements and operational reporting",
          ],
        },
        {
          heading: "What an LMS is usually bad at",
          bullets: [
            "Transparent, testable decision logic (rules are hidden, scattered, or hard-coded)",
            "Consistent exception handling and audit trails",
            "Champion/Challenger testing and safe improvement cycles",
          ],
        },
        {
          heading: "The simplest explanation",
          paragraphs: [
            "Think of the LMS as the ‘factory floor’. The decision layer is the ‘quality system’ that tells the factory what rules apply today, what changed, and why.",
          ],
        },
      ],
    },
  },

  {
    slug: "question-what-is-a-scorecard",
    kind: "questions",
    title: "Question: “What is a scorecard, in plain terms?”",
    summary:
      "A short, jargon-free explanation of scorecards, why they fail in practice, and how to use them safely.",
    date: "2025-12-13",
    read: "3 min",
    tags: ["Scorecards", "Risk", "Plain language"],
    category: "Questions",
    type: "Question",
    featured: true,
    featuredRank: 3,
    accent: "slate",
    body: {
      sections: [
        {
          heading: "Plain definition",
          paragraphs: [
            "A scorecard is a consistent way to combine multiple signals (e.g., income, stability, repayment history, identity checks) into one risk indicator—so your decisions are not dependent on who is working the application that day.",
          ],
        },
        {
          heading: "Why scorecards get distrusted",
          bullets: [
            "They are implemented as a black box (no explainability).",
            "They are applied without policy overlays or verification checks.",
            "Teams optimise technical metrics and ignore profit economics.",
            "No monitoring—performance drifts quietly over time.",
          ],
        },
        {
          heading: "How to use them safely",
          bullets: [
            "Start with rules you trust, then introduce the score as one input.",
            "Pilot with a challenger strategy, not a big-bang replacement.",
            "Measure profit impact, not only Gini/KS/AUC.",
          ],
        },
      ],
    },
  },

  {
    slug: "field-note-why-5-bad-rate-can-still-hide-risk",
    kind: "notes",
    title:
      "Field Note: “We have a 5% bad rate — we’re fine” (Sometimes you aren’t)",
    summary:
      "Why a low headline bad rate can still hide leakage, fraud exposure, and poor growth economics—especially in 1-month products.",
    date: "2025-12-13",
    read: "4 min",
    tags: ["Bad rate", "Short-term loans", "Leakage", "Fraud"],
    category: "Field notes",
    type: "Field Note",
    featured: false,
    accent: "slate",
    body: {
      sections: [
        {
          heading: "Common blind spots",
          bullets: [
            "Bad rate is averaged across segments—high-risk segments may be growing quietly.",
            "Fraud and identity issues often show up as ‘good’ until they don’t.",
            "Short-term products can mask affordability stress that appears on repeat borrowing.",
          ],
        },
        {
          heading: "A better set of questions",
          bullets: [
            "What is bad rate by acquisition channel and branch/agent?",
            "What is repeat borrowing behaviour by segment?",
            "What is time-to-decision and dropout before completion?",
          ],
        },
      ],
    },
  },

  {
    slug: "briefing-trust-someone-to-do-it-for-me",
    kind: "briefings",
    title:
      "Briefing: “Just do everything for me” — A Managed Decisioning Model That Still Keeps You Safe",
    summary:
      "How a ‘trust someone I trust’ persona can adopt decisioning without building internal capability first—while retaining governance and control.",
    date: "2025-12-13",
    read: "4 min",
    tags: ["Managed service", "Governance", "Outsourcing"],
    category: "Briefings",
    type: "Briefing",
    featured: false,
    accent: "teal",
    body: {
      sections: [
        {
          heading: "The risk with outsourcing decisioning",
          paragraphs: [
            "Outsourcing can speed up delivery, but it can also create dependency and hidden logic. The answer is not ‘don’t outsource’—it is to structure outsourcing around governance artefacts.",
          ],
        },
        {
          heading: "What you should insist on (non-negotiables)",
          bullets: [
            "Your policy rules documented in business language",
            "Versioning of decision rules and models",
            "Reason codes for approvals/declines",
            "Monthly monitoring pack (quality + profit metrics)",
          ],
        },
      ],
    },
  },
];

export function getLibraryItem(kind, slug) {
  return LIBRARY.find((x) => x.kind === kind && x.slug === slug);
}

export function getFeaturedLibrary() {
  return [...LIBRARY]
    .filter((x) => x.featured)
    .sort((a, b) => {
      const ar = Number.isFinite(a.featuredRank) ? a.featuredRank : 9999;
      const br = Number.isFinite(b.featuredRank) ? b.featuredRank : 9999;
      return ar - br || (b.date || "").localeCompare(a.date || "");
    });
}
