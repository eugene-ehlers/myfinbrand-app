// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [caseName, setCaseName] = useState("");
  const [docType, setDocType] = useState("bank_statements");
  const [customerType, setCustomerType] = useState("personal");

  // which services the requester wants the platform to run
  const [services, setServices] = useState({
    ocr: true,           // always on in your flow, but keep it explicit
    summary: true,
    structured: true,    // parse account + transactions
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
    setStatus({ type: "info", message: "Requesting upload slot…" });

    try {
      // 1) Get presigned POST from Lambda
      const presignRes = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType, // existing
          mimeType: file.type || "application/pdf",
          originalFilename: file.name,
          caseName: caseName.trim(),
          customerType,        // NEW
          services: selectedServices, // NEW
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
      setStatus({ type: "info", message: "Uploading file to secure storage…" });

      const form = new FormData();
      Object.entries(fields).forEach(([k, v]) => form.append(k, v));
      form.append("file", file);

      const s3Res = await fetch(url, { method: "POST", body: form });

      if (s3Res.status === 204) {
        setStatus({
          type: "success",
          message:
            "Upload complete. OCR will start automatically in the background.",
        });

        // clear file
        setFile(null);

        // 🔗 navigate to Results for this object
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
        message: "Unexpected error during upload. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  function statusClasses() {
    if (!status) return "";
    if (status.type === "success") return "text-green-600";
    if (status.type === "error") return "text-red-600";
    return "text-[rgb(var(--ink-dim))]";
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-[rgb(var(--ink-dim))]">
        Welcome back. Upload a statement or review recent cases.
      </p>

      <form className="mt-6 space-y-4" onSubmit={startUpload}>
        {/* Case name */}
        <div className="grid gap-2">
          <label htmlFor="caseName" className="font-medium">
            Case name
          </label>
          <input
            id="caseName"
            name="caseName"
            type="text"
            value={caseName}
            onChange={(e) => setCaseName(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-[rgb(var(--surface))] border-[rgb(var(--border))] focus:outline-none"
            placeholder="e.g., ACME_2025_11_BankStmt"
          />
          <p className="text-xs text-[rgb(var(--ink-dim))]">
            Used to group uploads and OCR results for this client.
          </p>
        </div>

        {/* Customer type */}
        <div className="grid gap-2">
          <label htmlFor="customerType" className="font-medium">
            Customer type
          </label>
          <select
            id="customerType"
            name="customerType"
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-[rgb(var(--surface))] border-[rgb(var(--border))] focus:outline-none"
          >
            <option value="personal">Personal</option>
            <option value="business">Business</option>
          </select>
          <p className="text-xs text-[rgb(var(--ink-dim))]">
            Helps the agentic engine tailor parsing, ratios and risk rules.
          </p>
        </div>

        {/* Document type selector */}
        <div className="grid gap-2">
          <label htmlFor="docType" className="font-medium">
            Document type
          </label>
          <select
            id="docType"
            name="docType"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-[rgb(var(--surface))] border-[rgb(var(--border))] focus:outline-none"
          >
            <option value="bank_statements">Bank statement</option>
            <option value="id_documents">ID / Passport</option>
            <option value="payslips">Payslip</option>
            <option value="generic">Other / Generic</option>
          </select>
        </div>

        {/* Service selection */}
        <div className="grid gap-2">
          <span className="font-medium">Requested services</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
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
          <p className="text-xs text-[rgb(var(--ink-dim))]">
            You can offer these as separate products or bundles; the backend
            will only run what is selected.
          </p>
        </div>

        {/* File input */}
        <div className="grid gap-2">
          <label htmlFor="file" className="font-medium">
            Upload PDF/Images
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept=".pdf,image/*"
            className="block"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file && (
            <div className="text-sm text-[rgb(var(--ink-dim))]">
              Selected: <span className="font-medium">{file.name}</span>
            </div>
          )}
        </div>

        {/* Status message */}
        {status && (
          <div className={`text-sm ${statusClasses()}`}>{status.message}</div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="btn-primary rounded-lg px-4 py-2 disabled:opacity-50"
          disabled={!file || busy}
        >
          {busy ? "Uploading…" : "Start OCR"}
        </button>
      </form>
    </section>
  );
}
