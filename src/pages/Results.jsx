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

// ─────────────────────────────────────────────
// Helpers to interpret run status / pipeline
// ─────────────────────────────────────────────

function classifyIssues(result) {
  if (!result) return { issues: [], overallStatus: "unknown" };

  const issues = [];
  const statusAudit = result.statusAudit || null; // pipeline_stage from backend
  const quality = result.quality || {};
  const qualityStatus = quality.status || null;

  // 1) Not finished yet – uploaded / in queue
  if (statusAudit === "uploaded" || statusAudit === "ocr_started") {
    issues.push({
      stage: "Processing pipeline",
      level: "warning",
      category: "internal",
      userMessage:
        "The document has been uploaded and is queued for OCR and analysis. Results may not be available yet.",
      rawMessage: JSON.stringify({ statusAudit }),
    });
  }

  // 2) OCR completed but no quick/detailed yet
  const hasQuick = !!result.quick;
  const hasDetailed = !!result.detailed;

  if (
    statusAudit === "ocr_completed" &&
    !hasQuick &&
    !hasDetailed
  ) {
    issues.push({
      stage: "Processing pipeline",
      level: "warning",
      category: "internal",
      userMessage:
        "OCR completed successfully, but AI analysis has not finished yet. Please wait a moment and refresh.",
      rawMessage: JSON.stringify({ statusAudit }),
    });
  }

  // 3) Quality checks – treat 'stop' as hard error, other non-ok as warnings
  if (qualityStatus) {
    const q = String(qualityStatus).toUpperCase();
    if (q === "STOP") {
      issues.push({
        stage: "Quality checks",
        level: "error",
        category: "document",
        userMessage:
          "Processing was stopped because the document quality was too low for reliable analysis.",
        rawMessage: JSON.stringify({ qualityStatus }),
      });
    } else if (!["OK", "GOOD", "PASS"].includes(q)) {
      issues.push({
        stage: "Quality checks",
        level: "warning",
        category: "document",
        userMessage:
          `The document passed basic checks, but the quality status is "${qualityStatus}". Please review the results before relying on them.`,
        rawMessage: JSON.stringify({ qualityStatus }),
      });
    }
  }

  // Overall status for badge
  let overallStatus = "ok";
  if (issues.some((i) => i.level === "error")) {
    overallStatus = "error";
  } else if (issues.some((i) => i.level === "warning")) {
    overallStatus = "warning";
  }

  // If we have no issues but statusAudit is unknown, mark as unknown
  if (!issues.length && !statusAudit) {
    overallStatus = "unknown";
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
        Completed with warnings / in progress
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

// map backend docType → nice label
const DOC_TYPE_LABELS = {
  bank_statements: "Bank statement",
  payslips: "Payslip",
  id_documents: "ID / Passport",
  financial_statements: "Financial statements",
  proof_of_address: "Proof of address",
  generic: "Other / Generic",
};

// ─────────────────────────────────────────────
// Build a doc-type aware UI summary from agentic JSON + fields
// (this is future-proofed for when quick/detailed results carry
// richer data; for now most of these will be blank, which is ok.)
// ─────────────────────────────────────────────

function buildUiSummary(docType, agentic, fields = []) {
  if (!agentic && !fields.length) return null;

  // Helper to read from fields array by name
  const getField = (name) =>
    fields.find(
      (f) => f.name && f.name.toLowerCase() === name.toLowerCase()
    )?.value ?? null;

  // BANK STATEMENTS: bank_statement_agentic_v1 style
  if (docType === "bank_statements") {
    const account = agentic?.account || {};
    const txs = Array.isArray(agentic?.transactions)
      ? agentic.transactions
      : [];

    let totalCredits = 0;
    let totalDebits = 0;

    for (const tx of txs) {
      const dir = (tx.direction || "").toUpperCase();
      const rawAmount = tx.amount;
      const amount =
        typeof rawAmount === "number"
          ? rawAmount
          : parseFloat(rawAmount ?? 0) || 0;

      if (dir === "IN") totalCredits += amount;
      else if (dir === "OUT") totalDebits += amount;
    }

    return {
      kind: "bank",
      account_holder: account.accountName || null,
      period_start: account.startDate || null,
      period_end: account.endDate || null,
      opening_balance:
        typeof account.openingBalance === "number"
          ? account.openingBalance
          : null,
      closing_balance:
        typeof account.closingBalance === "number"
          ? account.closingBalance
          : null,
      total_credits: totalCredits || null,
      total_debits: totalDebits || null,
      currency: account.currency || "ZAR",
    };
  }

  // FINANCIAL STATEMENTS
  if (docType === "financial_statements") {
    const summary = agentic?.summary || {};
    const financials = agentic?.structured?.financials || {};
    const income = financials.income_statement || {};
    const balance = financials.balance_sheet || {};

    return {
      kind: "financials",
      entity_name: summary.entity_name || "UNKNOWN",
      period_start: summary.period_start || null,
      period_end: summary.period_end || null,
      currency: summary.currency || "ZAR",
      revenue: income.revenue ?? summary.revenue ?? null,
      ebitda: income.ebitda ?? summary.ebitda ?? null,
      net_profit: income.netProfit ?? summary.net_profit ?? null,
      total_assets: balance.totalAssets ?? null,
      total_liabilities: balance.totalLiabilities ?? null,
      equity: balance.equity ?? null,
    };
  }

  // PAYSLIPS – derive from fields
  if (docType === "payslips") {
    return {
      kind: "payslip",
      employee_name:
        getField("Employee Name") || getField("Employee") || null,
      employer_name:
        getField("Employer Name") || getField("Employer") || null,
      period_label:
        getField("Salary Period Label") ||
        getField("Salary Period") ||
        null,
      gross_pay:
        getField("Gross Salary") ||
        getField("Gross Pay") ||
        getField("Gross") ||
        null,
      net_pay:
        getField("Net Salary") ||
        getField("Net Pay") ||
        getField("Net") ||
        null,
      currency: getField("Currency") || "ZAR",
    };
  }

  // ID DOCUMENTS – derive from fields
  if (docType === "id_documents") {
    return {
      kind: "id",
      first_names:
        getField("First Name(s)") ||
        getField("First Names") ||
        getField("Given Names") ||
        null,
      surname: getField("Surname") || getField("Last Name") || null,
      id_type: getField("ID Type") || null,
      id_number:
        getField("ID Number") ||
        getField("Identity Number") ||
        getField("Passport Number") ||
        null,
      issuing_country:
        getField("Issuing Country") ||
        getField("Country") ||
        getField("Nationality") ||
        null,
      date_of_birth:
        getField("Date of Birth") || getField("DOB") || null,
    };
  }

  // PROOF OF ADDRESS – derive from fields
  if (docType === "proof_of_address") {
    return {
      kind: "address",
      holder_name:
        getField("Address Holder Name") ||
        getField("Account Holder Name") ||
        getField("Customer Name") ||
        null,
      holder_type: getField("Holder Type") || null,
      address_line_1:
        getField("Address Line 1") || getField("Address1") || null,
      address_line_2:
        getField("Address Line 2") || getField("Address2") || null,
      city: getField("City / Town") || getField("City") || null,
      province:
        getField("Province / State") ||
        getField("Province") ||
        getField("State") ||
        null,
      postal_code:
        getField("Postal Code") || getField("Postcode") || null,
      country: getField("Country") || null,
      proof_entity_name:
        getField("Proof Entity Name") ||
        getField("Provider") ||
        getField("Issuer") ||
        null,
      document_issue_date:
        getField("Document Issue Date") || getField("Issue Date") || null,
    };
  }

  // Default
  return null;
}

export default function Results() {
  const query = useQuery();
  const objectKey = query.get("objectKey");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // string
  const [result, setResult] = useState(null);

  // Current function URL (GeneratePresignedPost-dev URL)
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

    const maxAttempts = 60;
    const delayMs = 5000;
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
      alert("Could not download JSON. Please try again.");
    }
  }

  function handleDownloadPdf() {
    alert(
      "PDF export of the summary is not implemented yet. You can download the JSON for now."
    );
  }

  // High-level fields from the backend
  const docType = result?.docType ?? "—";
  const docTypeLabel = DOC_TYPE_LABELS[docType] || docType || "—";
  const fields = Array.isArray(result?.fields) ? result.fields : [];
  const statusAudit = result?.statusAudit || null;
  const analysisMode = result?.analysisMode || null;

  // There is no agentic payload yet in the new service; keep this here
  // for future compatibility (agentic parser integration).
  const rawAgentic = result?.result || null;
  const agentic = rawAgentic?.result ?? rawAgentic ?? null;

  const uiSummary = buildUiSummary(docType, agentic, fields);

  // Risk + confidence (riskScore not yet provided by backend)
  const riskScore =
    result?.riskScore ??
    result?.quick?.riskScore ??
    result?.detailed?.riskScore ??
    null;

  const riskBand =
    result?.riskBand ??
    result?.quick?.riskBand ??
    result?.detailed?.riskBand ??
    null;

  // 🔑 Confidence for the card: comes from backend quality.confidence
  const confidence =
    result?.quality?.confidence ??
    result?.confidence ??
    null;

  const { issues, overallStatus } = classifyIssues(result);

  const aiSummaryText =
    typeof result?.summary === "string" ? result.summary : null;

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
              OCR &amp; AI Results
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
                  {statusAudit && (
                    <span className="text-xs text-slate-500">
                      (Pipeline stage: <code>{statusAudit}</code>)
                    </span>
                  )}
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

              {/* AI Summary block */}
              {aiSummaryText && (
                <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                  <h2 className="text-sm font-semibold mb-2">
                    AI summary
                  </h2>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap">
                    {aiSummaryText}
                  </p>
                </div>
              )}

              {/* Summary cards */}
              <div className="grid gap-4 md:grid-cols-4 mb-6">
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
                <div className="rounded-lg border border-[rgb(var(--border))] p-4 bg-white">
                  <div className="text-xs uppercase tracking-wide opacity-70">
                    Analysis Mode
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {analysisMode === "detailed"
                      ? "Detailed"
                      : analysisMode === "quick"
                      ? "Quick"
                      : "—"}
                  </div>
                </div>
              </div>

              {/* Doc-type aware summary – will stay mostly blank until fields/agentic are populated */}
              {uiSummary && (
                <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                  <h2 className="text-sm font-semibold mb-3">
                    {uiSummary.kind === "bank" && "Bank statement summary"}
                    {uiSummary.kind === "financials" &&
                      "Financial statement summary"}
                    {uiSummary.kind === "payslip" && "Payslip summary"}
                    {uiSummary.kind === "id" && "ID / Passport summary"}
                    {uiSummary.kind === "address" &&
                      "Proof of address summary"}
                    {!uiSummary.kind && "Document summary"}
                  </h2>

                  {/* BANK STATEMENTS */}
                  {uiSummary.kind === "bank" && (
                    <>
                      <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Account Holder
                          </div>
                          <div className="font-medium">
                            {uiSummary.account_holder || "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Statement Period
                          </div>
                          <div className="font-medium">
                            {uiSummary.period_start || "—"}{" "}
                            {uiSummary.period_end
                              ? `to ${uiSummary.period_end}`
                              : ""}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Currency
                          </div>
                          <div className="font-medium">
                            {uiSummary.currency || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-4 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Opening Balance
                          </div>
                          <div className="font-medium">
                            {uiSummary.opening_balance != null
                              ? uiSummary.opening_balance.toLocaleString(
                                  "en-ZA"
                                )
                              : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Closing Balance
                          </div>
                          <div className="font-medium">
                            {uiSummary.closing_balance != null
                              ? uiSummary.closing_balance.toLocaleString(
                                  "en-ZA"
                                )
                              : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Total Credits
                          </div>
                          <div className="font-medium">
                            {uiSummary.total_credits != null
                              ? uiSummary.total_credits.toLocaleString("en-ZA")
                              : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Total Debits
                          </div>
                          <div className="font-medium">
                            {uiSummary.total_debits != null
                              ? uiSummary.total_debits.toLocaleString("en-ZA")
                              : "—"}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* FINANCIAL STATEMENTS */}
                  {uiSummary.kind === "financials" && (
                    <>
                      <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Entity
                          </div>
                          <div className="font-medium">
                            {uiSummary.entity_name || "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Reporting Period
                          </div>
                          <div className="font-medium">
                            {uiSummary.period_start || "—"}{" "}
                            {uiSummary.period_end
                              ? `to ${uiSummary.period_end}`
                              : ""}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Currency
                          </div>
                          <div className="font-medium">
                            {uiSummary.currency || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Revenue
                          </div>
                          <div className="font-medium">
                            {uiSummary.revenue != null
                              ? uiSummary.revenue.toLocaleString("en-ZA")
                              : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            EBITDA
                          </div>
                          <div className="font-medium">
                            {uiSummary.ebitda != null
                              ? uiSummary.ebitda.toLocaleString("en-ZA")
                              : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Net profit
                          </div>
                          <div className="font-medium">
                            {uiSummary.net_profit != null
                              ? uiSummary.net_profit.toLocaleString("en-ZA")
                              : "—"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Total assets
                          </div>
                          <div className="font-medium">
                            {uiSummary.total_assets != null
                              ? uiSummary.total_assets.toLocaleString("en-ZA")
                              : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Total liabilities
                          </div>
                          <div className="font-medium">
                            {uiSummary.total_liabilities != null
                              ? uiSummary.total_liabilities.toLocaleString(
                                  "en-ZA"
                                )
                              : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Equity
                          </div>
                          <div className="font-medium">
                            {uiSummary.equity != null
                              ? uiSummary.equity.toLocaleString("en-ZA")
                              : "—"}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* PAYSLIP SUMMARY */}
                  {uiSummary.kind === "payslip" && (
                    <>
                      <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Employee
                          </div>
                          <div className="font-medium">
                            {uiSummary.employee_name || "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Employer
                          </div>
                          <div className="font-medium">
                            {uiSummary.employer_name || "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Period
                          </div>
                          <div className="font-medium">
                            {uiSummary.period_label || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Gross pay
                          </div>
                          <div className="font-medium">
                            {uiSummary.gross_pay != null
                              ? uiSummary.gross_pay.toLocaleString("en-ZA")
                              : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Net pay
                          </div>
                          <div className="font-medium">
                            {uiSummary.net_pay != null
                              ? uiSummary.net_pay.toLocaleString("en-ZA")
                              : "—"}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ID SUMMARY */}
                  {uiSummary.kind === "id" && (
                    <>
                      <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            First name(s)
                          </div>
                          <div className="font-medium">
                            {uiSummary.first_names || "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Surname
                          </div>
                          <div className="font-medium">
                            {uiSummary.surname || "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Date of birth
                          </div>
                          <div className="font-medium">
                            {uiSummary.date_of_birth || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            ID type
                          </div>
                          <div className="font-medium">
                            {uiSummary.id_type || "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            ID / Passport number
                          </div>
                          <div className="font-medium">
                            {uiSummary.id_number || "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Issuing country
                          </div>
                          <div className="font-medium">
                            {uiSummary.issuing_country || "—"}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* PROOF OF ADDRESS SUMMARY */}
                  {uiSummary.kind === "address" && (
                    <>
                      <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Address holder
                          </div>
                          <div className="font-medium">
                            {uiSummary.holder_name || "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Holder type
                          </div>
                          <div className="font-medium">
                            {uiSummary.holder_type || "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Country
                          </div>
                          <div className="font-medium">
                            {uiSummary.country || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
                        <div className="md:col-span-2">
                          <div className="text-slate-500 text-xs uppercase">
                            Address
                          </div>
                          <div className="font-medium whitespace-pre-line">
                            {uiSummary.address_line_1 || "—"}
                            {uiSummary.address_line_2
                              ? `\n${uiSummary.address_line_2}`
                              : ""}
                            {(uiSummary.city ||
                              uiSummary.province ||
                              uiSummary.postal_code) && "\n"}
                            {uiSummary.city || ""}
                            {uiSummary.city && uiSummary.province ? ", " : ""}
                            {uiSummary.province || ""}
                            {(uiSummary.city || uiSummary.province) &&
                            uiSummary.postal_code
                              ? " "
                              : ""}
                            {uiSummary.postal_code || ""}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Provider / Issuer
                          </div>
                          <div className="font-medium">
                            {uiSummary.proof_entity_name || "—"}
                          </div>
                          <div className="mt-2 text-slate-500 text-xs uppercase">
                            Issue date
                          </div>
                          <div className="font-medium">
                            {uiSummary.document_issue_date || "—"}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Raw fields table */}
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
                          No structured fields found. Check the JSON download
                          for more details.
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
