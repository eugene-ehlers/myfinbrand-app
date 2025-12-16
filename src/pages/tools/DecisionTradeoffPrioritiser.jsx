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

  const toggle = (id) => {
    setRanking((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const primary = ranking[0];
  const secondary = ranking[1];

  const interpretation = () => {
    if (!primary) {
      return "Select the factors that most influence your decisions to see how trade-offs are shaping outcomes.";
    }

    switch (primary) {
      case "profit":
        return "Profit appears to be the primary driver. This often brings clarity and discipline, but tension can arise if cost, fairness, or speed expectations are not made explicit.";
      case "cost":
        return "Cost and effort appear to dominate. This can stabilise operations, but risks frustration if service speed or perceived fairness is compromised.";
      case "speed":
        return "Speed and experience appear most important. This often improves conversion and satisfaction, but can quietly increase risk or operational strain.";
      case "risk":
        return "Risk control appears dominant. This protects the downside, but may limit growth or responsiveness if applied too broadly.";
      case "fairness":
        return "Fairness and consistency appear most important. This supports trust and morale, but may feel rigid in environments with many edge cases.";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--surface))] text-slate-900">
      <Seo
        title="Decision Trade-off Prioritiser | TSDG"
        description="Make decision trade-offs explicit without forcing false precision."
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold">
          Decision Trade-off Prioritiser
        </h1>

        <p className="mt-4 text-slate-700">
          Decisions involve trade-offs. Select the factors that most influence
          your decisions today. Order reflects priority.
        </p>

        <div className="mt-8 space-y-3">
          {OPTIONS.map((o) => {
            const index = ranking.indexOf(o.id);
            const selected = index !== -1;

            return (
              <button
                key={o.id}
                onClick={() => toggle(o.id)}
                className={`w-full text-left rounded-xl border p-4 transition ${
                  selected
                    ? "bg-slate-900 text-white"
                    : "bg-white hover:bg-slate-50"
                }`}
              >
                {selected ? `${index + 1}. ` : ""}
                {o.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border bg-slate-50 p-6">
          <h2 className="text-lg font-semibold">What this suggests</h2>

          <p className="mt-3 text-slate-700">{interpretation()}</p>

          {secondary && (
            <p className="mt-3 text-sm text-slate-600">
              Your secondary priority further shapes how trade-offs are handled.
              Tension usually appears when this is not openly acknowledged.
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
