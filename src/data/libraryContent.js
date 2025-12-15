// src/data/libraryContent.js

/* ============================
   Taxonomy (UI-facing)
   ============================ */

export const LIBRARY_CATEGORIES = [
  "Start here",
  "Situations",
  "Questions",
  "Field notes",
  "Briefings",
];

export const LIBRARY_TYPES = [
  "Situation",
  "Question",
  "Field Note",
  "Briefing",
];

/* ============================
   Library Content Registry
   ============================ */

export const LIBRARY = [
  /* ======================================================
     START HERE
     ====================================================== */

  {
    slug: "start-here-micro-lender-to-modern-decisions",
    kind: "briefings",
    title:
      "Start Here: From Excel & Rules to Modern Decisioning (Without Losing Control)",
    summary:
      "A respectful, practical pathway for small lenders and retailers moving from manual decisioning into repeatable, governed decisions—without big-bank complexity.",
    date: "2025-12-13",
    read: "4–5 min",
    tags: ["Manual decisions", "Rules", "Governance", "Decision ownership"],
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
            "Most small lenders do not lack software; they lack clarity. Decisions sit inside systems, people’s heads, spreadsheets, or inherited practices. That works—until volumes rise, staff change, fraud increases, or accountability is questioned.",
            "Decisioning maturity is not about becoming a bank. It is about making trade-offs explicit, testable, and explainable—at a pace that fits the business.",
          ],
        },
        {
          heading: "A minimum viable starting point",
          bullets: [
            "Write down your top rules in plain business language.",
            "Separate policy decisions from operational workflow.",
            "Measure approval rate, time-to-decision, and outcomes by segment.",
            "Move decisions out of memory and habit into something visible.",
          ],
        },
      ],
    },
  },

  /* ======================================================
     SITUATIONS
     ====================================================== */

  {
    slug: "situation-lms-does-everything",
    kind: "situations",
    title:
      "Situation: “Our LMS already does originations — why do we need anything else?”",
    summary:
      "How to explain the difference between workflow systems and decision ownership—using language operators recognise.",
    date: "2025-12-13",
    read: "3–4 min",
    tags: ["Systems", "Workflow", "Governance"],
    category: "Situations",
    type: "Situation",
    featured: true,
    featuredRank: 2,
    accent: "navy",
    body: {
      sections: [
        {
          heading: "What systems are excellent at",
          bullets: [
            "Capturing data and documents",
            "Managing accounts and transactions",
            "Producing operational reports",
          ],
        },
        {
          heading: "Where responsibility often disappears",
          bullets: [
            "Decision logic scattered across rules, configs, and habits",
            "Exceptions handled differently by different people",
            "No clear owner when outcomes drift",
          ],
        },
        {
          heading: "A simple way to explain the gap",
          paragraphs: [
            "Systems run the process. Someone still needs to own the decisions the process executes.",
          ],
        },
      ],
    },
  },

  /* ======================================================
     QUESTIONS
     ====================================================== */

  {
    slug: "question-what-is-a-scorecard",
    kind: "questions",
    title: "Question: “What is a scorecard, in plain terms?”",
    summary:
      "A short, jargon-free explanation of scorecards, why they get distrusted, and how to use them safely.",
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
          heading: "A plain definition",
          paragraphs: [
            "A scorecard is a consistent way of combining signals so decisions are not dependent on who happens to be working that day.",
          ],
        },
        {
          heading: "Why they often fail in practice",
          bullets: [
            "They are treated as the decision, not an input.",
            "They are opaque to business owners.",
            "They optimise statistics instead of economics.",
            "They are not monitored once live.",
          ],
        },
      ],
    },
  },

  /* ======================================================
     FIELD NOTES
     ====================================================== */

  {
    slug: "field-note-why-5-bad-rate-can-still-hide-risk",
    kind: "notes",
    title:
      "Field Note: “We have a 5% bad rate — we’re fine” (Sometimes you aren’t)",
    summary:
      "Why acceptable headline numbers can still hide risk, leakage, and missed growth.",
    date: "2025-12-13",
    read: "4 min",
    tags: ["Bad rate", "Blind spots", "Risk visibility"],
    category: "Field notes",
    type: "Field Note",
    featured: false,
    accent: "slate",
    body: {
      sections: [
        {
          heading: "Where problems hide",
          bullets: [
            "Risk averaged across segments",
            "Fraud showing up late",
            "Repeat behaviour masking stress",
          ],
        },
      ],
    },
  },

  {
    slug: "field-note-when-everything-you-trust-says-its-fine",
    kind: "notes",
    title: "When Everything You Trust Says “It’s Fine” — and It Isn’t",
    summary:
      "Why trusted systems, standards, and assurances can still mask problems—and why early signals are usually human.",
    date: "2025-01-15",
    read: "3–4 min",
    tags: [
      "Delegated trust",
      "Decision ownership",
      "Early warning signals",
    ],
    category: "Field notes",
    type: "Field Note",
    featured: true,
    featuredRank: 4,
    accent: "slate",
    body: {
      sections: [
        {
          paragraphs: [
            "There is a particular kind of discomfort experienced operators recognise. Nothing is visibly broken. Reports look acceptable. Trusted systems and standards all say things are fine.",
            "And yet, something feels off.",
            "The most expensive problems rarely announce themselves early. They hide in missed growth, quiet margin erosion, habitual exceptions, and customers you never see.",
            "Trust is not the problem. The problem is when trust replaces ownership.",
            "If the business started today, with what you know now, would it be set up the same way?",
          ],
        },
      ],
    },
  },

  /* ======================================================
     BRIEFINGS
     ====================================================== */

  {
    slug: "briefing-trust-someone-to-do-it-for-me",
    kind: "briefings",
    title:
      "Briefing: “Just do everything for me” — A Managed Decisioning Model That Still Keeps You Safe",
    summary:
      "How outsourcing decisions can work—if ownership and governance are preserved.",
    date: "2025-12-13",
    read: "4 min",
    tags: ["Outsourcing", "Governance", "Ownership"],
    category: "Briefings",
    type: "Briefing",
    featured: false,
    accent: "teal",
    body: {
      sections: [
        {
          heading: "The real risk with delegation",
          paragraphs: [
            "Delegating execution is sensible. Delegating responsibility is not. Problems arise when no one inside the business can explain why decisions are made.",
          ],
        },
        {
          heading: "Non-negotiables",
          bullets: [
            "Documented policy in business language",
            "Versioned rules and models",
            "Clear reason codes",
            "Regular outcome reviews",
          ],
        },
      ],
    },
  },
];

/* ============================
  Everyone we trust
   ============================ */

{
  slug: "situation-everyone-we-trust-says-its-fine",
  kind: "situations",
  title: "Situation: “Everyone we trust says it’s fine — so why does it feel wrong?”",
  summary:
    "A common moment where systems, standards, and advisors all agree — yet unease remains. Why this feeling matters, and why it often appears before any metric changes.",
  date: "2025-01-16",
  read: "3–4 min",
  tags: [
    "Delegated trust",
    "Decision ownership",
    "Early warning signs",
    "Governance",
  ],
  category: "Situations",
  type: "Situation",
  featured: false,
  accent: "slate",
  body: {
    sections: [
      {
        heading: "The situation",
        paragraphs: [
          "You’ve asked the questions. You’ve checked the reports. You’ve spoken to the people you trust.",
          "The answers are consistent. The system is working. The benchmarks look acceptable. The regulator hasn’t raised concerns. Peers are doing something similar.",
          "And yet, you’re not fully comfortable.",
        ],
      },
      {
        heading: "Why this moment is easy to ignore",
        paragraphs: [
          "There is no obvious trigger. No spike in losses. No operational failure. No external pressure forcing a change.",
          "Raising concerns feels awkward when everything appears defensible. It can sound like overthinking, or worse, a lack of confidence in people and systems that have worked so far.",
        ],
      },
      {
        heading: "What is usually happening underneath",
        paragraphs: [
          "In many businesses, responsibility for decisions has quietly moved outward — into systems, standards, advisors, or accepted practice.",
          "This is not negligence. It is often a sign of maturity and trust. But over time, it can blur a simple question:",
        ],
      },
      {
        heading: "A quiet test",
        paragraphs: [
          "If something started to drift tomorrow — slowly, subtly — who would notice first?",
          "Not who would be blamed later. Who would recognise the change early enough to respond calmly?",
        ],
      },
      {
        heading: "Why this matters now",
        paragraphs: [
          "This feeling tends to appear before numbers move, before regulators ask questions, and before options narrow.",
          "It is not a signal to act immediately. It is a signal to look more closely, while there is still time to do so without urgency.",
        ],
      },
    ],
  },
}


/* ============================
   Helpers
   ============================ */

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
