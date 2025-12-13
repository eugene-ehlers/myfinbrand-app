// src/pages/tools/BuildVsRentModels.jsx
import React, { useMemo, useState } from "react";
import Seo from "../../components/Seo.jsx";
import { Link } from "react-router-dom";
import CalculatorShell from "../../components/tools/CalculatorShell.jsx";
import { computeBuildVsRentModels } from "../../lib/calculators/buildVsRentModels.js";

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

const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border ${
      checked ? "bg-slate-900 text-white" : "bg-white text-slate-900"
    }`}
  >
    <span className="text-sm font-medium">{label}</span>
    <span className="text-xs">{checked ? "On" : "Off"}</span>
  </button>
);

export default function BuildVsRentModels() {
  const [inputs, setInputs] = useState({
    years: 3,

    // In-house
    oneOffBuildCost: 1800000,
    monthlyRunCost: 120000,
    monthlyGovernanceCost: 85000,
    maintenancePctPerYear: 18,

    // Staffing model (optional)
    useStaffingModel: false,
    buildMonths: 6,
    dsMonthlyCost: 120000,
    deMonthlyCost: 110000,
    mlopsMonthlyCost: 140000,
    riskMonthlyCost: 90000,
    pmMonthlyCost: 100000,
    buildFteDs: 1,
    buildFteDe: 1,
    buildFteMlops: 0.5,
    buildFteRisk: 0.3,
    buildFtePm: 0.3,

    // Rent / MaaS
    maasMonthlyFee: 220000,
    maasOneOffSetup: 250000,

    // Time-to-value (informational)
    inHouseTimeToValueMonths: 6,
    maasTimeToValueMonths: 2,
  });

  const results = useMemo(() => computeBuildVsRentModels(inputs), [inputs]);

  const update = (key) => (e) => {
    const val = e.target.value;
    setInputs((prev) => ({ ...prev, [key]: val === "" ? "" : Number(val) }));
  };

  const setFlag = (key) => (val) => setInputs((prev) => ({ ...prev, [key]: val }));

  const { horizon, inHouse, rent, comparison } = results;

  return (
    <CalculatorShell
      seo={
        <Seo
          title="Build vs Rent Models Calculator | The Smart Decision Group"
          description="Compare 3-year total cost of ownership for in-house predictive models versus models-as-a-service, including governance and monitoring overhead."
          canonical="https://www.tsdg.co.za/tools/build-vs-rent-models"
          ogType="website"
        />
      }
      meta="Calculator • ~3 min"
      title="Build vs Rent: Predictive Model TCO Comparator"
      subtitle="A practical 3-year cost comparison. Use either a simple one-off build estimate or a staffing-based estimate."
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
              href="mailto:contact@tsdg.co.za?subject=Build%20vs%20Rent%20model%20review%20request"
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
              href="/docs/building-predictive-models-in-house.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm rounded-xl border px-3 py-2 hover:shadow-sm transition-shadow bg-white"
            >
              Download: Building Predictive Models In-House
            </a>
            <a
              href="mailto:contact@tsdg.co.za?subject=Predictive%20model%20operating%20model%20assessment"
              className="text-sm rounded-xl px-3 py-2"
              style={{
                background: "rgb(var(--primary))",
                color: "rgb(var(--primary-fg))",
              }}
            >
              Assess my operating model
            </a>
          </>
        ),
      }}
      assumptions={
        <ul className="list-disc pl-5 space-y-2">
          <li>
            In-house maintenance is modelled as <strong>% of one-off build per year</strong> (enhancements, recalibration, drift fixes, documentation, re-approvals).
          </li>
          <li>
            Monthly governance cost represents monitoring, reporting, champion/challenger, back-testing, and audit evidence production.
          </li>
          <li>
            MaaS monthly fee assumes hosting + monitoring + governance are included; adjust if you separate these.
          </li>
          <li>
            Time-to-value is informational only, but typically correlates strongly with business-case outcomes.
          </li>
        </ul>
      }
      childrenLeft={
        <div className="grid gap-6">
          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Horizon
            </div>

            <Field label="Comparison horizon (years)">
              <Input
                type="number"
                min="1"
                max="10"
                step="1"
                value={inputs.years}
                onChange={update("years")}
              />
            </Field>

            <div className="text-xs text-slate-500">
              Calculating totals over {horizon.months} months.
            </div>
          </div>

          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              In-house cost model
            </div>

            <Toggle
              checked={inputs.useStaffingModel}
              onChange={setFlag("useStaffingModel")}
              label="Use staffing-based build estimate"
            />

            {!inputs.useStaffingModel ? (
              <>
                <Field
                  label="One-off build cost (ZAR)"
                  hint="build + integration + initial rollout"
                >
                  <Input
                    type="number"
                    min="0"
                    step="5000"
                    value={inputs.oneOffBuildCost}
                    onChange={update("oneOffBuildCost")}
                  />
                </Field>
              </>
            ) : (
              <>
                <Field label="Build duration (months)">
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={inputs.buildMonths}
                    onChange={update("buildMonths")}
                  />
                </Field>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="DS monthly cost" hint="ZAR">
                    <Input
                      type="number"
                      min="0"
                      step="1000"
                      value={inputs.dsMonthlyCost}
                      onChange={update("dsMonthlyCost")}
                    />
                  </Field>
                  <Field label="DS FTE (build)">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={inputs.buildFteDs}
                      onChange={update("buildFteDs")}
                    />
                  </Field>

                  <Field label="DE monthly cost" hint="ZAR">
                    <Input
                      type="number"
                      min="0"
                      step="1000"
                      value={inputs.deMonthlyCost}
                      onChange={update("deMonthlyCost")}
                    />
                  </Field>
                  <Field label="DE FTE (build)">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={inputs.buildFteDe}
                      onChange={update("buildFteDe")}
                    />
                  </Field>

                  <Field label="MLOps monthly cost" hint="ZAR">
                    <Input
                      type="number"
                      min="0"
                      step="1000"
                      value={inputs.mlopsMonthlyCost}
                      onChange={update("mlopsMonthlyCost")}
                    />
                  </Field>
                  <Field label="MLOps FTE (build)">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={inputs.buildFteMlops}
                      onChange={update("buildFteMlops")}
                    />
                  </Field>

                  <Field label="Risk monthly cost" hint="ZAR">
                    <Input
                      type="number"
                      min="0"
                      step="1000"
                      value={inputs.riskMonthlyCost}
                      onChange={update("riskMonthlyCost")}
                    />
                  </Field>
                  <Field label="Risk FTE (build)">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={inputs.buildFteRisk}
                      onChange={update("buildFteRisk")}
                    />
                  </Field>

                  <Field label="PM monthly cost" hint="ZAR">
                    <Input
                      type="number"
                      min="0"
                      step="1000"
                      value={inputs.pmMonthlyCost}
                      onChange={update("pmMonthlyCost")}
                    />
                  </Field>
                  <Field label="PM FTE (build)">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={inputs.buildFtePm}
                      onChange={update("buildFtePm")}
                    />
                  </Field>
                </div>
              </>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Monthly run cost" hint="infra + tooling (ZAR)">
                <Input
                  type="number"
                  min="0"
                  step="1000"
                  value={inputs.monthlyRunCost}
                  onChange={update("monthlyRunCost")}
                />
              </Field>

              <Field
                label="Monthly governance cost"
                hint="monitoring + reporting (ZAR)"
              >
                <Input
                  type="number"
                  min="0"
                  step="1000"
                  value={inputs.monthlyGovernanceCost}
                  onChange={update("monthlyGovernanceCost")}
                />
              </Field>
            </div>

            <Field
              label="Maintenance per year (% of one-off build)"
              hint="enhancements + recalibration"
            >
              <Input
                type="number"
                min="0"
                step="1"
                value={inputs.maintenancePctPerYear}
                onChange={update("maintenancePctPerYear")}
              />
            </Field>
          </div>

          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Models-as-a-Service
            </div>

            <Field label="One-off setup (ZAR)" hint="integration + configuration">
              <Input
                type="number"
                min="0"
                step="5000"
                value={inputs.maasOneOffSetup}
                onChange={update("maasOneOffSetup")}
              />
            </Field>

            <Field label="Monthly fee (ZAR)" hint="hosting + monitoring + governance">
              <Input
                type="number"
                min="0"
                step="1000"
                value={inputs.maasMonthlyFee}
                onChange={update("maasMonthlyFee")}
              />
            </Field>
          </div>

          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Time-to-value (optional)
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="In-house TTV (months)">
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={inputs.inHouseTimeToValueMonths}
                  onChange={update("inHouseTimeToValueMonths")}
                />
              </Field>

              <Field label="MaaS TTV (months)">
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={inputs.maasTimeToValueMonths}
                  onChange={update("maasTimeToValueMonths")}
                />
              </Field>
            </div>
          </div>
        </div>
      }
      childrenRight={
        <div className="grid gap-5">
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-xs text-slate-500">Cheapest option (TCO)</div>
            <div className="mt-1 text-2xl font-semibold">{comparison.cheaperOption}</div>
            <div className="mt-2 text-sm text-slate-700">
              Over {horizon.years} years: difference{" "}
              <strong>
                ZAR {money(Math.abs(comparison.delta))}
              </strong>{" "}
              ({comparison.delta > 0 ? "MaaS cheaper" : comparison.delta < 0 ? "In-house cheaper" : "equal"}).
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border bg-white p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                In-house TCO
              </div>
              <div className="mt-1 text-xl font-semibold">ZAR {money(inHouse.total)}</div>
              <div className="mt-3 text-sm grid gap-1">
                <div className="flex items-center justify-between">
                  <span>One-off build</span>
                  <strong>ZAR {money(inHouse.oneOffBuild)}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Maintenance (total)</span>
                  <strong>ZAR {money(inHouse.maintenanceTotal)}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Run cost (total)</span>
                  <strong>ZAR {money(inHouse.runTotal)}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Governance (total)</span>
                  <strong>ZAR {money(inHouse.governanceTotal)}</strong>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Time-to-value (estimate): {num(inHouse.ttvMonths, 0)} months
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Models-as-a-Service TCO
              </div>
              <div className="mt-1 text-xl font-semibold">ZAR {money(rent.total)}</div>
              <div className="mt-3 text-sm grid gap-1">
                <div className="flex items-center justify-between">
                  <span>One-off setup</span>
                  <strong>ZAR {money(rent.oneOffSetup)}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fees (total)</span>
                  <strong>ZAR {money(rent.feeTotal)}</strong>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Time-to-value (estimate): {num(rent.ttvMonths, 0)} months
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            This view focuses on cost. In practice, governance strength, speed-to-production,
            auditability, and model monitoring maturity usually dominate the decision.
          </div>
        </div>
      }
    />
  );
}
