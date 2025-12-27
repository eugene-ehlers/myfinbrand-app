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

  // 1) If backend already provides top-level agentic, prefer that
  if (result.agentic && typeof result.agentic === "object") {
    return {
      agentic: result.agentic,
      rawAgentic: result.agentic,
      detailedEnvelope,
    };
  }

  // 2) If we have a detailed envelope using the new contract
  let agenticFromDetailed = null;
  if (
    detailedEnvelope &&
    typeof detailedEnvelope === "object" &&
    detailedEnvelope.result &&
    typeof detailedEnvelope.result === "object"
  ) {
    const r = detailedEnvelope.result;
    agenticFromDetailed = {
      docType:
        detailedEnvelope.docType || result.docType || r.docType || "unknown",
      analysisMode:
        detailedEnvelope.analysisMode || result.analysisMode || "detailed",
      quality: detailedEnvelope.quality || result.quality || null,
      // Flatten result.* into the agentic object
      ...r,
    };
  }

  // 3) Legacy / quick-path contracts
  // 3) PRIORITY ORDER FOR AGENTIC PAYLOAD
  //    1. detailedEnvelope.result (new contract, most reliable)
  //    2. result.agentic (future explicit contract)
  //    3. quick.result or quick.structured (legacy fallbacks)
  const rawAgentic =
    agenticFromDetailed ||
    result.agentic ||
    result.quick?.result ||
    result.quick?.structured ||
    null;

  // Unwrap `.result` if nested (legacy shape)
  const agentic = rawAgentic?.result ?? rawAgentic ?? null;

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
  const qualityDecision = quality.decision || null; // for future expansion
  const qualityReasons = Array.isArray(quality.reasons) ? quality.reasons : [];

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


  // ───────────────────────────────────────────────
  // 1) PIPELINE IN-PROGRESS / QUEUED STATE
  // ───────────────────────────────────────────────
  const isInProgress =
    // If we have no final payload yet, we are still processing — even if stage is missing/unknown
    (!hasAnyFinalResult &&
      (pipelineStage == null ||
        pipelineStage === "uploaded" ||
        pipelineStage === "ocr_completed" ||
        pipelineStage === "detailed_ai_queued" ||
        pipelineStage === "quick_ai_queued" ||
        pipelineStage === "detailed_ai_completed")) ||
    (!hasAnyFinalResult && qualityStatus === "pending") ||
    // defensive: stage says "completed" but detailed payload not present yet (avoid false "completed" UI)
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
    fields.find(
      (f) => f.name && f.name.toLowerCase() === name.toLowerCase()
    )?.value ?? null;

  // BANK STATEMENTS
  if (docType === "bank_statements") {
    // New contract: agentic.structured.statement_summary + .transactions
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

    // Prefer backend totals if present
    if (
      typeof stmt.total_credits === "number" ||
      typeof stmt.total_debits === "number"
    ) {
      totalCredits =
        typeof stmt.total_credits === "number" ? stmt.total_credits : null;
      totalDebits =
        typeof stmt.total_debits === "number" ? stmt.total_debits : null;
    } else if (txs.length) {
      // Fallback: compute from signed amounts
      let credits = 0;
      let debits = 0;
      for (const tx of txs) {
        const rawAmount = tx.amount;
        const amount =
          typeof rawAmount === "number"
            ? rawAmount
            : parseFloat(rawAmount ?? 0) || 0;

        if (amount >= 0) credits += amount;
        else debits += Math.abs(amount);
      }
      totalCredits = credits;
      totalDebits = debits;
    }

    return {
      kind: "bank",
    
      // Prefer current structured contract keys first, then legacy keys, then fields[] fallback
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
    
      // Normalize numeric values (strings -> numbers)
      opening_balance:
        stmt.opening_balance != null
          ? Number(stmt.opening_balance)
          : getField("opening_balance") != null
          ? Number(getField("opening_balance"))
          : null,
    
      closing_balance:
        stmt.closing_balance != null
          ? Number(stmt.closing_balance)
          : getField("closing_balance") != null
          ? Number(getField("closing_balance"))
          : null,
    
      total_credits: totalCredits != null ? Number(totalCredits) : null,
      total_debits: totalDebits != null ? Number(totalDebits) : null,
    
      currency: stmt.currency || getField("currency") || "ZAR",
    };
  }

  // FINANCIAL STATEMENTS
  if (docType === "financial_statements") {
    const getFieldNum = (name) => {
      const v = getField(name);
      if (v == null) return null;
      const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
      return Number.isFinite(n) ? n : null;
    };
  
    // Coerce structured to an object even if backend serialized it as a JSON string
    const structuredRaw = agentic?.structured ?? null;
    const s = coerceToObject(structuredRaw) || {};
  
    // Backward-compatible support for structured.financials nesting
    const fin = coerceToObject(s.financials) || null;
  
    const income = fin?.income_statement || s.income_statement || {};
    const balance = fin?.balance_sheet || s.balance_sheet || {};
  
    // Fallbacks from fields[] in case the UI agentic payload is missing/partial
    const entityName = s.entity_name || getField("entity_name") || "UNKNOWN";
    const periodStart =
      s.reporting_period_start ||
      s.period_start ||
      getField("reporting_period_start") ||
      getField("period_start") ||
      null;
  
    const periodEnd =
      s.reporting_period_end ||
      s.period_end ||
      getField("reporting_period_end") ||
      getField("period_end") ||
      null;
  
    const currency =
      s.currency || getField("currency") || "ZAR";
  
    const revenue =
      income.revenue ??
      s.income_statement?.revenue ??
      getFieldNum("revenue");
  
    const ebitda =
      income.ebitda ??
      s.income_statement?.ebitda ??
      getFieldNum("ebitda");
  
    const netProfit =
      income.profit_after_tax ??
      income.net_profit ??
      income.netProfit ??
      s.income_statement?.profit_after_tax ??
      getFieldNum("profit_after_tax") ??
      getFieldNum("net_profit") ??
      getFieldNum("netProfit");
  
    const totalAssets =
      balance.assets_total ??
      balance.totalAssets ??
      getFieldNum("assets_total") ??
      getFieldNum("total_assets") ??
      getFieldNum("totalAssets");
  
    const totalLiabilities =
      balance.liabilities_total ??
      balance.totalLiabilities ??
      getFieldNum("liabilities_total") ??
      getFieldNum("total_liabilities") ??
      getFieldNum("totalLiabilities");
  
    const equity =
      balance.equity ??
      getFieldNum("equity");
  
    return {
      kind: "financials",
      entity_name: entityName,
      period_start: periodStart,
      period_end: periodEnd,
      currency,
      revenue,
      ebitda,
      net_profit: netProfit,
      total_assets: totalAssets,
      total_liabilities: totalLiabilities,
      equity,
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
  
    const netRaw =
      s.net_pay ?? getField("net_pay") ?? getField("Net Pay") ?? null;
  
    const grossPay =
      grossRaw == null ? null : typeof grossRaw === "number" ? grossRaw : Number(grossRaw);
  
    const netPay =
      netRaw == null ? null : typeof netRaw === "number" ? netRaw : Number(netRaw);
  
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
      gross_pay: Number.isFinite(grossPay) ? grossPay : null,
      net_pay: Number.isFinite(netPay) ? netPay : null,
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
    const line2 = addressLines.length > 1 ? addressLines.slice(1).join(", ") : null;
  
    return {
      kind: "address",
  
      // Your backend uses structured.customer_name for POA
      holder_name:
        s.customer_name ||
        getField("customer_name") ||
        getField("Customer Name") ||
        getField("Account Holder Name") ||
        getField("Address Holder Name") ||
        null,
  
      // Not currently provided in structured payload (fine to remain field-only)
      holder_type: getField("Holder Type") || null,
  
      // Prefer address_lines from structured, then fall back to fields
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
  
      // Your structured payload doesn't split city/province today; keep as field fallbacks
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
  
      country:
        s.country ||
        getField("Country") ||
        null,
  
      // issuer_name + issue_date are in structured
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

  // NEW: view toggle – "summary" (client) vs "agent"
  const [activeView, setActiveView] = useState("summary");

  // NEW AGGREGATOR FUNCTION URL
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

        
        // Only overwrite the UI with partial results if we don't already have something better
        setResult((prev) => {
          if (!prev) return data;
          if (!inProgress) return data; // final → always take it
          // in progress → keep previous if it already has quick/detailed to avoid flicker
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

  // Agentic payload: unified view across old and new contracts
  const { agentic } = deriveAgenticFromResult(result);

  // High-level fields from the stub / aggregator
  const docTypeRaw = agentic?.docType ?? result?.docType ?? null;

// Normalize docType so UI logic is stable even if backend returns "Payslip" / "payslip"
  const docType =
    typeof docTypeRaw === "string"
      ? (() => {
          const k = docTypeRaw.trim().toLowerCase();
          if (k === "payslip") return "payslips";
          if (k === "id_document") return "id_documents";
          return k;
        })()
      : null;
  
  const docTypeLabel = (docType && DOC_TYPE_LABELS[docType]) || docTypeRaw || "—";
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


  // Build a UI summary based on docType + agentic content + fields
  const uiSummary = buildUiSummary(docType, agentic, fields);

  // Classification & risk (where present)
  const classification = agentic?.classification || null;
  const riskScore = agentic?.risk_score?.score ?? result?.riskScore ?? null;
  const riskBand =
    agentic?.risk_score?.band ?? result?.riskScore?.band ?? null;

  // Confidence: normalize 0–1 or 0–100 into a percent
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

  // Analysis mode from backend / agentic (with fallback)
  const analysisModeRaw =
    agentic?.analysisMode || result?.analysisMode || null;

  const analysisMode =
    analysisModeRaw ||
    (result?.detailed ? "detailed" : result?.quick ? "quick" : null);

  const { issues, overallStatus, inProgress } = classifyIssues(result);

  // Summary selection aligned to current backend contract:
  // - detailed: result.detailed.result.summary or result.detailed.summary
  // - quick: result.quick.summary
  // - fallbacks for any legacy paths
  const agenticSummary =
    result?.detailed?.result?.summary ??
    result?.detailed?.summary ??
    result?.quick?.summary ??
    agentic?.summary ??
    result?.summary ??
    null;

  // Ratios & cashflow summaries
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

  // Financial statement ratio convenience
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
    financialRatios?.dscr ??
    financialRatios?.coverage?.debt_service_coverage ??
    null;
  const cashflowCoverage =
    financialRatios?.cashflow_coverage ??
    financialRatios?.coverage?.cashflow_coverage ??
    null;

  // Bank-statement specific ratios
  const bankNetCashFlow = bankRatios?.net_cash_flow ?? null;
  const bankInflowToOutflow = bankRatios?.inflow_to_outflow_ratio ?? null;
  const bankClosingToOpening =
    bankRatios?.closing_to_opening_balance_ratio ?? null;

  // Optional generic scores block, if contracts expose it
  const genericScores =
    agentic?.scores && typeof agentic.scores === "object"
      ? agentic.scores
      : null;

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
                                  ? uiSummary.total_credits.toLocaleString(
                                      "en-ZA"
                                    )
                                  : "—"}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-500 text-xs uppercase">
                                Total Debits
                              </div>
                              <div className="font-medium">
                                {uiSummary.total_debits != null
                                  ? uiSummary.total_debits.toLocaleString(
                                      "en-ZA"
                                    )
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
                                  ? uiSummary.total_assets.toLocaleString(
                                      "en-ZA"
                                    )
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

                  {/* Simple income / expense view for personal bank statements */}
                  {classification &&
                    classification.income_summary &&
                    classification.expense_summary &&
                    !inProgress && (
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
                            Income frequency:&nbsp;
                            <span className="font-medium">
                              {classification.income_summary.frequency ||
                                classification.income_summary
                                  .income_frequency ||
                                classification.income_frequency ||
                                "—"}
                            </span>
                          </p>
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

                  {/* Bank-statement ratios panel */}
                  {bankRatios &&
                    !inProgress &&
                    docType === "bank_statements" && (
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
                              {bankNetCashFlow != null
                                ? bankNetCashFlow.toLocaleString("en-ZA")
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Inflow / outflow ratio
                            </div>
                            <div className="font-medium">
                              {bankInflowToOutflow != null
                                ? Number(bankInflowToOutflow).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Closing vs opening balance
                            </div>
                            <div className="font-medium">
                              {bankClosingToOpening != null
                                ? Number(bankClosingToOpening).toFixed(2)
                                : "—"}
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
                              {currentRatio != null
                                ? Number(currentRatio).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Quick ratio
                            </div>
                            <div className="font-medium">
                              {quickRatio != null
                                ? Number(quickRatio).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Debt to equity
                            </div>
                            <div className="font-medium">
                              {debtToEquity != null
                                ? Number(debtToEquity).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Interest cover
                            </div>
                            <div className="font-medium">
                              {interestCover != null
                                ? Number(interestCover).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-4 text-sm">
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Net margin
                            </div>
                            <div className="font-medium">
                              {netMargin != null
                                ? Number(netMargin).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Return on assets
                            </div>
                            <div className="font-medium">
                              {returnOnAssets != null
                                ? Number(returnOnAssets).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Debt service coverage
                            </div>
                            <div className="font-medium">
                              {debtServiceCoverage != null
                                ? Number(debtServiceCoverage).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Cashflow coverage
                            </div>
                            <div className="font-medium">
                              {cashflowCoverage != null
                                ? Number(cashflowCoverage).toFixed(2)
                                : "—"}
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
                  {/* Run status / pipeline */}
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

                  {/* Core scores */}
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
                        {uiSummary?.period_end
                          ? ` → ${uiSummary.period_end}`
                          : ""}
                      </div>
                    </div>
                  </div>

                  {/* Income & cashflow metrics */}
                  {classification?.income_summary && !inProgress && (
                    <div className="mb-4 rounded-lg border border-[rgb(var(--border))] bg-white p-4 text-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold">
                          Income &amp; expenses (scores)
                        </h2>
                      </div>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Total income
                          </div>
                          <div className="font-medium">
                            {classification.income_summary.total_income != null
                              ? classification.income_summary.total_income.toLocaleString(
                                  "en-ZA"
                                )
                              : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Frequency
                          </div>
                          <div className="font-medium">
                            {classification.income_summary.frequency ||
                              classification.income_summary
                                .income_frequency ||
                              classification.income_frequency ||
                              "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Salary component
                          </div>
                          <div className="font-medium">
                            {classification.income_summary.salary != null
                              ? classification.income_summary.salary.toLocaleString(
                                  "en-ZA"
                                )
                              : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase">
                            Other recurring income
                          </div>
                          <div className="font-medium">
                            {classification.income_summary
                              .third_party_income != null
                              ? classification.income_summary.third_party_income.toLocaleString(
                                  "en-ZA"
                                )
                              : "—"}
                          </div>
                        </div>
                      </div>

                      {classification.expense_summary && (
                        <div className="mt-4 grid gap-4 md:grid-cols-4">
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Total expenses
                            </div>
                            <div className="font-medium">
                              {classification.expense_summary
                                .total_expenses != null
                                ? classification.expense_summary.total_expenses.toLocaleString(
                                    "en-ZA"
                                  )
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Housing
                            </div>
                            <div className="font-medium">
                              {classification.expense_summary.housing != null
                                ? classification.expense_summary.housing.toLocaleString(
                                    "en-ZA"
                                  )
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Food &amp; groceries
                            </div>
                            <div className="font-medium">
                              {classification.expense_summary.food_groceries != null
                                ? classification.expense_summary.food_groceries.toLocaleString(
                                    "en-ZA"
                                  )
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Transport
                            </div>
                            <div className="font-medium">
                              {classification.expense_summary.transport != null
                                ? classification.expense_summary.transport.toLocaleString(
                                    "en-ZA"
                                  )
                                : "—"}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bank ratios – agent view */}
                  {bankRatios &&
                    !inProgress &&
                    docType === "bank_statements" && (
                      <div className="mb-4 rounded-lg border border-[rgb(var(--border))] bg-white p-4 text-sm">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-sm font-semibold">
                            Bank statement cashflow metrics
                          </h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Net cash flow
                            </div>
                            <div className="font-medium">
                              {bankNetCashFlow != null
                                ? bankNetCashFlow.toLocaleString("en-ZA")
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Inflow / outflow ratio
                            </div>
                            <div className="font-medium">
                              {bankInflowToOutflow != null
                                ? Number(bankInflowToOutflow).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Closing vs opening balance
                            </div>
                            <div className="font-medium">
                              {bankClosingToOpening != null
                                ? Number(bankClosingToOpening).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Financial ratios – agent view */}
                  {financialRatios &&
                    !inProgress &&
                    docType === "financial_statements" && (
                      <div className="mb-4 rounded-lg border border-[rgb(var(--border))] bg-white p-4 text-sm">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-sm font-semibold">
                            Financial ratios
                          </h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-4">
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Current ratio
                            </div>
                            <div className="font-medium">
                              {currentRatio != null
                                ? Number(currentRatio).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Quick ratio
                            </div>
                            <div className="font-medium">
                              {quickRatio != null
                                ? Number(quickRatio).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Debt / Equity
                            </div>
                            <div className="font-medium">
                              {debtToEquity != null
                                ? Number(debtToEquity).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Interest cover
                            </div>
                            <div className="font-medium">
                              {interestCover != null
                                ? Number(interestCover).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-4">
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Net margin
                            </div>
                            <div className="font-medium">
                              {netMargin != null
                                ? Number(netMargin).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Return on assets
                            </div>
                            <div className="font-medium">
                              {returnOnAssets != null
                                ? Number(returnOnAssets).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Debt service coverage
                            </div>
                            <div className="font-medium">
                              {debtServiceCoverage != null
                                ? Number(debtServiceCoverage).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase">
                              Cashflow coverage
                            </div>
                            <div className="font-medium">
                              {cashflowCoverage != null
                                ? Number(cashflowCoverage).toFixed(2)
                                : "—"}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Generic scores table (if contracts expose scores[]) */}
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
                            {Object.entries(genericScores).map(
                              ([key, value]) => (
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
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* For agents: quick access to raw JSON */}
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

