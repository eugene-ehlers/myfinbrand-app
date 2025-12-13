// src/pages/tools/DecisionEngineRoi.jsx
import React, { useMemo, useState } from "react";
import Seo from "../../components/Seo.jsx";
import { Link } from "react-router-dom";
import CalculatorShell from "../../components/tools/CalculatorShell.jsx";
import { computeDecisionEngineRoi } from "../../lib/calculators/decisionEngineRoi.js";

const money = (n) => {
  const x = Number(n || 0);
  return x.toLocaleString(undefined, { maximumFractionDigits: 0 });
};

const money2 = (n) => {
  const x = Number(n || 0);
  return x.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const pct = (n) => `${(Number(n || 0) * 100).toFixed(1)}%`;

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
    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-300 ${props.className || ""}`}
  />
);

export default function DecisionEngineRoi() {
  const [inputs, setInputs] = useState({
    // Volumes & ops
    monthlyApplications: 25000,
    avgMinutesPerDecision: 6,
    fullyLoadedHourlyCost: 350, // ZAR/hour

    // Conversion
    currentApprovalRatePct: 35,
    upliftApprovalPctPoints: 3,

    // Unit economics
    avgGrossProfitPerApproved: 220, // ZAR contribution per approved
    avgExposurePerApproved: 12000, // ZAR principal/exposure
    currentLossRatePct: 7.5,
    lossReductionPctPoints: 0.8,

    // Costs
    oneOffImplementationCost: 650000,
    monthlyPlatformCost: 65000,
  });

  const results = useMemo(() => computeDecisionEngineRoi(inputs), [inputs]);

  const update = (key) => (e) => {
    const val = e.target.value;
    setInputs((prev) => ({ ...prev, [key]: val === "" ? "" : Number(val) }));
  };

  const { breakdown, headline, derived } = results;

  return (
    <CalculatorShell
      seo={
        <Seo
          title="Decision Engine ROI Calculator | The Smart Decision Group"
          description="Estimate ROI and payback period from decision automation using cost-to-serve, conversion uplift, and loss reduction assumptions."
          canonical="https://www.tsdg.co.za/tools/decision-engine-roi"
          ogType="website"
        />
      }
      meta="Calculator • 2–3 min"
      title="Decision Engine ROI & Payback Calculator"
      subtitle="A quick, defensible estimate of value from decision automation. Adjust assumptions to reflect your portfolio and operating model."
      ctas={{
        topRight: (
          <>
            <Link
              to="/insights"
              className="text-sm rounded-xl border px-3 py-2 hover:shadow-sm transition-shadow"
            >
              Read Insights
            </Link>
            <a
              href="mailto:contact@tsdg.co.za?subject=ROI%20calculator%20review%20request"
              className="text-sm rounded-xl px-3 py-2"
              style={{
                background: "rgb(var(--primary))",
                color: "rgb(var(--primary-fg))",
              }}
            >
              Request a review
            </a>
          </>
        ),
        bottom: (
          <>
            <a
              href="/docs/decision-engines-101.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm rounded-xl border px-3 py-2 hover:shadow-sm transition-shadow bg-white"
            >
              Download: Decision Engines 101
            </a>
            <a
              href="mailto:contact@tsdg.co.za?subject=Decision%20Engine%20ROI%20business%20case"
              className="text-sm rounded-xl px-3 py-2"
              style={{
                background: "rgb(var(--primary))",
                color: "rgb(var(--primary-fg))",
              }}
            >
              Build my business case
            </a>
          </>
        ),
      }}
      assumptions={
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Operational savings assume <strong>70%</strong> of manual handling time is removed through automation, straight-through processing, and reduced rework. Adjust this in the calculator logic if your baseline differs.
          </li>
          <li>
            “Gross profit per approved” should be a contribution margin proxy (fees + interest margin − variable costs), not total revenue.
          </li>
          <li>
            Loss reduction is applied to approvals after uplift (conservative) and uses a simplified expected-loss proxy: approvals × exposure × loss rate.
          </li>
          <li>
            This estimate excludes second-order benefits (customer experience, compliance overhead reduction, fraud ring disruption, improved pricing, etc.).
          </li>
        </ul>
      }
      childrenLeft={
        <div className="grid gap-6">
          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Volume & Operating Cost
            </div>

            <Field label="Monthly decisions / applications" hint="e.g., originations, onboarding, claims">
              <Input
                type="number"
                min="0"
                value={inputs.monthlyApplications}
                onChange={update("monthlyApplications")}
              />
            </Field>

            <Field label="Average minutes per decision (manual / current)" hint="baseline handling time">
              <Input
                type="number"
                min="0"
                step="0.5"
                value={inputs.avgMinutesPerDecision}
                onChange={update("avgMinutesPerDecision")}
              />
            </Field>

            <Field label="Fully loaded hourly cost (ZAR)" hint="staff + overhead proxy">
              <Input
                type="number"
                min="0"
                step="10"
                value={inputs.fullyLoadedHourlyCost}
                onChange={update("fullyLoadedHourlyCost")}
              />
            </Field>
          </div>

          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Conversion Value
            </div>

            <Field label="Current approval rate (%)">
              <Input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={inputs.currentApprovalRatePct}
                onChange={update("currentApprovalRatePct")}
              />
            </Field>

            <Field label="Approval uplift (percentage points)" hint="e.g., +3 points">
              <Input
                type="number"
                step="0.5"
                value={inputs.upliftApprovalPctPoints}
                onChange={update("upliftApprovalPctPoints")}
              />
            </Field>

            <Field label="Gross profit per approved (ZAR)" hint="contribution margin proxy">
              <Input
                type="number"
                min="0"
                step="10"
                value={inputs.avgGrossProfitPerApproved}
                onChange={update("avgGrossProfitPerApproved")}
              />
            </Field>
          </div>

          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Risk / Loss Value
            </div>

            <Field label="Average exposure per approved (ZAR)" hint="principal / balance proxy">
              <Input
                type="number"
                min="0"
                step="100"
                value={inputs.avgExposurePerApproved}
                onChange={update("avgExposurePerApproved")}
              />
            </Field>

            <Field label="Current loss rate (%)" hint="expected loss proxy">
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={inputs.currentLossRatePct}
                onChange={update("currentLossRatePct")}
              />
            </Field>

            <Field label="Loss reduction (percentage points)" hint="e.g., 0.8 points">
              <Input
                type="number"
                step="0.1"
                value={inputs.lossReductionPctPoints}
                onChange={update("lossReductionPctPoints")}
              />
            </Field>
          </div>

          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Cost Assumptions
            </div>

            <Field label="One-off implementation cost (ZAR)" hint="setup + integration + rollout">
              <Input
                type="number"
                min="0"
                step="5000"
                value={inputs.oneOffImplementationCost}
                onChange={update("oneOffImplementationCost")}
              />
            </Field>

            <Field label="Monthly platform / managed cost (ZAR)" hint="licence + hosting + support">
              <Input
                type="number"
                min="0"
                step="1000"
                value={inputs.monthlyPlatformCost}
                onChange={update("monthlyPlatformCost")}
              />
            </Field>
          </div>
        </div>
      }
      childrenRight={
        <div className="grid gap-5">
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-xs text-slate-500">Estimated annual net value</div>
            <div className="mt-1 text-2xl font-semibold">
              ZAR {money(headline.annualNetValue)}
            </div>
            <div className="mt-2 text-sm text-slate-700">
              Annual gross value: <strong>ZAR {money(headline.annualGrossValue)}</strong>
              <br />
              Annual platform cost: <strong>ZAR {money(headline.annualCost)}</strong>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border bg-white p-4">
              <div className="text-xs text-slate-500">Payback period (months)</div>
              <div className="mt-1 text-xl font-semibold">
                {headline.paybackMonths == null
                  ? "N/A (net value ≤ 0)"
                  : headline.paybackMonths.toFixed(1)}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Based on monthly net value versus one-off cost.
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4">
              <div className="text-xs text-slate-500">12-month ROI multiple (simple)</div>
              <div className="mt-1 text-xl font-semibold">
                {headline.roiMultiple == null ? "N/A" : `${headline.roiMultiple.toFixed(2)}×`}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                ((Annual net value − one-off) / one-off). Excludes discounting.
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Monthly value drivers
            </div>
            <div className="mt-3 grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Ops savings</span>
                <strong>ZAR {money2(breakdown.monthlyOpsSavings)}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Conversion uplift value</span>
                <strong>ZAR {money2(breakdown.monthlyConversionValue)}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Loss avoidance value</span>
                <strong>ZAR {money2(breakdown.monthlyLossAvoidance)}</strong>
              </div>
              <div className="border-t pt-2 mt-1 flex items-center justify-between">
                <span>Gross value</span>
                <strong>ZAR {money2(breakdown.monthlyGrossValue)}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Platform cost</span>
                <strong>− ZAR {money2(breakdown.monthlyTotalCost)}</strong>
              </div>
              <div className="border-t pt-2 mt-1 flex items-center justify-between">
                <span>Net value</span>
                <strong>ZAR {money2(breakdown.monthlyNetValue)}</strong>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Derived signals
            </div>
            <div className="mt-3 grid gap-2 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Hours saved (per month)</span>
                <strong>{headline.monthlyHoursSaved.toFixed(0)}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Incremental approvals (per month)</span>
                <strong>{headline.incrementalApprovals.toFixed(0)}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Approval rate (before → after)</span>
                <strong>
                  {pct(derived.approvals0 / (Number(inputs.monthlyApplications) || 1))} →{" "}
                  {pct(derived.approvals1 / (Number(inputs.monthlyApplications) || 1))}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Loss rate (before → after)</span>
                <strong>
                  {(derived.lossRate0 * 100).toFixed(1)}% →{" "}
                  {(derived.lossRate1 * 100).toFixed(1)}%
                </strong>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            This is a directional estimate. For investment approval, we recommend
            validating assumptions against your portfolio segmentation,
            operational workflows, and current decision journey.
          </div>
        </div>
      }
    />
  );
}
