import React, { useState } from "react";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

const OPTIONS = [
  { id: "profit", label: "Profit & margin" },
  { id: "cost", label: "Cost-to-serve & effort" },
  { id: "speed", label: "Speed & customer experience" },
  { id: "risk", label: "Risk & loss control" },
  { id: "fairness", label: "Fairness & consistency" },
];

export default function DecisionTradeoffPrioritiser() {
  const [ranking, setRanking] = useState([]);

  const handleSelect = (id) => {
    if (ranking.includes(id)) return;
    setRanking([...ranking, id]);
  };

  const reset = () => setRanking([]);

  const ordered = ranking.map(
    (id) => OPTIONS.find((o) => o.id === id)?.label
  );

  const primary = ranking[0];
  const secondary = ranking[1];

  const interpretation = () => {
    if (!primary) {
      return "Make your selections to see how your priorities line up.";
    }

    if (primary === "profit") {
      return "You are primarily optimising for profitability. This often brings clarity, but can create tension if cost, fairness, or speed expectations are not explicitly managed.";
    }

    if (primary === "cost") {
      return "You are primarily optimising for cost and effort. This can stabilise operations, but risks frustration if service speed or perceived fairness is not protected.";
    }

    if (primary === "speed") {
      return "You are primarily optimising for speed and experience. This often improves conversion, but can quietly increase risk or operational strain if unchecked.";
    }

    if (primary === "risk") {
      return "You are primarily optimising for risk control. This can protect the downside, but may limit growth or responsiveness if applied too broadly.";
    }

    if (primary === "fairness") {
      return "You are primarily optimising for fairness and consistency. This supports trust, but may feel rigid if edge cases are common.";
    }

    return "";
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--surface))] text-slate-900">
      <Seo
        title="Decision Trade-off Prioritiser | TSDG"
        description="A prioritisation exercise to make decision trade-offs explicit."
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold">
          Decision Trade-off Prioritiser
        </h1>

        <p className="mt-4 text-slate-700">
          Decisions involve trade-offs. Select the factors that most influence
          your decisions — in order of importance.
        </p>

        <div className="mt-8 space-y-3">
          {OPTIONS.map((o) => {
            const index = ranking.indexOf(o.id);
            const selected = index !== -1;

            return (
              <button
                key={o.id}
                onClick={() => handleSelect(o.id)}
                disabled={selected}
                className={`w-full text-left rounded-xl border p-4 transition ${
                  selected
                    ? "bg-slate-900 text-white cursor-default"
                    : "bg-white hover:bg-slate-50"
                }`}
              >
                {selected ? `${index + 1}. ` : ""}{o.label}
              </button>
            );
          })}
        </div>

        {ranking.length > 0 && (
          <div className="mt-4 text-sm">
            <button
              onClick={reset}
              className="underline underline-offset-2 text-slate-600"
            >
              Reset priorities
            </button>
          </div>
        )}

        <div className="mt-10 rounded-2xl border bg-slate-50 p-6">
          <h2 className="text-lg font-semibold">What this suggests</h2>

          <p className="mt-3 text-slate-700">{interpretation()}</p>

          {secondary && (
            <p className="mt-3 text-sm text-slate-600">
              Your secondary priority further shapes how trade-offs are handled.
              Tension usually appears when secondary priorities are not openly
              acknowledged.
            </p>
          )}

          <p className="mt-4 text-sm text-slate-600">
            None of these priorities are right or wrong. Problems arise when they
            are implicit, misaligned, or change without acknowledgement.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

