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

/**
 * Number formatting helpers.
 * Rule:
 * - show "—" only for null/undefined/non-finite
 * - show 0 if the value is 0
 */
function toFiniteNumber(v) {
  if (v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;

  // strings like "1 200 000" or "1,200,000"
  const s = String(v).trim();
  if (!s) return null;

  const normalized = s.replace(/,/g, "").replace(/\s+/g, "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function fmtNum(v, locale = "en-ZA") {
  const n = toFiniteNumber(v);
  return n == null ? "—" : n.toLocaleString(locale);
}

function fmtFixed(v, digits = 2) {
  const n = toFiniteNumber(v);
  return n == null ? "—" : Number(n).toFixed(digits);
}

/**
 * Derive a unified "agentic" payload from the backend result.
 *
 * Supports multiple shapes:
 * - result.agentic (future explicit contract)
 * - result.detailed = {
 *     docType,
 *     analysisMode,
 *     quality,
 *     result: { summary, structured, classification, ratios, risk_score, scores, ... }
 *   }
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

  // Detect when `result.detailed` itself is the agentic payload (your current financial_statements shape)
  const detailedAsAgentic = asObj(detailedEnvelope);
  const detailedLooksLikeAgentic =
    detailedAsAgentic &&
    typeof detailedAsAgentic === "object" &&
    // typical agentic payload keys
    (typeof detailedAsAgentic.summary === "string" ||
      typeof detailedAsAgentic.status === "string" ||
      typeof detailedAsAgentic.mode === "string" ||
      typeof detailedAsAgentic.lambda_version === "string" ||
      typeof detailedAsAgentic.structured === "object" ||
      typeof detailedAsAgentic.ratios === "object" ||
      typeof detailedAsAgentic.risk_score === "object");

  // Candidate locations for the detailed S3 payload (these vary by aggregator implementations)
  const candidates = [
    // IMPORTANT: accept detailed itself when it already contains the payload
    detailedLooksLikeAgentic ? detailedAsAgentic : null,

    // common envelope: { docType, analysisMode, quality, result: {...} }
    detailedEnvelope?.result,
    detailedEnvelope?.result?.result,

    // other variants
    detailedEnvelope?.agentic,
    detailedEnvelope?.agentic?.result,

    // legacy
    result?.quick?.result,
    result?.quick?.structured,
    result?.result,
    result?.result?.result,
  ]
    .map(asObj)
    .filter(Boolean);

  const rawAgentic = candidates[0] || null;

  if (!rawAgentic) {
    return { agentic: null, rawAgentic: null, detailedEnvelope };
  }

  // Unwrap if it's a wrapper like { result: {...} }
  let agentic = rawAgentic;
  if (
    agentic &&
    typeof agentic === "object" &&
    agentic.result &&
    typeof agentic.result === "object"
  ) {
    agentic = { ...agentic, ...agentic.result };
    delete agentic.result;
  }

  // If we came from a detailed envelope that has metadata, preserve it
  if (
    detailedEnvelope &&
    typeof detailedEnvelope === "object" &&
    // only apply envelope metadata if it actually looks like an envelope
    ("docType" in detailedEnvelope ||
      "analysisMode" in detailedEnvelope ||
      "quality" in detailedEnvelope)
  ) {
    agentic = {
      docType: detailedEnvelope.docType || result.docType || agentic.docType,
      analysisMode:
        detailedEnvelope.analysisMode ||
        result.analysisMode ||
        agentic.analysisMode,
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
      ? result.statusAudit.pipeline_stage ||
        result.statusAudit.pipelineStage ||
        result.statusAudit.stage ||
        null
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

  // ───────────────────────────────────────────────
  // 1) PIPELINE IN-PROGRESS / QUEUED STATE
  // ───────────────────────────────────────────────
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

  // ───────────────────────────────────────────────
  // 2) REAL ISSUES: OCR / QUALITY / AGENTIC
  // ───────────────────────────────────────────────

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
      category,
      userMessage,
      rawMessage: msg,
    });
  }

  // ---- QUALITY decision (STOP) → real blocking error ----
  if (qualityDecision === "STOP") {
    const reasonText =
      qualityReasons.length > 0
        ? `We stopped processing because the document quality was too low: ${qualityReasons.join(
            "; "
          )}.`
        : "We stopped processing because the document quality was too low for reliable analysis.";

    issues.push({
      stage: "Quality checks",
      level: "error",
      category: "document",
      userMessage: reasonText,
      rawMessage: JSON.stringify({
        decision: qualityDecision,
        reasons: qualityReasons,
      }),
    });
  }

  // ---- Agentic / GPT issues ----
  if (agenticStatus === "error") {
    const errorType = agentic?.error_type || rawAgentic?.error_type || "";
    const msg =
      agentic?.msg ||
      agentic?.error ||
      rawAgentic?.msg ||
      rawAgentic?.error ||
      "Agentic parser error";

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
  if (!ocrEngine.error && agentic && agenticStatus !== "error") {
    if (docType === "bank_statements") {
      let txs = [];
      if (Array.isArray(agentic?.structured?.transactions)) {
        txs = agentic.structured.transactions;
      }
      if (!txs.length && Array.isArray(agentic?.transactions)) {
        txs = agentic.transactions;
      }

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
  if (issues.some((i) => i.level === "error")) {
    overallStatus = "error";
  } else if (issues.some((i) => i.level === "warning")) {
    overallStatus = "warning";
  }

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

// map backend docType → nice label
const DOC_TYPE_LABELS = {
  bank_statements: "Bank statement",
  payslips: "Payslip",
  id_documents: "ID / Passport",
  financial_statements: "Financial statements",
  proof_of_address: "Proof of address",
  generic: "Other / Generic",
};

// ---- Build a doc-type aware UI summary from agentic JSON + fields ----
function buildUiSummary(docType, agentic, fields = []) {
  if (!agentic && !fields.length) return null;

  const getField = (name) =>
    fields.find((f) => f.name && f.name.toLowerCase() === name.toLowerCase())
      ?.value ?? null;

  // BANK STATEMENTS
  if (docType === "bank_statements") {
    const stmt =
      agentic?.structured?.statement_summary ||
      agentic?.statement_summary ||
      agentic?.structured ||
      {};

    const txs =
      (agentic?.structured &&
        Array.isArray(agentic.structured.transactions) &&
        agentic.structured.transactions) ||
      (Array.isArray(agentic?.transactions) ? agentic.transactions : []);

    let totalCredits = null;
    let totalDebits = null;

    if (
      typeof stmt.total_credits === "number" ||
      typeof stmt.total_debits === "number"
    ) {
      totalCredits =
        typeof stmt.total_credits === "number" ? stmt.total_credits : null;
      totalDebits =
        typeof stmt.total_debits === "number" ? stmt.total_debits : null;
    } else if (txs.length) {
      let credits = 0;
      let debits = 0;
      for (const tx of txs) {
        const amount = toFiniteNumber(tx.amount) ?? 0;
        if (amount >= 0) credits += amount;
        else debits += Math.abs(amount);
      }
      totalCredits = credits;
      totalDebits = debits;
    }

    return {
      kind: "bank",
      account_holder:
        stmt.account_holder_name ||
        stmt.account_holder ||
        stmt.account_name ||
        stmt.account_name_normalised ||
        getField("account_holder_name") ||
        null,
      period_start:
        stmt.statement_period_start ||
        stmt.statement_start_date ||
        stmt.period_start ||
        getField("statement_period_start") ||
        null,
      period_end:
        stmt.statement_period_end ||
        stmt.statement_end_date ||
        stmt.period_end ||
        getField("statement_period_end") ||
        null,
      opening_balance:
        stmt.opening_balance != null
          ? toFiniteNumber(stmt.opening_balance)
          : getField("opening_balance") != null
          ? toFiniteNumber(getField("opening_balance"))
          : null,
      closing_balance:
        stmt.closing_balance != null
          ? toFiniteNumber(stmt.closing_balance)
          : getField("closing_balance") != null
          ? toFiniteNumber(getField("closing_balance"))
          : null,
      total_credits: totalCredits != null ? toFiniteNumber(totalCredits) : null,
      total_debits: totalDebits != null ? toFiniteNumber(totalDebits) : null,
      currency: stmt.currency || getField("currency") || "ZAR",
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
      s?.balance_sheet ||
      fin?.balance_sheet ||
      agentic?.balance_sheet ||
      agentic?.financials?.balance_sheet ||
      {};

    return {
      kind: "financials",
      entity_name:
        s?.entity_name || agentic?.entity_name || getField("entity_name") || "UNKNOWN",
      period_start:
        s?.reporting_period_start ||
        s?.period_start ||
        agentic?.reporting_period_start ||
        agentic?.period_start ||
        getField("reporting_period_start") ||
        getField("period_start") ||
        null,
      period_end:
        s?.reporting_period_end ||
        s?.period_end ||
        agentic?.reporting_period_end ||
        agentic?.period_end ||
        getField("reporting_period_end") ||
        getField("period_end") ||
        null,
      currency: s?.currency || agentic?.currency || getField("currency") || "ZAR",

      revenue: income?.revenue ?? toFiniteNumber(getField("revenue")),
      ebitda: income?.ebitda ?? toFiniteNumber(getField("ebitda")),
      net_profit:
        income?.profit_after_tax ??
        income?.net_profit ??
        income?.netIncome ??
        income?.net_income ??
        toFiniteNumber(getField("profit_after_tax")) ??
        toFiniteNumber(getField("net_profit")) ??
        toFiniteNumber(getField("net_income")) ??
        null,

      total_assets:
        balance?.assets_total ??
        balance?.total_assets ??
        balance?.totalAssets ??
        toFiniteNumber(getField("assets_total")) ??
        toFiniteNumber(getField("total_assets")) ??
        toFiniteNumber(getField("totalAssets")) ??
        null,

      total_liabilities:
        balance?.liabilities_total ??
        balance?.total_liabilities ??
        balance?.totalLiabilities ??
        toFiniteNumber(getField("liabilities_total")) ??
        toFiniteNumber(getField("total_liabilities")) ??
        toFiniteNumber(getField("totalLiabilities")) ??
        null,

      equity: balance?.equity ?? toFiniteNumber(getField("equity")) ?? null,
    };
  }

  // PAYSLIPS
  if (docType === "payslips") {
    const s = agentic?.structured || {};

    const periodStart = s.pay_period_start || null;
    const periodEnd = s.pay_period_end || null;
    const periodLabel =
      periodStart && periodEnd ? `${periodStart} to ${periodEnd}` : null;

    const grossRaw =
      s.gross_pay ?? getField("gross_pay") ?? getField("Gross Pay") ?? null;
    const netRaw = s.net_pay ?? getField("net_pay") ?? getField("Net Pay") ?? null;

    const grossPay = toFiniteNumber(grossRaw);
    const netPay = toFiniteNumber(netRaw);

    return {
      kind: "payslip",
      employee_name:
        s.employee_name ||
        getField("employee_name") ||
        getField("Employee Name") ||
        getField("Employee") ||
        null,
      employer_name:
        s.employer_name ||
        getField("employer_name") ||
        getField("Employer Name") ||
        getField("Employer") ||
        null,
      period_label: periodLabel || null,
      gross_pay: grossPay,
      net_pay: netPay,
      currency: s.currency || getField("currency") || "ZAR",
    };
  }

  // ID DOCUMENTS
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
      date_of_birth: getField("Date of Birth") || getField("DOB") || null,
    };
  }

  // PROOF OF ADDRESS
  if (docType === "proof_of_address") {
    const s = agentic?.structured || {};
    const addressLines = Array.isArray(s.address_lines) ? s.address_lines : [];

    const line1 = addressLines[0] || null;
    const line2 =
      addressLines.length > 1 ? addressLines.slice(1).join(", ") : null;

    return {
      kind: "address",
      holder_name:
        s.customer_name ||
        getField("customer_name") ||
        getField("Customer Name") ||
        getField("Account Holder Name") ||
        getField("Address Holder Name") ||
        null,
      holder_type: getField("Holder Type") || null,
      address_line_1:
        line1 ||
        getField("address_line_1") ||
        getField("Address Line 1") ||
        getField("Address1") ||
        null,
      address_line_2:
        line2 ||
        getField("address_line_2") ||
        getField("Address Line 2") ||
        getField("Address2") ||
        null,
      city: getField("City / Town") || getField("City") || null,
      province:
        getField("Province / State") ||
        getField("Province") ||
        getField("State") ||
        null,
      postal_code:
        s.postal_code ||
        getField("postal_code") ||
        getField("Postal Code") ||
        getField("Postcode") ||
        null,
      country: s.country || getField("Country") || null,
      proof_entity_name:
        s.issuer_name ||
        getField("issuer_name") ||
        getField("Proof Entity Name") ||
        getField("Provider") ||
        getField("Issuer") ||
        null,
      document_issue_date:
        s.issue_date ||
        getField("issue_date") ||
        getField("Document Issue Date") ||
        getField("Issue Date") ||
        null,
    };
  }

  return null;
}

export default function Results() {
  const query = useQuery();
  const objectKey = query.get("objectKey");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const [activeView, setActiveView] = useState("summary");

  const functionUrl =
    "https://5epugrqble4dg6pahfz63wx44a0caasj.lambda-url.us-east-1.on.aws/";

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

        const hasQuick = !!data.quick;
        const hasDetailed = !!data.detailed;
        const qualityStatus = data.quality?.status || null;
        const pipelineStage =
          typeof data.statusAudit === "string"
            ? data.statusAudit
            : data.statusAudit && typeof data.statusAudit === "object"
            ? data.statusAudit.pipeline_stage ||
              data.statusAudit.pipelineStage ||
              data.statusAudit.stage ||
              null
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
      } catch (err) {
        console.error("Failed to load OCR result", err);
        attempt += 1;

        if (attempt < maxAttempts && !cancelled) {
          setTimeout(attemptFetch, delayMs);
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

  const { agentic } = deriveAgenticFromResult(result);

  const docTypeRaw = agentic?.docType ?? result?.docType ?? null;

  const docType =
    typeof docTypeRaw === "string"
      ? (() => {
          const k = docTypeRaw.trim().toLowerCase();
          if (k === "payslip") return "payslips";
          if (k === "id_document") return "id_documents";
          return k;
        })()
      : null;

  const docTypeLabel =
    (docType && DOC_TYPE_LABELS[docType]) || docTypeRaw || "—";

  const fields = Array.isArray(result?.fields) ? result.fields : [];

  const pipelineStage =
    typeof result?.statusAudit === "string"
      ? result.statusAudit
      : result?.statusAudit && typeof result.statusAudit === "object"
      ? result.statusAudit.pipeline_stage ||
        result.statusAudit.pipelineStage ||
        result.statusAudit.stage ||
        null
      : null;

  const uiSummary = buildUiSummary(docType, agentic, fields);

  const classification = agentic?.classification || null;
  const riskScore = agentic?.risk_score?.score ?? result?.riskScore?.score ?? null;
  const riskBand = agentic?.risk_score?.band ?? result?.riskScore?.band ?? null;

  const quality = result?.quality || {};
  const rawConfidence =
    typeof quality.confidence === "number" ? quality.confidence : null;

  const confidencePct =
    typeof rawConfidence === "number"
      ? rawConfidence <= 1
        ? rawConfidence * 100
        : rawConfidence
      : null;

  const qualityStatus = quality.status || null;

  const analysisModeRaw = agentic?.analysisMode || result?.analysisMode || null;

  const analysisMode =
    analysisModeRaw ||
    (result?.detailed ? "detailed" : result?.quick ? "quick" : null);

  const { issues, overallStatus, inProgress } = classifyIssues(result);

  const agenticSummary =
    result?.detailed?.result?.summary ??
    result?.detailed?.summary ??
    result?.quick?.summary ??
    agentic?.summary ??
    result?.summary ??
    null;

  const ratios =
    agentic?.ratios ||
    agentic?.financial_ratios ||
    agentic?.statement_ratios ||
    null;

  const bankRatios = docType === "bank_statements" ? ratios : null;
  const financialRatios = docType === "financial_statements" ? ratios : null;

  const cashflowSummary =
    agentic?.cashflow_summary ||
    agentic?.cash_flow_summary ||
    agentic?.cashflow ||
    null;

  // Financial statement ratio convenience (support both key variants)
  const currentRatio =
    financialRatios?.current_ratio ??
    financialRatios?.liquidity?.current_ratio ??
    null;

  const quickRatio =
    financialRatios?.quick_ratio ??
    financialRatios?.liquidity?.quick_ratio ??
    null;

  const debtToEquity =
    financialRatios?.debt_to_equity ??
    financialRatios?.debt_to_equity_ratio ??
    financialRatios?.leverage?.debt_to_equity ??
    null;

  const interestCover =
    financialRatios?.interest_cover ??
    financialRatios?.coverage?.interest_cover ??
    null;

  const netMargin =
    financialRatios?.net_margin ??
    financialRatios?.profitability?.net_margin ??
    null;

  const returnOnAssets =
    financialRatios?.return_on_assets ??
    financialRatios?.profitability?.return_on_assets ??
    null;

  const debtServiceCoverage =
    financialRatios?.debt_service_coverage ??
    financialRatios?.debt_service_coverage_ratio ??
    financialRatios?.dscr ??
    financialRatios?.coverage?.debt_service_coverage ??
    null;

  const cashflowCoverage =
    financialRatios?.cashflow_coverage ??
    financialRatios?.cash_flow_coverage_ratio ??
    financialRatios?.coverage?.cashflow_coverage ??
    null;

  // Bank-statement specific ratios
  const bankNetCashFlow = bankRatios?.net_cash_flow ?? null;
  const bankInflowToOutflow = bankRatios?.inflow_to_outflow_ratio ?? null;
  const bankClosingToOpening =
    bankRatios?.closing_to_opening_balance_ratio ?? null;

  const genericScores =
    agentic?.scores && typeof agentic.scores === "object" ? agentic.scores : null;

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
              {/* View toggle: Client vs Agent */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveView("summary")}
                    className={`px-3 py-1 rounded-full transition ${
                      activeView === "summary"
                        ? "bg-white shadow-sm text-slate-900"
                        : "text-slate-600"
                    }`}
                  >
                    Client view
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView("agent")}
                    className={`px-3 py-1 rounded-full transition ${
                      activeView === "agent"
                        ? "bg-white shadow-sm text-slate-900"
                        : "text-slate-600"
                    }`}
                  >
                    Agent view
                  </button>
                </div>
              </div>

              {/* ─────────────────────────────
                  CLIENT / SUMMARY VIEW
                  ───────────────────────────── */}
              {activeView === "summary" && (
                <>
                  {/* Run status / issues */}
                  <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-slate-50 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <div className="font-medium text-sm">Run status</div>
                      {formatStatusBadge(overallStatus)}
                      {pipelineStage && (
                        <span className="text-xs text-slate-500">
                          (Pipeline stage: {pipelineStage})
                        </span>
                      )}
                      {qualityStatus && !inProgress && (
                        <span className="text-xs text-slate-500">
                          • Quality status: {qualityStatus}
                        </span>
                      )}
                    </div>

                    {inProgress && (
                      <p className="text-sm text-slate-700">
                        The document has been uploaded and is queued for OCR and
                        AI analysis. Results will appear here once processing
                        completes.
                      </p>
                    )}

                    {!inProgress && issues.length === 0 && (
                      <p className="text-sm text-slate-700">
                        All processing stages completed without any detected
                        issues.
                      </p>
                    )}

                    {!inProgress && issues.length > 0 && (
                      <>
                        <ul className="space-y-2 text-sm">
                          {issues.map((issue, idx) => (
                            <li
                              key={idx}
                              className="border-t border-slate-200 pt-2 first:border-t-0 first:pt-0"
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium">
                                  {issue.stage}
                                </span>
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

                        <details className="mt-3 text-xs text-slate-600">
                          <summary className="cursor-pointer underline underline-offset-2">
                            Technical details (for support teams)
                          </summary>
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
                      <p className="text-sm text-slate-800 whitespace-pre-wrap">
                        {agenticSummary}
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
                        {confidencePct != null
                          ? confidencePct.toFixed(1) + "%"
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
                          : inProgress
                          ? "Processing"
                          : "—"}
                      </div>
                    </div>
                  </div>

                  {/* Doc-type aware summary */}
                  {uiSummary && !inProgress && (
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
                                {fmtNum(uiSummary.opening_balance)}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">
                                Closing Balance
                              </div>
                              <div className="font-medium">
                                {fmtNum(uiSummary.closing_balance)}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">
                                Total Credits
                              </div>
                              <div className="font-medium">
                                {fmtNum(uiSummary.total_credits)}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">
                                Total Debits
                              </div>
                              <div className="font-medium">
                                {fmtNum(uiSummary.total_debits)}
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
                                {fmtNum(uiSummary.revenue)}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">
                                EBITDA
                              </div>
                              <div className="font-medium">
                                {fmtNum(uiSummary.ebitda)}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">
                                Net profit
                              </div>
                              <div className="font-medium">
                                {fmtNum(uiSummary.net_profit)}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
                            <div>
                              <div className="text-slate-500 text-xs uppercase">
                                Total assets
                              </div>
                              <div className="font-medium">
                                {fmtNum(uiSummary.total_assets)}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">
                                Total liabilities
                              </div>
                              <div className="font-medium">
                                {fmtNum(uiSummary.total_liabilities)}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">
                                Equity
                              </div>
                              <div className="font-medium">
                                {fmtNum(uiSummary.equity)}
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
                                {fmtNum(uiSummary.gross_pay)}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">
                                Net pay
                              </div>
                              <div className="font-medium">
                                {fmtNum(uiSummary.net_pay)}
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
                                {uiSummary.city && uiSummary.province
                                  ? ", "
                                  : ""}
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

                  {/* Bank-statement ratios panel */}
                  {bankRatios && !inProgress && docType === "bank_statements" && (
                    <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <h2 className="text-sm font-semibold mb-3">
                        Bank statement cashflow metrics
                      </h2>
                      <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Net cash flow
                          </div>
                          <div className="font-medium">
                            {fmtNum(bankNetCashFlow)}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Inflow / outflow ratio
                          </div>
                          <div className="font-medium">
                            {fmtFixed(bankInflowToOutflow, 2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Closing vs opening balance
                          </div>
                          <div className="font-medium">
                            {fmtFixed(bankClosingToOpening, 2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Financial-statement ratios panel */}
                  {financialRatios &&
                    !inProgress &&
                    docType === "financial_statements" && (
                      <div className="mb-6 rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                        <h2 className="text-sm font-semibold mb-3">
                          Key ratios (from statements)
                        </h2>
                        <div className="grid gap-4 md:grid-cols-4 text-sm">
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Current ratio
                            </div>
                            <div className="font-medium">
                              {fmtFixed(currentRatio, 2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Quick ratio
                            </div>
                            <div className="font-medium">
                              {fmtFixed(quickRatio, 2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Debt to equity
                            </div>
                            <div className="font-medium">
                              {fmtFixed(debtToEquity, 2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Interest cover
                            </div>
                            <div className="font-medium">
                              {fmtFixed(interestCover, 2)}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-4 text-sm">
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Net margin
                            </div>
                            <div className="font-medium">
                              {fmtFixed(netMargin, 2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Return on assets
                            </div>
                            <div className="font-medium">
                              {fmtFixed(returnOnAssets, 2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Debt service coverage
                            </div>
                            <div className="font-medium">
                              {fmtFixed(debtServiceCoverage, 2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Cashflow coverage
                            </div>
                            <div className="font-medium">
                              {fmtFixed(cashflowCoverage, 2)}
                            </div>
                          </div>
                        </div>

                        {cashflowSummary && (
                          <details className="mt-3 text-xs text-slate-600">
                            <summary className="cursor-pointer underline underline-offset-2">
                              Cashflow summary (technical)
                            </summary>
                            <pre className="mt-2 max-h-48 overflow-auto rounded bg-slate-900 text-slate-100 p-2 text-[11px]">
                              {JSON.stringify(cashflowSummary, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    )}

                  {/* Raw parsed fields table from stub */}
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
                              {inProgress
                                ? "Structured fields will appear here once analysis completes."
                                : "No structured fields found. Check the raw JSON download for more details."}
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
                </>
              )}

              {/* ─────────────────────────────
                  AGENT VIEW – SCORE-ONLY
                  ───────────────────────────── */}
              {activeView === "agent" && (
                <>
                  <div className="mb-4 rounded-lg border border-[rgb(var(--border))] bg-slate-50 px-4 py-3 text-sm">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-medium">Run status</span>
                      {formatStatusBadge(overallStatus)}
                      {pipelineStage && (
                        <span className="text-xs text-slate-500">
                          Stage: {pipelineStage}
                        </span>
                      )}
                      {qualityStatus && !inProgress && (
                        <span className="text-xs text-slate-500">
                          • Quality: {qualityStatus}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 grid gap-4 md:grid-cols-4 text-sm">
                    <div className="rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <div className="text-slate-500 text-xs uppercase">
                        Risk score
                      </div>
                      <div className="mt-1 text-2xl font-semibold">
                        {typeof riskScore === "number"
                          ? riskScore.toFixed(2)
                          : "—"}
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        Band: {riskBand || "—"}
                      </div>
                    </div>
                    <div className="rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <div className="text-slate-500 text-xs uppercase">
                        Confidence
                      </div>
                      <div className="mt-1 text-2xl font-semibold">
                        {confidencePct != null
                          ? confidencePct.toFixed(1) + "%"
                          : "—"}
                      </div>
                    </div>
                    <div className="rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <div className="text-slate-500 text-xs uppercase">
                        Document
                      </div>
                      <div className="mt-1 text-lg font-semibold">
                        {docTypeLabel}
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        Mode:{" "}
                        {analysisMode === "detailed"
                          ? "Detailed"
                          : analysisMode === "quick"
                          ? "Quick"
                          : inProgress
                          ? "Processing"
                          : "—"}
                      </div>
                    </div>
                    <div className="rounded-lg border border-[rgb(var(--border))] bg-white p-4">
                      <div className="text-slate-500 text-xs uppercase">
                        Period
                      </div>
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
                              <th className="text-left p-2 border-b border-[rgb(var(--border))]">
                                Metric
                              </th>
                              <th className="text-left p-2 border-b border-[rgb(var(--border))]">
                                Value
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(genericScores).map(([key, value]) => (
                              <tr key={key} className="odd:bg-slate-50/50">
                                <td className="p-2 border-b border-[rgb(var(--border))]">
                                  {key}
                                </td>
                                <td className="p-2 border-b border-[rgb(var(--border))]">
                                  {typeof value === "number"
                                    ? value.toFixed(4)
                                    : String(value)}
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

              {/* Downloads / navigation actions – always visible */}
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

