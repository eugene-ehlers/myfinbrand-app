import React, { useState } from "react";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

const QUESTIONS = [
  {
    id: "effort",
    text: "Keeping results stable requires noticeably more effort than it used to.",
  },
  {
    id: "consistency",
    text: "Similar cases can receive different outcomes depending on who handles them.",
  },
  {
    id: "repeat",
    text: "Repeat or loyal customers are behaving less predictably than before.",
  },
  {
    id: "rule_changes",
    text: "Rules change, but performance does not improve consistently.",
  },
  {
    id: "ownership",
    text: "It is not always clear who owns decision outcomes when something drifts.",
  },
  {
    id: "staff_signals",
    text: "Experienced staff leave or rely on workarounds more than they used to.",
  },
  {
    id: "fairness",
    text: "Staff or customers sometimes question whether decisions are fair or consistent.",
  },
  {
    id: "scaling",
    text: "If volumes increased meaningfully, decisioning would feel stressful.",
  },
  {
    id: "external_pressure",
    text: "Regulation, competition, or funders are starting to ask different questions.",
  },
  {
    id: "visibility",
    text: "We would struggle to clearly explain how decisions are made today.",
  },
];

export default function DecisioningFitReadiness() {
  const [checked, setChecked] = useState({});

  const toggle = (id) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const count = Object.values(checked).filter(Boolean).length;

  let interpretation;
  if (count <= 2) {
    interpretation =
      "Your current way of making decisions likely still fits your business well. Staying as you are may be entirely appropriate — just remain aware of early signals.";
  } else if (count <= 5) {
    interpretation =
      "Your decisioning approach may still work, but pressure is starting to show. This is a good time to clarify ownership and expectations — without rushing into change.";
  } else {
    interpretation =
      "Several signals suggest that effort, clarity, or consistency may no longer fit your ambitions. This does not require urgency — but it does reward early, calm attention.";
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--surface))] text-slate-900">
      <Seo
        title="Decisioning Fit & Readiness Assessment | TSDG"
        description="A calm self-assessment to help operators understand whether their current decisioning approach still fits their business."
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold">
          Decisioning Fit & Readiness Self-Assessment
        </h1>

        <p className="mt-4 text-slate-700">
          Tick the statements that resonate with your current experience.
          There are no right or wrong answers.
        </p>

        <div className="mt-8 space-y-4">
          {QUESTIONS.map((q) => (
            <label
              key={q.id}
              className="flex gap-3 items-start rounded-xl border bg-white p-4 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={!!checked[q.id]}
                onChange={() => toggle(q.id)}
                className="mt-1"
              />
              <span>{q.text}</span>
            </label>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border bg-slate-50 p-6">
          <h2 className="text-lg font-semibold">What this suggests</h2>
          <p className="mt-3 text-slate-700">{interpretation}</p>

          <p className="mt-4 text-sm text-slate-600">
            This assessment is not a diagnosis. It is a way to organise your
            thinking before deciding whether — and how much — change makes sense.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
