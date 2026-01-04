// src/pages/CollectionsStrategy.jsx
import React, { useState } from "react";
import { Settings2, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import SiteHeader from "../../../../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../../../../components/layout/SiteFooter.jsx";


const FIELD_OPTIONS = [
  { value: "ptp_score", label: "Propensity to Pay (PTP)" },
  { value: "ptr_score", label: "Propensity to React (PTR)" },
  { value: "days_past_due", label: "Days Past Due (DPD)" },
  { value: "arrears_amount", label: "Arrears Amount" },
  { value: "collections_segment", label: "Collections Segment" },
];

const OPERATOR_OPTIONS = [
  { value: "<", label: "<" },
  { value: "<=", label: "≤" },
  { value: ">", label: ">" },
  { value: ">=", label: "≥" },
  { value: "=", label: "=" },
];

const ACTION_TYPE_OPTIONS = [
  { value: "treatment_type", label: "Treatment" },
  { value: "primary_channel", label: "Channel" },
  { value: "output_stream", label: "Output stream" },
];

const TREATMENT_VALUES = [
  { value: "campaign", label: "Campaign" },
  { value: "soft", label: "Soft" },
  { value: "hard", label: "Hard" },
  { value: "legal", label: "Legal" },
];

const CHANNEL_VALUES = [
  { value: "SMS", label: "SMS" },
  { value: "EMAIL", label: "Email" },
  { value: "DIALLER", label: "Dialler" },
];

const OUTPUT_VALUES = [
  { value: "SMS", label: "SMS file" },
  { value: "EMAIL", label: "Email file" },
  { value: "DIALLER", label: "Dialler file" },
  { value: "SUPPRESSED", label: "Suppressed" },
];

// Seed rules grouped by gate
const INITIAL_RULES = [
  {
    id: "r1",
    gate: "Gate 2 – Collections Segmentation",
    description: "Early bucket",
    field: "days_past_due",
    operator: "<=",
    threshold: "30",
    actionType: "treatment_type",
    actionValue: "campaign",
  },
  {
    id: "r2",
    gate: "Gate 5 – Treatment Selection",
    description: "Very low PTP → Legal",
    field: "ptp_score",
    operator: "<",
    threshold: "0.2",
    actionType: "treatment_type",
    actionValue: "legal",
  },
  {
    id: "r3",
    gate: "Gate 5 – Treatment Selection",
    description: "Low PTP → Hard",
    field: "ptp_score",
    operator: "<",
    threshold: "0.4",
    actionType: "treatment_type",
    actionValue: "hard",
  },
  {
    id: "r4",
    gate: "Gate 4 – Channel Selection",
    description: "High PTR → Email",
    field: "ptr_score",
    operator: ">=",
    threshold: "0.7",
    actionType: "primary_channel",
    actionValue: "EMAIL",
  },
];

export default function CollectionsStrategy() {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [status, setStatus] = useState(null); // { type, message }

  function updateRule(id, key, value) {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, [key]: value } : rule
      )
    );
  }

  function addRuleForGate(gateName) {
    const newId = `r${Date.now()}`;
    setRules((prev) => [
      ...prev,
      {
        id: newId,
        gate: gateName,
        description: "New rule",
        field: "ptp_score",
        operator: "<",
        threshold: "0.5",
        actionType: "treatment_type",
        actionValue: "soft",
      },
    ]);
  }

  function removeRule(id) {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  async function handleSave() {
    try {
      setStatus({
        type: "info",
        message: "Saving strategy rules…",
      });

      // TODO: Replace this with your API call to persist rules to S3/Dynamo/etc.
      // Example:
      // await fetch("/api/collections/rules", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ rules }),
      // });

      // For now we just simulate success
      await new Promise((resolve) => setTimeout(resolve, 600));

      setStatus({
        type: "success",
        message: "Rules saved. New uploads will use the updated strategy.",
      });
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "Failed to save rules. Please try again.",
      });
    }
  }

  function renderStatus() {
    if (!status) return null;

    if (status.type === "success") {
      return (
        <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 flex gap-2">
          <CheckCircle2 className="h-5 w-5 mt-0.5" />
          <span>{status.message}</span>
        </div>
      );
    }

    if (status.type === "error") {
      return (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex gap-2">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <span>{status.message}</span>
        </div>
      );
    }

    return (
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 flex gap-2">
        <AlertCircle className="h-5 w-5 mt-0.5" />
        <span>{status.message}</span>
      </div>
    );
  }

  // Group rules by gate name for display
  const rulesByGate = rules.reduce((acc, rule) => {
    acc[rule.gate] = acc[rule.gate] || [];
    acc[rule.gate].push(rule);
    return acc;
  }, {});

  function renderActionValueSelect(rule) {
    if (rule.actionType === "treatment_type") {
      return (
        <select
          className="border rounded-lg px-2 py-1 text-xs"
          value={rule.actionValue}
          onChange={(e) => updateRule(rule.id, "actionValue", e.target.value)}
        >
          {TREATMENT_VALUES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }
    if (rule.actionType === "primary_channel") {
      return (
        <select
          className="border rounded-lg px-2 py-1 text-xs"
          value={rule.actionValue}
          onChange={(e) => updateRule(rule.id, "actionValue", e.target.value)}
        >
          {CHANNEL_VALUES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }
    if (rule.actionType === "output_stream") {
      return (
        <select
          className="border rounded-lg px-2 py-1 text-xs"
          value={rule.actionValue}
          onChange={(e) => updateRule(rule.id, "actionValue", e.target.value)}
        >
          {OUTPUT_VALUES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }
    return null;
  }

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <SiteHeader />

      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
              <Settings2 className="h-6 w-6" />
              Collections Strategy – Rules & Gates
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              View and adjust the rules that drive segmentation, scores,
              channels and treatments. For example:{" "}
              <span className="font-mono text-xs">
                if ptp_score &lt; 0.40 then treatment = hard
              </span>{" "}
              or{" "}
              <span className="font-mono text-xs">
                if ptp_score &lt; 0.20 then treatment = legal
              </span>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary rounded-xl px-4 py-2 text-sm font-medium inline-flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save rules
          </button>
        </div>

        {/* Rules per gate */}
        <div className="space-y-6">
          {Object.entries(rulesByGate).map(([gateName, gateRules]) => (
            <div
              key={gateName}
              className="rounded-3xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-semibold">{gateName}</h2>
                  <p className="text-xs text-slate-500">
                    Rules evaluated at this decision gate. You can adjust the
                    thresholds and actions for each rule.
                  </p>
                </div>
                <button
                  type="button"
                  className="text-xs text-slate-600 border border-slate-200 rounded-xl px-3 py-1 hover:bg-slate-50"
                  onClick={() => addRuleForGate(gateName)}
                >
                  + Add rule
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border-separate border-spacing-y-1">
                  <thead>
                    <tr className="text-left text-[11px] text-slate-500">
                      <th className="px-2 py-1">Rule name</th>
                      <th className="px-2 py-1">Field</th>
                      <th className="px-2 py-1">Operator</th>
                      <th className="px-2 py-1">Threshold / value</th>
                      <th className="px-2 py-1">Then set</th>
                      <th className="px-2 py-1">To</th>
                      <th className="px-2 py-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {gateRules.map((rule) => (
                      <tr
                        key={rule.id}
                        className="bg-slate-50 hover:bg-slate-100"
                      >
                        <td className="px-2 py-1 align-middle">
                          <input
                            type="text"
                            value={rule.description}
                            onChange={(e) =>
                              updateRule(rule.id, "description", e.target.value)
                            }
                            className="w-full border rounded-lg px-2 py-1 text-xs bg-white"
                          />
                        </td>
                        <td className="px-2 py-1 align-middle">
                          <select
                            className="border rounded-lg px-2 py-1 text-xs"
                            value={rule.field}
                            onChange={(e) =>
                              updateRule(rule.id, "field", e.target.value)
                            }
                          >
                            {FIELD_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-1 align-middle">
                          <select
                            className="border rounded-lg px-2 py-1 text-xs"
                            value={rule.operator}
                            onChange={(e) =>
                              updateRule(
                                rule.id,
                                "operator",
                                e.target.value
                              )
                            }
                          >
                            {OPERATOR_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-1 align-middle">
                          <input
                            type="text"
                            value={rule.threshold}
                            onChange={(e) =>
                              updateRule(
                                rule.id,
                                "threshold",
                                e.target.value
                              )
                            }
                            className="w-full border rounded-lg px-2 py-1 text-xs bg-white"
                            placeholder="e.g. 0.4 or 60 or SEG3"
                          />
                        </td>
                        <td className="px-2 py-1 align-middle">
                          <select
                            className="border rounded-lg px-2 py-1 text-xs"
                            value={rule.actionType}
                            onChange={(e) =>
                              updateRule(
                                rule.id,
                                "actionType",
                                e.target.value
                              )
                            }
                          >
                            {ACTION_TYPE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-1 align-middle">
                          {renderActionValueSelect(rule)}
                        </td>
                        <td className="px-2 py-1 align-middle text-right">
                          <button
                            type="button"
                            className="text-[11px] text-slate-500 hover:text-red-500"
                            onClick={() => removeRule(rule.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    {gateRules.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-2 py-3 text-center text-xs text-slate-400"
                        >
                          No rules defined for this gate yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Status messages */}
        {renderStatus()}
      </main>

      <SiteFooter />
    </div>
  );
}
