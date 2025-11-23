// src/pages/Results.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, FileText, ShieldCheck } from "lucide-react";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function Results() {
  const query = useQuery();
  const objectKey = query.get("objectKey");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const functionUrl =
    "https://rip7ft5vrq6ltl7r7btoop4whm0fqcnp.lambda-url.us-east-1.on.aws/";

  useEffect(() => {
    if (!objectKey) {
      setError("No objectKey supplied. Please upload a document first.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setResult(null);

    const maxAttempts = 8;
    let attempt = 0;

    async function attemptFetch() {
      if (cancelled) return;

      try {
        const res = await fetch(
          `${functionUrl}?objectKey=${encodeURIComponent(objectKey)}`
        );

        if (!res.ok) {
          attempt += 1;
          console.warn(
            `Result fetch not OK (status ${res.status}), attempt ${attempt}/${maxAttempts}`
          );

          if (attempt < maxAttempts && !cancelled) {
            setTimeout(attemptFetch, 1500);
          } else if (!cancelled) {
            const text = await res.text().catch(() => "");
            setLoading(false);
            setError(
              `Could not load OCR result (HTTP ${res.status}). ${
                text || ""
              }`.trim()
            );
          }
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        setResult(data);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("Failed to load OCR result", err);
        attempt += 1;

        if (attempt < maxAttempts && !cancelled) {
          setTimeout(attemptFetch, 1500);
        } else if (!cancelled) {
          setLoading(false);
          setError(
            "Could not load OCR result. Please refresh in a moment or try again."
          );
        }
      }
    }

    attemptFetch();

    return () => {
      cancelled = true;
    };
  }, [objectKey]);

  async function handleDownloadJson() {
    if (!objectKey) return;
    try {
      const res = await fetch(
        `${functionUrl}?objectKey=${encodeURIComponent(objectKey)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ocr-result.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download JSON failed", err);
      alert("Could not download JSON.");
    }
  }

  function handleDownloadPdf() {
    alert("PDF export not implemented yet – JSON is available though.");
  }

  // ---------- Derived data (agentic + legacy) ----------
  const docType = result?.docType ?? "—";

  // Agentic payload (v8) is nested under result.result
  const agentic = result?.result || null;
  const agenticSummary = agentic?.summary || null;
  const agenticClassification = agentic?.classification || null;
  const agenticRisk = agentic?.risk_score || null;

  // Risk score: prefer agentic risk_score.score, fall back to legacy riskScore
  const effectiveRiskScore =
    typeof agenticRisk?.score === "number"
      ? agenticRisk.score
      : typeof result?.riskScore === "number"
      ? result.riskScore
      : null;

  const confidence = result?.confidence ?? "—";
  const fields = Array.isArray(result?.fields) ? result.fields : [];

  const isBankStatement = docType === "bank_statements";

  const totalIncome =
    agenticClassification?.income_summary?.total_income ?? null;
  const totalExpenses =
    agenticClassification?.expense_summary?.total_expenses ?? null;

  const riskBand = agenticRisk?.band ?? null;
  const riskReasons = Array.isArray(agenticRisk?.reason_codes)
    ? agenticRisk.reason_codes
    : [];

  const ocrError = result?.ocr_engine?.error || null;
  const agenticWarnings = Array.isArray(agentic?.warnings)
    ? agentic.warnings
    : [];

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <SiteHeader />

      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-6 w-6" />
              Document Results
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              High-level summary for your uploaded document, with raw JSON
              available for deeper analysis.
            </p>
          </div>
          <button
            type="button"
            className="hidden sm:inline-flex items-center px-3 py-2 rounded-xl border text-sm"
            onClick={() => navigate("/dashboard")}
          >
            ← New OCR request
          </button>
        </div>

        {objectKey && (
          <p className="opacity-80 mb-4 break-all text-xs">
            <span className="font-semibold">Object:</span>{" "}
            <span className="font-mono">{objectKey}</span>
          </p>
        )}

        {loading && (
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="opacity-80 mb-1 text-sm">
              Fetching OCR result… this may take a few seconds.
            </p>
            <p className="text-xs text-slate-500">
              You can stay on this page — we’ll update automatically when the
              result is ready.
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 flex gap-3 text-sm text-red-800">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div>
              <div className="font-semibold mb-0.5">Error loading result</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {!loading && !error && result && (
          <div className="space-y-6">
            {/* Main card */}
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              {/* Summary cards */}
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="rounded-2xl border bg-slate-50/80 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Risk Score
                  </div>
                  <div className="mt-1 text-2xl font-semibold flex items-baseline gap-2">
                    {typeof effectiveRiskScore === "number"
                      ? effectiveRiskScore.toFixed(2)
                      : "—"}
                    {riskBand && (
                      <span className="text-xs uppercase px-2 py-0.5 rounded-full border border-slate-300 text-slate-700">
                        {riskBand}
                      </span>
                    )}
                  </div>
                </div>
                <div className="rounded-2xl border bg-slate-50/80 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Confidence
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {typeof confidence === "number"
                      ? (confidence * 100).toFixed(1) + "%"
                      : confidence}
                  </div>
                </div>
                <div className="rounded-2xl border bg-slate-50/80 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Document Type
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {docType || "Unknown"}
                  </div>
                </div>
              </div>

              {/* Warnings (OCR + agentic) */}
              {(ocrError || agenticWarnings.length > 0) && (
                <div className="mb-6 rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900 flex gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">
                      One or more issues were detected:
                    </div>
                    {ocrError && (
                      <p className="mb-1">
                        <span className="font-semibold">OCR:</span> {ocrError}
                      </p>
                    )}
                    {agenticWarnings.length > 0 && (
                      <ul className="list-disc ml-5">
                        {agenticWarnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* Bank statement specific summary (agentic v8) */}
              {isBankStatement && agenticSummary && (
                <div className="rounded-2xl border bg-slate-50/60 p-4 mb-4">
                  <div className="flex flex-wrap justify-between gap-4 mb-3">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Account Holder
                      </div>
                      <div className="text-lg font-semibold">
                        {agenticSummary.account_holder || "Unknown"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Statement Period
                      </div>
                      <div className="text-lg font-semibold">
                        {agenticSummary.period_start || "—"}{" "}
                        <span className="opacity-60">to</span>{" "}
                        {agenticSummary.period_end || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Currency
                      </div>
                      <div className="text-lg font-semibold">
                        {agenticSummary.currency || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4 mt-2">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Opening Balance
                      </div>
                      <div className="text-base font-semibold">
                        {agenticSummary.opening_balance != null
                          ? agenticSummary.opening_balance.toLocaleString()
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Closing Balance
                      </div>
                      <div className="text-base font-semibold">
                        {agenticSummary.closing_balance != null
                          ? agenticSummary.closing_balance.toLocaleString()
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Total Credits
                      </div>
                      <div className="text-base font-semibold">
                        {agenticSummary.total_credits != null
                          ? agenticSummary.total_credits.toLocaleString()
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Total Debits
                      </div>
                      <div className="text-base font-semibold">
                        {agenticSummary.total_debits != null
                          ? agenticSummary.total_debits.toLocaleString()
                          : "—"}
                      </div>
                    </div>
                  </div>

                  {agenticClassification && (
                    <div className="grid gap-4 md:grid-cols-2 mt-4">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                          Income (Personal)
                        </div>
                        <div className="text-base font-semibold mb-1">
                          {totalIncome != null
                            ? totalIncome.toLocaleString()
                            : "—"}
                        </div>
                        <div className="text-xs text-slate-600">
                          Salary:{" "}
                          {agenticClassification.income_summary?.salary != null
                            ? agenticClassification.income_summary.salary.toLocaleString()
                            : "0"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                          Expenses (Budget Categories)
                        </div>
                        <div className="text-base font-semibold mb-1">
                          {totalExpenses != null
                            ? totalExpenses.toLocaleString()
                            : "—"}
                        </div>
                        <div className="text-xs text-slate-600">
                          Housing:{" "}
                          {agenticClassification.expense_summary?.housing !=
                          null
                            ? agenticClassification.expense_summary.housing.toLocaleString()
                            : "0"}
                          {" · "}
                          Food &amp; Groceries:{" "}
                          {agenticClassification.expense_summary
                            ?.food_groceries != null
                            ? agenticClassification.expense_summary.food_groceries.toLocaleString()
                            : "0"}
                        </div>
                      </div>
                    </div>
                  )}

                  {riskReasons.length > 0 && (
                    <div className="mt-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                        Risk Reason Codes
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {riskReasons.map((r) => (
                          <span
                            key={r}
                            className="inline-flex items-center rounded-full border border-slate-300 px-2 py-0.5 text-xs bg-white"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* If not a bank statement or no agentic summary, just show a small info note */}
              {!isBankStatement && (
                <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>
                    No specialised summary available for this document type
                    yet. You can still download the raw JSON for analysis.
                  </span>
                </div>
              )}
            </div>

            {/* Parsed fields table (original stub fields) */}
            <div className="rounded-3xl border bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5" />
                <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-600">
                  Technical Fields Snapshot
                </h2>
              </div>
              <div className="rounded-lg border border-[rgb(var(--border))] overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-3 border-b border-[rgb(var(--border))]">
                        Field
                      </th>
                      <th className="text-left p-3 border-b border-[rgb(var(--border))]">
                        Value
                      </th>
                      <th className="text-left p-3 border-b border-[rgb(var(--border))]">
                        Confidence
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-3 border-b border-[rgb(var(--border))] text-center opacity-70"
                        >
                          No structured fields found. Check the raw JSON
                          download.
                        </td>
                      </tr>
                    )}
                    {fields.map((f, idx) => (
                      <tr key={idx} className="odd:bg-slate-50/40">
                        <td className="p-3 border-b border-[rgb(var(--border))]">
                          {f.name}
                        </td>
                        <td className="p-3 border-b border-[rgb(var(--border))]">
                          {f.value}
                        </td>
                        <td className="p-3 border-b border-[rgb(var(--border))]">
                          {typeof f.confidence === "number"
                            ? (f.confidence * 100).toFixed(1) + "%"
                            : f.confidence ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                This is a compact view of the stub fields used for the initial
                OCR pipeline. Use the JSON download for full detail.
              </p>
            </div>

            {/* Downloads / navigation actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="btn-primary inline-flex items-center px-4 py-2 rounded-xl text-sm"
                onClick={handleDownloadPdf}
              >
                Download Summary (PDF)
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 rounded-xl border border-[rgb(var(--border))] text-sm bg-white"
                onClick={handleDownloadJson}
              >
                Download JSON
              </button>
              <div className="ml-auto flex gap-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 rounded-xl border border-[rgb(var(--border))] text-sm bg-white"
                  onClick={() => navigate("/dashboard")}
                >
                  New OCR request
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 rounded-xl border border-[rgb(var(--border))] text-sm bg-white"
                  onClick={() => navigate("/")}
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
