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

  const ordered = ranking.map(
    (id) => OPTIONS.find((o) => o.id === id)?.label
  );

  return (
    <div className="min-h-screen bg-[rgb(var(--surface))] text-slate-900">
      <Seo
        title="Decision Trade-off Prioritiser | TSDG"
        description="A simple prioritisation tool to clarify what matters most when decision trade-offs are unavoidable."
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold">
          Decision Trade-off Prioritiser
        </h1>

        <p className="mt-4 text-slate-700">
          Decisions usually involve trade-offs. This short exercise helps make
          those trade-offs explicit.
        </p>

        <p className="mt-2 text-slate-700">
          Select the factors that most strongly influence your decisions today,
          in order of importance.
        </p>

        <div className="mt-8 space-y-3">
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              onClick={() => toggle(o.id)}
              className={`w-full text-left rounded-xl border p-4 transition ${
                ranking.includes(o.id)
                  ? "bg-slate-900 text-white"
                  : "bg-white"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border bg-slate-50 p-6">
          <h2 className="text-lg font-semibold">
            What this suggests
          </h2>

          {ordered.length === 0 ? (
            <p className="mt-3 text-slate-700">
              Make a few selections to see how your priorities line up.
            </p>
          ) : (
            <>
              <p className="mt-3 text-slate-700">
                Your current decision focus appears to prioritise:
              </p>
              <ol className="mt-3 list-decimal list-inside text-slate-800">
                {ordered.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ol>
              <p className="mt-4 text-sm text-slate-600">
                None of these priorities are right or wrong. Problems arise when
                they are implicit, misaligned, or change without acknowledgement.
              </p>
            </>
          )}
        </div>

        <div className="mt-8 text-sm text-slate-600">
          This tool is not a prescription. It helps surface trade-offs so they
          can be discussed deliberately.
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
