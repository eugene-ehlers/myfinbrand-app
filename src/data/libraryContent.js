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
    slug: "start-here-running-decisions-without-losing-control",
    kind: "briefings",
    title: "Start Here: Running Decisions Without Losing Control",
    summary:
      "A calm orientation for operators who run people- and Excel-based decisions and want to stay in control without rushing into change.",
    date: "2025-01-10",
    read: "4–5 min",
    tags: ["Manual decisions", "Control", "Ownership"],
    category: "Start here",
    type: "Briefing",
    featured: true,
    featuredRank: 1,
    accent: "slate",
    body: {
      sections: [
        {
          heading: "You are not behind",
          paragraphs: [
            "Many well-run businesses still rely on people, judgement, and spreadsheets. This is not a flaw. It is often a sign of experience and proximity to the work.",
            "Problems usually arise not because decisions are manual, but because no one can clearly explain how they are made when conditions change.",
          ],
        },
        {
          heading: "What this library is for",
          paragraphs: [
            "This library exists to help you think clearly about decisions before anything feels urgent.",
            "There is no required endpoint. Some organisations remain manual by choice — and do so well.",
          ],
        },
      ],
    },
  },

  /* ======================================================
     SITUATIONS
     ====================================================== */

  {
    slug: "situation-im-ok-should-i-worry",
    kind: "situations",
    title: "Situation: “I’m ok — should I worry?”",
    summary:
      "When nothing is broken, results are acceptable, but the world around you is changing.",
    date: "2025-01-11",
    read: "3–4 min",
    tags: ["Change", "Timing", "Stability"],
    category: "Situations",
    type: "Situation",
    featured: true,
    featuredRank: 2,
    accent: "slate",
    body: {
      sections: [
        {
          heading: "The situation",
          paragraphs: [
            "Your business is running. Customers are paying. Staff know what to do.",
            "At the same time, regulations, competitors, customer behaviour, and expectations seem to be shifting.",
          ],
        },
        {
          heading: "Why this is uncomfortable",
          paragraphs: [
            "There is no clear reason to act, but also no clear reason to ignore what is changing.",
            "This is not panic territory. It is timing territory.",
          ],
        },
      ],
    },
  },

  {
    slug: "situation-everyone-we-trust-says-its-fine",
    kind: "situations",
    title:
      "Situation: “Everyone we trust says it’s fine — so why does it feel wrong?”",
    summary:
      "When systems, standards, and advisors all agree — yet unease remains.",
    date: "2025-01-12",
    read: "3–4 min",
    tags: ["Delegated trust", "Early signals"],
    category: "Situations",
    type: "Situation",
    featured: false,
    accent: "slate",
    body: {
      sections: [
        {
          heading: "The quiet contradiction",
          paragraphs: [
            "Reports look acceptable. Trusted people confirm nothing is wrong.",
            "And yet, something does not fully sit right.",
          ],
        },
        {
          heading: "Why this matters",
          paragraphs: [
            "This feeling usually appears before metrics move.",
            "It is not a call to action — it is a prompt to look more closely.",
          ],
        },
      ],
    },
  },

  {
    slug: "situation-decisions-mostly-work-except-when-they-dont",
    kind: "situations",
    title: "Situation: “Our decisions mostly work — except when they don’t”",
    summary:
      "When outcomes are acceptable on average, but inconsistent in edge cases.",
    date: "2025-01-13",
    read: "3 min",
    tags: ["Inconsistency", "Exceptions"],
    category: "Situations",
    type: "Situation",
    featured: false,
    accent: "slate",
    body: {
      sections: [
        {
          paragraphs: [
            "Most cases are straightforward. Problems appear in the margins — exceptions, overrides, edge cases.",
            "These moments reveal how decisions are actually made.",
          ],
        },
      ],
    },
  },

  /* ======================================================
     QUESTIONS
     ====================================================== */

  {
    slug: "question-how-do-we-actually-decide-today",
    kind: "questions",
    title: "Question: “How do we actually decide today?”",
    summary:
      "A deceptively simple question that often reveals hidden rules and habits.",
    date: "2025-01-14",
    read: "2–3 min",
    tags: ["Visibility", "Decision logic"],
    category: "Questions",
    type: "Question",
    featured: false,
    accent: "slate",
    body: {
      sections: [
        {
          paragraphs: [
            "Not how decisions are supposed to be made — how they really are made.",
            "If the answer differs by person, location, or day, that difference matters.",
          ],
        },
      ],
    },
  },

{
  slug: "question-do-two-people-decide-the-same",
  kind: "questions",
  title:
    "Question: “If two people see the same case, do they decide the same way?”",
  summary:
    "Understanding when variation is healthy — and when it quietly becomes costly.",
  date: "2025-01-15",
  read: "7–8 min",
  tags: [
    "Consistency",
    "Judgement",
    "Fairness",
    "Control",
    "Decision ownership",
  ],
  category: "Questions",
  type: "Question",
  featured: false,
  accent: "slate",
  body: {
    sections: [
      {
        heading: "This question is not about sameness",
        paragraphs: [
          "In real businesses, perfect consistency is neither realistic nor desirable.",
          "Different people bring judgement, context, and experience. In many organisations, this human variation is precisely what makes decisions work.",
          "So the question is not whether every decision should be identical.",
          "The real question is whether differences are intentional, understood, and aligned with what is best for the business.",
        ],
      },
      {
        heading: "Where differences usually show up",
        paragraphs: [
          "Variation tends to appear in familiar places.",
          "Repeat or loyal customers may receive different treatment. Different staff may request different documents. Decision time may depend on who handles the case. Offers may vary for comparable situations.",
          "Individually, each decision can usually be defended. Collectively, these differences start to raise quiet questions.",
        ],
      },
      {
        heading:
          "Not always about correctness — but about fairness, effort, control, and what is best for the business",
        paragraphs: [
          "When similar cases produce different outcomes without a clear reason, the issue is not always that a decision is wrong.",
          "More often, it affects how fair the process feels, how much effort is required to achieve results, who really controls outcomes, and whether the business is operating in its own best interests.",
        ],
      },
      {
        heading: "When inconsistency is healthy",
        paragraphs: [
          "Inconsistency can be a strength when context genuinely matters, volumes are manageable, and experienced people are close to the work.",
          "In these environments, judgement fills gaps that rigid rules would struggle to capture.",
          "Trying to eliminate variation here can slow decisions, frustrate staff, and remove exactly the nuance that makes the business work.",
        ],
      },
      {
        heading: "When inconsistency becomes costly",
        paragraphs: [
          "Inconsistency starts to matter when it creates side effects.",
          "Customers feel treated differently without understanding why. Staff feel exposed or unfairly measured. Repeat behaviour becomes unpredictable. Cost-to-serve increases quietly through rework and delay.",
          "At this point, variation is no longer serving judgement. It is creating noise.",
        ],
      },
      {
        heading: "How staff experience this",
        paragraphs: [
          "From the staff side, inconsistency often feels like the rules are unclear or constantly shifting.",
          "People may feel that following the process puts them at a disadvantage, while bending the rules produces better results — especially when commissions or targets are involved.",
          "This is how quiet resistance emerges, not through misconduct, but through pragmatic adaptation.",
        ],
      },
      {
        heading: "When individuals outperform the process",
        paragraphs: [
          "A particularly important moment is when certain individuals consistently get better outcomes than the process itself.",
          "This may reflect experience and skill, but it raises critical questions.",
          "Do we know why they succeed? Could others replicate it? Is the organisation learning from it, or is performance trapped inside individuals?",
          "If the business cannot answer these questions, control begins to shift quietly.",
        ],
      },
      {
        heading: "The customer sees this too",
        paragraphs: [
          "From the customer’s perspective, inconsistency often appears as different answers, different document requests, or different turnaround times depending on who they speak to.",
          "Over time, this erodes trust — particularly for repeat customers, who expect familiarity and predictability.",
          "For repeat-driven businesses, this is often one of the earliest economic warning signs.",
        ],
      },
      {
        heading: "Finding the right level of progress",
        paragraphs: [
          "The question is not how to eliminate inconsistency, but what level of consistency actually serves the business today.",
          "Some organisations choose to stay largely manual and accept variation. Others reduce variation in specific decisions to protect cost, trust, or repeat economics.",
          "Neither path is better, and neither is worse. What matters is alignment with the organisation’s dream, ambition, and commercial reality.",
        ],
      },
      {
        heading: "A simple reflection",
        paragraphs: [
          "Are differences in decisions mostly intentional or accidental?",
          "Do we know which variations matter economically?",
          "Are we comfortable explaining these differences to staff and customers?",
          "If the answers are unclear, the issue is not automation or technology. It is clarity about what consistency means for us.",
        ],
      },
    ],
  },
},


  /* ======================================================
     FIELD NOTES
     ====================================================== */

  {
    slug: "field-note-5-percent-bad-rate",
    kind: "notes",
    title:
      "Field Note: “We have a 5% bad rate — we’re fine” (Sometimes you aren’t)",
    summary:
      "Why acceptable headline numbers can still hide risk and missed opportunity.",
    date: "2025-01-16",
    read: "4 min",
    tags: ["Metrics", "Blind spots"],
    category: "Field notes",
    type: "Field Note",
    featured: false,
    accent: "slate",
    body: {
      sections: [
        {
          bullets: [
            "Risk averaged across segments",
            "Late-appearing fraud",
            "Repeat behaviour masking stress",
          ],
        },
      ],
    },
  },

  {
    slug: "field-note-when-everything-feels-fine",
    kind: "notes",
    title: "When Everything You Trust Says “It’s Fine” — and It Isn’t",
    summary:
      "Why early signals are usually human, not numerical.",
    date: "2025-01-17",
    read: "3–4 min",
    tags: ["Human signals", "Ownership"],
    category: "Field notes",
    type: "Field Note",
    featured: true,
    featuredRank: 3,
    accent: "slate",
    body: {
      sections: [
        {
          paragraphs: [
            "The most expensive problems rarely announce themselves early.",
            "They surface first as unease, not failure.",
          ],
        },
      ],
    },
  },

  {
    slug: "field-note-where-responsibility-disappears",
    kind: "notes",
    title: "Where Responsibility Quietly Disappears in People-Based Decisions",
    summary:
      "How habits, precedent, and trust can blur ownership over time.",
    date: "2025-01-18",
    read: "3 min",
    tags: ["Responsibility", "Delegation"],
    category: "Field notes",
    type: "Field Note",
    featured: false,
    accent: "slate",
    body: {
      sections: [
        {
          paragraphs: [
            "Responsibility rarely disappears suddenly.",
            "It fades gradually into habit, assumption, and precedent.",
          ],
        },
      ],
    },
  },

  /* ======================================================
     BRIEFINGS
     ====================================================== */

  {
    slug: "briefing-delegating-without-realising-it",
    kind: "briefings",
    title: "Briefing: Delegating Decisions Without Realising It",
    summary:
      "How responsibility shifts quietly even in well-intentioned teams.",
    date: "2025-01-19",
    read: "4 min",
    tags: ["Delegation", "Governance"],
    category: "Briefings",
    type: "Briefing",
    featured: false,
    accent: "slate",
    body: {
      sections: [
        {
          paragraphs: [
            "Delegation is often implicit, not deliberate.",
            "Over time, no one is quite sure who owns the outcome.",
          ],
        },
      ],
    },
  },

  {
    slug: "briefing-what-good-enough-decisioning-looks-like",
    kind: "briefings",
    title: "Briefing: What ‘Good Enough’ Decisioning Actually Looks Like",
    summary:
      "Why staying manual can be the right choice — when done consciously.",
    date: "2025-01-20",
    read: "4–5 min",
    tags: ["Manual excellence", "Fit for purpose"],
    category: "Briefings",
    type: "Briefing",
    featured: false,
    accent: "slate",
    body: {
      sections: [
        {
          paragraphs: [
            "Good decisioning is about fit, not sophistication.",
            "For many organisations, manual processes remain appropriate and effective.",
          ],
        },
      ],
    },
  },

  {
    slug: "briefing-does-progress-mean-losing-control",
    kind: "briefings",
    title: "Briefing: Does Progress Mean Losing Control?",
    summary:
      "Why the fear of black boxes is understandable — and how control can be retained.",
    date: "2025-01-21",
    read: "7–8 min",
    tags: ["Control", "Black box", "Scorecards", "Governance"],
    category: "Briefings",
    type: "Briefing",
    featured: true,
    featuredRank: 4,
    accent: "slate",
    body: {
      sections: [
        {
          heading: "This fear is rational",
          paragraphs: [
            "For many operators, the idea of progressing decisioning raises a deep concern: that authority will shift away from the business.",
            "This is not resistance to improvement. It is a fear of losing control over outcomes, explanations, and accountability.",
          ],
        },
        {
          heading: "Where black boxes fit — and where they don’t",
          paragraphs: [
            "Scorecards are often experienced as black boxes. What matters is not seeing every calculation, but deciding where opacity is acceptable.",
            "Allowing a black box by choice — with clear boundaries — is very different from being ruled by one.",
          ],
        },
        {
          heading: "Control through explanation and visibility",
          paragraphs: [
            "Control is exercised through understandable decisions, consistent documentation, and meaningful reporting.",
            "When staff and customers can understand outcomes, authority remains with the business — even if some components are opaque.",
          ],
        },
        {
          heading: "Delegating execution vs delegating authority",
          paragraphs: [
            "Delegating execution is often necessary. Delegating authority is optional.",
            "Progress becomes risky only when these two are confused.",
          ],
        },
      ],
    },
  },
];

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
