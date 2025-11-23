// src/pages/Results.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, AlertCircle, CheckCircle2 } from "lucide-react";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function Results() {
  const query = useQuery();
  const objectKey = query.get("objectKey");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [pollingMessage, setPollingMessage] = useState(
    "Fetching OCR result… (this can take up to a minute for full analysis)"
  );
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
    setPollingMessage(
      "Fetching OCR result… (this can take up to a minute for full analysis)"
    );

    const maxAttempts = 40; // ~40 * 2.5s ≈ 100s
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

          // While the result file may not exist yet, keep polling for 403/404
          if (
            attempt < maxAttempts &&
            (res.status === 403 || res.status === 404)
          ) {
            if (!cancelled) {
              setLoading(true);
              setError(null);
              setPollingMessage(
                "Document is still being processed… (OCR and agentic analysis running)"
              );
              setTimeout(attemptFetch, 2500);
            }
            return;
          }

          // Other HTTP errors: retry a bit, then give up
          if (attempt < maxAttempts && !cancelled) {
            setTimeout(attemptFetch, 2500);
          } else if (!cancelled) {
            const text = await res.text().catch(() => "");
            setLoading(false);
            setError(
              `Could not load OCR result (HTTP ${res.status}). ${
                text || ""
              }`
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
          if (!cancelled) {
            setPollingMessage(
              "Temporary network issue while fetching results, retrying…"
            );
          }
          setTimeout(attemptFetch, 2500);
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
  }, [objectKey, functionUrl]);

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

  // ---- Derived fields from base + agentic result ----
  const agentic = result?.result || null;
  const riskScoreValue =
    agentic?.risk_score?.score ??
    (typeof result?.riskScore === "number" ? result.riskScore : null);
  const riskBand = agentic?.risk_score?.band ?? null;
  const confidence = result?.confidence ?? null;
  const docType = result?.docType ?? "—";

  const summary = agentic?.summary || {};
  const classification = agentic?.classification || {};
  const incomeSummary = classification.income_summary || {};
  const expenseSummary = classification.expense_summary || {};

  const fields = Array.isArray(result?.fields) ? result.fields : [];

  const ocrError = result?.ocr_engine?.error || null;
  const ocrEngineVersion = result?.ocr_engine?.engine_version || null;

  const riskBadge = (() => {
    if (!riskBand) return null;
    const colorMap = {
      low: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-amber-100 text-amber-800 border-amber-200",
      high: "bg-red-100 text-red-800 border-red-200",
    };
    const cls =
      colorMap[riskBand] || "bg-slate-100 text-slate-800 border-slate-200";
    return (
      <span
        className={`ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}
      >
        {riskBand}
      </span>
    );
  })();

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <button
          type="button"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </button>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold mb-2">Results</h1>

          {objectKey && (
            <p className="opacity-80 mb-4 break-all text-xs">
              Object: <span className="font-mono">{objectKey}</span>
            </p>
          )}

          {loading && (
            <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 flex gap-2">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <span>{pollingMessage}</span>
            </div>
          )}

          {error && !loading && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex gap-2">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* OCR failure banner (even if we have some result JSON) */}
          {!loading && !error && ocrError && (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div>
                <div className="font-medium">
                  OCR engine reported a problem reading this document.
                </div>
                <div className="mt-1 text-xs">
                  The text could not be extracted reliably, so downstream
                  parsing and risk analysis may be incomplete or missing.
                  Consider uploading a clearer or higher-resolution copy, or
                  checking that the document is a readable PDF/image.
                </div>
                <div className="mt-1 text-xs opacity-80">
                  <span className="font-mono">Error:</span> {ocrError}
                  {ocrEngineVersion && (
                    <>
                      {" · "}
                      <span className="font-mono">
                        engine={ocrEngineVersion}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {!loading && !error && result && (
            <>
              {/* Summary cards */}
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="rounded-2xl border border-[rgb(var(--border))] p-4">
                  <div className="text-xs uppercase tracking-wide opacity-70">
                    Risk Score
                  </div>
                  <div className="mt-1 text-2xl font-semibold flex items-center">
                    {typeof riskScoreValue === "number"
                      ? riskScoreValue.toFixed(2)
                      : "—"}
                    {riskBadge}
                  </div>
                </div>
                <div className="rounded-2xl border border-[rgb(var(--border))] p-4">
                  <div className="text-xs uppercase tracking-wide opacity-70">
                    Confidence
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {typeof confidence === "number"
                      ? (confidence * 100).toFixed(1) + "%"
                      : "—"}
                  </div>
                </div>
                <div className="rounded-2xl border border-[rgb(var(--border))] p-4">
                  <div className="text-xs uppercase tracking-wide opacity-70">
                    Document Type
                  </div>
                  <div className="mt-1 text-2xl font-semibold">{docType}</div>
                </div>
              </div>

              {/* Agentic bank-statement summary if present */}
              {agentic && (
                <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-2xl border p-4 text-sm">
                    <div className="text-xs uppercase tracking-wide opacity-70">
                      Account Holder
                    </div>
                    <div className="mt-1 font-semibold">
                      {summary.account_holder || "—"}
                    </div>
                  </div>
                  <div className="rounded-2xl border p-4 text-sm">
                    <div className="text-xs uppercase tracking-wide opacity-70">
                      Statement Period
                    </div>
                    <div className="mt-1 font-semibold">
                      {summary.period_start || "—"}{" "}
                      {summary.period_start || summary.period_end
                        ? "to"
                        : ""}{" "}
                      {summary.period_end || ""}
                    </div>
                  </div>
                  <div className="rounded-2xl border p-4 text-sm">
                    <div className="text-xs uppercase tracking-wide opacity-70">
                      Currency
                    </div>
                    <div className="mt-1 font-semibold">
                      {summary.currency || "—"}
                    </div>
                  </div>

                  <div className="rounded-2xl border p-4 text-sm">
                    <div className="text-xs uppercase tracking-wide opacity-70">
                      Opening Balance
                    </div>
                    <div className="mt-1 font-semibold">
                      {summary.opening_balance != null
                        ? summary.opening_balance.toLocaleString("en-ZA")
                        : "—"}
                    </div>
                  </div>
                  <div className="rounded-2xl border p-4 text-sm">
                    <div className="text-xs uppercase tracking-wide opacity-70">
                      Closing Balance
                    </div>
                    <div className="mt-1 font-semibold">
                      {summary.closing_balance != null
                        ? summary.closing_balance.toLocaleString("en-ZA")
                        : "—"}
                    </div>
                  </div>
                  <div className="rounded-2xl border p-4 text-sm">
                    <div className="text-xs uppercase tracking-wide opacity-70">
                      Total Credits / Debits
                    </div>
                    <div className="mt-1 font-semibold">
                      {summary.total_credits != null
                        ? summary.total_credits.toLocaleString("en-ZA")
                        : "—"}{" "}
                      /{" "}
                      {summary.total_debits != null
                        ? summary.total_debits.toLocaleString("en-ZA")
                        : "—"}
                    </div>
                  </div>

                  {/* Income / expenses for personal bank statements */}
                  <div className="rounded-2xl border p-4 text-sm">
                    <div className="text-xs uppercase tracking-wide opacity-70">
                      Income (Personal)
                    </div>
                    <div className="mt-1 font-semibold">
                      {incomeSummary.total_income != null
                        ? incomeSummary.total_income.toLocaleString("en-ZA")
                        : "—"}
                    </div>
                    <div className="mt-1 text-xs text-slate-600">
                      Salary:{" "}
                      {incomeSummary.salary != null
                        ? incomeSummary.salary.toLocaleString("en-ZA")
                        : 0}
                    </div>
                  </div>
                  <div className="rounded-2xl border p-4 text-sm">
                    <div className="text-xs uppercase tracking-wide opacity-70">
                      Expenses (Budget Categories)
                    </div>
                    <div className="mt-1 font-semibold">
                      {expenseSummary.total_expenses != null
                        ? expenseSummary.total_expenses.toLocaleString("en-ZA")
                        : "—"}
                    </div>
                    <div className="mt-1 text-xs text-slate-600">
                      Housing:{" "}
                      {expenseSummary.housing != null
                        ? expenseSummary.housing.toLocaleString("en-ZA")
                        : 0}
                      {" · "}Food &amp; Groceries:{" "}
                      {expenseSummary.food_groceries != null
                        ? expenseSummary.food_groceries.toLocaleString("en-ZA")
                        : 0}
                    </div>
                  </div>
                  {agentic?.risk_score?.reason_codes &&
                    agentic.risk_score.reason_codes.length > 0 && (
                      <div className="rounded-2xl border p-4 text-sm md:col-span-2 lg:col-span-3">
                        <div className="text-xs uppercase tracking-wide opacity-70">
                          Risk Reason Codes
                        </div>
                        <div className="mt-1 font-semibold">
                          {agentic.risk_score.reason_codes.join(", ")}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Parsed fields table */}
              <div className="rounded-2xl border border-[rgb(var(--border))] overflow-x-auto">
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
                          No structured fields found. Check the raw JSON
                          download.
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
                  <Download className="h-4 w-4 mr-1" />
                  Download Summary (PDF)
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 rounded-lg border border-[rgb(var(--border))]"
                  onClick={handleDownloadJson}
                >
                  <Download className="h-4 w-4 mr-1" />
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
      </main>
    </div>
  );
}
