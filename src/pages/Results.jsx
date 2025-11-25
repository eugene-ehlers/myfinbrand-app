// src/pages/Results.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Home as HomeIcon,
  FileText,
} from "lucide-react";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

// ---- Helpers to interpret errors & run status ----

function classifyIssues(result) {
  if (!result) return { issues: [], overallStatus: "unknown" };

  const issues = [];
  const ocrEngine = result.ocr_engine || {};
  const agentic = result.result || null;

  // ---- OCR issues ----
  if (ocrEngine && ocrEngine.error) {
    const msg = String(ocrEngine.error || "");
    let category = "internal";
    let userMessage =
      "We could not reliably read text from this document. The OCR engine reported an error.";

    if (/timed out/i.test(msg)) {
      category = "internal";
      userMessage =
        "Our OCR engine took too long to process this file. This is on our side – you can try again later or contact support.";
    } else if (/pdftoppm|Fontconfig|format/i.test(msg)) {
      category = "document";
      userMessage =
        "We could not convert this PDF into text. This often happens with unusual or password-protected PDFs. Try downloading the original statement again or asking the client for a different version.";
    } else if (/empty/i.test(msg) || /no text/i.test(msg)) {
      category = "document";
      userMessage =
        "The document appears to be blank or has no extractable text. Please confirm the file and try again.";
    }

    issues.push({
      stage: "OCR text extraction",
      level: "error",
      category, // "internal" | "document"
      userMessage,
      rawMessage: msg,
    });
  }

  // ---- Agentic / GPT issues ----
  if (agentic && agentic.status === "error") {
    const errorType = agentic.error_type || "";
    const msg = String(agentic.msg || agentic.error || "Agentic parser error");

    let category = "internal";
    let userMessage =
      "Our AI parser could not complete the analysis for this document.";

    if (errorType === "model_call_failure") {
      category = "internal";
      userMessage =
        "Our AI parser had a problem while processing this document. This is on our side – you can try again later, or contact support if it keeps happening.";
    } else if (/timeout/i.test(msg)) {
      category = "internal";
      userMessage =
        "Our AI parser took too long to respond. This is a platform issue rather than a problem with the document.";
    } else if (/not a bank statement/i.test(msg)) {
      category = "document";
      userMessage =
        "The AI did not recognise this as a bank statement. Please check that the uploaded document matches the selected document type.";
    }

    issues.push({
      stage: "AI parsing & classification",
      level: "error",
      category,
      userMessage,
      rawMessage: msg,
    });
  }

  // ---- Suspicious-but-not-crashing cases ----
  const agenticStructured = agentic?.structured;
  const txs = agenticStructured?.transactions || [];

  if (!ocrEngine.error && agentic && agentic.status === "ok") {
    if (txs.length === 0) {
      issues.push({
        stage: "AI parsing & classification",
        level: "warning",
        category: "document",
        userMessage:
          "We processed the document but did not find any transactions. Check that the statement period is correct and that the file contains actual activity.",
        rawMessage: "No transactions parsed from the document.",
      });
    }
  }

  // Overall status for a simple badge
  let overallStatus = "ok";
  if (issues.some((i) => i.level === "error")) {
    overallStatus = "error";
  } else if (issues.some((i) => i.level === "warning")) {
    overallStatus = "warning";
  }

  return { issues, overallStatus };
}

function formatStatusBadge(status) {
  if (status === "ok") {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
        All stages completed
      </span>
    );
  }
  if (status === "warning") {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
        Completed with warnings
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
        One or more stages failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-700">
      Status unknown
    </span>
  );
}

// Map docType to a more friendly label (incl. financial_statements)
const DOC_TYPE_LABELS = {
  bank_statements: "Bank statement",
  payslips: "Payslip",
  id_documents: "ID / Passport",
  financial_statements: "Financial statements",
  generic: "Other / Generic",
};

export default function Results() {
  const query = useQuery();
  const objectKey = query.get("objectKey");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // string
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
              `We couldn't load the OCR result from secure storage (HTTP ${res.status}).` +
                (text ? ` Details: ${text}` : "")
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
            "We couldn't reach the results service. Please refresh in a moment or try the upload again."
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
      alert("Could not download JSON. Please try again.");
    }
  }

  function handleDownloadPdf() {
    alert(
      "PDF export of the summary is not implemented yet. You can download the JSON for now."
    );
  }

  // High-level fields from the stub result
  const riskScore =
    result?.result?.risk_score?.score ?? result?.riskScore ?? null;
  const riskBand = result?.result?.risk_score?.band ?? null;
  const confidence = result?.confidence ?? null;
  const docType = result?.docType ?? "—";
  const docTypeLabel = DOC_TYPE_LABELS[docType] || docType || "—";
  const fields = Array.isArray(result?.fields) ? result.fields : [];

  // Agentic summary (if present)
  const agentic = result?.result || null;
  const summary = agentic?.summary || null;
  const classification = agentic?.classification || null;

  const { issues, overallStatus } = classifyIssues(result);

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <SiteHeader />

      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6" />
              OCR & Agentic Results
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Review OCR output, AI-parsed structure, and any issues detected
              for this document.
            </p>
          </div>
        </div>

        <section className="rounded-2xl border border-[rgb(var(--border))] bg-white/90 backdrop-blur p-6 shadow-sm">
          {objectKey && (
            <p className="opacity-80 mb-4 break-all text-xs">
              Object: <span className="font-mono">{objectKey}</span>
            </p>
          )}

          {loading && (
            <p className="opacity-80 mb-4">
              Fetching OCR result… this usually takes a few seconds.
            </p>
          )}

          {error && !loading && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 flex gap-2">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div>
                <div className="font-medium mb-1">Error loading result</div>
                <div>{error}</div>
              </div>
            </div>
          )}

          {!loading && !error && result && (
            <>
              {/* Run status / issues */}
              <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-slate-50 px-4 py-3">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <div className="font-medium text-sm">Run status</div>
                  {formatStatusBadge(overallStatus)}
                </div>

                {issues.length === 0 && (
                  <p className="text-sm text-slate-700">
                    All processing stages completed without any detected issues.
                  </p>
                )}

                {issues.length > 0 && (
                  <ul className="space-y-2 text-sm">
                    {issues.map((issue, idx) => (
                      <li
                        key={idx}
                        className="border-t border-slate-200 pt-2 first:border-t-0 first:pt-0"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{issue.stage}</span>
                          {issue.level === "error" && (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-red-100 text-red-800">
                              Error
                            </span>
                          )}
                          {issue.level === "warning" && (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-amber-100 text-amber-800">
                              Warning
                            </span>
                          )}
                          {issue.category === "internal" && (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-sky-100 text-sky-800">
                              On our side
                            </span>
                          )}
                          {issue.category === "document" && (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-800">
                              Document / input issue
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-slate-700">
                          {issue.userMessage}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Support-only technical details */}
                {issues.length > 0 && (
                  <details className="mt-3 text-xs text-slate-600">
                    <summary className="cursor-pointer underline underline-offset-2">
                      Technical details (for support teams)
                    </summary>
                    <pre className="mt-2 max-h-48 overflow-auto rounded bg-slate-900 text-slate-100 p-2 text-[11px]">
                      {JSON.stringify(issues, null, 2)}
                    </pre>
                  </details>
                )}
              </div>

              {/* Summary cards */}
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="rounded-lg border border-[rgb(var(--border))] p-4 bg-white">
                  <div className="text-xs uppercase tracking-wide opacity-70">
                    Risk Score
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {typeof riskScore === "number"
                      ? riskScore.toFixed(2)
                      : "—"}
                    {riskBand && typeof riskScore === "number" && (
                      <span className="ml-2 text-sm font-normal uppercase tracking-wide text-slate-600">
                        ({riskBand})
                      </span>
                    )}
                  </div>
                </div>
                <div className="rounded-lg border border-[rgb(var(--border))] p-4 bg-white">
                  <div className="text-xs uppercase tracking-wide opacity-70">
                    Confidence
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {typeof confidence === "number"
                      ? (confidence * 100).toFixed(1) + "%"
                      : "—"}
                  </div>
                </div>
                <div className="rounded-lg border border-[rgb(var(--border))] p-4 bg-white">
                  <div className="text-xs uppercase tracking-wide opacity-70">
                    Document Type
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {docTypeLabel}
                  </div>
                </div>
              </div>

              {/* Agentic summary (if present, works for bank & can later adapt to financial_statements) */}
              {summary && (
                <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                  <h2 className="text-sm font-semibold mb-3">
                    Statement summary
                  </h2>
                  <div className="grid gap-4 md:grid-cols-3 text-sm">
                    <div>
                      <div className="text-slate-500 text-xs uppercase">
                        Account Holder
                      </div>
                      <div className="font-medium">
                        {summary.account_holder || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs uppercase">
                        Statement Period
                      </div>
                      <div className="font-medium">
                        {summary.period_start || "—"}{" "}
                        {summary.period_end ? `to ${summary.period_end}` : ""}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs uppercase">
                        Currency
                      </div>
                      <div className="font-medium">
                        {summary.currency || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-4 text-sm">
                    <div>
                      <div className="text-slate-500 text-xs uppercase">
                        Opening Balance
                      </div>
                      <div className="font-medium">
                        {summary.opening_balance != null
                          ? summary.opening_balance.toLocaleString("en-ZA")
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs uppercase">
                        Closing Balance
                      </div>
                      <div className="font-medium">
                        {summary.closing_balance != null
                          ? summary.closing_balance.toLocaleString("en-ZA")
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs uppercase">
                        Total Credits
                      </div>
                      <div className="font-medium">
                        {summary.total_credits != null
                          ? summary.total_credits.toLocaleString("en-ZA")
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs uppercase">
                        Total Debits
                      </div>
                      <div className="font-medium">
                        {summary.total_debits != null
                          ? summary.total_debits.toLocaleString("en-ZA")
                          : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Simple income / expense view for personal statements */}
              {classification &&
                classification.income_summary &&
                classification.expense_summary && (
                  <div className="mb-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <h2 className="text-sm font-semibold mb-3">
                        Income (Personal)
                      </h2>
                      <div className="text-2xl font-semibold mb-1">
                        {classification.income_summary.total_income != null
                          ? classification.income_summary.total_income.toLocaleString(
                              "en-ZA"
                            )
                          : "—"}
                      </div>
                      <p className="text-xs text-slate-600 mb-2">
                        Breakdown (where detectable):
                      </p>
                      <div className="text-xs text-slate-700 space-y-1">
                        <div>
                          Salary:{" "}
                          {classification.income_summary.salary?.toLocaleString(
                            "en-ZA"
                          ) || 0}
                        </div>
                        <div>
                          Other recurring / third-party:{" "}
                          {classification.income_summary.third_party_income?.toLocaleString(
                            "en-ZA"
                          ) || 0}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <h2 className="text-sm font-semibold mb-3">
                        Expenses (Budget Categories)
                      </h2>
                      <div className="text-2xl font-semibold mb-1">
                        {classification.expense_summary.total_expenses != null
                          ? classification.expense_summary.total_expenses.toLocaleString(
                              "en-ZA"
                            )
                          : "—"}
                      </div>
                      <p className="text-xs text-slate-600 mb-2">
                        Examples from this statement:
                      </p>
                      <div className="text-xs text-slate-700 space-y-1">
                        <div>
                          Housing:{" "}
                          {classification.expense_summary.housing?.toLocaleString(
                            "en-ZA"
                          ) || 0}
                        </div>
                        <div>
                          Food &amp; Groceries:{" "}
                          {classification.expense_summary.food_groceries?.toLocaleString(
                            "en-ZA"
                          ) || 0}
                        </div>
                        <div>
                          Transport:{" "}
                          {classification.expense_summary.transport?.toLocaleString(
                            "en-ZA"
                          ) || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Raw parsed fields table from stub (still useful for generic docs and financial_statements) */}
              <div className="rounded-lg border border-[rgb(var(--border))] overflow-x-auto bg-white">
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
                          download for more details.
                        </td>
                      </tr>
                    )}
                    {fields.map((f, idx) => (
                      <tr key={idx} className="odd:bg-slate-50/50">
                        <td className="p-3 border-b border-[rgb(var(--border))]">
                          {f.name}
                        </td>
                        <td className="p-3 border-b border-[rgb(var(--border))] whitespace-pre-wrap">
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
                  className="btn-primary inline-flex items-center gap-2 px-3 py-2 rounded-lg"
                  onClick={handleDownloadPdf}
                >
                  <Download className="h-4 w-4" />
                  Download Summary (PDF)
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[rgb(var(--border))] bg-white"
                  onClick={handleDownloadJson}
                >
                  <Download className="h-4 w-4" />
                  Download JSON
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[rgb(var(--border))] bg-white ml-auto"
                  onClick={() => navigate("/dashboard")}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  New OCR request
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[rgb(var(--border))] bg-white"
                  onClick={() => navigate("/")}
                >
                  <HomeIcon className="h-4 w-4" />
                  Home
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}


