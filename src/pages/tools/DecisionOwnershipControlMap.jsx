import React, { useState } from "react";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

const QUESTIONS = [
  {
    id: "policy",
    text: "Who defines what a ‘good’ or ‘bad’ decision is?",
  },
  {
    id: "rules",
    text: "Who can change decision rules or thresholds?",
  },
  {
    id: "exceptions",
    text: "Who can override or make exceptions?",
  },
  {
    id: "learning",
    text: "Who reviews outcomes and decides what should change?",
  },
  {
    id: "impact",
    text: "Who feels the financial or operational impact of decisions?",
  },
  {
    id: "explain",
    text: "Who can explain to an outsider why a decision was made?",
  },
];

export default function DecisionOwnershipControlMap() {
  const [answers, setAnswers] = useState({});

  const handleChange = (id, value) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const filled = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-[rgb(var(--surface))] text-slate-900">
      <Seo
        title="Decision Ownership & Control Map | TSDG"
        description="Clarify who controls decisions today — without assuming automation or centralisation."
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold">
          Decision Ownership & Control Map
        </h1>

        <p className="mt-4 text-slate-700">
          This exercise helps make decision ownership explicit. There are no
          correct answers — only clarity.
        </p>

        <div className="mt-8 space-y-6">
          {QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="rounded-xl border bg-white p-4"
            >
              <label className="block font-medium">
                {q.text}
              </label>
              <input
                type="text"
                placeholder="e.g. branch manager, credit head, system, committee"
                value={answers[q.id] || ""}
                onChange={(e) =>
                  handleChange(q.id, e.target.value)
                }
                className="mt-2 w-full border rounded p-2"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border bg-slate-50 p-6">
          <h2 className="text-lg font-semibold">
            What to look for
          </h2>

          {filled === 0 ? (
            <p className="mt-3 text-slate-700">
              Complete a few fields to reflect on where ownership sits.
            </p>
          ) : (
            <>
              <p className="mt-3 text-slate-700">
                Notice where answers are:
              </p>
              <ul className="mt-2 list-disc list-inside text-slate-700">
                <li>Clear and consistent</li>
                <li>Implicit or assumed</li>
                <li>Different depending on who is asked</li>
              </ul>

              <p className="mt-4 text-sm text-slate-600">
                Control is not about centralising decisions. It is about knowing
                where authority, responsibility, and impact actually sit.
              </p>
            </>
          )}
        </div>

        <div className="mt-8 text-sm text-slate-600">
          This map often reveals that “black box” fears are not about technology,
          but about unclear ownership.
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
