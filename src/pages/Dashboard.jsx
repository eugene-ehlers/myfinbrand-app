// src/pages/Dashboard.jsx
import React, { useState } from "react";

export default function Dashboard() {
  const [caseName, setCaseName] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  // Presign Lambda URL
  const functionUrl =
    "https://rip7ft5vrq6ltl7r7btoop4whm0fqcnp.lambda-url.us-east-1.on.aws/";

  async function startUpload(e) {
    e?.preventDefault?.();
    if (!file) {
      alert("Please choose a file first.");
      return;
    }

    setBusy(true);
    try {
      // 1) Get presigned POST from Lambda
      const presignRes = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType: "bank_statements", // TODO: make dynamic later
          mimeType: file.type || "application/pdf",
          originalFilename: file.name,
          // You can include metadata here later (e.g., caseName)
        }),
      });

      if (!presignRes.ok) {
        console.error("Presign failed", presignRes.status);
        alert("Presign failed.");
        return;
      }

      const { url, fields } = await presignRes.json();

      // 2) Upload directly to S3 with the returned form fields
      const form = new FormData();
      Object.entries(fields).forEach(([k, v]) => form.append(k, v));
      form.append("file", file);

      const s3Res = await fetch(url, { method: "POST", body: form });

      if (s3Res.status === 204) {
        alert("✅ Uploaded to S3");
        // (Optional) clear file after success
        setFile(null);
      } else {
        const text = await s3Res.text().catch(() => "");
        console.error("S3 upload failed", s3Res.status, text);
        alert(`❌ Upload failed (status ${s3Res.status})`);
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error during upload.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-[rgb(var(--ink-dim))]">
        Welcome back. Upload a statement or review recent cases.
      </p>

      <form className="mt-6 space-y-4" onSubmit={startUpload}>
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
        </div>

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
