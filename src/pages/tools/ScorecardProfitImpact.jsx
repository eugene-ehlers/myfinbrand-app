// src/pages/tools/ScorecardProfitImpact.jsx
import React, { useMemo, useState } from "react";
import Seo from "../../components/Seo.jsx";
import { Link } from "react-router-dom";
import CalculatorShell from "../../components/tools/CalculatorShell.jsx";
import { computeScorecardProfitImpact } from "../../lib/calculators/scorecardProfitImpact.js";

const money = (n) =>
  Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });

const num = (n, d = 0) =>
  Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: d });

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

export default function ScorecardProfitImpact() {
  const [inputs, setInputs] = useState({
    monthlyApplications: 20000,
    badRatePct: 18,

    approvalRatePct: 45,
    truePositiveRatePct: 82,
    falsePositiveRatePct: 28,

    profitPerGood: 320,
    lossPerBad: 2800,
    opportunityCostPerGoodRejected: 180,
  });

  const results = useMemo(
    () => computeScorecardProfitImpact(inputs),
    [inputs]
  );

  const update = (key) => (e) =>
    setInputs((p) => ({ ...p, [key]: Number(e.target.value) }));

  const { confusionMatrix, economics, derived } = results;

  return (
    <CalculatorShell
      seo={
        <Seo
          title="Scorecard Profit Impact Calculator | The Smart Decision Group"
          description="Translate scorecard performance into real profit and loss using a confusion-matrix-based economic model."
          canonical="https://www.tsdg.co.za/tools/scorecard-profit-impact"
          ogType="website"
        />
      }
      meta="Calculator • ~3 min"
      title="Scorecard Profit Impact Calculator"
      subtitle="Understand how scorecard decisions translate into profit, loss, and opportunity cost — not just technical metrics."
      ctas={{
        topRight: (
          <>
            <Link
              to="/tools"
              className="text-sm rounded-xl border px-3 py-2"
            >
              All Tools
            </Link>
            <a
              href="mailto:contact@tsdg.co.za?subject=Scorecard%20profit%20impact%20review"
              className="text-sm rounded-xl px-3 py-2"
              style={{
                background: "rgb(var(--primary))",
                color: "rgb(var(--primary-fg))",
              }}
            >
              Review my scorecard
            </a>
          </>
        ),
      }}
      assumptions={
        <ul className="list-disc pl-5 space-y-2">
          <li>
            This calculator evaluates <strong>a scorecard at a given cut-off</strong>.
            It does not optimise technical metrics such as Gini or AUC.
          </li>
          <li>
            Opportunity cost represents foregone contribution margin from
            rejecting otherwise profitable customers.
          </li>
          <li>
            Loss per bad account should reflect expected lifetime loss, not
            just first-cycle delinquency.
          </li>
        </ul>
      }
      childrenLeft={
        <div className="grid gap-6">
          <Field label="Monthly applications">
            <Input type="number" value={inputs.monthlyApplications} onChange={update("monthlyApplications")} />
          </Field>

          <Field label="Base bad rate (%)">
            <Input type="number" value={inputs.badRatePct} onChange={update("badRatePct")} />
          </Field>

          <Field label="Approval rate (%)">
            <Input type="number" value={inputs.approvalRatePct} onChange={update("approvalRatePct")} />
          </Field>

          <Field label="True positive rate (%)" hint="Goods correctly approved">
            <Input type="number" value={inputs.truePositiveRatePct} onChange={update("truePositiveRatePct")} />
          </Field>

          <Field label="False positive rate (%)" hint="Bads incorrectly approved">
            <Input type="number" value={inputs.falsePositiveRatePct} onChange={update("falsePositiveRatePct")} />
          </Field>

          <Field label="Profit per good account">
            <Input type="number" value={inputs.profitPerGood} onChange={update("profitPerGood")} />
          </Field>

          <Field label="Loss per bad account">
            <Input type="number" value={inputs.lossPerBad} onChange={update("lossPerBad")} />
          </Field>

          <Field label="Opportunity cost per rejected good">
            <Input type="number" value={inputs.opportunityCostPerGoodRejected} onChange={update("opportunityCostPerGoodRejected")} />
          </Field>
        </div>
      }
      childrenRight={
        <div className="grid gap-4">
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-xs text-slate-500">Monthly net profit impact</div>
            <div className="mt-1 text-2xl font-semibold">
              ZAR {money(economics.netProfit)}
            </div>
            <div className="mt-2 text-sm">
              Profit per 1,000 apps:{" "}
              <strong>ZAR {money(derived.profitPerThousandApps)}</strong>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Economic breakdown
            </div>
            <div className="mt-3 text-sm grid gap-2">
              <div className="flex justify-between">
                <span>Profit from approved goods</span>
                <strong>ZAR {money(economics.profitFromGoods)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Loss from approved bads</span>
                <strong>− ZAR {money(economics.lossFromBads)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Opportunity cost (rejected goods)</span>
                <strong>− ZAR {money(economics.opportunityCost)}</strong>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Confusion matrix (monthly)
            </div>
            <div className="mt-3 text-sm grid gap-1">
              <div>True positives: {num(confusionMatrix.tp)}</div>
              <div>False positives: {num(confusionMatrix.fp)}</div>
              <div>False negatives: {num(confusionMatrix.fn)}</div>
              <div>True negatives: {num(confusionMatrix.tn)}</div>
            </div>
          </div>
        </div>
      }
    />
  );
}
