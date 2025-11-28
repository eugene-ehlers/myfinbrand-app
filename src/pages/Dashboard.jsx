// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  Settings2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

// Allowed doc types per customer type
const DOC_TYPE_OPTIONS = {
  personal: [
    { value: "bank_statements", label: "Bank statement" },
    { value: "payslips", label: "Payslip" },
    { value: "id_documents", label: "ID / Passport" },
    { value: "proof_of_address", label: "Proof of address" },
    { value: "generic", label: "Other / Generic" },
  ],
  business: [
    { value: "bank_statements", label: "Bank statement" },
    { value: "financial_statements", label: "Financial statements" },
    { value: "id_documents", label: "Company / Director ID docs" },
    { value: "proof_of_address", label: "Proof of address" },
    { value: "generic", label: "Other / Generic" },
  ],
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [caseName, setCaseName] = useState("");
  const [customerType, setCustomerType] = useState("personal");
  const [docType, setDocType] = useState("bank_statements");

  // which services the requester wants the platform to run
  const [services, setServices] = useState({
    ocr: true, // always on in your flow, but keep it explicit
    summary: true,
    structured: true, // parse account + transactions
    classification: true, // label transactions/categories
    ratios: false,
    risk: false,
  });

  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null); // { type: "info" | "success" | "error", message: string }

  // Presign Lambda URL
  const functionUrl =
    "https://rip7ft5vrq6ltl7r7btoop4whm0fqcnp.lambda-url.us-east-1.on.aws/";

  const availableDocTypes = DOC_TYPE_OPTIONS[customerType] || [];

  // When customerType changes, ensure docType is still valid for that type
  useEffect(() => {
    const stillValid = availableDocTypes.some((opt) => opt.value === docType);
    if (!stillValid && availableDocTypes.length > 0) {
      setDocType(availableDocTypes[0].value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerType]);

  function toggleService(key) {
    setServices((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  async function startUpload(e) {
    e?.preventDefault?.();

    if (!file) {
      setStatus({ type: "error", message: "Please choose a file first." });
      return;
    }

    if (!caseName.trim()) {
      setStatus({
        type: "error",
        message: "Please enter a case name to group this upload.",
      });
      return;
    }

    // flatten checked services into an array of strings
    const selectedServices = Object.entries(services)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => name);

    if (selectedServices.length === 0) {
      setStatus({
        type: "error",
        message: "Please select at least one processing service.",
      });
      return;
    }

    setBusy(true);
    setStatus({ type: "info", message: "Requesting secure upload slot…" });

    try {
      // 1) Get presigned POST from Lambda
      const presignRes = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType,
          mimeType: file.type || "application/pdf",
          originalFilename: file.name,
          caseName: caseName.trim(),
          customerType,
          services: selectedServices,
        }),
      });

      if (!presignRes.ok) {
        console.error("Presign failed", presignRes.status);
        setStatus({
          type: "error",
          message: `Presign failed (HTTP ${presignRes.status}).`,
        });
        return;
      }

      const { url, fields, objectKey } = await presignRes.json();

      // 2) Upload directly to S3 with the returned form fields
      setStatus({
        type: "info",
        message: "Uploading file to secure storage…",
      });

      const form = new FormData();
      Object.entries(fields).forEach(([k, v]) => form.append(k, v));
      form.append("file", file);

      const s3Res = await fetch(url, { method: "POST", body: form });

      if (s3Res.status === 204) {
        setStatus({
          type: "success",
          message:
            "Upload complete. OCR and agentic analysis will start automatically.",
        });

        // clear file
        setFile(null);

        // navigate to Results for this object
        navigate(`/results?objectKey=${encodeURIComponent(objectKey)}`);
      } else {
        const text = await s3Res.text().catch(() => "");
        console.error("S3 upload failed", s3Res.status, text);
        setStatus({
          type: "error",
          message: `Upload failed (status ${s3Res.status}).`,
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message:
          "Unexpected error during upload. Please check your connection and try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  function renderStatus() {
    if (!status) return null;

    if (status.type === "success") {
      return (
        <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 flex gap-2">
          <CheckCircle2 className="h-5 w-5 mt-0.5" />
          <span>{status.message}</span>
        </div>
      );
    }

    if (status.type === "error") {
      return (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex gap-2">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <span>{status.message}</span>
        </div>
      );
    }

    // info
    return (
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 flex gap-2">
        <AlertCircle className="h-5 w-5 mt-0.5" />
        <span>{status.message}</span>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <SiteHeader />

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
              <Upload className="h-6 w-6" />
              OCR & Agentic Demo
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Upload a document, choose the services you want, and we’ll handle
              OCR, parsing, and risk in the background.
            </p>
          </div>
        </div>

        {/* Main card */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <form className="space-y-5" onSubmit={startUpload}>
            {/* Case name */}
            <div className="grid gap-2">
              <label htmlFor="caseName" className="font-medium text-sm">
                Case name
              </label>
              <input
                id="caseName"
                name="caseName"
                type="text"
                value={caseName}
                onChange={(e) => setCaseName(e.target.value)}
                className="border rounded-xl px-3 py-2.5 bg-[rgb(var(--surface))] border-[rgb(var(--border))] focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm"
                placeholder="e.g., JOHN_DOE_2024_08_BANK"
              />
              <p className="text-xs text-slate-500">
                Used to group uploads and OCR results for this client.
              </p>
            </div>

            {/* Customer type + Document type */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor="customerType" className="font-medium text-sm">
                  Customer type
                </label>
                <select
                  id="customerType"
                  name="customerType"
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                  className="border rounded-xl px-3 py-2.5 bg-[rgb(var(--surface))] border-[rgb(var(--border))] focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm"
                >
                  <option value="personal">Personal</option>
                  <option value="business">Business</option>
                </select>
                <p className="text-xs text-slate-500">
                  Choose <span className="font-semibold">Business</span> for
                  companies, close corporations, and{" "}
                  <span className="font-semibold">sole traders / trading as</span>{" "}
                  that provide financial statements.
                </p>
              </div>

              <div className="grid gap-2">
                <label htmlFor="docType" className="font-medium text-sm">
                  Document type
                </label>
                <select
                  id="docType"
                  name="docType"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="border rounded-xl px-3 py-2.5 bg-[rgb(var(--surface))] border-[rgb(var(--border))] focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm"
                >
                  {availableDocTypes.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500">
                  Personal customers can upload bank statements, payslips, ID
                  docs and proof of address. Business customers can upload bank
                  statements, financial statements, related ID docs and proof of
                  address.
                </p>
              </div>
            </div>

            {/* Service selection */}
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-slate-600" />
                <span className="font-medium text-sm">Requested services</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={services.ocr}
                    onChange={() => toggleService("ocr")}
                  />
                  <span>OCR text extraction</span>
                </label>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={services.summary}
                    onChange={() => toggleService("summary")}
                  />
                  <span>Statement summary</span>
                </label>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={services.structured}
                    onChange={() => toggleService("structured")}
                  />
                  <span>Structured parse (account + transactions)</span>
                </label>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={services.classification}
                    onChange={() => toggleService("classification")}
                  />
                  <span>Transaction classification</span>
                </label>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={services.ratios}
                    onChange={() => toggleService("ratios")}
                  />
                  <span>Financial ratios / metrics</span>
                </label>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={services.risk}
                    onChange={() => toggleService("risk")}
                  />
                  <span>Risk score</span>
                </label>
              </div>
              <p className="text-xs text-slate-500">
                You can offer these as separate products or bundles; the backend
                will only run what is selected.
              </p>
            </div>

            {/* File input */}
            <div className="grid gap-2">
              <label htmlFor="file" className="font-medium text-sm">
                Upload PDF/Images
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer text-sm">
                  <Upload className="h-4 w-4" />
                  <span>Select file</span>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
                {file && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500">
                PDFs work best. For images, multi-page statements may need more
                tuning.
              </p>
            </div>

            {/* Status */}
            {renderStatus()}

            {/* Submit */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="submit"
                className="btn-primary rounded-xl px-5 py-2.5 text-sm font-medium disabled:opacity-50 inline-flex items-center gap-2"
                disabled={!file || busy}
              >
                {busy ? "Uploading…" : "Start OCR & analysis"}
              </button>
              <button
                type="button"
                className="text-xs text-slate-600"
                onClick={() => navigate("/")}
              >
                ← Back to home
              </button>
            </div>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
