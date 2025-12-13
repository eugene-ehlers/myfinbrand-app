// src/pages/tools/ScorecardCompareProfit.jsx
import React, { useMemo, useState } from "react";
import Seo from "../../components/Seo.jsx";
import { Link } from "react-router-dom";
import CalculatorShell from "../../components/tools/CalculatorShell.jsx";
import { computeScorecardCompareProfit } from "../../lib/calculators/scorecardCompareProfit.js";

const money = (n) =>
  Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });

const num = (n, d = 0) =>
  Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: d });

const pct = (n, d = 1) =>
  `${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: d })}%`;

const Field = ({ label, hint, children }) => (
  <div className="grid gap-1">
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm font-medium">{label}</label>
      {hint ? <div className="text-xs text-slate-500">{hint}</div> : null}
    </div>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-300"
  />
);

const SectionLabel = ({ children }) => (
  <div className="text-xs uppercase tracking-wide text-slate-500">{children}</div>
);

export default function ScorecardCompareProfit() {
  // Shared + Champion + Challenger
  const [inputs, setInputs] = useState({
    shared: {
      monthlyApplications: 20000,
      badRatePct: 18,
      profitPerGood: 320,
      lossPerBad: 2800,
      opportunityCostPerGoodRejected: 180,
    },
    champion: {
      truePositiveRatePct: 82,
      falsePositiveRatePct: 28,
    },
    challenger: {
      truePositiveRatePct: 84,
      falsePositiveRatePct: 26,
    },
  });

  const results = useMemo(() => computeScorecardCompareProfit(inputs), [inputs]);

  const update = (group, key) => (e) => {
    const v = Number(e.target.value);
    setInputs((p) => ({
      ...p,
      [group]: { ...p[group], [key]: v },
    }));
  };

  const { champion, challenger, delta, technical } = results;

  const profitWinner =
    (challenger.economics.netProfit || 0) > (champion.economics.netProfit || 0)
      ? "Challenger"
      : "Champion";

  // Simple “technical winner” heuristic for exec-facing view:
  // Prefer higher goods/1k and lower bads/1k. If split, show “Trade-off”.
  const goodsDelta = technical.challenger.goodsPer1k - technical.champion.goodsPer1k;
  const badsDelta = technical.challenger.badsPer1k - technical.champion.badsPer1k;

  let technicalWinner = "Trade-off";
  if (goodsDelta >= 0 && badsDelta <= 0) technicalWinner = "Challenger";
  if (goodsDelta <= 0 && badsDelta >= 0) technicalWinner = "Champion";

  return (
    <CalculatorShell
      seo={
        <Seo
          title="Scorecard Champion vs Challenger Profit Comparator | The Smart Decision Group"
          description="Compare a current scorecard vs a new scorecard (or cut-off) using a confusion-matrix-based economic model: approvals, bads booked, and net profit impact."
          canonical="https://www.tsdg.co.za/tools/scorecard-compare-profit"
          ogType="website"
        />
      }
      meta="Calculator • ~3–4 min"
      title="Scorecard Champion vs Challenger Comparator"
      subtitle="Compare the current scorecard vs a new scorecard (or cut-off) using both operational metrics and profit impact — so the ‘best’ model is the one that makes more money."
      ctas={{
        topRight: (
          <>
            <Link to="/tools" className="text-sm rounded-xl border px-3 py-2">
              All Tools
            </Link>
            <a
              href="mailto:contact@tsdg.co.za?subject=Champion%20vs%20Challenger%20scorecard%20review"
              className="text-sm rounded-xl px-3 py-2"
              style={{
                background: "rgb(var(--primary))",
                color: "rgb(var(--primary-fg))",
              }}
            >
              Review my cut-offs
            </a>
          </>
        ),
      }}
      assumptions={
        <ul className="list-disc pl-5 space-y-2">
          <li>
            This compares two scorecards (or two cut-offs) on the <strong>same portfolio</strong> and the same base bad rate.
          </li>
          <li>
            Profit and loss are driven by <strong>approved goods</strong> (TP), <strong>approved bads</strong> (FP), and <strong>rejected goods</strong> (FN).
          </li>
          <li>
            “Technical winner” here is a practical operating view (goods booked vs bads booked), not AUC/Gini.
          </li>
          <li>
            Loss per bad should reflect expected lifetime loss (net of recoveries if relevant), and opportunity cost should reflect foregone contribution margin.
          </li>
        </ul>
      }
      childrenLeft={
        <div className="grid gap-6">
          {/* Shared inputs */}
          <div className="grid gap-4">
            <SectionLabel>Portfolio & economics</SectionLabel>

            <Field label="Monthly applications">
              <Input
                type="number"
                value={inputs.shared.monthlyApplications}
                onChange={update("shared", "monthlyApplications")}
              />
            </Field>

            <Field label="Base bad rate (%)" hint="Share of applications that are ‘bad’">
              <Input
                type="number"
                value={inputs.shared.badRatePct}
                onChange={update("shared", "badRatePct")}
              />
            </Field>

            <Field label="Profit per good approved (ZAR)" hint="Contribution margin / LTV net of costs">
              <Input
                type="number"
                value={inputs.shared.profitPerGood}
                onChange={update("shared", "profitPerGood")}
              />
            </Field>

            <Field label="Loss per bad approved (ZAR)" hint="Expected lifetime loss">
              <Input
                type="number"
                value={inputs.shared.lossPerBad}
                onChange={update("shared", "lossPerBad")}
              />
            </Field>

            <Field
              label="Opportunity cost per good rejected (ZAR)"
              hint="Foregone contribution margin from rejecting good accounts"
            >
              <Input
                type="number"
                value={inputs.shared.opportunityCostPerGoodRejected}
                onChange={update("shared", "opportunityCostPerGoodRejected")}
              />
            </Field>
          </div>

          {/* Champion */}
          <div className="grid gap-4 pt-2">
            <SectionLabel>Champion (current scorecard / current cut-off)</SectionLabel>

            <Field label="True positive rate (%)" hint="Goods correctly approved">
              <Input
                type="number"
                value={inputs.champion.truePositiveRatePct}
                onChange={update("champion", "truePositiveRatePct")}
              />
            </Field>

            <Field label="False positive rate (%)" hint="Bads incorrectly approved">
              <Input
                type="number"
                value={inputs.champion.falsePositiveRatePct}
                onChange={update("champion", "falsePositiveRatePct")}
              />
            </Field>
          </div>

          {/* Challenger */}
          <div className="grid gap-4 pt-2">
            <SectionLabel>Challenger (new scorecard / alternative cut-off)</SectionLabel>

            <Field label="True positive rate (%)" hint="Goods correctly approved">
              <Input
                type="number"
                value={inputs.challenger.truePositiveRatePct}
                onChange={update("challenger", "truePositiveRatePct")}
              />
            </Field>

            <Field label="False positive rate (%)" hint="Bads incorrectly approved">
              <Input
                type="number"
                value={inputs.challenger.falsePositiveRatePct}
                onChange={update("challenger", "falsePositiveRatePct")}
              />
            </Field>
          </div>
        </div>
      }
      childrenRight={
        <div className="grid gap-4">
          {/* Headline summary */}
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-xs text-slate-500">Winner summary</div>
            <div className="mt-1 text-sm">
              <div className="flex justify-between">
                <span>Technical winner</span>
                <strong>{technicalWinner}</strong>
              </div>
              <div className="flex justify-between mt-1">
                <span>Profit winner</span>
                <strong>{profitWinner}</strong>
              </div>
            </div>
            <div className="mt-3 text-sm">
              Monthly profit delta:{" "}
              <strong>
                {delta.economics.netProfit >= 0 ? "+" : "−"} ZAR{" "}
                {money(Math.abs(delta.economics.netProfit))}
              </strong>
            </div>
          </div>

          {/* Delta card */}
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Profit impact (Challenger − Champion)
            </div>
            <div className="mt-3 text-sm grid gap-2">
              <div className="flex justify-between">
                <span>Δ profit from goods</span>
                <strong>
                  {delta.economics.profitFromGoods >= 0 ? "+" : "−"} ZAR{" "}
                  {money(Math.abs(delta.economics.profitFromGoods))}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Δ loss from bads</span>
                <strong>
                  {delta.economics.lossFromBads >= 0 ? "+" : "−"} ZAR{" "}
                  {money(Math.abs(delta.economics.lossFromBads))}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Δ opportunity cost</span>
                <strong>
                  {delta.economics.opportunityCost >= 0 ? "+" : "−"} ZAR{" "}
                  {money(Math.abs(delta.economics.opportunityCost))}
                </strong>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>
                  <strong>Δ net profit</strong>
                </span>
                <strong>
                  {delta.economics.netProfit >= 0 ? "+" : "−"} ZAR{" "}
                  {money(Math.abs(delta.economics.netProfit))}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Δ profit per 1,000 apps</span>
                <strong>
                  {delta.derived.profitPerThousandApps >= 0 ? "+" : "−"} ZAR{" "}
                  {money(Math.abs(delta.derived.profitPerThousandApps))}
                </strong>
              </div>
            </div>
          </div>

          {/* Technical comparison */}
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Operating metrics
            </div>
            <div className="mt-3 text-sm grid gap-2">
              <div className="flex justify-between">
                <span>Approval rate</span>
                <strong>
                  {pct(technical.champion.approvalRatePct)} →{" "}
                  {pct(technical.challenger.approvalRatePct)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Bads booked per 1,000 apps</span>
                <strong>
                  {num(technical.champion.badsPer1k, 1)} →{" "}
                  {num(technical.challenger.badsPer1k, 1)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Goods booked per 1,000 apps</span>
                <strong>
                  {num(technical.champion.goodsPer1k, 1)} →{" "}
                  {num(technical.challenger.goodsPer1k, 1)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Bad rate on-book</span>
                <strong>
                  {pct(technical.champion.badRateOnBookPct, 2)} →{" "}
                  {pct(technical.challenger.badRateOnBookPct, 2)}
                </strong>
              </div>
            </div>
          </div>

          {/* Side-by-side net profit */}
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Net profit (monthly)
            </div>
            <div className="mt-3 grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Champion</span>
                <strong>ZAR {money(champion.economics.netProfit)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Challenger</span>
                <strong>ZAR {money(challenger.economics.netProfit)}</strong>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
