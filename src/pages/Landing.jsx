// src/pages/Landing.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  const [file, setFile] = useState(null);
  const functionUrl =
    "https://rip7ft5vrq6ltl7r7btoop4whm0fqcnp.lambda-url.us-east-1.on.aws/"; // presign Lambda URL

  async function startUpload() {
    try {
      if (!file) {
        alert("Please choose a file first.");
        return;
      }

      // 1) Get presigned POST from Lambda
      const presignRes = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType: "bank_statements",
          mimeType: file.type || "application/pdf",
          originalFilename: file.name,
        }),
      });
      if (!presignRes.ok) {
        alert("Presign failed.");
        return;
      }
      const { url, fields } = await presignRes.json();

      // 2) Upload to S3
      const form = new FormData();
      Object.entries(fields).forEach(([k, v]) => form.append(k, v));
      form.append("file", file);

      const s3Res = await fetch(url, { method: "POST", body: form });

      if (s3Res.status === 204) {
        alert("✅ Uploaded to S3");
      } else {
        alert(`❌ Upload failed (status ${s3Res.status})`);
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error during upload.");
    }
  }

  return (
    <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Financial OCR</h1>
        <p className="opacity-80">
          Upload financial statements, run OCR, and view risk metrics and summaries.
        </p>
        <div className="mt-5 flex gap-3">
          <Link to="/dashboard" className="btn-primary inline-flex items-center px-3 py-2 rounded-lg">
            Go to Dashboard
          </Link>
          <Link to="/admin" className="inline-flex items-center px-3 py-2 rounded-lg border border-[rgb(var(--border))]">
            Admin
          </Link>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-3">
        <h2 className="font-medium">Test upload (dev)</h2>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block"
        />
        <button
          onClick={startUpload}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          disabled={!file}
        >
          Start OCR (upload)
        </button>
      </div>
    </section>
  );
}
