import React, { useState } from "react";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

const QUESTIONS = [
  "When rules change, the reason for the change is clearly documented.",
  "We usually change one meaningful thing at a time.",
  "We know which metric the rule change is meant to improve.",
  "We allow enough time to see the effect before changing again.",
  "Staff understand what changed and why.",
  "We can tell whether performance is better, worse, or unchanged.",
  "Rule changes rarely conflict with existing incentives or commissions.",
  "When outcomes do not improve, we can explain why.",
];

export default function RuleChangeLearningHygiene() {
  const [answers, setAnswers] = useState({});

  const toggle = (i) =>
    setAnswers((prev) => ({ ...prev, [i]: !prev[i] }));

  const score = Object.values(answers).filter(Boolean).length;

  let interpretation;
  if (score <= 2) {
    interpretation =
      "Rule changes are likely reactive. Improvement is hard because learning is limited.";
  } else if (score <= 5) {
    interpretation =
      "Some learning is happening, but results may be inconsistent or fragile.";
  } else {
    interpretation =
      "Rule changes are likely deliberate and measurable. Learning is accumulating over time.";
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--surface))] text-slate-900">
      <Seo
        title="Rule Change Learning Hygiene | TSDG"
        description="Assess whether rule changes are creating learning or just activity."
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold">
          Rule Change Learning Hygiene Checklist
        </h1>

        <p className="mt-4 text-slate-700">
          This checklist helps you assess whether rule changes are producing
          learning — or simply creating motion.
        </p>

        <div className="mt-8 space-y-4">
          {QUESTIONS.map((q, i) => (
            <label
              key={i}
              className="flex gap-3 items-start rounded-xl border bg-white p-4 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={!!answers[i]}
                onChange={() => toggle(i)}
                className="mt-1"
              />
              <span>{q}</span>
            </label>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border bg-slate-50 p-6">
          <h2 className="text-lg font-semibold">What this suggests</h2>
          <p className="mt-3 text-slate-700">{interpretation}</p>

          <p className="mt-4 text-sm text-slate-600">
            This is not about perfection. It is about creating conditions where
            improvement is possible — without increasing stress or confusion.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
