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
   Core formatting rules (NO redesign; just consistent rendering)
   - Missing (null/undefined/NaN) => "—"
   - Zero must remain visible as 0
───────────────────────────────────────────────────────────── */
function toNumberOrNull(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;

  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return null;

    // Negative via parentheses: "(80,000)" => -80000
    const isParenNeg = /^\(.*\)$/.test(s);
    const raw = s.replace(/^\(|\)$/g, "");

    // Remove commas and spaces: "1 200 000" / "1,200,000"
    const cleaned = raw.replace(/[,\s]/g, "");
    const n = Number(cleaned);
    if (!Number.isFinite(n)) return null;
    return isParenNeg ? -Math.abs(n) : n;
  }

  return null;
}

function formatNumberValue(v, locale = "en-ZA") {
  const n = typeof v === "number" ? v : toNumberOrNull(v);
  if (n === null) return "—";
  return n.toLocaleString(locale);
}

function formatFixedValue(v, digits = 2) {
  const n = typeof v === "number" ? v : toNumberOrNull(v);
  if (n === null) return "—";
  return Number(n).toFixed(digits);
}

/** Prefer defined values (including 0). Only skip null/undefined. */
function firstDefined(...vals) {
  for (const v of vals) {
    if (v !== null && v !== undefined) return v;
  }
  return null;
}

function coerceToObject(v) {
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
}

/* ─────────────────────────────────────────────────────────────
   Doc-type labels (existing)
───────────────────────────────────────────────────────────── */
const DOC_TYPE_LABELS = {
  bank_statements: "Bank statements",
  payslips: "Payslips",
  id_documents: "ID documents",
  financial_statements: "Financial statements",
  proof_of_address: "Proof of address",
  generic: "Generic",
};

function normalizeDocType(docTypeRaw) {
  if (typeof docTypeRaw !== "string") return null;
  const k = docTypeRaw.trim().toLowerCase();
  if (k === "payslip") return "payslips";
  if (k === "bank_statement") return "bank_statements";
  if (k === "financial_statement") return "financial_statements";
  if (k === "id_document") return "id_documents";
  if (k === "proof_of_address_document") return "proof_of_address";
  return k;
}

/* ─────────────────────────────────────────────────────────────
   CRITICAL: unify result payload extraction
   Goal: stop chasing different shapes per doc type.

   We treat these as candidates (first valid wins):
   1) result.agentic (explicit future)
   2) result.detailed (your current contract: summary/structured/ratios/risk_score)
   3) result.detailed.result / .result.result (legacy wrappers)
   4) result.quick / result.quick.result (legacy)
   5) result.result / result.result.result (legacy)
───────────────────────────────────────────────────────────── */
function deriveAgenticFromResult(result) {
  if (!result) return { agentic: null, rawAgentic: null, detailedEnvelope: null };

  const detailedEnvelope = result.detailed || null;

  const asObj = (v) => {
    const o = coerceToObject(v);
    return o && typeof o === "object" ? o : null;
  };

  const top = asObj(result.agentic);
  if (top) return { agentic: top, rawAgentic: top, detailedEnvelope };

  const candidates = [
    detailedEnvelope, // current: direct payload
    detailedEnvelope?.result,
    detailedEnvelope?.result?.result,
    detailedEnvelope?.agentic,
    detailedEnvelope?.agentic?.result,

    result?.quick,
    result?.quick?.result,
    result?.result,
    result?.result?.result,
  ]
    .map(asObj)
    .filter(Boolean);

  const rawAgentic = candidates[0] || null;
  if (!rawAgentic) return { agentic: null, rawAgentic: null, detailedEnvelope };

  // If wrapper has { result: {...} }, merge it (but preserve wrapper keys too)
  let agentic = rawAgentic;
  if (agentic.result && typeof agentic.result === "object") {
    agentic = { ...agentic, ...agentic.result };
    delete agentic.result;
  }

  // Ensure docType/analysisMode/quality are present if available on the outer result
  agentic = {
    docType: agentic.docType ?? detailedEnvelope?.docType ?? result.docType ?? null,
    analysisMode: agentic.analysisMode ?? detailedEnvelope?.analysisMode ?? result.analysisMode ?? null,
    quality: agentic.quality ?? detailedEnvelope?.quality ?? result.quality ?? null,
    ...agentic,
  };

  return { agentic, rawAgentic, detailedEnvelope };
}

/* ─────────────────────────────────────────────────────────────
   Issues / run status classification (keep existing behaviour)
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
  const hasAnyFinal = hasQuick || hasDetailed;

  const quality = result.quality || {};
  const qualityStatus = quality.status || null;
  const qualityDecision = quality.decision || null;
  const qualityReasons = Array.isArray(quality.reasons) ? quality.reasons : [];

  const { agentic, rawAgentic } = deriveAgenticFromResult(result);
  const agenticStatus = rawAgentic?.status ?? agentic?.status ?? "ok";

  const inProgress =
    (!hasAnyFinal &&
      (pipelineStage == null ||
        pipelineStage === "uploaded" ||
        pipelineStage === "ocr_completed" ||
        pipelineStage === "detailed_ai_queued" ||
        pipelineStage === "quick_ai_queued" ||
        pipelineStage === "detailed_ai_completed")) ||
    (!hasAnyFinal && qualityStatus === "pending") ||
    (pipelineStage === "detailed_ai_completed" && !hasDetailed);

  if (inProgress) {
    return { issues: [], overallStatus: "in_progress", inProgress: true, pipelineStage };
  }

  if (qualityDecision === "STOP") {
    issues.push({
      stage: "Quality checks",
      level: "error",
      category: "document",
      userMessage:
        qualityReasons.length > 0
          ? `We stopped processing because the document quality was too low: ${qualityReasons.join("; ")}.`
          : "We stopped processing because the document quality was too low for reliable analysis.",
      rawMessage: JSON.stringify({ decision: qualityDecision, reasons: qualityReasons }),
    });
  }

  if (agenticStatus === "error") {
    const msg = agentic?.msg || agentic?.error || rawAgentic?.msg || rawAgentic?.error || "AI parser error";
    issues.push({
      stage: "AI parsing & classification",
      level: "error",
      category: "internal",
      userMessage: "Our AI parser could not complete the analysis for this document.",
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
   Build UI summary for the SAME on-screen sections you already have
   (No new sections; no removals)
───────────────────────────────────────────────────────────── */
function buildUiSummary(docType, agentic, fields) {
  const safeFields = Array.isArray(fields) ? fields : [];
  const getField = (name) =>
    safeFields.find((f) => String(f?.name || "").toLowerCase() === String(name).toLowerCase())?.value ?? null;

  if (docType === "financial_statements") {
    const s = coerceToObject(agentic?.structured) || agentic?.structured || {};
    const income = s.income_statement || agentic?.income_statement || {};
    const balance = s.balance_sheet || agentic?.balance_sheet || {};

    return {
      kind: "financials",
      entity_name: firstDefined(s.entity_name, agentic?.entity_name, getField("entity_name")),
      period_start: firstDefined(
        s.reporting_period_start,
        agentic?.reporting_period_start,
        getField("reporting_period_start")
      ),
      period_end: firstDefined(
        s.reporting_period_end,
        agentic?.reporting_period_end,
        getField("reporting_period_end")
      ),
      currency: firstDefined(s.currency, agentic?.currency, getField("currency")),

      revenue: firstDefined(income?.revenue, getField("revenue")),
      ebitda: firstDefined(income?.ebitda, getField("ebitda")),
      net_profit: firstDefined(
        income?.profit_after_tax,
        income?.net_profit,
        income?.net_income,
        getField("profit_after_tax"),
        getField("net_profit"),
        getField("net_income")
      ),

      total_assets: firstDefined(balance?.assets_total, balance?.total_assets, getField("assets_total"), getField("total_assets")),
      total_liabilities: firstDefined(
        balance?.liabilities_total,
        balance?.total_liabilities,
        getField("liabilities_total"),
        getField("total_liabilities")
      ),
      equity: firstDefined(balance?.equity, getField("equity")),
    };
  }

  if (docType === "bank_statements") {
    const s = coerceToObject(agentic?.structured) || agentic?.structured || {};
    return {
      kind: "bank",
      bank_name: firstDefined(s.bank_name, getField("bank_name")),
      account_holder_name: firstDefined(s.account_holder_name, getField("account_holder_name")),
      account_number: firstDefined(s.account_number, getField("account_number")),
      statement_period_start: firstDefined(s.statement_period_start, getField("statement_period_start")),
      statement_period_end: firstDefined(s.statement_period_end, getField("statement_period_end")),
      opening_balance: firstDefined(s.opening_balance, getField("opening_balance")),
      closing_balance: firstDefined(s.closing_balance, getField("closing_balance")),
      total_credits: firstDefined(s.total_credits, getField("total_credits")),
      total_debits: firstDefined(s.total_debits, getField("total_debits")),
      currency: firstDefined(s.currency, getField("currency")),
    };
  }

  if (docType === "payslips") {
    const s = coerceToObject(agentic?.structured) || agentic?.structured || {};
    return {
      kind: "payslip",
      employer_name: firstDefined(s.employer_name, getField("employer_name")),
      employee_name: firstDefined(s.employee_name, getField("employee_name")),
      pay_period_start: firstDefined(s.pay_period_start, getField("pay_period_start")),
      pay_period_end: firstDefined(s.pay_period_end, getField("pay_period_end")),
      gross_pay: firstDefined(s.gross_pay, getField("gross_pay")),
      net_pay: firstDefined(s.net_pay, getField("net_pay")),
      currency: firstDefined(s.currency, getField("currency")),
    };
  }

  if (docType === "proof_of_address") {
    const s = coerceToObject(agentic?.structured) || agentic?.structured || {};
    return {
      kind: "address",
      customer_name: firstDefined(s.customer_name, getField("customer_name")),
      issuer_name: firstDefined(s.issuer_name, getField("issuer_name")),
      issue_date: firstDefined(s.issue_date, getField("issue_date")),
      address: firstDefined(
        Array.isArray(s.address_lines) ? s.address_lines.join(", ") : null,
        s.address,
        getField("address")
      ),
      postal_code: firstDefined(s.postal_code, getField("postal_code")),
      country: firstDefined(s.country, getField("country")),
    };
  }

  if (docType === "id_documents") {
    const s = coerceToObject(agentic?.structured) || agentic?.structured || {};
    return {
      kind: "id",
      // You said IDs not implemented yet; still keep stable surface so gaps are visible.
      full_name: firstDefined(s.full_name, getField("full_name")),
      id_number: firstDefined(s.id_number, getField("id_number")),
      issuing_country: firstDefined(s.issuing_country, getField("issuing_country")),
      date_of_birth: firstDefined(s.date_of_birth, getField("date_of_birth")),
    };
  }

  // generic
  return null;
}

function buildUiRatios(docType, agentic) {
  const r = coerceToObject(agentic?.ratios) || agentic?.ratios || null;
  if (!r || typeof r !== "object") return null;

  if (docType === "financial_statements") {
    return {
      kind: "financials",
      current_ratio: firstDefined(r.current_ratio, r.currentRatio),
      quick_ratio: firstDefined(r.quick_ratio, r.quickRatio),
      debt_to_equity: firstDefined(r.debt_to_equity_ratio, r.debt_to_equity, r.debtToEquity),
      interest_cover: firstDefined(r.interest_cover, r.interest_cover_ratio, r.interestCover),
      net_margin: firstDefined(r.net_margin, r.netMargin),
      return_on_assets: firstDefined(r.return_on_assets, r.roa, r.returnOnAssets),
      debt_service_coverage: firstDefined(r.debt_service_coverage_ratio, r.dscr, r.debtServiceCoverage),
      cashflow_coverage: firstDefined(r.cash_flow_coverage_ratio, r.cashflow_coverage_ratio, r.cashflowCoverage),
    };
  }

  if (docType === "bank_statements") {
    return {
      kind: "bank",
      net_cash_flow: firstDefined(r.net_cash_flow, r.netCashFlow),
      inflow_to_outflow_ratio: firstDefined(r.inflow_to_outflow_ratio, r.inflowToOutflowRatio),
      closing_to_opening_balance_ratio: firstDefined(r.closing_to_opening_balance_ratio, r.closingToOpeningBalanceRatio),
    };
  }

  return { kind: "generic", raw: r };
}

/* ─────────────────────────────────────────────────────────────
   PDF summary: print-to-PDF (works immediately; no backend change)
───────────────────────────────────────────────────────────── */
function buildPrintableHtml({
  objectKey,
  docTypeLabel,
  analysisModeLabel,
  riskScore,
  riskBand,
  confidencePct,
  agenticSummary,
  uiSummary,
  uiRatios,
}) {
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
  lines.push(
    `<table class="t">
      ${row("Document Type", docTypeLabel || "—")}
      ${row("Analysis Mode", analysisModeLabel || "—")}
    </table>`
  );

  lines.push(`<h2>Scores</h2>`);
  lines.push(
    `<table class="t">
      ${row(
        "Risk Score",
        typeof riskScore === "number" ? `${riskScore.toFixed(2)}${riskBand ? ` (${riskBand})` : ""}` : "—"
      )}
      ${row("Confidence", confidencePct != null ? `${confidencePct.toFixed(1)}%` : "—")}
    </table>`
  );

  if (agenticSummary) {
    lines.push(`<h2>AI summary</h2>`);
    lines.push(`<pre class="summary">${esc(agenticSummary)}</pre>`);
  }

  if (uiSummary?.kind === "financials") {
    lines.push(`<h2>Financial statement summary</h2>`);
    lines.push(
      `<table class="t">
        ${row("Entity", uiSummary.entity_name || "—")}
        ${row(
          "Reporting Period",
          `${uiSummary.period_start || "—"}${uiSummary.period_end ? ` to ${uiSummary.period_end}` : ""}`
        )}
        ${row("Currency", uiSummary.currency || "—")}
        ${row("Revenue", formatNumberValue(uiSummary.revenue))}
        ${row("EBITDA", formatNumberValue(uiSummary.ebitda))}
        ${row("Net profit", formatNumberValue(uiSummary.net_profit))}
        ${row("Total assets", formatNumberValue(uiSummary.total_assets))}
        ${row("Total liabilities", formatNumberValue(uiSummary.total_liabilities))}
        ${row("Equity", formatNumberValue(uiSummary.equity))}
      </table>`
    );

    if (uiRatios?.kind === "financials") {
      lines.push(`<h2>Key ratios (from statements)</h2>`);
      lines.push(
        `<table class="t">
          ${row("Current ratio", formatFixedValue(uiRatios.current_ratio, 2))}
          ${row("Quick ratio", formatFixedValue(uiRatios.quick_ratio, 2))}
          ${row("Debt to equity", formatFixedValue(uiRatios.debt_to_equity, 2))}
          ${row("Interest cover", formatFixedValue(uiRatios.interest_cover, 2))}
          ${row("Net margin", formatFixedValue(uiRatios.net_margin, 2))}
          ${row("Return on assets", formatFixedValue(uiRatios.return_on_assets, 2))}
          ${row("Debt service coverage", formatFixedValue(uiRatios.debt_service_coverage, 2))}
          ${row("Cashflow coverage", formatFixedValue(uiRatios.cashflow_coverage, 2))}
        </table>`
      );
    }
  }

  if (uiSummary?.kind === "bank") {
    lines.push(`<h2>Bank statement summary</h2>`);
    lines.push(
      `<table class="t">
        ${row("Bank", uiSummary.bank_name || "—")}
        ${row("Account holder", uiSummary.account_holder_name || "—")}
        ${row("Account number", uiSummary.account_number || "—")}
        ${row(
          "Statement period",
          `${uiSummary.statement_period_start || "—"}${uiSummary.statement_period_end ? ` to ${uiSummary.statement_period_end}` : ""}`
        )}
        ${row("Currency", uiSummary.currency || "—")}
        ${row("Opening balance", formatNumberValue(uiSummary.opening_balance))}
        ${row("Closing balance", formatNumberValue(uiSummary.closing_balance))}
        ${row("Total credits", formatNumberValue(uiSummary.total_credits))}
        ${row("Total debits", formatNumberValue(uiSummary.total_debits))}
      </table>`
    );

    if (uiRatios?.kind === "bank") {
      lines.push(`<h2>Bank cashflow metrics</h2>`);
      lines.push(
        `<table class="t">
          ${row("Net cash flow", formatNumberValue(uiRatios.net_cash_flow))}
          ${row("Inflow / outflow ratio", formatFixedValue(uiRatios.inflow_to_outflow_ratio, 2))}
          ${row("Closing vs opening balance", formatFixedValue(uiRatios.closing_to_opening_balance_ratio, 2))}
        </table>`
      );
    }
  }

  if (uiSummary?.kind === "payslip") {
    lines.push(`<h2>Payslip summary</h2>`);
    lines.push(
      `<table class="t">
        ${row("Employer", uiSummary.employer_name || "—")}
        ${row("Employee", uiSummary.employee_name || "—")}
        ${row(
          "Pay period",
          `${uiSummary.pay_period_start || "—"}${uiSummary.pay_period_end ? ` to ${uiSummary.pay_period_end}` : ""}`
        )}
        ${row("Currency", uiSummary.currency || "—")}
        ${row("Gross pay", formatNumberValue(uiSummary.gross_pay))}
        ${row("Net pay", formatNumberValue(uiSummary.net_pay))}
      </table>`
    );
  }

  if (uiSummary?.kind === "address") {
    lines.push(`<h2>Proof of address summary</h2>`);
    lines.push(
      `<table class="t">
        ${row("Customer name", uiSummary.customer_name || "—")}
        ${row("Issuer", uiSummary.issuer_name || "—")}
        ${row("Issue date", uiSummary.issue_date || "—")}
        ${row("Address", uiSummary.address || "—")}
        ${row("Postal code", uiSummary.postal_code || "—")}
        ${row("Country", uiSummary.country || "—")}
      </table>`
    );
  }

  if (uiSummary?.kind === "id") {
    lines.push(`<h2>ID document summary</h2>`);
    lines.push(
      `<table class="t">
        ${row("Full name", uiSummary.full_name || "—")}
        ${row("ID number", uiSummary.id_number || "—")}
        ${row("Issuing country", uiSummary.issuing_country || "—")}
        ${row("Date of birth", uiSummary.date_of_birth || "—")}
      </table>`
    );
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

  // Your aggregator function URL
  const functionUrl = "https://5epugrqble4dg6pahfz63wx44a0caasj.lambda-url.us-east-1.on.aws/";

  useEffect(() => {
    if (!objectKey) {
      setError("Missing required query parameter: objectKey");
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
              `We couldn't load the OCR result from secure storage (HTTP ${res.status}).` +
                (text ? ` Details: ${text}` : "")
            );
          }
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        // Determine in-progress same way as classifyIssues to avoid flapping
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
          if (!inProgress) return data; // final => always take it
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
          setError("We couldn't reach the results service. Please refresh or try again.");
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

      const analysisModeRaw = agentic?.analysisMode || result?.analysisMode || null;
      const analysisModeLabel =
        analysisModeRaw === "detailed" ? "Detailed" : analysisModeRaw === "quick" ? "Quick" : analysisModeRaw || "—";

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

      const q = result?.quality || {};
      const rawConfidence = typeof q.confidence === "number" ? q.confidence : null;
      const confidencePct =
        typeof rawConfidence === "number" ? (rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence) : null;

      const html = buildPrintableHtml({
        objectKey,
        docTypeLabel,
        analysisModeLabel,
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
  const fields = Array.isArray(result?.fields) ? result.fields : [];

  const docTypeRaw = agentic?.docType ?? result?.docType ?? null;
  const docType = normalizeDocType(docTypeRaw);
  const docTypeLabel = (docType && DOC_TYPE_LABELS[docType]) || docTypeRaw || "—";

  const analysisModeRaw = agentic?.analysisMode || result?.analysisMode || null;
  const analysisMode =
    analysisModeRaw || (result?.detailed ? "detailed" : result?.quick ? "quick" : null);

  const pipelineStage =
    typeof result?.statusAudit === "string"
      ? result.statusAudit
      : result?.statusAudit && typeof result.statusAudit === "object"
      ? result.statusAudit.pipeline_stage || result.statusAudit.pipelineStage || result.statusAudit.stage || null
      : null;

  const { issues, overallStatus, inProgress } = classifyIssues(result);

  const agenticSummary =
    result?.detailed?.summary ??
    result?.detailed?.result?.summary ??
    result?.quick?.summary ??
    agentic?.summary ??
    result?.summary ??
    null;

  const riskScore = agentic?.risk_score?.score ?? result?.riskScore?.score ?? null;
  const riskBand = agentic?.risk_score?.band ?? result?.riskScore?.band ?? null;

  const q = result?.quality || {};
  const rawConfidence = typeof q.confidence === "number" ? q.confidence : null;
  const confidencePct =
    typeof rawConfidence === "number" ? (rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence) : null;

  const uiSummary = buildUiSummary(docType, agentic, fields);
  const uiRatios = buildUiRatios(docType, agentic);

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
            <p className="text-sm text-slate-600 mt-1">
              Review OCR output, AI-parsed structure, and any issues detected for this document.
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
              {inProgress
                ? "The document has been uploaded and is being processed. This page will update once results are ready."
                : "Fetching OCR result…"}
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
                    className={`px-3 py-1 rounded-full transition ${
                      activeView === "summary" ? "bg-white shadow-sm text-slate-900" : "text-slate-600"
                    }`}
                  >
                    Client view
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView("agent")}
                    className={`px-3 py-1 rounded-full transition ${
                      activeView === "agent" ? "bg-white shadow-sm text-slate-900" : "text-slate-600"
                    }`}
                  >
                    Agent view
                  </button>
                </div>
              </div>

              {activeView === "summary" && (
                <>
                  {/* Run status */}
                  <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-slate-50 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <div className="font-medium text-sm">Run status</div>
                      {formatStatusBadge(overallStatus)}
                      {pipelineStage && (
                        <span className="text-xs text-slate-500">(Pipeline stage: {pipelineStage})</span>
                      )}
                    </div>

                    {inProgress && (
                      <p className="text-sm text-slate-700">
                        The document has been uploaded and is queued for OCR and AI analysis. Results will appear here once processing completes.
                      </p>
                    )}

                    {!inProgress && issues.length === 0 && (
                      <p className="text-sm text-slate-700">
                        All processing stages completed without any detected issues.
                      </p>
                    )}

                    {!inProgress && issues.length > 0 && (
                      <>
                        <ul className="space-y-2 text-sm">
                          {issues.map((issue, idx) => (
                            <li key={idx} className="border-t border-slate-200 pt-2 first:border-t-0 first:pt-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium">{issue.stage}</span>
                                {issue.level === "error" && (
                                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-red-100 text-red-800">
                                    Error
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-slate-700">{issue.userMessage}</p>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>

                  {/* AI summary */}
                  {agenticSummary && !inProgress && (
                    <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <h2 className="text-sm font-semibold mb-2">AI summary</h2>
                      <p className="text-sm text-slate-800 whitespace-pre-wrap">{agenticSummary}</p>
                    </div>
                  )}

                  {/* Score tiles */}
                  <div className="grid gap-4 md:grid-cols-4 mb-6">
                    <div className="rounded-lg border border-[rgb(var(--border))] p-4 bg-white">
                      <div className="text-xs uppercase tracking-wide opacity-70">Risk Score</div>
                      <div className="mt-1 text-2xl font-semibold">
                        {typeof riskScore === "number" ? riskScore.toFixed(2) : "—"}
                        {riskBand && typeof riskScore === "number" && (
                          <span className="ml-2 text-sm font-normal uppercase tracking-wide text-slate-600">
                            ({riskBand})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg border border-[rgb(var(--border))] p-4 bg-white">
                      <div className="text-xs uppercase tracking-wide opacity-70">Confidence</div>
                      <div className="mt-1 text-2xl font-semibold">
                        {confidencePct != null ? `${confidencePct.toFixed(1)}%` : "—"}
                      </div>
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

                  {/* Financial statement summary (restore what you had: include totals) */}
                  {uiSummary?.kind === "financials" && !inProgress && (
                    <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <h2 className="text-sm font-semibold mb-3">Financial statement summary</h2>

                      <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Entity</div>
                          <div className="font-medium">{uiSummary.entity_name || "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Reporting Period</div>
                          <div className="font-medium">
                            {uiSummary.period_start || "—"} {uiSummary.period_end ? `to ${uiSummary.period_end}` : ""}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Currency</div>
                          <div className="font-medium">{uiSummary.currency || "—"}</div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Revenue</div>
                          <div className="font-medium">{formatNumberValue(uiSummary.revenue)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">EBITDA</div>
                          <div className="font-medium">{formatNumberValue(uiSummary.ebitda)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Net profit</div>
                          <div className="font-medium">{formatNumberValue(uiSummary.net_profit)}</div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Total assets</div>
                          <div className="font-medium">{formatNumberValue(uiSummary.total_assets)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Total liabilities</div>
                          <div className="font-medium">{formatNumberValue(uiSummary.total_liabilities)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Equity</div>
                          <div className="font-medium">{formatNumberValue(uiSummary.equity)}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank statement summary (keep stable surface) */}
                  {uiSummary?.kind === "bank" && !inProgress && (
                    <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <h2 className="text-sm font-semibold mb-3">Bank statement summary</h2>

                      <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Bank Name</div>
                          <div className="font-medium">{uiSummary.bank_name || "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Account Holder Name</div>
                          <div className="font-medium">{uiSummary.account_holder_name || "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Account Number</div>
                          <div className="font-medium">{uiSummary.account_number || "—"}</div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Statement Period</div>
                          <div className="font-medium">
                            {uiSummary.statement_period_start || "—"}{" "}
                            {uiSummary.statement_period_end ? `to ${uiSummary.statement_period_end}` : ""}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Currency</div>
                          <div className="font-medium">{uiSummary.currency || "—"}</div>
                        </div>
                        <div />
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-4 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Opening Balance</div>
                          <div className="font-medium">{formatNumberValue(uiSummary.opening_balance)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Closing Balance</div>
                          <div className="font-medium">{formatNumberValue(uiSummary.closing_balance)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Total Credits</div>
                          <div className="font-medium">{formatNumberValue(uiSummary.total_credits)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Total Debits</div>
                          <div className="font-medium">{formatNumberValue(uiSummary.total_debits)}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payslip summary (stable) */}
                  {uiSummary?.kind === "payslip" && !inProgress && (
                    <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <h2 className="text-sm font-semibold mb-3">Payslip summary</h2>

                      <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Employer Name</div>
                          <div className="font-medium">{uiSummary.employer_name || "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Employee Name</div>
                          <div className="font-medium">{uiSummary.employee_name || "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Pay Period</div>
                          <div className="font-medium">
                            {uiSummary.pay_period_start || "—"} {uiSummary.pay_period_end ? `to ${uiSummary.pay_period_end}` : ""}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Currency</div>
                          <div className="font-medium">{uiSummary.currency || "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Gross Pay</div>
                          <div className="font-medium">{formatNumberValue(uiSummary.gross_pay)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Net Pay</div>
                          <div className="font-medium">{formatNumberValue(uiSummary.net_pay)}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Proof of address summary (stable) */}
                  {uiSummary?.kind === "address" && !inProgress && (
                    <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <h2 className="text-sm font-semibold mb-3">Proof of address summary</h2>

                      <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Customer name</div>
                          <div className="font-medium">{uiSummary.customer_name || "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Issuing institution</div>
                          <div className="font-medium">{uiSummary.issuer_name || "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Issue date</div>
                          <div className="font-medium">{uiSummary.issue_date || "—"}</div>
                        </div>
                      </div>

                      <div className="mt-4 text-sm">
                        <div className="text-slate-500 text-xs uppercase">Address</div>
                        <div className="font-medium whitespace-pre-wrap">{uiSummary.address || "—"}</div>
                      </div>
                    </div>
                  )}

                  {/* Ratios blocks (as you already had) */}
                  {uiRatios?.kind === "financials" && !inProgress && docType === "financial_statements" && (
                    <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <h2 className="text-sm font-semibold mb-3">Key ratios (from statements)</h2>
                      <div className="grid gap-4 md:grid-cols-4 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Current ratio</div>
                          <div className="font-medium">{formatFixedValue(uiRatios.current_ratio, 2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Quick ratio</div>
                          <div className="font-medium">{formatFixedValue(uiRatios.quick_ratio, 2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Debt to equity</div>
                          <div className="font-medium">{formatFixedValue(uiRatios.debt_to_equity, 2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Interest cover</div>
                          <div className="font-medium">{formatFixedValue(uiRatios.interest_cover, 2)}</div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-4 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Net margin</div>
                          <div className="font-medium">{formatFixedValue(uiRatios.net_margin, 2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Return on assets</div>
                          <div className="font-medium">{formatFixedValue(uiRatios.return_on_assets, 2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Debt service coverage</div>
                          <div className="font-medium">{formatFixedValue(uiRatios.debt_service_coverage, 2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Cashflow coverage</div>
                          <div className="font-medium">{formatFixedValue(uiRatios.cashflow_coverage, 2)}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {uiRatios?.kind === "bank" && !inProgress && docType === "bank_statements" && (
                    <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <h2 className="text-sm font-semibold mb-3">Bank statement cashflow metrics</h2>
                      <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Net cash flow</div>
                          <div className="font-medium">{formatNumberValue(uiRatios.net_cash_flow)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Inflow / outflow ratio</div>
                          <div className="font-medium">{formatFixedValue(uiRatios.inflow_to_outflow_ratio, 2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Closing vs opening balance</div>
                          <div className="font-medium">{formatFixedValue(uiRatios.closing_to_opening_balance_ratio, 2)}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fields table */}
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
                              {inProgress
                                ? "Structured fields will appear here once analysis completes."
                                : "No structured fields found. Check the raw JSON download for more details."}
                            </td>
                          </tr>
                        )}
                        {fields.map((f, idx) => (
                          <tr key={idx} className="odd:bg-slate-50/50">
                            <td className="p-3 border-b border-[rgb(var(--border))]">{f.name}</td>
                            <td className="p-3 border-b border-[rgb(var(--border))] whitespace-pre-wrap">
                              {f.value ?? "—"}
                            </td>
                            <td className="p-3 border-b border-[rgb(var(--border))]">
                              {typeof f.confidence === "number" ? `${(f.confidence * 100).toFixed(1)}%` : f.confidence ?? "—"}
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
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[rgb(var(--border))] bg-white"
                      onClick={handleDownloadJson}
                    >
                      <Download className="h-4 w-4" />
                      Download raw JSON
                    </button>
                  </div>
                </>
              )}

              {/* Buttons (same set) */}
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




