// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  Settings2,
  AlertCircle,
  CheckCircle2,
  Files,
  X,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
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

// Which services are meaningful per docType
const DOC_TYPE_SERVICE_CONFIG = {
  bank_statements: [
    "ocr",
    "summary",
    "structured",
    "classification",
    "ratios",
    "risk",
  ],
  financial_statements: ["ocr", "summary", "structured", "ratios", "risk"],
  payslips: ["ocr", "summary", "structured", "risk"],
  id_documents: ["ocr", "structured", "risk"],
  proof_of_address: ["ocr", "structured", "risk"],
  generic: ["ocr", "summary", "structured", "classification", "ratios", "risk"],
};

// Services that are only available in DETAILED mode (for supported docTypes)
const DETAILED_ONLY_SERVICES = ["ratios"];

// Labels to render checkboxes nicely
const SERVICE_LABELS = {
  ocr: "OCR text extraction",
  summary: "Summary / key facts",
  structured: "Structured parse (accounts / key fields)",
  classification: "Transaction classification",
  ratios: "Financial ratios / metrics",
  risk: "Risk score",
};

// Helper: build a single multi-page PDF from image files
async function buildPdfFromImages(imageFiles) {
  const pdfDoc = await PDFDocument.create();

  for (const file of imageFiles) {
    const bytes = await file.arrayBuffer();

    let image;
    if (file.type === "image/jpeg" || file.type === "image/jpg") {
      image = await pdfDoc.embedJpg(bytes);
    } else {
      // default to PNG embed; most mobile images are jpeg or png
      image = await pdfDoc.embedPng(bytes);
    }

    const { width, height } = image.scale(1);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [caseName, setCaseName] = useState("");
  const [customerType, setCustomerType] = useState("personal");
  const [docType, setDocType] = useState("bank_statements");

  // Analysis depth selection
  const [analysisMode, setAnalysisMode] = useState("quick"); // "quick" | "detailed"

  // which services the requester wants the platform to run
  const [services, setServices] = useState({
    ocr: true,
    summary: true,
    structured: true,
    classification: true,
    ratios: false,
    risk: false,
  });

  // Upload mode: "single" (existing behaviour) vs "multi" (multi-page images)
  const [uploadMode, setUploadMode] = useState("single");
  const [file, setFile] = useState(null); // single-file mode
  const [pages, setPages] = useState([]); // multi-page images mode

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null); // { type: "info" | "success" | "error", message: string }

  // Presign Lambda URL (GeneratePresignedPost-dev)
  const functionUrl =
    "https://rip7ft5vrq6ltl7r7btoop4whm0fqcnp.lambda-url.us-east-1.on.aws/";

  const availableDocTypes = DOC_TYPE_OPTIONS[customerType] || [];

  // Services that make sense for the current docType
  const allowedServicesForDocType =
    DOC_TYPE_SERVICE_CONFIG[docType] || Object.keys(services);

  // Further restrict services based on analysisMode
  const allowedServicesForMode = allowedServicesForDocType.filter((svc) => {
    if (analysisMode === "quick" && DETAILED_ONLY_SERVICES.includes(svc)) {
      return false;
    }
    return true;
  });

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

  function handleSingleFileChange(e) {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  }

  function handleMultiPageChange(e) {
    const newFiles = Array.from(e.target.files || []);
    if (!newFiles.length) return;

    setPages((prev) => [...prev, ...newFiles]);
  }

  function removePage(index) {
    setPages((prev) => prev.filter((_, i) => i !== index));
  }

  async function startUpload(e) {
    e?.preventDefault?.();

    // Basic validations
    if (!caseName.trim()) {
      setStatus({
        type: "error",
        message: "Please enter a case name to group this upload.",
      });
      return;
    }

    if (uploadMode === "single" && !file) {
      setStatus({ type: "error", message: "Please choose a file first." });
      return;
    }

    if (uploadMode === "multi" && pages.length === 0) {
      setStatus({
        type: "error",
        message: "Please add at least one page image.",
      });
      return;
    }

    // Flatten checked services into an array of strings,
    // but only those that make sense for this docType AND analysisMode
    const selectedServices = Object.entries(services)
      .filter(
        ([name, enabled]) => enabled && allowedServicesForMode.includes(name)
      )
      .map(([name]) => name);

    if (selectedServices.length === 0) {
      setStatus({
        type: "error",
        message: "Please select at least one processing service.",
      });
      return;
    }

    setBusy(true);
    setStatus({ type: "info", message: "Preparing document for upload…" });

    let uploadFile = file;
    let captureMode = "single_file";

    try {
      // If multi-page mode, build a single PDF from the page images
      if (uploadMode === "multi") {
        captureMode = "multipage_frontend";

        setStatus({
          type: "info",
          message: "Combining pages into a single PDF…",
        });

        const pdfBlob = await buildPdfFromImages(pages);

        const safeName =
          caseName.trim().replace(/\s+/g, "_").toUpperCase() ||
          "MULTIPAGE_DOCUMENT";

        uploadFile = new File([pdfBlob], `${safeName}.pdf`, {
          type: "application/pdf",
        });
      }

      if (!uploadFile) {
        setStatus({
          type: "error",
          message: "No file prepared for upload. Please try again.",
        });
        return;
      }

      setStatus({ type: "info", message: "Requesting secure upload slot…" });

      // 1) Get presigned POST from Lambda
      const presignRes = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType,
          mimeType: uploadFile.type || "application/pdf",
          originalFilename: uploadFile.name,
          caseName: caseName.trim(),
          customerType,
          services: selectedServices,
          captureMode, // how this was captured
          analysisMode, // quick vs detailed
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

      let presignJson;
      try {
        presignJson = await presignRes.json();
      } catch (jsonErr) {
        console.error("Failed to parse presign JSON", jsonErr);
        setStatus({
          type: "error",
          message:
            "Upload initialisation returned an unexpected response. Please try again or contact support.",
        });
        return;
      }

      const { url, fields, objectKey } = presignJson || {};

      if (!url || !fields || !objectKey) {
        console.error("Presign response missing fields", presignJson);
        setStatus({
          type: "error",
          message:
            "Upload initialisation was incomplete. Please try again or contact support.",
        });
        return;
      }

      // 2) Upload directly to S3 with the returned form fields
      setStatus({
        type: "info",
        message: "Uploading file to secure storage…",
      });

      const form = new FormData();
      Object.entries(fields).forEach(([k, v]) => form.append(k, v));
      form.append("file", uploadFile);

      const s3Res = await fetch(url, { method: "POST", body: form });

      if (s3Res.ok) {
        setStatus({
          type: "success",
          message:
            "Upload complete. OCR and agentic analysis will start automatically.",
        });

        // Clear selections
        setFile(null);
        setPages([]);

        // Navigate to Results for this object
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
      console.error("Unexpected error during upload:", err);
      setStatus({
        type: "error",
        message:
          "Unexpected error during upload. " +
          (err?.message || "Please check your connection and try again."),
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

  const submitDisabled =
    busy ||
    (uploadMode === "single" && !file) ||
    (uploadMode === "multi" && pages.length === 0);

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
                  <span className="font-semibold">
                    sole traders / trading as
                  </span>{" "}
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

            {/* Analysis mode (Quick vs Detailed) */}
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-slate-600" />
                <span className="font-medium text-sm">Analysis depth</span>
              </div>
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setAnalysisMode("quick")}
                  className={`flex-1 px-3 py-1.5 rounded-lg ${
                    analysisMode === "quick"
                      ? "bg-white shadow-sm font-semibold"
                      : "text-slate-600"
                  }`}
                >
                  Quick (faster)
                </button>
                <button
                  type="button"
                  onClick={() => setAnalysisMode("detailed")}
                  className={`flex-1 px-3 py-1.5 rounded-lg ${
                    analysisMode === "detailed"
                      ? "bg-white shadow-sm font-semibold"
                      : "text-slate-600"
                  }`}
                >
                  Detailed (slower, richer)
                </button>
              </div>
              <p className="text-xs text-slate-500">
                <span className="font-semibold">Quick</span> returns a shorter
                result and is optimised for speed.{" "}
                <span className="font-semibold">Detailed</span> can take longer
                but enables heavier analysis like ratios on supported documents.
              </p>
            </div>

            {/* Service selection */}
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-slate-600" />
                <span className="font-medium text-sm">Requested services</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {allowedServicesForMode.map((serviceKey) => (
                  <label
                    key={serviceKey}
                    className="inline-flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={services[serviceKey]}
                      onChange={() => toggleService(serviceKey)}
                    />
                    <span>{SERVICE_LABELS[serviceKey] || serviceKey}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Services are tailored to the selected{" "}
                <span className="font-semibold">document type</span> and{" "}
                <span className="font-semibold">analysis depth</span>. Some
                heavy services (like ratios) are only available in Detailed mode
                on supported documents.
              </p>
            </div>

            {/* Upload mode toggle */}
            <div className="grid gap-2">
              <span className="font-medium text-sm flex items-center gap-2">
                <Files className="h-4 w-4 text-slate-600" />
                Capture mode
              </span>
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setUploadMode("single")}
                  className={`flex-1 px-3 py-1.5 rounded-lg ${
                    uploadMode === "single"
                      ? "bg-white shadow-sm font-semibold"
                      : "text-slate-600"
                  }`}
                >
                  Single document (PDF / image)
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("multi")}
                  className={`flex-1 px-3 py-1.5 rounded-lg ${
                    uploadMode === "multi"
                      ? "bg-white shadow-sm font-semibold"
                      : "text-slate-600"
                  }`}
                >
                  Multiple pages (images)
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Use <span className="font-semibold">Multiple pages</span> when a
                statement or document is photographed page-by-page. We’ll
                combine the pages into a single PDF before upload.
              </p>
            </div>

            {/* File input(s) */}
            {uploadMode === "single" ? (
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
                      onChange={handleSingleFileChange}
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
                  PDFs work best. Single images are also supported.
                </p>
              </div>
            ) : (
              <div className="grid gap-2">
                <label htmlFor="multiPages" className="font-medium text-sm">
                  Add page images
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer text-sm">
                    <Upload className="h-4 w-4" />
                    <span>Add pages</span>
                    <input
                      id="multiPages"
                      name="multiPages"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleMultiPageChange}
                    />
                  </label>
                </div>
                {pages.length > 0 && (
                  <div className="mt-2 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {pages.length} page{pages.length > 1 ? "s" : ""} added
                      </span>
                    </div>
                    <div className="max-h-40 overflow-auto border rounded-xl p-2 bg-slate-50">
                      {pages.map((p, idx) => (
                        <div
                          key={`${p.name}-${idx}`}
                          className="flex items-center justify-between gap-2 py-0.5"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            <span className="truncate max-w-[200px]">
                              {idx + 1}. {p.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePage(idx)}
                            className="text-[10px] text-slate-500 hover:text-red-500 inline-flex items-center gap-0.5"
                          >
                            <X className="h-3 w-3" />
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-slate-500">
                  Capture each page as a clear photo (no blur, good lighting).
                  Pages will be combined into a single multi-page PDF.
                </p>
              </div>
            )}

            {/* Status */}
            {renderStatus()}

            {/* Submit */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="submit"
                className="btn-primary rounded-xl px-5 py-2.5 text-sm font-medium disabled:opacity-50 inline-flex items-center gap-2"
                disabled={submitDisabled}
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
