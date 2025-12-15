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
  slug: "briefing-does-progress-mean-losing-control",
  kind: "briefings",
  title: "Briefing: Does Progress Mean Losing Control?",
  summary:
    "Why the fear of black boxes is understandable — and how real control is retained even as decisions evolve.",
  date: "2025-01-21",
  read: "8–9 min",
  tags: [
    "Control",
    "Black box",
    "Scorecards",
    "Governance",
    "Decision ownership",
  ],
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
          "For many operators, the idea of progressing decisioning raises a deep and personal concern: that authority will slowly shift away from the business.",
          "This fear is often expressed as resistance to black boxes, systems, models, or outside expertise. But underneath it is something more fundamental.",
          "It is not fear of improvement. It is fear of losing the ability to explain, defend, and ultimately own decisions.",
        ],
      },
      {
        heading: "Why “black box” has become shorthand for loss of control",
        paragraphs: [
          "In many organisations, this fear is rooted in real experience.",
          "Control has previously been lost when decisions were embedded deep inside systems, when rules were implemented without explanation, or when changes were made by people who did not carry responsibility for outcomes.",
          "Over time, progress became associated with opacity, rigidity, and diminished agency. In that context, resisting change can feel like the responsible choice.",
        ],
      },
      {
        heading: "The uncomfortable truth: control is often lost while staying manual",
        paragraphs: [
          "What is rarely acknowledged is that loss of control often begins long before any formal progression takes place.",
          "It shows up quietly when decisions depend on a few individuals, when no one can fully explain why outcomes differ, when rules are adjusted reactively, or when profit holds steady only through increased effort.",
          "At that point, control has not disappeared — it has migrated informally into habits, exceptions, and unspoken rules that no one explicitly owns.",
        ],
      },
      {
        heading: "Delegating execution is not the same as delegating authority",
        paragraphs: [
          "A critical distinction is often blurred: the difference between execution and authority.",
          "Execution is about who carries out decisions. Authority is about who defines, owns, and can deliberately change them.",
          "Progress becomes dangerous only when these two are confused. Delegating execution can be sensible. Delegating authority without intent is where control is lost.",
        ],
      },
      {
        heading: "Where black boxes can exist — without losing control",
        paragraphs: [
          "Scorecards are often the clearest example of a feared black box.",
          "What matters is not whether every calculation is visible, but whether the business decides where opacity is acceptable, what role the score plays, and under what conditions it can be challenged or overridden.",
          "Allowing a black box to exist by choice is very different from being ruled by one. In this sense, a scorecard becomes one delegated input within boundaries the business defines.",
        ],
      },
      {
        heading: "Why clarity of output matters more than visibility of logic",
        paragraphs: [
          "Another way control is often lost is not through the decision itself, but through how it is explained and observed.",
          "Control is exercised when staff can understand why an outcome occurred, customers receive consistent explanations, documents feel coherent, and reporting makes patterns visible.",
          "This does not require exposing internal mechanics. It requires that decisions can be explained in plain language and reviewed meaningfully over time.",
        ],
      },
      {
        heading: "Progress does not have to be total or irreversible",
        paragraphs: [
          "One of the biggest sources of fear is the assumption that progress is all-or-nothing or permanent.",
          "In reality, progression can be partial, reversible, and scoped to specific decisions. Some organisations formalise repeat decisions but keep new cases manual. Others clarify logic without automating it.",
          "This is not hesitation. It is intentional design.",
        ],
      },
      {
        heading: "The real question to ask",
        paragraphs: [
          "Instead of asking whether progress will cause a loss of control, a more useful question is where control already feels unclear — and whether that is acceptable.",
          "If you are comfortable, staying where you are is a valid choice. If not, the solution is not necessarily technology, but making ownership explicit again.",
        ],
      },
      {
        heading: "Where this leaves you",
        paragraphs: [
          "Progress does not mean losing control. Careless progress can. Unexamined complexity often does.",
          "Whether you stay manual or move forward, the principle remains the same: the business must be able to explain, defend, and deliberately change its decisions on its own terms.",
          "Everything else is secondary.",
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

   {
  slug: "situation-we-change-rules-but-results-dont-improve",
  kind: "situations",
  title: "Situation: “We change rules, but results don’t improve”",
  summary:
    "When effort is high, changes are frequent, but outcomes remain stubbornly familiar.",
  date: "2025-01-22",
  read: "7–8 min",
  tags: [
    "Rules",
    "Learning",
    "Static results",
    "Cost pressure",
    "Decision noise",
  ],
  category: "Situations",
  type: "Situation",
  featured: false,
  accent: "slate",
  body: {
    sections: [
      {
        heading: "This situation feels active, not broken",
        paragraphs: [
          "On the surface, there is no sense of neglect.",
          "Rules are reviewed. Thresholds are adjusted. New checks are introduced. Old ones are relaxed.",
          "People are paying attention. Effort is visible. Discussions are frequent.",
          "And yet, results feel stubbornly familiar.",
        ],
      },
      {
        heading: "What typically stays the same",
        paragraphs: [
          "Approval rates move slightly, then settle.",
          "Losses fluctuate, but do not meaningfully improve.",
          "Profit holds steady — often through effort rather than clarity.",
          "There is activity, but little confidence that changes are truly helping.",
        ],
      },
      {
        heading: "Why this is different from doing nothing",
        paragraphs: [
          "This situation is not about inaction.",
          "It is about change without clear learning.",
          "Rules are adjusted in response to pressure, instinct, or isolated events, but it becomes difficult to answer a simple question:",
          "Which change actually worked — and why?",
        ],
      },
      {
        heading: "How noisy learning creeps in",
        paragraphs: [
          "Noisy learning usually appears when multiple changes are made close together, often by different people, for different reasons.",
          "Results are assessed in aggregate rather than by segment, and short-term fluctuations are mistaken for trends.",
          "Over time, confidence in signals erodes. Everything feels tentative.",
        ],
      },
      {
        heading: "Why this often turns into a cost problem",
        paragraphs: [
          "When learning is unclear, businesses compensate with effort.",
          "More reviews. More senior involvement. More manual checks. More staff to be safe.",
          "This can keep outcomes stable — but it raises cost-to-serve.",
          "Profit stabilises not because decisions improved, but because more work was done to achieve the same result.",
        ],
      },
      {
        heading: "Where rules and scorecards are often blamed",
        paragraphs: [
          "At this stage, frustration often focuses on the tools.",
          "Either the rules are seen as ineffective, or scorecards are viewed as black boxes that do not deliver.",
          "In reality, the problem is often simpler: the role of each decision input is unclear, and changes are not isolated long enough to learn from.",
        ],
      },
      {
        heading: "Why this does not automatically mean progress is required",
        paragraphs: [
          "This situation does not mean you need more sophistication, automation, or new systems.",
          "It means the organisation is struggling to learn cleanly from its own decisions.",
          "That struggle can exist in fully manual environments and highly automated ones alike.",
        ],
      },
      {
        heading: "A useful pause",
        paragraphs: [
          "Instead of asking what to change next, it can be helpful to ask what you are actually trying to learn.",
          "Are rules changing because something specific is being tested, or because outcomes feel uncomfortable?",
          "Are you willing to leave something unchanged long enough to see its real effect?",
        ],
      },
      {
        heading: "Where this leaves you",
        paragraphs: [
          "This is not a failure point.",
          "It is often the moment where organisations decide — deliberately or not — whether to continue compensating with effort, or to improve clarity about how decisions are changed and evaluated.",
          "Neither choice is better or worse. What matters is that it aligns with the business’s goals, appetite, and economics.",
        ],
      },
      {
        heading: "The question that follows",
        paragraphs: [
          "If results are static despite frequent change, the next useful question is not what rule to adjust.",
          "It is: what are we actually optimising for?",
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
    "A practical way to surface how decisions are really made — beyond policy, rules, and intention.",
  date: "2025-01-14",
  read: "7–8 min",
  tags: [
    "Decision logic",
    "Judgement",
    "Visibility",
    "Ownership",
    "Learning",
  ],
  category: "Questions",
  type: "Question",
  featured: false,
  accent: "slate",
  body: {
    sections: [
      {
        heading: "This question is harder than it sounds",
        paragraphs: [
          "Most operators answer this question too quickly.",
          "They describe a policy document, a checklist, a set of rules in a system, or how decisions are supposed to be made.",
          "That answer is rarely wrong — but it is often incomplete.",
          "The more useful version of the question is quieter: how do decisions really get made when things are not straightforward?",
        ],
      },
      {
        heading: "Where decisions actually come from",
        paragraphs: [
          "In practice, decisions rarely come from a single place.",
          "They emerge from a mix of written rules, unwritten judgement, experience, precedent, incentives, time pressure, and who happens to be available.",
          "Individually, each of these makes sense. Together, they form a system that is difficult to see clearly.",
        ],
      },
      {
        heading: "Why different people describe the process differently",
        paragraphs: [
          "It is common for two experienced people in the same organisation to describe the decision process differently — and for both to be correct.",
          "Each person sees only the part of the process they interact with most.",
          "This is not confusion or incompetence. It is how human systems adapt when formal structure is light.",
        ],
      },
      {
        heading: "Why this matters as the business changes",
        paragraphs: [
          "As long as volumes are low and the same people are involved, this ambiguity is manageable.",
          "Problems start when new staff join, volume increases, repeat customers behave differently, or costs need to be understood more precisely.",
          "At that point, the business depends on something it cannot easily explain.",
        ],
      },
      {
        heading: "A practical way to explore the question",
        paragraphs: [
          "Instead of asking how decisions should work, describe the last five difficult decisions that were actually made.",
          "For each one, ask who was involved, which rules were applied, where judgement stepped in, what information mattered most, and what was unclear or debated.",
          "Patterns usually appear quickly. Those patterns are more informative than any policy document.",
        ],
      },
      {
        heading: "What organisations usually discover",
        paragraphs: [
          "When businesses do this honestly, they often find that some rules are rarely used, some judgement calls repeat again and again, and certain people quietly act as safeguards.",
          "They may also discover that exceptions cluster in specific situations, and that repeat customers are treated differently — sometimes intentionally, sometimes not.",
          "None of this is a failure. It is simply how people make systems work.",
        ],
      },
      {
        heading: "Why changing rules often doesn’t help",
        paragraphs: [
          "Many organisations respond to uncertainty by adjusting rules: tightening thresholds, adding conditions, or creating new exceptions.",
          "Sometimes this helps briefly. Often it does not.",
          "That is usually because the underlying question has not been answered: what decision are we actually trying to make here?",
          "Without clarity on that, rule changes create noise rather than learning.",
        ],
      },
      {
        heading: "A useful self-check",
        paragraphs: [
          "You do not need to document anything formally to reflect on this.",
          "Could you explain your decision logic to a new senior hire? Would two experienced people describe it the same way? Do you know which decisions drive most of your cost and risk?",
          "Uncertainty here does not demand action. It simply tells you where clarity is missing.",
        ],
      },
      {
        heading: "What this question is not asking",
        paragraphs: [
          "This question is not asking you to formalise everything, remove judgement, introduce systems, or standardise prematurely.",
          "It is asking something simpler and harder: do we understand ourselves well enough to choose what to change — or what not to?",
        ],
      },
      {
        heading: "Where this leaves you",
        paragraphs: [
          "If you can describe how decisions are actually made — including where judgement steps in — you are in a strong position, even if everything remains manual.",
          "If that description feels fuzzy or person-dependent, it explains why fixes don’t stick and effort increases without clarity.",
          "Understanding how you decide today is often the first step toward deciding how much progress, if any, makes sense tomorrow.",
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

   {
  slug: "question-what-are-we-actually-optimising-for",
  kind: "questions",
  title: "Question: “What are we actually optimising for?”",
  summary:
    "Why many decision problems persist because the goal is unclear — not because the rules are wrong.",
  date: "2025-01-23",
  read: "8–9 min",
  tags: [
    "Profit",
    "Cost-to-serve",
    "Growth",
    "Fairness",
    "Decision trade-offs",
  ],
  category: "Questions",
  type: "Question",
  featured: false,
  accent: "slate",
  body: {
    sections: [
      {
        heading: "This question sits underneath almost every other one",
        paragraphs: [
          "When decisions feel hard to improve, inconsistent, or endlessly debated, the problem is often not the rules themselves.",
          "It is that different people are optimising for different things — sometimes without realising it.",
          "Until this is made explicit, no change will ever feel decisive.",
        ],
      },
      {
        heading: "Most organisations optimise for several things at once",
        paragraphs: [
          "In practice, decisions are rarely optimised for a single goal.",
          "One person may be focused on approval rate. Another on losses. Another on speed. Another on fairness. Another on staff effort or customer experience.",
          "All of these are reasonable. The tension arises when trade-offs are not acknowledged.",
        ],
      },
      {
        heading: "Why rules feel unstable",
        paragraphs: [
          "When optimisation goals are unclear, rules change frequently.",
          "A decline threshold is adjusted to improve conversion. Then tightened to reduce risk. Then relaxed again to hit volume targets.",
          "Each change makes sense in isolation. Together, they create the feeling that the business does not quite know what it wants.",
        ],
      },
      {
        heading: "Profit is not the same as volume or loss rate",
        paragraphs: [
          "Many organisations discover late that they have been optimising the wrong proxy.",
          "A low bad rate can coexist with missed growth. High approval rates can hide thin margins. Fast decisions can drive up rework and downstream cost.",
          "Profit emerges from the balance between volume, loss, and cost — not from any single metric.",
        ],
      },
      {
        heading: "Effort is always part of the equation",
        paragraphs: [
          "One of the least discussed optimisation variables is effort.",
          "Some outcomes are achieved not because decisions are strong, but because people work harder to compensate.",
          "Over time, this creates hidden costs, burnout, and fragility — even when headline numbers look stable.",
        ],
      },
      {
        heading: "Fairness and consistency matter more than they appear",
        paragraphs: [
          "Fairness is often treated as a soft consideration. In reality, it has economic consequences.",
          "When staff perceive rules as unfair or arbitrary, resistance grows. When customers experience inconsistency, trust erodes — especially for repeat relationships.",
          "These effects are slow, but they are real.",
        ],
      },
      {
        heading: "Optimising for the dream, not the textbook",
        paragraphs: [
          "What matters most is alignment with what the business is trying to achieve.",
          "A small, stable operation may legitimately optimise for simplicity and control. A growing one may prioritise scalability or cost efficiency.",
          "Neither choice is better or worse. Problems arise only when the optimisation goal is assumed rather than chosen.",
        ],
      },
      {
        heading: "A practical way to surface the real objective",
        paragraphs: [
          "Ask a simple question: if we could only improve one thing this year, what would it be?",
          "Then ask what you would be willing to give up to achieve it.",
          "If the answer is unclear or contested, that uncertainty is likely driving many of the frustrations you feel today.",
        ],
      },
      {
        heading: "Why this question should be revisited over time",
        paragraphs: [
          "Optimisation goals are not permanent.",
          "As markets, regulation, competition, and ambition change, what made sense before may no longer fit.",
          "Revisiting this question periodically is not indecision — it is governance.",
        ],
      },
      {
        heading: "Where this leaves you",
        paragraphs: [
          "You do not need perfect metrics or sophisticated tools to answer this question.",
          "You need honesty about trade-offs, effort, and intent.",
          "Once optimisation goals are clear, many decision debates resolve themselves — and progress, if chosen, becomes far less threatening.",
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
    "Why staying manual can be the right choice — and how to recognise when it no longer fits.",
  date: "2025-01-24",
  read: "8–9 min",
  tags: [
    "Fit for purpose",
    "Manual excellence",
    "Decision maturity",
    "Cost control",
    "Business ambition",
  ],
  category: "Briefings",
  type: "Briefing",
  featured: false,
  accent: "slate",
  body: {
    sections: [
      {
        heading: "Good decisioning is about fit, not sophistication",
        paragraphs: [
          "There is a persistent myth that better decisioning always means more technology, more automation, or more complexity.",
          "In reality, good decisioning is about fit.",
          "A system is good enough when it reliably supports the business you are trying to run — not the one described in textbooks or vendor decks.",
        ],
      },
      {
        heading: "Many businesses are already good enough",
        paragraphs: [
          "Many well-run organisations make decisions manually and do so successfully.",
          "People understand the context, customers are known, exceptions are handled thoughtfully, and outcomes are acceptable.",
          "This is not a temporary state or a failure to mature. In many cases, it is an intentional and effective operating model.",
        ],
      },
      {
        heading: "The bicycle versus the Formula 1 car",
        paragraphs: [
          "A bicycle can be the perfect solution for daily transport.",
          "It is cheap, flexible, easy to maintain, and perfectly suited to short, familiar journeys.",
          "A Formula 1 car is extraordinary — but only in a very specific context, with enormous supporting infrastructure.",
          "Problems arise when businesses feel pressured to upgrade simply because something more advanced exists.",
        ],
      },
      {
        heading: "When staying manual is the right choice",
        paragraphs: [
          "Staying manual often makes sense when volumes are manageable, decisions rely heavily on context, and experienced people are close to the work.",
          "It also makes sense when the cost of mistakes is low, and when the effort required to maintain clarity is acceptable.",
          "In these cases, adding sophistication can increase cost and friction without improving outcomes.",
        ],
      },
      {
        heading: "Where ‘good enough’ quietly stops being good enough",
        paragraphs: [
          "The shift usually does not happen suddenly.",
          "It appears when effort increases faster than results, when outcomes become harder to explain, or when consistency starts to matter more — to customers, staff, or regulators.",
          "At that point, the bicycle still works, but the journey has changed.",
        ],
      },
      {
        heading: "Effort as an early warning sign",
        paragraphs: [
          "One of the clearest signals that fit is drifting is rising effort.",
          "More reviews. More senior involvement. More exceptions. More explanations.",
          "The business may still perform acceptably, but it is becoming fragile — dependent on people working harder to maintain the same outcomes.",
        ],
      },
      {
        heading: "Progress does not require a full upgrade",
        paragraphs: [
          "Recognising that something no longer fits does not mean jumping to the most advanced solution available.",
          "Many organisations improve decisioning incrementally: clarifying rules, documenting judgement, separating policy from process, or stabilising how changes are tested.",
          "These steps improve control without committing to large-scale change.",
        ],
      },
      {
        heading: "Aligning decisioning with your dream",
        paragraphs: [
          "The most important alignment is not with best practice, but with ambition.",
          "If the goal is stability, control, and a manageable operation, good enough may remain manual for a long time.",
          "If the goal is growth, scale, or resilience under pressure, the definition of good enough will change.",
        ],
      },
      {
        heading: "Neither choice is better — or worse",
        paragraphs: [
          "Progress is not inherently better. Staying manual is not inherently inferior.",
          "What matters is whether the way decisions are made supports the business you want to protect or build.",
          "Problems arise only when the operating model and the ambition drift apart without being acknowledged.",
        ],
      },
      {
        heading: "A grounding question",
        paragraphs: [
          "If the business doubled in size, would decisioning still feel calm?",
          "If a key person left, would outcomes remain explainable?",
          "If the answer is yes, you may already be good enough.",
          "If not, the issue is not urgency — it is awareness.",
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
