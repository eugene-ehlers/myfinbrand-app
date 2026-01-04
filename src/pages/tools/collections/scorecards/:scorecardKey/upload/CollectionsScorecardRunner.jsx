// src/pages/tools/collections/scorecards/:scorecardKey/upload/CollectionsScorecardRunner.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import SiteHeader from "../../../../../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../../../../../components/layout/SiteFooter.jsx";

/**
 * Route: /tools/collections/scorecards/:scorecardKey/upload
 *
 * - Displays required inputs + sample format
 * - Uploads file via presigned POST
 * - Redirects to /tools/collections/scorecards/:scorecardKey/outcome?objectKey=...
 */

const SCORECARD_CONFIG = {
  behaviour: {
    title: "Behaviour Scorecard",
    description:
      "Calculate behaviour_score and behaviour_score_band using delinquency and recent repayment behaviour inputs.",
    requiredColumns: [
      "customer_id",
      "loan_id",
      "dpd",
      "missed_payments_3m",
      "last_payment_days_ago",
      "promise_to_pay_kept_3m",
    ],
    outputColumns: ["behaviour_score", "behaviour_score_band"],
    sampleRows: [
      {
        customer_id: "C001",
        loan_id: "L001",
        dpd: 5,
        missed_payments_3m: 0,
        last_payment_days_ago: 7,
        promise_to_pay_kept_3m: 1,
      },
      {
        customer_id: "C002",
        loan_id: "L002",
        dpd: 35,
        missed_payments_3m: 2,
        last_payment_days_ago: 45,
        promise_to_pay_kept_3m: 0,
      },
      {
        customer_id: "C003",
        loan_id: "L003",
        dpd: 65,
        missed_payments_3m: 3,
        last_payment_days_ago: 70,
        promise_to_pay_kept_3m: 0,
      },
    ],
  },

  affordability: {
    title: "Affordability Scorecard",
    description:
      "Calculate affordability_score and affordability_score_band using income/expense proxies and obligation indicators.",
    requiredColumns: [
      "customer_id",
      "loan_id",
      "net_income",
      "monthly_expenses",
      "instalment_amount",
    ],
    outputColumns: ["affordability_score", "affordability_score_band"],
    sampleRows: [
      {
        customer_id: "C001",
        loan_id: "L001",
        net_income: 25000,
        monthly_expenses: 18000,
        instalment_amount: 1500,
      },
      {
        customer_id: "C002",
        loan_id: "L002",
        net_income: 18000,
        monthly_expenses: 16500,
        instalment_amount: 2200,
      },
      {
        customer_id: "C003",
        loan_id: "L003",
        net_income: 12000,
        monthly_expenses: 11500,
        instalment_amount: 1800,
      },
    ],
  },

  ptp: {
    title: "Propensity to Pay (PTP) Scorecard",
    description:
      "Calculate ptp_score and ptp_band using payment engagement and promise-to-pay performance signals.",
    requiredColumns: [
      "customer_id",
      "loan_id",
      "last_payment_days_ago",
      "promise_to_pay_kept_3m",
      "missed_payments_3m",
    ],
    outputColumns: ["ptp_score", "ptp_band"],
    sampleRows: [
      {
        customer_id: "C001",
        loan_id: "L001",
        last_payment_days_ago: 7,
        promise_to_pay_kept_3m: 1,
        missed_payments_3m: 0,
      },
      {
        customer_id: "C002",
        loan_id: "L002",
        last_payment_days_ago: 20,
        promise_to_pay_kept_3m: 0,
        missed_payments_3m: 1,
      },
      {
        customer_id: "C003",
        loan_id: "L003",
        last_payment_days_ago: 70,
        promise_to_pay_kept_3m: 0,
        missed_payments_3m: 3,
      },
    ],
  },

  contactability: {
    title: "Contactability Scorecard",
    description:
      "Calculate contactability_score and preferred_channel using available contact details.",
    requiredColumns: ["customer_id", "loan_id", "phone", "email"],
    outputColumns: ["contactability_score", "preferred_channel"],
    sampleRows: [
      {
        customer_id: "C001",
        loan_id: "L001",
        phone: "0711111111",
        email: "c001@test.com",
      },
      { customer_id: "C002", loan_id: "L002", phone: "0722222222", email: "" },
      { customer_id: "C003", loan_id: "L003", phone: "", email: "c003@test.com" },
    ],
  },

  vulnerability: {
    title: "Vulnerability Scorecard",
    description:
      "Calculate vulnerable_flag and restricted_channels based on vulnerability indicators and policy rules.",
    requiredColumns: ["customer_id", "loan_id", "vulnerability_indicator"],
    outputColumns: ["vulnerable_flag", "restricted_channels"],
    sampleRows: [
      { customer_id: "C001", loan_id: "L001", vulnerability_indicator: "N" },
      { customer_id: "C002", loan_id: "L002", vulnerability_indicator: "Y" },
      { customer_id: "C003", loan_id: "L003", vulnerability_indicator: "N" },
    ],
  },
};

export default function CollectionsScorecardRunner() {
  const navigate = useNavigate();
  const { scorecardKey } = useParams();
  const cfg = SCORECARD_CONFIG[scorecardKey];

  const [caseName, setCaseName] = useState("");
  const [strategyMode, setStrategyMode] = useState("simulation"); // simulation | production
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'info'|'success'|'error', message }

  // TODO: Replace with your presign Lambda URL (can be same as CollectionsUpload if it supports scorecard_run)
  const collectionsFunctionUrl =
    "https://xddchlet6fj2qqncrr7y5fopva0tvxsb.lambda-url.us-east-1.on.aws/";

  const sampleHeaders = useMemo(() => cfg?.requiredColumns || [], [cfg]);

  function handleFileChange(e) {
    setFile(e.target.files?.[0] || null);
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

  async function startUpload(e) {
    e?.preventDefault?.();

    if (!cfg) {
      setStatus({
        type: "error",
        message:
          "Unknown scorecard selected. Please return to Collections tools and choose a valid scorecard.",
      });
      return;
    }

    if (!caseName.trim()) {
      setStatus({
        type: "error",
        message: "Please enter a batch / case name for this scorecard run.",
      });
      return;
    }

    if (!file) {
      setStatus({
        type: "error",
        message: "Please choose a CSV, Excel, TXT, or DOCX file to upload.",
      });
      return;
    }

    setBusy(true);
    setStatus({ type: "info", message: "Requesting secure upload slot…" });

    try {
      const presignRes = await fetch(collectionsFunctionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pipeline: "scorecard_run",
          scorecard: scorecardKey,
          mimeType:
            file.type ||
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          originalFilename: file.name,
          caseName: caseName.trim(),
          strategyMode,
        }),
      });

      if (!presignRes.ok) {
        setStatus({
          type: "error",
          message: `Presign failed (HTTP ${presignRes.status}).`,
        });
        return;
      }

      const { url, fields, objectKey } = await presignRes.json();

      setStatus({ type: "info", message: "Uploading file to secure storage…" });

      const form = new FormData();
      Object.entries(fields).forEach(([k, v]) => form.append(k, v));
      form.append("file", file);

      const s3Res = await fetch(url, { method: "POST", body: form });

      if (s3Res.status === 204) {
        setStatus({
          type: "success",
          message: "Upload complete. The scorecard will run automatically.",
        });

        setFile(null);

        navigate(
          `/tools/collections/scorecards/${encodeURIComponent(
            scorecardKey
          )}/outcome?objectKey=${encodeURIComponent(objectKey)}`
        );
      } else {
        const text = await s3Res.text().catch(() => "");
        console.error("S3 upload failed", s3Res.status, text);
        setStatus({
          type: "error",
          message: `Upload failed (status ${s3Res.status}).`,
        });
        if (text) console.error(text);
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "Unexpected error during upload.",
      });
    } finally {
      setBusy(false);
    }
  }

  if (!cfg) {
    return (
      <div
        className="min-h-screen text-slate-900"
        style={{ background: "rgb(var(--surface))" }}
      >
        <SiteHeader />
        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="text-base font-semibold">Unknown scorecard</div>
            <p className="mt-2 text-sm text-slate-600">
              Return to the Collections Tools dashboard and select a valid
              scorecard.
            </p>
            <button
              type="button"
              className="mt-4 btn-primary rounded-xl px-5 py-2.5 text-sm font-medium"
              onClick={() => navigate("/tools/collections")}
            >
              Back to Collections tools
            </button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <SiteHeader />

      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Upload className="h-6 w-6" />
            {cfg.title} – Upload
          </h1>
          <p className="text-sm text-slate-600 mt-1">{cfg.description}</p>
        </div>

        const SCORECARD_CONFIG = {
            behaviour: {
              title: "Behaviour Scorecard",
              businessOverview:
                "This scorecard estimates how likely an account is to deteriorate (or stabilise) based on recent repayment behaviour and delinquency signals. It helps you prioritise which accounts need attention first.",
              typicalUses: [
                "Prioritise agent time toward higher-risk accounts.",
                "Identify early warning signals in portfolios before roll-rates worsen.",
                "Trigger proactive reminders for accounts that are starting to slip.",
                "Create risk tiers for reporting and operational queueing.",
              ],
              description:
                "Calculate behaviour_score and behaviour_score_band using delinquency and recent repayment behaviour inputs.",
              requiredColumns: [/* ... */],
              outputColumns: [/* ... */],
              sampleRows: [/* ... */],
            },
          
            affordability: {
              title: "Affordability Scorecard",
              businessOverview:
                "This scorecard estimates whether a customer has sufficient repayment capacity, based on income and expense indicators. It helps you select appropriate hardship approaches and avoid unaffordable contact paths.",
              typicalUses: [
                "Segment customers into affordable vs. strained repayment capacity.",
                "Support hardship workflows and repayment plan decisions.",
                "Adjust treatment intensity to reduce customer harm and complaints.",
                "Improve right-party resolution by matching offers to capacity.",
              ],
              description:
                "Calculate affordability_score and affordability_score_band using income/expense proxies and obligation indicators.",
              requiredColumns: [/* ... */],
              outputColumns: [/* ... */],
              sampleRows: [/* ... */],
            },
          
            ptp: {
              title: "Propensity to Pay (PTP) Scorecard",
              businessOverview:
                "This scorecard estimates the likelihood a customer will pay in the near term. It helps you choose the right effort level and timing, so you spend less on accounts unlikely to respond now.",
              typicalUses: [
                "Prioritise outreach to accounts most likely to pay soon.",
                "Reduce cost-to-collect by lowering effort on low-PTP segments.",
                "Forecast short-term recoveries and expected cashflow.",
                "Select treatments (soft vs hard) based on likelihood to pay.",
              ],
              description:
                "Calculate ptp_score and ptp_band using payment engagement and promise-to-pay performance signals.",
              requiredColumns: [/* ... */],
              outputColumns: [/* ... */],
              sampleRows: [/* ... */],
            },
          
            contactability: {
              title: "Contactability Scorecard",
              businessOverview:
                "This scorecard estimates how reachable a customer is and recommends a primary contact channel. It helps you improve contact rates and avoid wasting attempts on invalid channels.",
              typicalUses: [
                "Select the best channel (SMS, email, dialler) per customer.",
                "Reduce dialler waste by avoiding unreachable numbers.",
                "Improve compliance by respecting opt-outs and preferences.",
                "Increase right-party contact and conversion to payment.",
              ],
              description:
                "Calculate contactability_score and preferred_channel using available contact details.",
              requiredColumns: [/* ... */],
              outputColumns: [/* ... */],
              sampleRows: [/* ... */],
            },
          
            vulnerability: {
              title: "Vulnerability Scorecard",
              businessOverview:
                "This scorecard flags potentially vulnerable customers and indicates which channels should be restricted. It helps you operate compliantly and reduce customer harm by applying safer contact approaches.",
              typicalUses: [
                "Apply restricted channel rules for vulnerable customers.",
                "Route vulnerable cases to specialist teams or softer treatments.",
                "Demonstrate governance and auditability for regulators.",
                "Reduce complaints by preventing inappropriate contact tactics.",
              ],
              description:
                "Calculate vulnerable_flag and restricted_channels based on vulnerability indicators and policy rules.",
              requiredColumns: [/* ... */],
              outputColumns: [/* ... */],
              sampleRows: [/* ... */],
            },
          };


        {/* Requirements */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm space-y-4">
          <div>
            <div className="text-sm font-semibold">Required input format</div>
            <p className="text-xs text-slate-500 mt-1">
              CSV/XLSX is recommended. TXT/DOCX must be tabular with a header row
              matching the required columns.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-700">
                Required columns
              </div>
              <ul className="mt-2 text-xs text-slate-600 list-disc pl-5 space-y-1">
                {cfg.requiredColumns.map((c) => (
                  <li key={c} className="font-mono">
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-700">
                Output columns added
              </div>
              <ul className="mt-2 text-xs text-slate-600 list-disc pl-5 space-y-1">
                {cfg.outputColumns.map((c) => (
                  <li key={c} className="font-mono">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sample */}
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-2">
              Sample input (first rows)
            </div>
            <div className="overflow-x-auto rounded-2xl border">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    {sampleHeaders.map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left font-semibold"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cfg.sampleRows.map((row, idx) => (
                    <tr key={idx} className="border-t bg-white">
                      {sampleHeaders.map((h) => (
                        <td key={h} className="px-3 py-2 font-mono">
                          {row[h] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-2 text-[11px] text-slate-400">
              Your backend should validate the presence and type/format of
              required columns before running the scorecard.
            </p>
          </div>
        </div>

        {/* Upload */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <form className="space-y-5" onSubmit={startUpload}>
            <div className="grid gap-2">
              <label htmlFor="caseName" className="font-medium text-sm">
                Batch / case name
              </label>
              <input
                id="caseName"
                name="caseName"
                type="text"
                value={caseName}
                onChange={(e) => setCaseName(e.target.value)}
                className="border rounded-xl px-3 py-2.5 bg-[rgb(var(--surface))] border-[rgb(var(--border))] focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm"
                placeholder={`e.g., SCORECARD_${scorecardKey.toUpperCase()}_TEST_2026_01`}
              />
              <p className="text-xs text-slate-500">
                Used to group outputs for this run.
              </p>
            </div>

            <div className="grid gap-2">
              <label className="font-medium text-sm">Mode</label>
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setStrategyMode("simulation")}
                  className={`flex-1 px-3 py-1.5 rounded-lg ${
                    strategyMode === "simulation"
                      ? "bg-white shadow-sm font-semibold"
                      : "text-slate-600"
                  }`}
                >
                  Simulation
                </button>
                <button
                  type="button"
                  onClick={() => setStrategyMode("production")}
                  className={`flex-1 px-3 py-1.5 rounded-lg ${
                    strategyMode === "production"
                      ? "bg-white shadow-sm font-semibold"
                      : "text-slate-600"
                  }`}
                >
                  Production
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Simulation produces downloadable outputs only. Production can be
                used if you later integrate results into downstream systems.
              </p>
            </div>

            <div className="grid gap-2">
              <label htmlFor="file" className="font-medium text-sm">
                Upload file (CSV / Excel / TXT / DOCX)
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer text-sm">
                  <Upload className="h-4 w-4" />
                  <span>Select file</span>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    accept=".csv,.xlsx,.txt,.docx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {file && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-500">
                CSV/XLSX recommended. TXT/DOCX must be tabular with a header row
                matching required columns.
              </p>
            </div>

            {renderStatus()}

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="submit"
                className="btn-primary rounded-xl px-5 py-2.5 text-sm font-medium disabled:opacity-50 inline-flex items-center gap-2"
                disabled={busy || !file}
              >
                {busy ? "Uploading…" : "Process scorecard"}
              </button>

              <button
                type="button"
                className="text-xs text-slate-600"
                onClick={() => navigate("/tools/collections")}
              >
                ← Back to Collections tools
              </button>
            </div>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
