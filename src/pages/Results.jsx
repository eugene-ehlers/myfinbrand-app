// src/pages/Results.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
              `Could not load OCR result (HTTP ${res.status}). ${text || ""}`
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

  // --------- NEW: derive agentic v8 info if present ---------
  const docType = result?.docType ?? "—";

  // agentic payload is nested under result.result (see your Lambda output)
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

  return (
    <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
      <h1 className="text-2xl font-semibold mb-2">Results</h1>

      {objectKey && (
        <p className="opacity-80 mb-4 break-all">
          Object: <span className="font-mono text-xs">{objectKey}</span>
        </p>
      )}

      {loading && (
        <p className="opacity-80 mb-4">
          Fetching OCR result… (this can take a few seconds)
        </p>
      )}

      {error && !loading && (
        <p className="text-red-600 mb-4 text-sm">{error}</p>
      )}

      {!loading && !error && result && (
        <>
          {/* Summary cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="rounded-lg border border-[rgb(var(--border))] p-4">
              <div className="text-sm opacity-70">Risk Score</div>
              <div className="text-2xl font-semibold">
                {typeof effectiveRiskScore === "number"
                  ? effectiveRiskScore.toFixed(2)
                  : "—"}
                {riskBand && (
                  <span className="ml-2 text-sm uppercase opacity-70">
                    ({riskBand})
                  </span>
                )}
              </div>
            </div>
            <div className="rounded-lg border border-[rgb(var(--border))] p-4">
              <div className="text-sm opacity-70">Confidence</div>
              <div className="text-2xl font-semibold">
                {typeof confidence === "number"
                  ? (confidence * 100).toFixed(1) + "%"
                  : confidence}
              </div>
            </div>
            <div className="rounded-lg border border-[rgb(var(--border))] p-4">
              <div className="text-sm opacity-70">Document Type</div>
              <div className="text-2xl font-semibold">{docType}</div>
            </div>
          </div>

          {/* --------- NEW: Bank statement high-level summary (agentic v8) --------- */}
          {isBankStatement && agenticSummary && (
            <div className="rounded-lg border border-[rgb(var(--border))] p-4 mb-6">
              <div className="flex flex-wrap justify-between gap-4 mb-3">
                <div>
                  <div className="text-sm opacity-70">Account Holder</div>
                  <div className="text-lg font-semibold">
                    {agenticSummary.account_holder || "Unknown"}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Statement Period</div>
                  <div className="text-lg font-semibold">
                    {agenticSummary.period_start || "—"}{" "}
                    <span className="opacity-60">to</span>{" "}
                    {agenticSummary.period_end || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Currency</div>
                  <div className="text-lg font-semibold">
                    {agenticSummary.currency || "—"}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4 mt-2">
                <div>
                  <div className="text-xs opacity-70">Opening Balance</div>
                  <div className="text-base font-semibold">
                    {agenticSummary.opening_balance != null
                      ? agenticSummary.opening_balance.toLocaleString()
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-70">Closing Balance</div>
                  <div className="text-base font-semibold">
                    {agenticSummary.closing_balance != null
                      ? agenticSummary.closing_balance.toLocaleString()
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-70">Total Credits</div>
                  <div className="text-base font-semibold">
                    {agenticSummary.total_credits != null
                      ? agenticSummary.total_credits.toLocaleString()
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-70">Total Debits</div>
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
                    <div className="text-xs uppercase opacity-70 mb-1">
                      Income (Personal)
                    </div>
                    <div className="text-base font-semibold mb-1">
                      {totalIncome != null
                        ? totalIncome.toLocaleString()
                        : "—"}
                    </div>
                    <div className="text-xs opacity-70">
                      Salary:{" "}
                      {agenticClassification.income_summary?.salary != null
                        ? agenticClassification.income_summary.salary.toLocaleString()
                        : "0"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase opacity-70 mb-1">
                      Expenses (Budget Categories)
                    </div>
                    <div className="text-base font-semibold mb-1">
                      {totalExpenses != null
                        ? totalExpenses.toLocaleString()
                        : "—"}
                    </div>
                    <div className="text-xs opacity-70">
                      Housing:{" "}
                      {agenticClassification.expense_summary?.housing != null
                        ? agenticClassification.expense_summary.housing.toLocaleString()
                        : "0"}
                      {" · "}
                      Food & Groceries:{" "}
                      {agenticClassification.expense_summary?.food_groceries !=
                      null
                        ? agenticClassification.expense_summary.food_groceries.toLocaleString()
                        : "0"}
                    </div>
                  </div>
                </div>
              )}

              {riskReasons.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs uppercase opacity-70 mb-1">
                    Risk Reason Codes
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {riskReasons.map((r) => (
                      <span
                        key={r}
                        className="inline-flex items-center rounded-full border border-[rgb(var(--border))] px-2 py-0.5 text-xs"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Parsed fields table (original stub fields) */}
          <div className="rounded-lg border border-[rgb(var(--border))] overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-white/40">
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
                      No structured fields found. Check the raw JSON download.
                    </td>
                  </tr>
                )}
                {fields.map((f, idx) => (
                  <tr key={idx} className="odd:bg-white/20">
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

          {/* Downloads / navigation actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="btn-primary inline-flex items-center px-3 py-2 rounded-lg"
              onClick={handleDownloadPdf}
            >
              Download Summary (PDF)
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 rounded-lg border border-[rgb(var(--border))]"
              onClick={handleDownloadJson}
            >
              Download JSON
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 rounded-lg border border-[rgb(var(--border))] ml-auto"
              onClick={() => navigate("/dashboard")}
            >
              New OCR request
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 rounded-lg border border-[rgb(var(--border))]"
              onClick={() => navigate("/")}
            >
              Home
            </button>
          </div>
        </>
      )}
    </section>
  );
}
