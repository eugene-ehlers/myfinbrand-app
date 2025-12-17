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
    "A calm orientation for operators who run people- and Excel-based decisions and want to stay in control — without rushing into change.",
  date: "2025-01-10",
  read: "10–12 min",
  tags: [
    "Manual decisions",
    "Control",
    "Ownership",
    "Decision maturity",
    "Business ambition",
  ],
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
          "Many well-run businesses still rely on people, judgement, spreadsheets, and experience.",
          "This is not a flaw. It is often a sign of proximity to customers, strong intuition, and founders or operators who are close to the work.",
          "Manual decisioning has powered profitable businesses for decades — and continues to do so today.",
          "Being manual does not mean being naive, unsophisticated, or at risk by default.",
        ],
      },
      {
        heading: "Where problems usually begin",
        paragraphs: [
          "Problems rarely start because decisions are manual.",
          "They start when conditions change — volumes increase, staff turnover rises, regulations tighten, competitors shift, or costs quietly creep up.",
          "At that point, a simple question becomes harder to answer:",
          "Why was this decision made — and would it be made the same way tomorrow?",
        ],
      },
      {
        heading: "Control is not about automation",
        paragraphs: [
          "Control is often misunderstood as having systems, models, or formal processes.",
          "In reality, control means being able to explain, defend, and deliberately change how decisions are made.",
          "A fully manual business can be in control. A highly automated one can be deeply out of control.",
          "The difference is not technology — it is clarity.",
        ],
      },
      {
        heading: "The quiet risk of people-based decisions",
        paragraphs: [
          "People-based decisioning works best when the same experienced individuals are involved consistently.",
          "Over time, however, knowledge concentrates. Exceptions become habitual. Judgement becomes assumed rather than articulated.",
          "Nothing breaks. Results often remain acceptable.",
          "But responsibility slowly shifts from something owned by the business to something embedded in individuals.",
        ],
      },
      {
        heading: "Why this often feels uncomfortable before it feels urgent",
        paragraphs: [
          "Most operators do not experience a sudden crisis.",
          "They experience unease: effort rising faster than results, decisions becoming harder to explain, staff asking more questions, or repeat customers behaving differently.",
          "This discomfort is not a signal that something is wrong.",
          "It is often a signal that the business has outgrown some of its informal decision foundations.",
        ],
      },
      {
        heading: "This library is not a roadmap",
        paragraphs: [
          "This library does not assume you should modernise, automate, or introduce decision engines.",
          "There is no required endpoint.",
          "Some organisations remain manual by choice — and do so exceptionally well.",
          "Others progress selectively, carefully, and in stages.",
        ],
      },
      {
        heading: "What this library is actually for",
        paragraphs: [
          "This library exists to help you think clearly about decisions before anything feels urgent.",
          "It focuses on situations operators recognise, questions they already ask quietly, and trade-offs that are often implicit rather than discussed.",
          "The goal is not to push change, but to make your current position visible — so that any decision to stay, pause, or progress is deliberate.",
        ],
      },
      {
        heading: "Progress is not always better — and neither is standing still",
        paragraphs: [
          "Progress is not inherently better.",
          "Staying manual is not inherently worse.",
          "What matters is alignment: between how decisions are made and what the business is trying to protect or build.",
          "Problems arise when ambition, complexity, and decision foundations drift apart without being acknowledged.",
        ],
      },
      {
        heading: "A grounding question to start with",
        paragraphs: [
          "If nothing changed for the next three years, would this way of deciding still feel calm?",
          "If the business grew, or a key person left, would decisions remain explainable?",
          "If the answer is yes, you may already be where you need to be.",
          "If not, awareness — not urgency — is the appropriate response.",
        ],
      },
      {
        heading: "How to use what follows",
        paragraphs: [
          "The notes that follow are organised as situations, questions, field notes, and briefings.",
          "You do not need to read them in order.",
          "You may find yourself recognising your business in some and not others.",
          "That is expected.",
        ],
      },
      {
        heading: "Where this leaves you",
        paragraphs: [
          "You are not late.",
          "You are not failing.",
          "You are not required to change.",
          "You are simply invited to look clearly at how decisions support the business you care about — and to protect that deliberately.",
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
    "When most cases flow smoothly, but edge cases, repeats, and people signals start to worry you.",
  date: "2025-01-26",
  read: "7–8 min",
  tags: [
    "Edge cases",
    "Repeat customers",
    "Staff signals",
    "Decision foundations",
    "Hidden risk",
  ],
  category: "Situations",
  type: "Situation",
  featured: false,
  accent: "slate",
  body: {
    sections: [
      {
        heading: "Most of the time, things work",
        paragraphs: [
          "For the majority of cases, decisions feel straightforward.",
          "Applications move through. Customers are served. Staff know what to do.",
          "If you only look at averages, the system appears healthy.",
        ],
      },
      {
        heading: "Where discomfort starts to appear",
        paragraphs: [
          "Problems tend to show up at the edges.",
          "Exceptions take longer. Certain customers trigger repeated debate. Decisions that look similar lead to different outcomes.",
          "These cases consume disproportionate attention and emotional energy.",
        ],
      },
      {
        heading: "Repeat customers are an early signal",
        paragraphs: [
          "In many businesses — especially short-term or relationship-driven ones — repeat customers form the majority of volume.",
          "When repeat customers begin to disappear, behave unpredictably, or complain about inconsistency, it is rarely random.",
          "Repeat behaviour often exposes weaknesses in decision logic earlier than new business does.",
        ],
      },
      {
        heading: "Staff signals matter just as much",
        paragraphs: [
          "Another early sign appears in people rather than metrics.",
          "Experienced staff start leaving. New staff struggle longer than expected. Informal workarounds become common.",
          "These are not HR issues first — they are decision clarity issues.",
        ],
      },
      {
        heading: "Why edge cases reveal the truth",
        paragraphs: [
          "Edge cases force the organisation to confront questions it usually avoids.",
          "What really matters here? Who gets to decide? Which rules are flexible, and which are not?",
          "When answers differ depending on who is asked, inconsistency becomes visible.",
        ],
      },
      {
        heading: "The common temptation: add complexity",
        paragraphs: [
          "A natural response is to add more.",
          "More rules. More checks. More products. More markets. More risk.",
          "This can create the feeling of progress, but it often increases complexity before the foundation is clear.",
        ],
      },
      {
        heading: "Why adding more often makes things worse",
        paragraphs: [
          "Additional complexity magnifies existing inconsistencies.",
          "If the core decision logic is unclear, expanding volume, channels, or products simply spreads that uncertainty.",
          "Costs rise. Learning slows. Control feels harder, not easier.",
        ],
      },
      {
        heading: "What this situation does not mean",
        paragraphs: [
          "It does not mean your decisions are bad.",
          "It does not mean automation or new systems are required.",
          "It means the foundation that works for most cases is being stretched by situations it was never designed to handle explicitly.",
        ],
      },
      {
        heading: "A more useful response",
        paragraphs: [
          "Instead of asking how to eliminate edge cases, it can be more productive to ask what they are teaching you.",
          "Which decisions repeat? Which ones feel unfair? Which ones consume the most effort?",
          "Answers here often point to where clarity — not complexity — is needed next.",
        ],
      },
      {
        heading: "Where this leaves you",
        paragraphs: [
          "Most organisations encounter this situation as they grow or change.",
          "You can choose to stay where you are and accept the effort, or you can clarify foundations before expanding further.",
          "Neither choice is better or worse. What matters is that it is deliberate and aligned with what you are trying to build.",
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
    "Why a reassuring headline number can still hide leakage, fragility, and missed opportunity.",
  date: "2025-01-27",
  read: "7–8 min",
  tags: [
    "Bad rate",
    "Leakage",
    "Repeat behaviour",
    "Fraud",
    "Short-term products",
  ],
  category: "Field notes",
  type: "Field Note",
  featured: false,
  accent: "slate",
  body: {
    sections: [
      {
        heading: "Why this statement feels comforting",
        paragraphs: [
          "A low bad rate is one of the most reassuring metrics in any credit or decision-driven business.",
          "It suggests discipline, prudence, and control. It provides confidence to management, investors, and regulators.",
          "When the number is stable, it is natural to conclude that things are working as intended.",
        ],
      },
      {
        heading: "What a headline bad rate does — and does not — tell you",
        paragraphs: [
          "A single bad-rate number is an average.",
          "It blends together new and repeat customers, different channels, different products, and different decision paths.",
          "As an average, it can remain stable even while important dynamics underneath it change materially.",
        ],
      },
      {
        heading: "Where problems often hide",
        paragraphs: [
          "Issues rarely announce themselves through a sudden spike in losses.",
          "They more often appear as slow leakage: margin erosion, rising operational effort, growing fraud exposure, or declining quality of repeat behaviour.",
          "These shifts can persist for a long time before they affect the headline number.",
        ],
      },
      {
        heading: "Short-term and repeat-driven products are especially deceptive",
        paragraphs: [
          "In short-term or repeat-heavy businesses, bad rates can look healthy even when underlying affordability or identity issues are emerging.",
          "Fraud may pass early checks and only surface later. Stress may appear across repeat cycles rather than in first loans.",
          "A stable bad rate here does not always mean stable economics.",
        ],
      },
      {
        heading: "Fraud often looks like performance — until it doesn’t",
        paragraphs: [
          "Some of the most damaging fraud patterns initially resemble good customers.",
          "They repay early, behave predictably, and do not immediately trigger loss metrics.",
          "By the time losses appear, the exposure has often scaled quietly.",
        ],
      },
      {
        heading: "Why repeat behaviour deserves separate attention",
        paragraphs: [
          "Repeat customers are usually cheaper to serve, faster to decide, and less risky — when decisioning is sound.",
          "When repeat behaviour deteriorates, approval rules tighten, or service slows, it often signals deeper issues.",
          "Looking only at aggregate bad rate can mask this shift.",
        ],
      },
      {
        heading: "The effort question",
        paragraphs: [
          "Another blind spot is effort.",
          "Sometimes a stable bad rate is achieved only because staff are reviewing more cases, escalating more decisions, or working longer hours.",
          "The metric holds — but the system becomes fragile.",
        ],
      },
      {
        heading: "Better questions than ‘are we fine?’",
        paragraphs: [
          "Instead of asking whether the bad rate is acceptable, more useful questions include:",
          "Where are losses concentrated? How do repeat customers behave over time? How much effort is required to maintain this outcome?",
          "These questions reveal resilience, not just performance.",
        ],
      },
      {
        heading: "What this note is not saying",
        paragraphs: [
          "This is not an argument to chase ever-lower bad rates.",
          "It is not a warning that something must be wrong.",
          "It is a reminder that comfort metrics should be understood, not trusted blindly.",
        ],
      },
      {
        heading: "Where this leaves you",
        paragraphs: [
          "If your bad rate is low and the economics feel healthy, that may be entirely sufficient.",
          "If the number feels reassuring but effort, uncertainty, or unease are rising, it is worth looking underneath while you still have time.",
          "Clarity here protects both profit and peace of mind.",
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
    "How trust, habit, and good intentions can slowly blur ownership — even in well-run businesses.",
  date: "2025-01-28",
  read: "7–8 min",
  tags: [
    "Responsibility",
    "Delegation",
    "Trust",
    "Decision ownership",
    "Governance",
  ],
  category: "Field notes",
  type: "Field Note",
  featured: false,
  accent: "slate",
  body: {
    sections: [
      {
        heading: "Responsibility rarely disappears suddenly",
        paragraphs: [
          "In most organisations, responsibility does not vanish through a single decision or event.",
          "It fades slowly, through trust, habit, and the understandable desire to keep things running smoothly.",
          "By the time it becomes noticeable, no one can point to when the shift occurred.",
        ],
      },
      {
        heading: "How trust becomes delegation",
        paragraphs: [
          "As people prove themselves capable, others rely on them more.",
          "Judgement is trusted. Exceptions are accepted. Decisions are waved through.",
          "This is not negligence. It is often a sign of maturity and respect.",
        ],
      },
      {
        heading: "When delegation becomes assumption",
        paragraphs: [
          "Over time, trust turns into assumption.",
          "People stop checking why decisions are made. Outcomes are accepted because they come from familiar hands or trusted systems.",
          "The question of ownership quietly recedes into the background.",
        ],
      },
      {
        heading: "The moment responsibility becomes unclear",
        paragraphs: [
          "The issue usually surfaces only when something goes wrong — or when someone asks an uncomfortable question.",
          "Who decided this? Why was this exception allowed? What changed?",
          "When answers differ depending on who is asked, responsibility has already blurred.",
        ],
      },
      {
        heading: "Why this is not about blame",
        paragraphs: [
          "This pattern is not the result of bad actors or poor discipline.",
          "It emerges because businesses prioritise continuity, speed, and trust — especially when things are working reasonably well.",
          "The problem is not delegation itself, but the absence of deliberate boundaries around it.",
        ],
      },
      {
        heading: "People-based systems amplify this risk",
        paragraphs: [
          "In manual or judgement-heavy environments, responsibility is often embedded in individuals rather than structures.",
          "When those individuals leave, change roles, or become overloaded, decision quality can shift suddenly.",
          "The organisation then realises how much knowledge and authority was never truly shared.",
        ],
      },
      {
        heading: "Why staying manual does not avoid this",
        paragraphs: [
          "It is a mistake to assume that remaining manual protects against loss of control.",
          "In fact, people-based systems can hide responsibility drift more effectively than formal ones, precisely because outcomes appear reasonable most of the time.",
          "Control feels present — until it is tested.",
        ],
      },
      {
        heading: "The subtle cost of blurred ownership",
        paragraphs: [
          "When responsibility is unclear, learning slows.",
          "Mistakes are repeated. Improvements are tentative. People hesitate to change what they do not fully own.",
          "Over time, effort increases as individuals compensate for structural ambiguity.",
        ],
      },
      {
        heading: "What clarity actually looks like",
        paragraphs: [
          "Clarity does not require rigid rules or removing judgement.",
          "It requires knowing which decisions belong to policy, which to judgement, and who is accountable for changing each.",
          "This can exist in fully manual environments when it is intentional.",
        ],
      },
      {
        heading: "A simple test",
        paragraphs: [
          "If a decision started producing worse outcomes tomorrow, who would notice first?",
          "Not who would be blamed later — but who would recognise the drift early enough to respond calmly.",
          "The answer to that question reveals where responsibility truly sits.",
        ],
      },
      {
        heading: "Where this leaves you",
        paragraphs: [
          "Responsibility does not need to be centralised or automated to be clear.",
          "It does need to be explicit.",
          "Whether decisions remain manual or evolve, clarity of ownership is what ultimately preserves control.",
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
