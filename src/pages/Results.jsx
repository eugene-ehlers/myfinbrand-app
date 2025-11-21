// src/pages/Results.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function Results() {
  const query = useQuery();
  const objectKey = query.get("objectKey");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const functionUrl =
    "https://rip7ft5vrq6ltl7r7btoop4whm0fqcnp.lambda-url.us-east-1.on.aws/";

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

    const maxAttempts = 8;
    let attempt = 0;

    async function attemptFetch() {
      if (cancelled) return;

      try {
        const res = await fetch(
          `${functionUrl}?objectKey=${encodeURIComponent(objectKey)}`
        );

        if (!res.ok) {
          // While result file may not exist yet, keep polling a few times
          attempt += 1;
          console.warn(
            `Result fetch not OK (status ${res.status}), attempt ${attempt}/${maxAttempts}`
          );

          if (attempt < maxAttempts && !cancelled) {
            setTimeout(attemptFetch, 1500); // 1.5s between polls
          } else if (!cancelled) {
            const text = await res.text().catch(() => "");
            setLoading(false);
            setError(
              `Could not load OCR result (HTTP ${res.status}). ${text || ""}`
            );
          }
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        setResult(data);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("Failed to load OCR result", err);
        attempt += 1;

        if (attempt < maxAttempts && !cancelled) {
          setTimeout(attemptFetch, 1500);
        } else if (!cancelled) {
          setLoading(false);
          setError(
            "Could not load OCR result. Please refresh in a moment or try again."
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
      alert("Could not download JSON.");
    }
  }

  function handleDownloadPdf() {
    alert("PDF export not implemented yet – JSON is available though.");
  }

  const riskScore = result?.riskScore ?? "—";
  const confidence = result?.confidence ?? "—";
  const docType = result?.docType ?? "—";
  const fields = Array.isArray(result?.fields) ? result.fields : [];

  return (
    <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
      <h1 className="text-2xl font-semibold mb-2">Results</h1>

      {objectKey && (
        <p className="opacity-80 mb-4 break-all">
          Object: <span className="font-mono text-xs">{objectKey}</span>
        </p>
      )}

      {loading && (
        <p className="opacity-80 mb-4">
          Fetching OCR result… (this can take a few seconds)
        </p>
      )}

      {error && !loading && (
        <p className="text-red-600 mb-4 text-sm">{error}</p>
      )}

      {!loading && !error && result && (
        <>
          {/* Summary cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="rounded-lg border border-[rgb(var(--border))] p-4">
              <div className="text-sm opacity-70">Risk Score</div>
              <div className="text-2xl font-semibold">
                {typeof riskScore === "number" ? riskScore.toFixed(2) : riskScore}
              </div>
            </div>
            <div className="rounded-lg border border-[rgb(var(--border))] p-4">
              <div className="text-sm opacity-70">Confidence</div>
              <div className="text-2xl font-semibold">
                {typeof confidence === "number"
                  ? (confidence * 100).toFixed(1) + "%"
                  : confidence}
              </div>
            </div>
            <div className="rounded-lg border border-[rgb(var(--border))] p-4">
              <div className="text-sm opacity-70">Document Type</div>
              <div className="text-2xl font-semibold">{docType}</div>
            </div>
          </div>

          {/* Parsed fields table */}
          <div className="rounded-lg border border-[rgb(var(--border))] overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-white/40">
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
                      No structured fields found. Check the raw JSON download.
                    </td>
                  </tr>
                )}
                {fields.map((f, idx) => (
                  <tr key={idx} className="odd:bg-white/20">
                    <td className="p-3 border-b border-[rgb(var(--border))]">
                      {f.name}
                    </td>
                    <td className="p-3 border-b border-[rgb(var(--border))]">
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

          {/* Downloads / navigation actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="btn-primary inline-flex items-center px-3 py-2 rounded-lg"
              onClick={handleDownloadPdf}
            >
              Download Summary (PDF)
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 rounded-lg border border-[rgb(var(--border))]"
              onClick={handleDownloadJson}
            >
              Download JSON
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 rounded-lg border border-[rgb(var(--border))] ml-auto"
              onClick={() => navigate("/dashboard")}
            >
              New OCR request
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 rounded-lg border border-[rgb(var(--border))]"
              onClick={() => navigate("/")}
            >
              Home
            </button>
          </div>
        </>
      )}
    </section>
  );
}
