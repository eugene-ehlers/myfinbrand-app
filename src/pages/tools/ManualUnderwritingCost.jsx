// src/pages/tools/ManualUnderwritingCost.jsx
import React, { useMemo, useState } from "react";
import Seo from "../../components/Seo.jsx";
import { Link } from "react-router-dom";
import CalculatorShell from "../../components/tools/CalculatorShell.jsx";
import { computeManualUnderwritingCost } from "../../lib/calculators/manualUnderwritingCost.js";

const money = (n) =>
  Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });

const num = (n, d = 1) =>
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
    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-300 ${props.className || ""}`}
  />
);

export default function ManualUnderwritingCost() {
  const [inputs, setInputs] = useState({
    monthlyCases: 18000,
    avgMinutesPerCase: 8,

    reworkRatePct: 22,
    reworkMinutesPerCase: 6,

    fullyLoadedHourlyCost: 320, // ZAR/hr
    workHoursPerFtePerMonth: 160, // typical

    peakToAverageRatio: 1.25,
    targetSlaDays: 2,
  });

  const results = useMemo(() => computeManualUnderwritingCost(inputs), [inputs]);

  const update = (key) => (e) => {
    const val = e.target.value;
    setInputs((prev) => ({ ...prev, [key]: val === "" ? "" : Number(val) }));
  };

  const d = results.derived;

  return (
    <CalculatorShell
      seo={
        <Seo
          title="Manual Underwriting Cost Calculator | The Smart Decision Group"
          description="Translate decision volumes and handling time into FTE requirements, monthly cost, and peak-demand capacity risk."
          canonical="https://www.tsdg.co.za/tools/manual-underwriting-cost"
          ogType="website"
        />
      }
      meta="Calculator • ~2 min"
      title="Manual Underwriting Cost & Capacity Calculator"
      subtitle="A fast estimate of operating cost and staffing capacity based on volumes, handling time, and rework."
      ctas={{
        topRight: (
          <>
            <Link
              to="/tools"
              className="text-sm rounded-xl border px-3 py-2 hover:shadow-sm transition-shadow"
            >
              All Tools
            </Link>
            <a
              href="mailto:contact@tsdg.co.za?subject=Underwriting%20capacity%20review%20request"
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
              href="mailto:contact@tsdg.co.za?subject=Underwriting%20ops%20business%20case"
              className="text-sm rounded-xl px-3 py-2"
              style={{
                background: "rgb(var(--primary))",
                color: "rgb(var(--primary-fg))",
              }}
            >
              Build my ops case
            </a>
          </>
        ),
      }}
      assumptions={
        <ul className="list-disc pl-5 space-y-2">
          <li>
            FTE is calculated using <strong>work hours per FTE per month</strong>{" "}
            (default 160). Adjust for your shift model, productivity, and
            meeting/training time.
          </li>
          <li>
            Rework is modelled as <strong>rework rate × extra minutes</strong>{" "}
            added to each case (directional, but typically close enough for a
            first-pass business case).
          </li>
          <li>
            Peak-to-average ratio is applied to workload to show capacity strain
            and implied cost pressure during peaks.
          </li>
        </ul>
      }
      childrenLeft={
        <div className="grid gap-6">
          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Volumes & Handling Time
            </div>

            <Field label="Monthly cases / decisions" hint="total cases per month">
              <Input
                type="number"
                min="0"
                value={inputs.monthlyCases}
                onChange={update("monthlyCases")}
              />
            </Field>

            <Field label="Average minutes per case" hint="baseline handling time">
              <Input
                type="number"
                min="0"
                step="0.5"
                value={inputs.avgMinutesPerCase}
                onChange={update("avgMinutesPerCase")}
              />
            </Field>
          </div>

          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Rework
            </div>

            <Field label="Rework rate (%)" hint="% cases requiring follow-up">
              <Input
                type="number"
                min="0"
                max="100"
                step="1"
                value={inputs.reworkRatePct}
                onChange={update("reworkRatePct")}
              />
            </Field>

            <Field
              label="Extra minutes for rework cases"
              hint="additional time per rework case"
            >
              <Input
                type="number"
                min="0"
                step="0.5"
                value={inputs.reworkMinutesPerCase}
                onChange={update("reworkMinutesPerCase")}
              />
            </Field>
          </div>

          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Cost & Capacity
            </div>

            <Field label="Fully loaded hourly cost (ZAR)" hint="staff + overhead">
              <Input
                type="number"
                min="0"
                step="10"
                value={inputs.fullyLoadedHourlyCost}
                onChange={update("fullyLoadedHourlyCost")}
              />
            </Field>

            <Field
              label="Work hours per FTE per month"
              hint="typical 160 (8×20)"
            >
              <Input
                type="number"
                min="1"
                step="1"
                value={inputs.workHoursPerFtePerMonth}
                onChange={update("workHoursPerFtePerMonth")}
              />
            </Field>

            <Field label="Peak-to-average ratio" hint="e.g., 1.25 = 25% peak">
              <Input
                type="number"
                min="1"
                step="0.05"
                value={inputs.peakToAverageRatio}
                onChange={update("peakToAverageRatio")}
              />
            </Field>

            <Field label="Target SLA (days)" hint="optional (informational)">
              <Input
                type="number"
                min="0"
                step="1"
                value={inputs.targetSlaDays}
                onChange={update("targetSlaDays")}
              />
            </Field>
          </div>
        </div>
      }
      childrenRight={
        <div className="grid gap-5">
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-xs text-slate-500">Effective minutes per case</div>
            <div className="mt-1 text-2xl font-semibold">
              {num(d.effectiveMinutesPerCase, 1)} min
            </div>
            <div className="mt-2 text-sm text-slate-700">
              Monthly workload: <strong>{num(d.monthlyTotalHours, 0)} hours</strong>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border bg-white p-4">
              <div className="text-xs text-slate-500">FTE required (average month)</div>
              <div className="mt-1 text-xl font-semibold">
                {num(d.fteRequiredAvg, 1)} FTE
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4">
              <div className="text-xs text-slate-500">FTE required (peak month)</div>
              <div className="mt-1 text-xl font-semibold">
                {num(d.fteRequiredPeak, 1)} FTE
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Using peak-to-average ratio: {num(inputs.peakToAverageRatio, 2)}×
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Cost estimate
            </div>
            <div className="mt-3 grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Monthly cost (average)</span>
                <strong>ZAR {money(d.monthlyCostAvg)}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Monthly cost (peak)</span>
                <strong>ZAR {money(d.monthlyCostPeak)}</strong>
              </div>
              <div className="border-t pt-2 mt-1 flex items-center justify-between">
                <span>Peak premium vs average</span>
                <strong>ZAR {money(d.peakPremiumCost)}</strong>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Use this as an operating baseline. Automation and decision engines typically reduce rework,
            handling time, and peak volatility through straight-through decisions and better routing.
          </div>
        </div>
      }
    />
  );
}
