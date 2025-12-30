function deriveAgenticFromResult(result) {
  if (!result) {
    return { agentic: null, rawAgentic: null, detailedEnvelope: null };
  }

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
  if (topAgentic) {
    return { agentic: topAgentic, rawAgentic: topAgentic, detailedEnvelope };
  }

  /**
   * IMPORTANT:
   * Your current aggregator returns "detailed" as the actual payload:
   *   detailed: { summary, structured, ratios, risk_score, ... }
   * (not wrapped in detailed.result).
   *
   * So we must treat detailedEnvelope itself as a candidate.
   */
  const candidates = [
    detailedEnvelope, // <-- NEW: direct detailed payload
    detailedEnvelope?.result, // common: { summary, structured, ratios, ... }
    detailedEnvelope?.result?.result, // double-wrapped
    detailedEnvelope?.agentic, // common: detailed.agentic
    detailedEnvelope?.agentic?.result, // common: detailed.agentic.result

    // Legacy / defensive
    result?.quick,
    result?.quick?.result,
    result?.quick?.structured,
    result?.result,
    result?.result?.result,
  ]
    .map(asObj)
    .filter(Boolean);

  let rawAgentic = candidates[0] || null;

  if (!rawAgentic) {
    return { agentic: null, rawAgentic: null, detailedEnvelope };
  }

  // If it's a wrapper like { docType, analysisMode, result: {...} }, merge it
  let agentic = rawAgentic;

  if (agentic && typeof agentic === "object" && agentic.result && typeof agentic.result === "object") {
    agentic = { ...agentic, ...agentic.result };
    delete agentic.result;
  }

  // Ensure docType/analysisMode/quality are present if we have the envelope
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
// src/pages/Results.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Download, Home as HomeIcon, FileText } from "lucide-react";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

/**
 * Coerce a value to an object.
 * - If object: return as-is
 * - If JSON string: parse
 * - Otherwise: null
 *
 * IMPORTANT: must be available to buildUiSummary() and classifyIssues()
 */
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

/** Treat only null/undefined/NaN as missing. Preserve 0. */
function toNumberOrNull(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    // Accept "1 200 000", "1,200,000", "(80,000)" etc.
    const s = v.trim();
    if (!s) return null;

    // Parentheses negative
    const isParenNeg = /^\(.*\)$/.test(s);
    const raw = s.replace(/^\(|\)$/g, "");

    // Remove spaces/commas
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

/**
 * Prefer defined values (including 0). Only skip null/undefined.
 */
function firstDefined(...vals) {
  for (const v of vals) {
    if (v !== null && v !== undefined) return v;
  }
  return null;
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

/**
 * Derive a unified "agentic" payload from the backend result.
 *
 * Supports multiple shapes:
 * - result.agentic (future explicit contract)
 * - result.detailed = { docType, analysisMode, quality, result: { summary, structured, ... } }
 * - legacy: result.result
 * - legacy: result.quick.result
 * - legacy: result.quick.structured
 */
function deriveAgenticFromResult(result) {
  if (!result) {
    return { agentic: null, rawAgentic: null, detailedEnvelope: null };
  }

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
  if (topAgentic) {
    return { agentic: topAgentic, rawAgentic: topAgentic, detailedEnvelope };
  }

  /**
   * IMPORTANT:
   * Your current aggregator returns "detailed" as the actual payload:
   *   detailed: { summary, structured, ratios, risk_score, ... }
   * (not wrapped in detailed.result).
   *
   * So we must treat detailedEnvelope itself as a candidate.
   */
  const candidates = [
    detailedEnvelope, // <-- NEW: direct detailed payload
    detailedEnvelope?.result, // common: { summary, structured, ratios, ... }
    detailedEnvelope?.result?.result, // double-wrapped
    detailedEnvelope?.agentic, // common: detailed.agentic
    detailedEnvelope?.agentic?.result, // common: detailed.agentic.result

    // Legacy / defensive
    result?.quick,
    result?.quick?.result,
    result?.quick?.structured,
    result?.result,
    result?.result?.result,
  ]
    .map(asObj)
    .filter(Boolean);

  let rawAgentic = candidates[0] || null;

  if (!rawAgentic) {
    return { agentic: null, rawAgentic: null, detailedEnvelope };
  }

  // If it's a wrapper like { docType, analysisMode, result: {...} }, merge it
  let agentic = rawAgentic;

  if (agentic && typeof agentic === "object" && agentic.result && typeof agentic.result === "object") {
    agentic = { ...agentic, ...agentic.result };
    delete agentic.result;
  }

  // Ensure docType/analysisMode/quality are present if we have the envelope
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


// ---- Helpers to interpret errors & run status ----

/**
 * Classifies issues and overall status for the run.
 * We explicitly handle "in progress" vs "completed" vs real failures.
 */
function classifyIssues(result) {
  if (!result) {
    return {
      issues: [],
      overallStatus: "unknown",
      inProgress: false,
      pipelineStage: null,
    };
  }

  const issues = [];
  const pipelineStage =
    typeof result.statusAudit === "string"
      ? result.statusAudit
      : result.statusAudit && typeof result.statusAudit === "object"
      ? result.statusAudit.pipeline_stage || result.statusAudit.pipelineStage || result.statusAudit.stage || null
      : null;

  // Which payloads do we actually have?
  const hasQuick = !!result.quick;
  const hasDetailed = !!result.detailed;
  const hasAnyFinalResult = hasQuick || hasDetailed;

  // Basic pieces for deeper checks
  const ocrEngine = result.ocr_engine || {};
  const docType = result.docType || null;

  // Agentic / AI payload via unified helper
  const { agentic, rawAgentic } = deriveAgenticFromResult(result);
  const agenticStatus = rawAgentic?.status ?? agentic?.status ?? "ok";

  const quality = result.quality || {};
  const qualityStatus = quality.status || null;
  const qualityDecision = quality.decision || null;
  const qualityReasons = Array.isArray(quality.reasons) ? quality.reasons : [];

  // 1) PIPELINE IN-PROGRESS / QUEUED STATE
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
    return {
      issues: [],
      overallStatus: "in_progress",
      inProgress: true,
      pipelineStage,
    };
  }

  // 2) REAL ISSUES: OCR / QUALITY / AGENTIC

  // OCR issues
  if (ocrEngine && ocrEngine.error) {
    const msg = String(ocrEngine.error || "");
    let category = "internal";
    let userMessage = "We could not reliably read text from this document. The OCR engine reported an error.";

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
      userMessage = "The document appears to be blank or has no extractable text. Please confirm the file and try again.";
    }

    issues.push({
      stage: "OCR text extraction",
      level: "error",
      category,
      userMessage,
      rawMessage: msg,
    });
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
    const msg =
      agentic?.msg || agentic?.error || rawAgentic?.msg || rawAgentic?.error || "Agentic parser error";

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

  // Suspicious-but-not-crashing: bank statements with no transactions
  if (!ocrEngine.error && agentic && agenticStatus !== "error") {
    if (docType === "bank_statements") {
      let txs = [];
      if (Array.isArray(agentic?.structured?.transactions)) txs = agentic.structured.transactions;
      if (!txs.length && Array.isArray(agentic?.transactions)) txs = agentic.transactions;

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

/**
 * Standardized ratios extraction (doc-type aware) with stable keys.
 * - Preserves 0
 * - Only returns null when truly missing
 */
function buildUiRatios(docType, agentic) {
  if (!agentic) return null;

  // Ratios live at agentic.ratios in your detailed payload.
  const r = coerceToObject(agentic?.ratios) || agentic?.ratios || null;
  if (!r || typeof r !== "object") return null;

  if (docType === "financial_statements") {
    const currentRatio = toNumberOrNull(firstDefined(r.current_ratio, r.currentRatio));
    const quickRatio = toNumberOrNull(firstDefined(r.quick_ratio, r.quickRatio));
    const debtToEquity = toNumberOrNull(
      firstDefined(r.debt_to_equity_ratio, r.debt_to_equity, r.debtToEquity, r.debtToEquityRatio)
    );
    const interestCover = toNumberOrNull(
      firstDefined(r.interest_cover, r.interest_cover_ratio, r.interestCover, r.interestCoverRatio)
    );
    const netMargin = toNumberOrNull(firstDefined(r.net_margin, r.netMargin));
    const returnOnAssets = toNumberOrNull(firstDefined(r.return_on_assets, r.roa, r.returnOnAssets));
    const debtServiceCoverage = toNumberOrNull(
      firstDefined(r.debt_service_coverage_ratio, r.dscr, r.debtServiceCoverage, r.debt_service_coverage)
    );
    const cashflowCoverage = toNumberOrNull(firstDefined(r.cash_flow_coverage_ratio, r.cashflow_coverage_ratio, r.cashflowCoverage));

    return {
      kind: "financials",
      currentRatio,
      quickRatio,
      debtToEquity,
      interestCover,
      netMargin,
      returnOnAssets,
      debtServiceCoverage,
      cashflowCoverage,
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

  // Other doc types: keep ratios available for agent view / future use
  return { kind: "generic", raw: r };
}

// ---- Build a doc-type aware UI summary from agentic JSON + fields ----
function buildUiSummary(docType, agentic, fields = []) {
  if (!agentic && !fields.length) return null;

  const getField = (name) =>
    fields.find((f) => f.name && f.name.toLowerCase() === name.toLowerCase())?.value ?? null;

  const getFieldNum = (name) => toNumberOrNull(getField(name));

  // BANK STATEMENTS
  if (docType === "bank_statements") {
    const s = coerceToObject(agentic?.structured) || agentic?.structured || {};
    const stmt = s.statement_summary || agentic?.statement_summary || s || {};

    const txs =
      (s && Array.isArray(s.transactions) && s.transactions) ||
      (Array.isArray(agentic?.transactions) ? agentic.transactions : []);

    let totalCredits = null;
    let totalDebits = null;

    // Prefer totals if present
    if (stmt.total_credits !== null && stmt.total_credits !== undefined) {
      totalCredits = toNumberOrNull(stmt.total_credits);
    }
    if (stmt.total_debits !== null && stmt.total_debits !== undefined) {
      totalDebits = toNumberOrNull(stmt.total_debits);
    }

    // Fallback: compute from txs
    if ((totalCredits === null || totalDebits === null) && txs.length) {
      let credits = 0;
      let debits = 0;
      for (const tx of txs) {
        const amount = toNumberOrNull(tx?.amount);
        if (amount === null) continue;
        if (amount >= 0) credits += amount;
        else debits += Math.abs(amount);
      }
      if (totalCredits === null) totalCredits = credits;
      if (totalDebits === null) totalDebits = debits;
    }

    return {
      kind: "bank",
      account_holder:
        firstDefined(
          stmt.account_holder_name,
          stmt.account_holder,
          stmt.account_name,
          stmt.account_name_normalised,
          getField("account_holder_name"),
          getField("account_holder")
        ) || null,
      period_start:
        firstDefined(
          stmt.statement_period_start,
          stmt.statement_start_date,
          stmt.period_start,
          getField("statement_period_start"),
          getField("statement_start_date"),
          getField("period_start")
        ) || null,
      period_end:
        firstDefined(
          stmt.statement_period_end,
          stmt.statement_end_date,
          stmt.period_end,
          getField("statement_period_end"),
          getField("statement_end_date"),
          getField("period_end")
        ) || null,
      opening_balance: firstDefined(toNumberOrNull(stmt.opening_balance), getFieldNum("opening_balance")),
      closing_balance: firstDefined(toNumberOrNull(stmt.closing_balance), getFieldNum("closing_balance")),
      total_credits: totalCredits !== null ? Number(totalCredits) : null,
      total_debits: totalDebits !== null ? Number(totalDebits) : null,
      currency: firstDefined(stmt.currency, getField("currency"), "ZAR"),
    };
  }

  // FINANCIAL STATEMENTS
  if (docType === "financial_statements") {
    const s = coerceToObject(agentic?.structured) || agentic?.structured || {};
    const fin = coerceToObject(s?.financials) || s?.financials || null;

    const income =
      s?.income_statement ||
      fin?.income_statement ||
      agentic?.income_statement ||
      agentic?.financials?.income_statement ||
      {};

    const balance =
      s?.balance_sheet || fin?.balance_sheet || agentic?.balance_sheet || agentic?.financials?.balance_sheet || {};

    return {
      kind: "financials",
      entity_name: firstDefined(s?.entity_name, agentic?.entity_name, getField("entity_name"), "UNKNOWN"),
      period_start:
        firstDefined(
          s?.reporting_period_start,
          s?.period_start,
          agentic?.reporting_period_start,
          agentic?.period_start,
          getField("reporting_period_start"),
          getField("period_start")
        ) || null,
      period_end:
        firstDefined(
          s?.reporting_period_end,
          s?.period_end,
          agentic?.reporting_period_end,
          agentic?.period_end,
          getField("reporting_period_end"),
          getField("period_end")
        ) || null,
      currency: firstDefined(s?.currency, agentic?.currency, getField("currency"), "ZAR"),

      // Numbers: preserve 0, only null when truly missing
      revenue: firstDefined(toNumberOrNull(income?.revenue), getFieldNum("revenue")),
      ebitda: firstDefined(toNumberOrNull(income?.ebitda), getFieldNum("ebitda")),
      net_profit: firstDefined(
        toNumberOrNull(income?.profit_after_tax),
        toNumberOrNull(income?.net_profit),
        toNumberOrNull(income?.netIncome),
        toNumberOrNull(income?.net_income),
        getFieldNum("profit_after_tax"),
        getFieldNum("net_profit"),
        getFieldNum("net_income")
      ),
      total_assets: firstDefined(
        toNumberOrNull(balance?.assets_total),
        toNumberOrNull(balance?.total_assets),
        toNumberOrNull(balance?.totalAssets),
        getFieldNum("assets_total"),
        getFieldNum("total_assets"),
        getFieldNum("totalAssets")
      ),
      total_liabilities: firstDefined(
        toNumberOrNull(balance?.liabilities_total),
        toNumberOrNull(balance?.total_liabilities),
        toNumberOrNull(balance?.totalLiabilities),
        getFieldNum("liabilities_total"),
        getFieldNum("total_liabilities"),
        getFieldNum("totalLiabilities")
      ),
      equity: firstDefined(toNumberOrNull(balance?.equity), getFieldNum("equity")),
    };
  }

  // PAYSLIPS
  if (docType === "payslips") {
    const s = coerceToObject(agentic?.structured) || agentic?.structured || {};

    const periodStart = s.pay_period_start || null;
    const periodEnd = s.pay_period_end || null;
    const periodLabel = periodStart && periodEnd ? `${periodStart} to ${periodEnd}` : null;

    const grossPay = firstDefined(toNumberOrNull(s.gross_pay), getFieldNum("gross_pay"), getFieldNum("Gross Pay"));
    const netPay = firstDefined(toNumberOrNull(s.net_pay), getFieldNum("net_pay"), getFieldNum("Net Pay"));

    return {
      kind: "payslip",
      employee_name: firstDefined(s.employee_name, getField("employee_name"), getField("Employee Name"), getField("Employee")) || null,
      employer_name: firstDefined(s.employer_name, getField("employer_name"), getField("Employer Name"), getField("Employer")) || null,
      period_label: periodLabel || null,
      gross_pay: grossPay,
      net_pay: netPay,
      currency: firstDefined(s.currency, getField("currency"), "ZAR"),
    };
  }

  // ID DOCUMENTS (standardize: structured-first, then fields)
  if (docType === "id_documents") {
    const s = coerceToObject(agentic?.structured) || agentic?.structured || {};
    return {
      kind: "id",
      first_names:
        firstDefined(
          s.first_names,
          s.given_names,
          getField("First Name(s)"),
          getField("First Names"),
          getField("Given Names")
        ) || null,
      surname: firstDefined(s.surname, s.last_name, getField("Surname"), getField("Last Name")) || null,
      id_type: firstDefined(s.id_type, getField("ID Type")) || null,
      id_number:
        firstDefined(s.id_number, s.identity_number, s.passport_number, getField("ID Number"), getField("Identity Number"), getField("Passport Number")) ||
        null,
      issuing_country: firstDefined(s.issuing_country, s.country, getField("Issuing Country"), getField("Country"), getField("Nationality")) || null,
      date_of_birth: firstDefined(s.date_of_birth, s.dob, getField("Date of Birth"), getField("DOB")) || null,
    };
  }

  // PROOF OF ADDRESS
  if (docType === "proof_of_address") {
    const s = coerceToObject(agentic?.structured) || agentic?.structured || {};
    const addressLines = Array.isArray(s.address_lines) ? s.address_lines : [];

    const line1 = addressLines[0] || null;
    const line2 = addressLines.length > 1 ? addressLines.slice(1).join(", ") : null;

    return {
      kind: "address",
      holder_name:
        firstDefined(
          s.customer_name,
          getField("customer_name"),
          getField("Customer Name"),
          getField("Account Holder Name"),
          getField("Address Holder Name")
        ) || null,
      holder_type: getField("Holder Type") || null,
      address_line_1: firstDefined(line1, getField("address_line_1"), getField("Address Line 1"), getField("Address1")) || null,
      address_line_2: firstDefined(line2, getField("address_line_2"), getField("Address Line 2"), getField("Address2")) || null,
      city: getField("City / Town") || getField("City") || null,
      province: getField("Province / State") || getField("Province") || getField("State") || null,
      postal_code: firstDefined(s.postal_code, getField("postal_code"), getField("Postal Code"), getField("Postcode")) || null,
      country: firstDefined(s.country, getField("Country")) || null,
      proof_entity_name: firstDefined(s.issuer_name, getField("issuer_name"), getField("Proof Entity Name"), getField("Provider"), getField("Issuer")) || null,
      document_issue_date: firstDefined(s.issue_date, getField("issue_date"), getField("Document Issue Date"), getField("Issue Date")) || null,
    };
  }

  return null;
}

function buildPrintableHtml({
  objectKey,
  docTypeLabel,
  analysisMode,
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
          ${row("Interest cover", uiRatios.interestCover != null ? formatFixed(uiRatios.interestCover, 2) : "—")}
          ${row("Net margin", uiRatios.netMargin != null ? formatFixed(uiRatios.netMargin, 2) : "—")}
          ${row("Return on assets", uiRatios.returnOnAssets != null ? formatFixed(uiRatios.returnOnAssets, 2) : "—")}
          ${row("Debt service coverage", uiRatios.debtServiceCoverage != null ? formatFixed(uiRatios.debtServiceCoverage, 2) : "—")}
          ${row("Cashflow coverage", uiRatios.cashflowCoverage != null ? formatFixed(uiRatios.cashflowCoverage, 2) : "—")}
        </table>`
      );
    }
  }

  if (uiSummary?.kind === "bank") {
    lines.push(`<h2>Bank Statement Summary</h2>`);
    lines.push(
      `<table class="t">
        ${row("Account Holder", uiSummary.account_holder || "—")}
        ${row("Statement Period", `${uiSummary.period_start || "—"}${uiSummary.period_end ? ` to ${uiSummary.period_end}` : ""}`)}
        ${row("Currency", uiSummary.currency || "—")}
        ${row("Opening Balance", uiSummary.opening_balance != null ? formatNumber(uiSummary.opening_balance) : "—")}
        ${row("Closing Balance", uiSummary.closing_balance != null ? formatNumber(uiSummary.closing_balance) : "—")}
        ${row("Total Credits", uiSummary.total_credits != null ? formatNumber(uiSummary.total_credits) : "—")}
        ${row("Total Debits", uiSummary.total_debits != null ? formatNumber(uiSummary.total_debits) : "—")}
      </table>`
    );

    if (uiRatios?.kind === "bank") {
      lines.push(`<h2>Bank Cashflow Metrics</h2>`);
      lines.push(
        `<table class="t">
          ${row("Net cash flow", uiRatios.netCashFlow != null ? formatNumber(uiRatios.netCashFlow) : "—")}
          ${row("Inflow / outflow ratio", uiRatios.inflowToOutflow != null ? formatFixed(uiRatios.inflowToOutflow, 2) : "—")}
          ${row("Closing vs opening balance", uiRatios.closingToOpening != null ? formatFixed(uiRatios.closingToOpening, 2) : "—")}
        </table>`
      );
    }
  }

  if (uiSummary?.kind === "payslip") {
    lines.push(`<h2>Payslip Summary</h2>`);
    lines.push(
      `<table class="t">
        ${row("Employee", uiSummary.employee_name || "—")}
        ${row("Employer", uiSummary.employer_name || "—")}
        ${row("Period", uiSummary.period_label || "—")}
        ${row("Currency", uiSummary.currency || "—")}
        ${row("Gross pay", uiSummary.gross_pay != null ? formatNumber(uiSummary.gross_pay) : "—")}
        ${row("Net pay", uiSummary.net_pay != null ? formatNumber(uiSummary.net_pay) : "—")}
      </table>`
    );
  }

  if (uiSummary?.kind === "id") {
    lines.push(`<h2>ID / Passport Summary</h2>`);
    lines.push(
      `<table class="t">
        ${row("First name(s)", uiSummary.first_names || "—")}
        ${row("Surname", uiSummary.surname || "—")}
        ${row("Date of birth", uiSummary.date_of_birth || "—")}
        ${row("ID type", uiSummary.id_type || "—")}
        ${row("ID / Passport number", uiSummary.id_number || "—")}
        ${row("Issuing country", uiSummary.issuing_country || "—")}
      </table>`
    );
  }

  if (uiSummary?.kind === "address") {
    const address = [
      uiSummary.address_line_1,
      uiSummary.address_line_2,
      [uiSummary.city, uiSummary.province, uiSummary.postal_code].filter(Boolean).join(" "),
    ]
      .filter(Boolean)
      .join("\n");

    lines.push(`<h2>Proof of Address Summary</h2>`);
    lines.push(
      `<table class="t">
        ${row("Address holder", uiSummary.holder_name || "—")}
        ${row("Holder type", uiSummary.holder_type || "—")}
        ${row("Country", uiSummary.country || "—")}
        ${row("Provider / Issuer", uiSummary.proof_entity_name || "—")}
        ${row("Issue date", uiSummary.document_issue_date || "—")}
      </table>`
    );
    lines.push(`<h3>Address</h3>`);
    lines.push(`<pre class="summary">${esc(address || "—")}</pre>`);
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
      h3 { margin: 14px 0 6px 0; font-size: 12px; }
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
      // Auto-open print dialog; user can "Save as PDF"
      window.onload = () => { setTimeout(() => window.print(), 250); };
    </script>
  </body>
</html>`;
}

export default function Results() {
  const query = useQuery();
  const objectKey = query.get("objectKey");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // view toggle – "summary" (client) vs "agent"
  const [activeView, setActiveView] = useState("summary");

  // Aggregator function URL
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
          console.warn(`Result fetch not OK (status ${res.status}), attempt ${attempt}/${maxAttempts}`);

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
          if (!inProgress) return data; // final → always take it
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
      } catch (err) {
        console.error("Failed to load OCR result", err);
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
    } catch (err) {
      console.error("Download JSON failed", err);
      alert("Could not download JSON. Please try again.");
    }
  }

  /**
   * “Download Summary (PDF)” implemented without extra dependencies:
   * - Opens a print-friendly window
   * - Automatically opens the print dialog
   * - User selects “Save as PDF”
   *
   * This makes the button functional immediately without changing the backend.
   */
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
      const confidencePct =
        typeof rawConfidence === "number" ? (rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence) : null;

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
    } catch (err) {
      console.error("Download PDF failed", err);
      alert("Could not generate the PDF summary. Please try again.");
    }
  }

  // Agentic payload
  const { agentic } = deriveAgenticFromResult(result);

  // High-level fields from stub / aggregator
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

  const uiSummary = buildUiSummary(docType, agentic, fields);
  const uiRatios = buildUiRatios(docType, agentic);

  // Classification & risk
  const classification = agentic?.classification || null;
  const riskScore = agentic?.risk_score?.score ?? result?.riskScore?.score ?? null;
  const riskBand = agentic?.risk_score?.band ?? result?.riskScore?.band ?? null;

  // Confidence: normalize 0–1 or 0–100 into a percent
  const quality = result?.quality || {};
  const rawConfidence = typeof quality.confidence === "number" ? quality.confidence : null;
  const confidencePct = typeof rawConfidence === "number" ? (rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence) : null;
  const qualityStatus = quality.status || null;

  // Analysis mode from backend / agentic (with fallback)
  const analysisModeRaw = agentic?.analysisMode || result?.analysisMode || null;
  const analysisMode = analysisModeRaw || (result?.detailed ? "detailed" : result?.quick ? "quick" : null);

  const { issues, overallStatus, inProgress } = classifyIssues(result);

  // Summary selection aligned to current backend contract:
  const agenticSummary =
    result?.detailed?.summary ??
    result?.detailed?.result?.summary ??
    result?.quick?.summary ??
    agentic?.summary ??
    result?.summary ??
    null;

  // Bank-statement ratios panel values
  const bankNetCashFlow = uiRatios?.kind === "bank" ? uiRatios.netCashFlow : null;
  const bankInflowToOutflow = uiRatios?.kind === "bank" ? uiRatios.inflowToOutflow : null;
  const bankClosingToOpening = uiRatios?.kind === "bank" ? uiRatios.closingToOpening : null;

  // Financial-statement ratios panel values
  const currentRatio = uiRatios?.kind === "financials" ? uiRatios.currentRatio : null;
  const quickRatio = uiRatios?.kind === "financials" ? uiRatios.quickRatio : null;
  const debtToEquity = uiRatios?.kind === "financials" ? uiRatios.debtToEquity : null;
  const interestCover = uiRatios?.kind === "financials" ? uiRatios.interestCover : null;
  const netMargin = uiRatios?.kind === "financials" ? uiRatios.netMargin : null;
  const returnOnAssets = uiRatios?.kind === "financials" ? uiRatios.returnOnAssets : null;
  const debtServiceCoverage = uiRatios?.kind === "financials" ? uiRatios.debtServiceCoverage : null;
  const cashflowCoverage = uiRatios?.kind === "financials" ? uiRatios.cashflowCoverage : null;

  // Optional generic scores block
  const genericScores = agentic?.scores && typeof agentic.scores === "object" ? agentic.scores : null;

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
                : "Fetching OCR result… this usually takes a few seconds."}
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
              {/* View toggle */}
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

              {/* ───────────────────────────── CLIENT / SUMMARY VIEW ───────────────────────────── */}
              {activeView === "summary" && (
                <>
                  {/* Run status / issues */}
                  <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-slate-50 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <div className="font-medium text-sm">Run status</div>
                      {formatStatusBadge(overallStatus)}
                      {pipelineStage && <span className="text-xs text-slate-500">(Pipeline stage: {pipelineStage})</span>}
                      {qualityStatus && !inProgress && <span className="text-xs text-slate-500">• Quality status: {qualityStatus}</span>}
                    </div>

                    {inProgress && (
                      <p className="text-sm text-slate-700">
                        The document has been uploaded and is queued for OCR and AI analysis. Results will appear here once processing completes.
                      </p>
                    )}

                    {!inProgress && issues.length === 0 && (
                      <p className="text-sm text-slate-700">All processing stages completed without any detected issues.</p>
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
                              <p className="mt-1 text-slate-700">{issue.userMessage}</p>
                            </li>
                          ))}
                        </ul>

                        <details className="mt-3 text-xs text-slate-600">
                          <summary className="cursor-pointer underline underline-offset-2">Technical details (for support teams)</summary>
                          <pre className="mt-2 max-h-48 overflow-auto rounded bg-slate-900 text-slate-100 p-2 text-[11px]">
                            {JSON.stringify(issues, null, 2)}
                          </pre>
                        </details>
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

                  {/* Summary cards */}
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

                  {/* Doc-type aware summary */}
                  {uiSummary && !inProgress && (
                    <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <h2 className="text-sm font-semibold mb-3">
                        {uiSummary.kind === "bank" && "Bank statement summary"}
                        {uiSummary.kind === "financials" && "Financial statement summary"}
                        {uiSummary.kind === "payslip" && "Payslip summary"}
                        {uiSummary.kind === "id" && "ID / Passport summary"}
                        {uiSummary.kind === "address" && "Proof of address summary"}
                        {!uiSummary.kind && "Document summary"}
                      </h2>

                      {/* BANK STATEMENTS */}
                      {uiSummary.kind === "bank" && (
                        <>
                          <div className="grid gap-4 md:grid-cols-3 text-sm">
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Account Holder</div>
                              <div className="font-medium">{uiSummary.account_holder || "—"}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Statement Period</div>
                              <div className="font-medium">
                                {uiSummary.period_start || "—"} {uiSummary.period_end ? `to ${uiSummary.period_end}` : ""}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Currency</div>
                              <div className="font-medium">{uiSummary.currency || "—"}</div>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-4 text-sm">
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Opening Balance</div>
                              <div className="font-medium">{uiSummary.opening_balance != null ? formatNumber(uiSummary.opening_balance) : "—"}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Closing Balance</div>
                              <div className="font-medium">{uiSummary.closing_balance != null ? formatNumber(uiSummary.closing_balance) : "—"}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Total Credits</div>
                              <div className="font-medium">{uiSummary.total_credits != null ? formatNumber(uiSummary.total_credits) : "—"}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Total Debits</div>
                              <div className="font-medium">{uiSummary.total_debits != null ? formatNumber(uiSummary.total_debits) : "—"}</div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* FINANCIAL STATEMENTS */}
                      {uiSummary.kind === "financials" && (
                        <>
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

                          <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Total assets</div>
                              <div className="font-medium">{uiSummary.total_assets != null ? formatNumber(uiSummary.total_assets) : "—"}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Total liabilities</div>
                              <div className="font-medium">{uiSummary.total_liabilities != null ? formatNumber(uiSummary.total_liabilities) : "—"}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Equity</div>
                              <div className="font-medium">{uiSummary.equity != null ? formatNumber(uiSummary.equity) : "—"}</div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* PAYSLIP SUMMARY */}
                      {uiSummary.kind === "payslip" && (
                        <>
                          <div className="grid gap-4 md:grid-cols-3 text-sm">
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Employee</div>
                              <div className="font-medium">{uiSummary.employee_name || "—"}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Employer</div>
                              <div className="font-medium">{uiSummary.employer_name || "—"}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Period</div>
                              <div className="font-medium">{uiSummary.period_label || "—"}</div>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm">
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Gross pay</div>
                              <div className="font-medium">{uiSummary.gross_pay != null ? formatNumber(uiSummary.gross_pay) : "—"}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Net pay</div>
                              <div className="font-medium">{uiSummary.net_pay != null ? formatNumber(uiSummary.net_pay) : "—"}</div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* ID SUMMARY */}
                      {uiSummary.kind === "id" && (
                        <>
                          <div className="grid gap-4 md:grid-cols-3 text-sm">
                            <div>
                              <div className="text-slate-500 text-xs uppercase">First name(s)</div>
                              <div className="font-medium">{uiSummary.first_names || "—"}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Surname</div>
                              <div className="font-medium">{uiSummary.surname || "—"}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Date of birth</div>
                              <div className="font-medium">{uiSummary.date_of_birth || "—"}</div>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
                            <div>
                              <div className="text-slate-500 text-xs uppercase">ID type</div>
                              <div className="font-medium">{uiSummary.id_type || "—"}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">ID / Passport number</div>
                              <div className="font-medium">{uiSummary.id_number || "—"}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Issuing country</div>
                              <div className="font-medium">{uiSummary.issuing_country || "—"}</div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* PROOF OF ADDRESS SUMMARY */}
                      {uiSummary.kind === "address" && (
                        <>
                          <div className="grid gap-4 md:grid-cols-3 text-sm">
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Address holder</div>
                              <div className="font-medium">{uiSummary.holder_name || "—"}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Holder type</div>
                              <div className="font-medium">{uiSummary.holder_type || "—"}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Country</div>
                              <div className="font-medium">{uiSummary.country || "—"}</div>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
                            <div className="md:col-span-2">
                              <div className="text-slate-500 text-xs uppercase">Address</div>
                              <div className="font-medium whitespace-pre-line">
                                {uiSummary.address_line_1 || "—"}
                                {uiSummary.address_line_2 ? `\n${uiSummary.address_line_2}` : ""}
                                {(uiSummary.city || uiSummary.province || uiSummary.postal_code) && "\n"}
                                {uiSummary.city || ""}
                                {uiSummary.city && uiSummary.province ? ", " : ""}
                                {uiSummary.province || ""}
                                {(uiSummary.city || uiSummary.province) && uiSummary.postal_code ? " " : ""}
                                {uiSummary.postal_code || ""}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">Provider / Issuer</div>
                              <div className="font-medium">{uiSummary.proof_entity_name || "—"}</div>
                              <div className="mt-2 text-slate-500 text-xs uppercase">Issue date</div>
                              <div className="font-medium">{uiSummary.document_issue_date || "—"}</div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Bank-statement ratios panel */}
                  {uiRatios?.kind === "bank" && !inProgress && docType === "bank_statements" && (
                    <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <h2 className="text-sm font-semibold mb-3">Bank statement cashflow metrics</h2>
                      <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Net cash flow</div>
                          <div className="font-medium">{bankNetCashFlow != null ? formatNumber(bankNetCashFlow) : "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Inflow / outflow ratio</div>
                          <div className="font-medium">{bankInflowToOutflow != null ? formatFixed(bankInflowToOutflow, 2) : "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Closing vs opening balance</div>
                          <div className="font-medium">{bankClosingToOpening != null ? formatFixed(bankClosingToOpening, 2) : "—"}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Financial-statement ratios panel */}
                  {uiRatios?.kind === "financials" && !inProgress && docType === "financial_statements" && (
                    <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <h2 className="text-sm font-semibold mb-3">Key ratios (from statements)</h2>
                      <div className="grid gap-4 md:grid-cols-4 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Current ratio</div>
                          <div className="font-medium">{currentRatio != null ? formatFixed(currentRatio, 2) : "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Quick ratio</div>
                          <div className="font-medium">{quickRatio != null ? formatFixed(quickRatio, 2) : "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Debt to equity</div>
                          <div className="font-medium">{debtToEquity != null ? formatFixed(debtToEquity, 2) : "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Interest cover</div>
                          <div className="font-medium">{interestCover != null ? formatFixed(interestCover, 2) : "—"}</div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-4 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Net margin</div>
                          <div className="font-medium">{netMargin != null ? formatFixed(netMargin, 2) : "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Return on assets</div>
                          <div className="font-medium">{returnOnAssets != null ? formatFixed(returnOnAssets, 2) : "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Debt service coverage</div>
                          <div className="font-medium">{debtServiceCoverage != null ? formatFixed(debtServiceCoverage, 2) : "—"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">Cashflow coverage</div>
                          <div className="font-medium">{cashflowCoverage != null ? formatFixed(cashflowCoverage, 2) : "—"}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Raw parsed fields table */}
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

              {/* ───────────────────────────── AGENT VIEW ───────────────────────────── */}
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

                  <div className="mb-4 grid gap-4 md:grid-cols-4 text-sm">
                    <div className="rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <div className="text-slate-500 text-xs uppercase">Risk score</div>
                      <div className="mt-1 text-2xl font-semibold">{typeof riskScore === "number" ? riskScore.toFixed(2) : "—"}</div>
                      <div className="mt-1 text-xs text-slate-600">Band: {riskBand || "—"}</div>
                    </div>
                    <div className="rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <div className="text-slate-500 text-xs uppercase">Confidence</div>
                      <div className="mt-1 text-2xl font-semibold">{confidencePct != null ? confidencePct.toFixed(1) + "%" : "—"}</div>
                    </div>
                    <div className="rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <div className="text-slate-500 text-xs uppercase">Document</div>
                      <div className="mt-1 text-lg font-semibold">{docTypeLabel}</div>
                      <div className="mt-1 text-xs text-slate-600">
                        Mode: {analysisMode === "detailed" ? "Detailed" : analysisMode === "quick" ? "Quick" : inProgress ? "Processing" : "—"}
                      </div>
                    </div>
                    <div className="rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <div className="text-slate-500 text-xs uppercase">Period</div>
                      <div className="mt-1 text-sm font-medium">
                        {uiSummary?.period_start || "—"}
                        {uiSummary?.period_end ? ` → ${uiSummary.period_end}` : ""}
                      </div>
                    </div>
                  </div>

                  {genericScores && !inProgress && (
                    <div className="mb-4 rounded-lg border border-[rgb(var(--border))] bg-white p-4 text-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold">Model scores</h2>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-xs">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="text-left p-2 border-b border-[rgb(var(--border))]">Metric</th>
                              <th className="text-left p-2 border-b border-[rgb(var(--border))]">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(genericScores).map(([key, value]) => (
                              <tr key={key} className="odd:bg-slate-50/50">
                                <td className="p-2 border-b border-[rgb(var(--border))]">{key}</td>
                                <td className="p-2 border-b border-[rgb(var(--border))]">
                                  {typeof value === "number" ? value.toFixed(4) : String(value)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-3">
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


