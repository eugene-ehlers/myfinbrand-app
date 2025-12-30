// src/pages/Results.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Download, Home as HomeIcon, FileText } from "lucide-react";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

/* ─────────────────────────────────────────────────────────────
   Query helper
───────────────────────────────────────────────────────────── */
function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

/* ─────────────────────────────────────────────────────────────
   Generic helpers (0 must stay 0; only null/undefined/NaN is missing)
───────────────────────────────────────────────────────────── */
function coerceToObject(maybeObjOrJsonString) {
  if (!maybeObjOrJsonString) return null;
  if (typeof maybeObjOrJsonString === "object") return maybeObjOrJsonString;
  if (typeof maybeObjOrJsonString === "string") {
    try {
      return JSON.parse(maybeObjOrJsonString);
    } catch {
      return null;
    }
  }
  return null;
}

function toNumberOrNull(v) {
  if (v === null || v === undefined) return null;

  if (typeof v === "number") return Number.isFinite(v) ? v : null;

  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return null;

    // Parentheses negative e.g. "(80,000)"
    const isParenNeg = /^\(.*\)$/.test(s);
    const raw = s.replace(/^\(|\)$/g, "");

    // remove spaces/commas
    const cleaned = raw.replace(/[,\s]/g, "");
    const n = Number(cleaned);

    if (!Number.isFinite(n)) return null;
    return isParenNeg ? -Math.abs(n) : n;
  }

  return null;
}

function formatNumber(n, locale = "en-ZA") {
  if (n === null || n === undefined) return "—";
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  return n.toLocaleString(locale);
}

function formatFixed(n, digits = 2) {
  if (n === null || n === undefined) return "—";
  const num = typeof n === "number" ? n : toNumberOrNull(n);
  if (num === null) return "—";
  return Number(num).toFixed(digits);
}

/** Prefer defined values (including 0). Only skip null/undefined. */
function firstDefined(...vals) {
  for (const v of vals) {
    if (v !== null && v !== undefined) return v;
  }
  return null;
}

/* ─────────────────────────────────────────────────────────────
   Doc type normalization
───────────────────────────────────────────────────────────── */
const DOC_TYPE_LABELS = {
  bank_statements: "Bank statement",
  payslips: "Payslip",
  id_documents: "ID / Passport",
  financial_statements: "Financial statements",
  proof_of_address: "Proof of address",
  generic: "Other / Generic",
};

function normalizeDocType(docTypeRaw) {
  if (typeof docTypeRaw !== "string") return null;
  const k = docTypeRaw.trim().toLowerCase();

  if (k === "payslip") return "payslips";
  if (k === "id_document") return "id_documents";
  if (k === "bank_statement") return "bank_statements";
  if (k === "financial_statement") return "financial_statements";
  if (k === "proof_of_address_document") return "proof_of_address";
  return k;
}

/* ─────────────────────────────────────────────────────────────
   Derive unified agentic payload (SINGLE definition)
   Key fix: treat result.detailed itself as agentic candidate.
───────────────────────────────────────────────────────────── */
function deriveAgenticFromResult(result) {
  if (!result) return { agentic: null, rawAgentic: null, detailedEnvelope: null };

  const detailedEnvelope = result.detailed || null;

  const asObj = (v) => {
    if (!v) return null;
    if (typeof v === "object") return v;
    if (typeof v === "string") {
      try {
        const parsed = JSON.parse(v);
        return parsed && typeof parsed === "object" ? parsed : null;
      } catch {
        return null;
      }
    }
    return null;
  };

  // Prefer explicit top-level agentic if present
  const topAgentic = asObj(result.agentic);
  if (topAgentic) return { agentic: topAgentic, rawAgentic: topAgentic, detailedEnvelope };

  // Candidates ordered by likelihood (most-specific first)
  const candidates = [
    // IMPORTANT: your aggregator can return detailed as the actual payload
    detailedEnvelope, // { summary, structured, ratios, risk_score, ... }
    detailedEnvelope?.result, // { result: { summary, structured... } } wrapper
    detailedEnvelope?.result?.result, // double-wrapped
    detailedEnvelope?.agentic,
    detailedEnvelope?.agentic?.result,

    // Legacy / defensive
    result?.quick,
    result?.quick?.result,
    result?.quick?.structured,
    result?.result,
    result?.result?.result,
  ]
    .map(asObj)
    .filter(Boolean);

  const rawAgentic = candidates[0] || null;
  if (!rawAgentic) return { agentic: null, rawAgentic: null, detailedEnvelope };

  // If wrapper has .result, merge it (common legacy pattern)
  let agentic = rawAgentic;
  if (agentic && typeof agentic === "object" && agentic.result && typeof agentic.result === "object") {
    agentic = { ...agentic, ...agentic.result };
    delete agentic.result;
  }

  // If we have envelope metadata, ensure it is present on agentic
  if (detailedEnvelope && typeof detailedEnvelope === "object") {
    agentic = {
      docType: detailedEnvelope.docType || result.docType || agentic.docType,
      analysisMode: detailedEnvelope.analysisMode || result.analysisMode || agentic.analysisMode,
      quality: detailedEnvelope.quality || result.quality || agentic.quality,
      ...agentic,
    };
  }

  return { agentic, rawAgentic, detailedEnvelope };
}

/* ─────────────────────────────────────────────────────────────
   Issues / run status
───────────────────────────────────────────────────────────── */
function classifyIssues(result) {
  if (!result) {
    return { issues: [], overallStatus: "unknown", inProgress: false, pipelineStage: null };
  }

  const issues = [];

  const pipelineStage =
    typeof result.statusAudit === "string"
      ? result.statusAudit
      : result.statusAudit && typeof result.statusAudit === "object"
      ? result.statusAudit.pipeline_stage || result.statusAudit.pipelineStage || result.statusAudit.stage || null
      : null;

  const hasQuick = !!result.quick;
  const hasDetailed = !!result.detailed;
  const hasAnyFinalResult = hasQuick || hasDetailed;

  const { agentic, rawAgentic } = deriveAgenticFromResult(result);
  const agenticStatus = rawAgentic?.status ?? agentic?.status ?? "ok";

  const quality = result.quality || {};
  const qualityStatus = quality.status || null;
  const qualityDecision = quality.decision || null;
  const qualityReasons = Array.isArray(quality.reasons) ? quality.reasons : [];

  const isInProgress =
    (!hasAnyFinalResult &&
      (pipelineStage == null ||
        pipelineStage === "uploaded" ||
        pipelineStage === "ocr_completed" ||
        pipelineStage === "detailed_ai_queued" ||
        pipelineStage === "quick_ai_queued" ||
        pipelineStage === "detailed_ai_completed")) ||
    (!hasAnyFinalResult && qualityStatus === "pending") ||
    (pipelineStage === "detailed_ai_completed" && !hasDetailed);

  if (isInProgress) {
    return { issues: [], overallStatus: "in_progress", inProgress: true, pipelineStage };
  }

  // QUALITY STOP
  if (qualityDecision === "STOP") {
    const reasonText =
      qualityReasons.length > 0
        ? `We stopped processing because the document quality was too low: ${qualityReasons.join("; ")}.`
        : "We stopped processing because the document quality was too low for reliable analysis.";
    issues.push({
      stage: "Quality checks",
      level: "error",
      category: "document",
      userMessage: reasonText,
      rawMessage: JSON.stringify({ decision: qualityDecision, reasons: qualityReasons }),
    });
  }

  // Agentic / AI issues
  if (agenticStatus === "error") {
    const errorType = agentic?.error_type || rawAgentic?.error_type || "";
    const msg = agentic?.msg || agentic?.error || rawAgentic?.msg || rawAgentic?.error || "Agentic parser error";

    let category = "internal";
    let userMessage = "Our AI parser could not complete the analysis for this document.";

    if (errorType === "model_call_failure") {
      category = "internal";
      userMessage =
        "Our AI parser had a problem while processing this document. This is on our side – you can try again later, or contact support if it keeps happening.";
    } else if (/timeout/i.test(msg)) {
      category = "internal";
      userMessage =
        "Our AI parser took too long to respond. This is a platform issue rather than a problem with the document.";
    }

    issues.push({
      stage: "AI parsing & classification",
      level: "error",
      category,
      userMessage,
      rawMessage: msg,
    });
  }

  let overallStatus = "ok";
  if (issues.some((i) => i.level === "error")) overallStatus = "error";
  else if (issues.some((i) => i.level === "warning")) overallStatus = "warning";

  return { issues, overallStatus, inProgress: false, pipelineStage };
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
  if (status === "in_progress") {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-sky-100 text-sky-800">
        Processing / queued
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-700">
      Status unknown
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Ratios extraction (doc-type aware, stable keys)
───────────────────────────────────────────────────────────── */
function buildUiRatios(docType, agentic) {
  if (!agentic) return null;

  const r = coerceToObject(agentic?.ratios) || agentic?.ratios || null;
  if (!r || typeof r !== "object") return null;

  if (docType === "financial_statements") {
    return {
      kind: "financials",
      currentRatio: toNumberOrNull(firstDefined(r.current_ratio, r.currentRatio)),
      quickRatio: toNumberOrNull(firstDefined(r.quick_ratio, r.quickRatio)),
      debtToEquity: toNumberOrNull(firstDefined(r.debt_to_equity_ratio, r.debt_to_equity, r.debtToEquity)),
      interestCover: toNumberOrNull(firstDefined(r.interest_cover, r.interest_cover_ratio, r.interestCover)),
      netMargin: toNumberOrNull(firstDefined(r.net_margin, r.netMargin)),
      returnOnAssets: toNumberOrNull(firstDefined(r.return_on_assets, r.roa, r.returnOnAssets)),
      debtServiceCoverage: toNumberOrNull(firstDefined(r.debt_service_coverage_ratio, r.dscr, r.debtServiceCoverage)),
      cashflowCoverage: toNumberOrNull(firstDefined(r.cash_flow_coverage_ratio, r.cashflow_coverage_ratio, r.cashflowCoverage)),
    };
  }

  if (docType === "bank_statements") {
    return {
      kind: "bank",
      netCashFlow: toNumberOrNull(firstDefined(r.net_cash_flow, r.netCashFlow)),
      inflowToOutflow: toNumberOrNull(firstDefined(r.inflow_to_outflow_ratio, r.inflowToOutflowRatio)),
      closingToOpening: toNumberOrNull(firstDefined(r.closing_to_opening_balance_ratio, r.closingToOpeningBalanceRatio)),
    };
  }

  return { kind: "generic", raw: r };
}

/* ─────────────────────────────────────────────────────────────
   Summary extraction (doc-type aware)
───────────────────────────────────────────────────────────── */
function buildUiSummary(docType, agentic, fields = []) {
  if (!agentic && !fields.length) return null;

  const getField = (name) =>
    fields.find((f) => f.name && f.name.toLowerCase() === name.toLowerCase())?.value ?? null;

  const getFieldNum = (name) => toNumberOrNull(getField(name));

  if (docType === "bank_statements") {
    const s = coerceToObject(agentic?.structured) || agentic?.structured || {};
    return {
      kind: "bank",
      account_holder: firstDefined(s.account_holder_name, getField("account_holder_name"), getField("account_holder")) || null,
      period_start: firstDefined(s.statement_period_start, getField("statement_period_start")) || null,
      period_end: firstDefined(s.statement_period_end, getField("statement_period_end")) || null,
      opening_balance: firstDefined(toNumberOrNull(s.opening_balance), getFieldNum("opening_balance")),
      closing_balance: firstDefined(toNumberOrNull(s.closing_balance), getFieldNum("closing_balance")),
      total_credits: firstDefined(toNumberOrNull(s.total_credits), getFieldNum("total_credits")),
      total_debits: firstDefined(toNumberOrNull(s.total_debits), getFieldNum("total_debits")),
      currency: firstDefined(s.currency, getField("currency"), "ZAR"),
    };
  }

if (docType === "financial_statements") {
  const s = coerceToObject(agentic?.structured) || agentic?.structured || {};

  const income = s?.income_statement || {};
  const balance = s?.balance_sheet || {};

  return {
    kind: "financials",

    entity_name: firstDefined(s.entity_name, getField("entity_name")) || null,
    period_start: firstDefined(s.reporting_period_start, getField("reporting_period_start")) || null,
    period_end: firstDefined(s.reporting_period_end, getField("reporting_period_end")) || null,
    currency: firstDefined(s.currency, getField("currency")) || null,

    // Income statement
    revenue: firstDefined(toNumberOrNull(income.revenue), getFieldNum("revenue")),
    ebitda: firstDefined(toNumberOrNull(income.ebitda), getFieldNum("ebitda")),
    net_profit: firstDefined(
      toNumberOrNull(income.profit_after_tax),
      toNumberOrNull(income.net_income),
      getFieldNum("profit_after_tax"),
      getFieldNum("net_income")
    ),

    // Balance sheet
    total_assets: firstDefined(toNumberOrNull(balance.assets_total), getFieldNum("assets_total")),
    total_liabilities: firstDefined(toNumberOrNull(balance.liabilities_total), getFieldNum("liabilities_total")),
    equity: firstDefined(toNumberOrNull(balance.equity), getFieldNum("equity")),
  };
}


  if (docType === "payslips") {
    const s = coerceToObject(agentic?.structured) || agentic?.structured || {};
    const periodLabel =
      s.pay_period_start && s.pay_period_end ? `${s.pay_period_start} to ${s.pay_period_end}` : null;

    return {
      kind: "payslip",
      employee_name: firstDefined(s.employee_name, getField("employee_name")) || null,
      employer_name: firstDefined(s.employer_name, getField("employer_name")) || null,
      period_label: periodLabel,
      gross_pay: firstDefined(toNumberOrNull(s.gross_pay), getFieldNum("gross_pay")),
      net_pay: firstDefined(toNumberOrNull(s.net_pay), getFieldNum("net_pay")),
      currency: firstDefined(s.currency, getField("currency"), "ZAR"),
    };
  }

  if (docType === "proof_of_address") {
    const s = coerceToObject(agentic?.structured) || agentic?.structured || {};
    const lines = Array.isArray(s.address_lines) ? s.address_lines : [];
    return {
      kind: "address",
      holder_name: firstDefined(s.customer_name, getField("customer_name")) || null,
      address_line_1: firstDefined(lines[0], getField("address_line_1")) || null,
      address_line_2: firstDefined(lines.slice(1).join(", "), getField("address_line_2")) || null,
      postal_code: firstDefined(s.postal_code, getField("postal_code")) || null,
      proof_entity_name: firstDefined(s.issuer_name, getField("issuer_name")) || null,
      document_issue_date: firstDefined(s.issue_date, getField("issue_date")) || null,
      country: firstDefined(s.country, getField("country")) || null,
    };
  }

  if (docType === "id_documents") {
    const s = coerceToObject(agentic?.structured) || agentic?.structured || {};
    return {
      kind: "id",
      first_names: firstDefined(s.first_names, s.given_names, getField("first_names")) || null,
      surname: firstDefined(s.surname, s.last_name, getField("surname")) || null,
      id_type: firstDefined(s.id_type, getField("id_type")) || null,
      id_number: firstDefined(s.id_number, s.identity_number, s.passport_number, getField("id_number")) || null,
      issuing_country: firstDefined(s.issuing_country, s.country, getField("issuing_country")) || null,
      date_of_birth: firstDefined(s.date_of_birth, s.dob, getField("date_of_birth")) || null,
    };
  }

  return null;
}

/* ─────────────────────────────────────────────────────────────
   Print-to-PDF HTML
───────────────────────────────────────────────────────────── */
function buildPrintableHtml({ objectKey, docTypeLabel, analysisMode, riskScore, riskBand, confidencePct, agenticSummary, uiSummary, uiRatios }) {
  const esc = (s) =>
    String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const row = (k, v) => `
    <tr>
      <td class="k">${esc(k)}</td>
      <td class="v">${esc(v)}</td>
    </tr>
  `;

  const lines = [];
  lines.push(`<h1>OCR & AI Results Summary</h1>`);
  lines.push(`<div class="meta"><div><b>Object</b>: ${esc(objectKey || "—")}</div></div>`);

  lines.push(`<h2>Run</h2>`);
  lines.push(`<table class="t">${row("Document Type", docTypeLabel || "—")}${row("Analysis Mode", analysisMode || "—")}</table>`);

  lines.push(`<h2>Scores</h2>`);
  lines.push(
    `<table class="t">
      ${row("Risk Score", typeof riskScore === "number" ? `${riskScore.toFixed(2)}${riskBand ? ` (${riskBand})` : ""}` : "—")}
      ${row("Confidence", confidencePct != null ? `${confidencePct.toFixed(1)}%` : "—")}
    </table>`
  );

  if (agenticSummary) {
    lines.push(`<h2>AI Summary</h2>`);
    lines.push(`<pre class="summary">${esc(agenticSummary)}</pre>`);
  }

  // Keep it lightweight; we don’t need every section for PDF right now.
  // Expand later if you want parity with the UI.
  if (uiSummary?.kind === "financials") {
    lines.push(`<h2>Financial Statement Summary</h2>`);
    lines.push(
      `<table class="t">
        ${row("Entity", uiSummary.entity_name || "—")}
        ${row("Reporting Period", `${uiSummary.period_start || "—"}${uiSummary.period_end ? ` to ${uiSummary.period_end}` : ""}`)}
        ${row("Currency", uiSummary.currency || "—")}
        ${row("Revenue", uiSummary.revenue != null ? formatNumber(uiSummary.revenue) : "—")}
        ${row("EBITDA", uiSummary.ebitda != null ? formatNumber(uiSummary.ebitda) : "—")}
        ${row("Net profit", uiSummary.net_profit != null ? formatNumber(uiSummary.net_profit) : "—")}
        ${row("Total assets", uiSummary.total_assets != null ? formatNumber(uiSummary.total_assets) : "—")}
        ${row("Total liabilities", uiSummary.total_liabilities != null ? formatNumber(uiSummary.total_liabilities) : "—")}
        ${row("Equity", uiSummary.equity != null ? formatNumber(uiSummary.equity) : "—")}
      </table>`
    );

    if (uiRatios?.kind === "financials") {
      lines.push(`<h2>Key Ratios</h2>`);
      lines.push(
        `<table class="t">
          ${row("Current ratio", uiRatios.currentRatio != null ? formatFixed(uiRatios.currentRatio, 2) : "—")}
          ${row("Quick ratio", uiRatios.quickRatio != null ? formatFixed(uiRatios.quickRatio, 2) : "—")}
          ${row("Debt to equity", uiRatios.debtToEquity != null ? formatFixed(uiRatios.debtToEquity, 2) : "—")}
          ${row("Net margin", uiRatios.netMargin != null ? formatFixed(uiRatios.netMargin, 2) : "—")}
        </table>`
      );
    }
  }

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>OCR & AI Results Summary</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 32px; color: #0f172a; }
      h1 { margin: 0 0 8px 0; font-size: 20px; }
      h2 { margin: 18px 0 8px 0; font-size: 14px; }
      .meta { font-size: 12px; color: #334155; margin-bottom: 8px; }
      .t { width: 100%; border-collapse: collapse; font-size: 12px; }
      .t td { border: 1px solid #e2e8f0; padding: 8px; vertical-align: top; }
      .k { width: 34%; font-weight: 600; background: #f8fafc; }
      .summary { background: #0b1220; color: #e2e8f0; padding: 10px; border-radius: 6px; font-size: 11px; white-space: pre-wrap; }
      @media print { body { margin: 14mm; } }
    </style>
  </head>
  <body>
    ${lines.join("\n")}
    <script>
      window.onload = () => { setTimeout(() => window.print(), 250); };
    </script>
  </body>
</html>`;
}

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
export default function Results() {
  const query = useQuery();
  const objectKey = query.get("objectKey");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [activeView, setActiveView] = useState("summary");

  const functionUrl = "https://5epugrqble4dg6pahfz63wx44a0caasj.lambda-url.us-east-1.on.aws/";

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
        const res = await fetch(`${functionUrl}?objectKey=${encodeURIComponent(objectKey)}`);

        if (!res.ok) {
          attempt += 1;
          if (attempt < maxAttempts && !cancelled) {
            setTimeout(attemptFetch, delayMs);
          } else if (!cancelled) {
            const text = await res.text().catch(() => "");
            setLoading(false);
            setError(
              `We couldn't load the OCR result from secure storage (HTTP ${res.status}).` + (text ? ` Details: ${text}` : "")
            );
          }
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        const hasQuick = !!data.quick;
        const hasDetailed = !!data.detailed;
        const qualityStatus = data.quality?.status || null;
        const pipelineStage =
          typeof data.statusAudit === "string"
            ? data.statusAudit
            : data.statusAudit && typeof data.statusAudit === "object"
            ? data.statusAudit.pipeline_stage || data.statusAudit.pipelineStage || data.statusAudit.stage || null
            : null;

        const inProgress =
          (!hasQuick &&
            !hasDetailed &&
            (pipelineStage == null ||
              pipelineStage === "uploaded" ||
              pipelineStage === "ocr_completed" ||
              pipelineStage === "detailed_ai_queued" ||
              pipelineStage === "quick_ai_queued" ||
              pipelineStage === "detailed_ai_completed")) ||
          (!hasQuick && !hasDetailed && qualityStatus === "pending") ||
          (pipelineStage === "detailed_ai_completed" && !hasDetailed);

        setResult((prev) => {
          if (!prev) return data;
          if (!inProgress) return data;
          const prevHasAny = !!prev.quick || !!prev.detailed;
          const nextHasAny = hasQuick || hasDetailed;
          return prevHasAny && !nextHasAny ? prev : data;
        });

        if (inProgress && attempt < maxAttempts) {
          attempt += 1;
          setTimeout(attemptFetch, delayMs);
        } else {
          setLoading(false);
          setError(null);
        }
      } catch {
        attempt += 1;
        if (attempt < maxAttempts && !cancelled) {
          setTimeout(attemptFetch, delayMs);
        } else if (!cancelled) {
          setLoading(false);
          setError("We couldn't reach the results service. Please refresh in a moment or try the upload again.");
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
      const res = await fetch(`${functionUrl}?objectKey=${encodeURIComponent(objectKey)}`);
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
    } catch {
      alert("Could not download JSON. Please try again.");
    }
  }

  function handleDownloadPdf() {
    try {
      if (!result) {
        alert("No result available yet. Please wait for the analysis to complete.");
        return;
      }

      const { agentic } = deriveAgenticFromResult(result);
      const fields = Array.isArray(result?.fields) ? result.fields : [];

      const docTypeRaw = agentic?.docType ?? result?.docType ?? null;
      const docType = normalizeDocType(docTypeRaw);
      const docTypeLabel = (docType && DOC_TYPE_LABELS[docType]) || docTypeRaw || "—";

      const uiSummary = buildUiSummary(docType, agentic, fields);
      const uiRatios = buildUiRatios(docType, agentic);

      const agenticSummary =
        result?.detailed?.summary ??
        result?.detailed?.result?.summary ??
        result?.quick?.summary ??
        agentic?.summary ??
        result?.summary ??
        null;

      const riskScore = agentic?.risk_score?.score ?? result?.riskScore?.score ?? null;
      const riskBand = agentic?.risk_score?.band ?? result?.riskScore?.band ?? null;

      const quality = result?.quality || {};
      const rawConfidence = typeof quality.confidence === "number" ? quality.confidence : null;
      const confidencePct = typeof rawConfidence === "number" ? (rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence) : null;

      const analysisModeRaw = agentic?.analysisMode || result?.analysisMode || null;
      const analysisMode = analysisModeRaw || (result?.detailed ? "detailed" : result?.quick ? "quick" : null);

      const html = buildPrintableHtml({
        objectKey,
        docTypeLabel,
        analysisMode: analysisMode === "detailed" ? "Detailed" : analysisMode === "quick" ? "Quick" : analysisMode || "—",
        riskScore: typeof riskScore === "number" ? riskScore : null,
        riskBand,
        confidencePct,
        agenticSummary,
        uiSummary,
        uiRatios,
      });

      const w = window.open("", "_blank", "noopener,noreferrer");
      if (!w) {
        alert("Popup blocked. Please allow popups to download the PDF.");
        return;
      }
      w.document.open();
      w.document.write(html);
      w.document.close();
    } catch {
      alert("Could not generate the PDF summary. Please try again.");
    }
  }

  const { agentic } = deriveAgenticFromResult(result);
  const docTypeRaw = agentic?.docType ?? result?.docType ?? null;
  const docType = normalizeDocType(docTypeRaw);
  const docTypeLabel = (docType && DOC_TYPE_LABELS[docType]) || docTypeRaw || "—";

  const fields = Array.isArray(result?.fields) ? result.fields : [];
  const pipelineStage =
    typeof result?.statusAudit === "string"
      ? result.statusAudit
      : result?.statusAudit && typeof result.statusAudit === "object"
      ? result.statusAudit.pipeline_stage || result.statusAudit.pipelineStage || result.statusAudit.stage || null
      : null;

  const { issues, overallStatus, inProgress } = classifyIssues(result);

  const uiSummary = buildUiSummary(docType, agentic, fields);
  const uiRatios = buildUiRatios(docType, agentic);

  const riskScore = agentic?.risk_score?.score ?? result?.riskScore?.score ?? null;
  const riskBand = agentic?.risk_score?.band ?? result?.riskScore?.band ?? null;

  const quality = result?.quality || {};
  const rawConfidence = typeof quality.confidence === "number" ? quality.confidence : null;
  const confidencePct = typeof rawConfidence === "number" ? (rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence) : null;
  const qualityStatus = quality.status || null;

  const analysisModeRaw = agentic?.analysisMode || result?.analysisMode || null;
  const analysisMode = analysisModeRaw || (result?.detailed ? "detailed" : result?.quick ? "quick" : null);

  const agenticSummary =
    result?.detailed?.summary ??
    result?.detailed?.result?.summary ??
    result?.quick?.summary ??
    agentic?.summary ??
    result?.summary ??
    null;

  return (
    <div className="min-h-screen text-slate-900" style={{ background: "rgb(var(--surface))" }}>
      <SiteHeader />

      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6" />
              OCR &amp; AI Results
            </h1>
            <p className="text-sm text-slate-600 mt-1">Review OCR output, AI-parsed structure, and any issues detected for this document.</p>
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
              {inProgress ? "The document has been uploaded and is being processed. This page will update once results are ready." : "Fetching OCR result…"}
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
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveView("summary")}
                    className={`px-3 py-1 rounded-full transition ${activeView === "summary" ? "bg-white shadow-sm text-slate-900" : "text-slate-600"}`}
                  >
                    Client view
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView("agent")}
                    className={`px-3 py-1 rounded-full transition ${activeView === "agent" ? "bg-white shadow-sm text-slate-900" : "text-slate-600"}`}
                  >
                    Agent view
                  </button>
                </div>
              </div>

              {activeView === "summary" && (
                <>
                  <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-slate-50 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <div className="font-medium text-sm">Run status</div>
                      {formatStatusBadge(overallStatus)}
                      {pipelineStage && <span className="text-xs text-slate-500">(Pipeline stage: {pipelineStage})</span>}
                      {qualityStatus && !inProgress && <span className="text-xs text-slate-500">• Quality status: {qualityStatus}</span>}
                    </div>

                    {!inProgress && issues.length === 0 && (
                      <p className="text-sm text-slate-700">All processing stages completed without any detected issues.</p>
                    )}

                    {!inProgress && issues.length > 0 && (
                      <ul className="space-y-2 text-sm">
                        {issues.map((issue, idx) => (
                          <li key={idx} className="border-t border-slate-200 pt-2 first:border-t-0 first:pt-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium">{issue.stage}</span>
                            </div>
                            <p className="mt-1 text-slate-700">{issue.userMessage}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {agenticSummary && !inProgress && (
                    <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <h2 className="text-sm font-semibold mb-2">AI summary</h2>
                      <p className="text-sm text-slate-800 whitespace-pre-wrap">{agenticSummary}</p>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-4 mb-6">
                    <div className="rounded-lg border border-[rgb(var(--border))] p-4 bg-white">
                      <div className="text-xs uppercase tracking-wide opacity-70">Risk Score</div>
                      <div className="mt-1 text-2xl font-semibold">
                        {typeof riskScore === "number" ? riskScore.toFixed(2) : "—"}
                        {riskBand && typeof riskScore === "number" && (
                          <span className="ml-2 text-sm font-normal uppercase tracking-wide text-slate-600">({riskBand})</span>
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg border border-[rgb(var(--border))] p-4 bg-white">
                      <div className="text-xs uppercase tracking-wide opacity-70">Confidence</div>
                      <div className="mt-1 text-2xl font-semibold">{confidencePct != null ? confidencePct.toFixed(1) + "%" : "—"}</div>
                    </div>
                    <div className="rounded-lg border border-[rgb(var(--border))] p-4 bg-white">
                      <div className="text-xs uppercase tracking-wide opacity-70">Document Type</div>
                      <div className="mt-1 text-2xl font-semibold">{docTypeLabel}</div>
                    </div>
                    <div className="rounded-lg border border-[rgb(var(--border))] p-4 bg-white">
                      <div className="text-xs uppercase tracking-wide opacity-70">Analysis Mode</div>
                      <div className="mt-1 text-2xl font-semibold">
                        {analysisMode === "detailed" ? "Detailed" : analysisMode === "quick" ? "Quick" : inProgress ? "Processing" : "—"}
                      </div>
                    </div>
                  </div>

                  {uiSummary?.kind === "financials" && !inProgress && (
                    <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <h2 className="text-sm font-semibold mb-3">Financial statement summary</h2>
                      <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Revenue</div>
                          <div className="font-medium">{uiSummary.revenue != null ? formatNumber(uiSummary.revenue) : "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">EBITDA</div>
                          <div className="font-medium">{uiSummary.ebitda != null ? formatNumber(uiSummary.ebitda) : "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Net profit</div>
                          <div className="font-medium">{uiSummary.net_profit != null ? formatNumber(uiSummary.net_profit) : "—"}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {uiRatios?.kind === "financials" && !inProgress && (
                    <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <h2 className="text-sm font-semibold mb-3">Key ratios (from statements)</h2>
                      <div className="grid gap-4 md:grid-cols-4 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Current ratio</div>
                          <div className="font-medium">{uiRatios.currentRatio != null ? formatFixed(uiRatios.currentRatio, 2) : "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Quick ratio</div>
                          <div className="font-medium">{uiRatios.quickRatio != null ? formatFixed(uiRatios.quickRatio, 2) : "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Debt to equity</div>
                          <div className="font-medium">{uiRatios.debtToEquity != null ? formatFixed(uiRatios.debtToEquity, 2) : "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Cashflow coverage</div>
                          <div className="font-medium">{uiRatios.cashflowCoverage != null ? formatFixed(uiRatios.cashflowCoverage, 2) : "—"}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-lg border border-[rgb(var(--border))] overflow-x-auto bg-white">
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left p-3 border-b border-[rgb(var(--border))]">Field</th>
                          <th className="text-left p-3 border-b border-[rgb(var(--border))]">Value</th>
                          <th className="text-left p-3 border-b border-[rgb(var(--border))]">Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fields.length === 0 && (
                          <tr>
                            <td colSpan={3} className="p-3 border-b border-[rgb(var(--border))] text-center opacity-70">
                              {inProgress ? "Structured fields will appear here once analysis completes." : "No structured fields found."}
                            </td>
                          </tr>
                        )}
                        {fields.map((f, idx) => (
                          <tr key={idx} className="odd:bg-slate-50/50">
                            <td className="p-3 border-b border-[rgb(var(--border))]">{f.name}</td>
                            <td className="p-3 border-b border-[rgb(var(--border))] whitespace-pre-wrap">{f.value}</td>
                            <td className="p-3 border-b border-[rgb(var(--border))]">
                              {typeof f.confidence === "number" ? (f.confidence * 100).toFixed(1) + "%" : f.confidence ?? "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeView === "agent" && (
                <>
                  <div className="mb-4 rounded-lg border border-[rgb(var(--border))] bg-slate-50 px-4 py-3 text-sm">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-medium">Run status</span>
                      {formatStatusBadge(overallStatus)}
                      {pipelineStage && <span className="text-xs text-slate-500">Stage: {pipelineStage}</span>}
                      {qualityStatus && !inProgress && <span className="text-xs text-slate-500">• Quality: {qualityStatus}</span>}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[rgb(var(--border))] bg-white"
                      onClick={handleDownloadJson}
                    >
                      <Download className="h-4 w-4" />
                      Download raw JSON
                    </button>

                    <details className="w-full mt-3 text-xs text-slate-600">
                      <summary className="cursor-pointer underline underline-offset-2">Raw result (debug)</summary>
                      <pre className="mt-2 max-h-96 overflow-auto rounded bg-slate-900 text-slate-100 p-2 text-[11px]">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </details>
                  </div>
                </>
              )}

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



