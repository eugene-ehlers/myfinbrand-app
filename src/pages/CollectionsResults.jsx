// src/pages/CollectionsResults.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle2, Download, AlertCircle } from "lucide-react";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

// Lambda URL that returns pre-signed GET URLs for the result files
const RESULTS_URL_FUNCTION =
  "https://3mxonnyr3li26y3drvcx2bw64q0akzky.lambda-url.us-east-1.on.aws/";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function CollectionsResults() {
  const query = useQuery();
  const objectKey = query.get("objectKey");

  const [urls, setUrls] = useState(null);
  const [status, setStatus] = useState({
    type: "info",
    message: "Fetching download links for results…",
  });

  useEffect(() => {
    async function fetchUrls() {
      if (!objectKey) {
        setStatus({
          type: "error",
          message: "No objectKey provided. Please re-run the upload.",
        });
        return;
      }

      try {
        setStatus({
          type: "info",
          message: "Preparing secure download links…",
        });

        const res = await fetch(RESULTS_URL_FUNCTION, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ objectKey }),
        });

        if (!res.ok) {
          console.error("GetResultUrls failed", res.status);
          setStatus({
            type: "error",
            message: `Could not prepare result links (HTTP ${res.status}). Check that the results files exist in S3.`,
          });
          return;
        }

        const data = await res.json();
        setUrls(data);
        setStatus({
          type: "success",
          message: "Download links are ready.",
        });
      } catch (err) {
        console.error(err);
        setStatus({
          type: "error",
          message:
            "Unexpected error while fetching result links. Please refresh and try again.",
        });
      }
    }

    fetchUrls();
  }, [objectKey]);

  function renderStatus() {
    if (!status) return null;

    if (status.type === "success") {
      return (
        <div className="mt-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-xs md:text-sm text-green-800 flex gap-2">
          <CheckCircle2 className="h-4 w-4 mt-0.5" />
          <span>{status.message}</span>
        </div>
      );
    }

    if (status.type === "error") {
      return (
        <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs md:text-sm text-red-800 flex gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5" />
          <span>{status.message}</span>
        </div>
      );
    }

    // info
    return (
      <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs md:text-sm text-slate-800 flex gap-2">
        <AlertCircle className="h-4 w-4 mt-0.5" />
        <span>{status.message}</span>
      </div>
    );
  }

  const downloadsReady =
    urls &&
    urls.smsUrl &&
    urls.emailUrl &&
    urls.diallerUrl &&
    urls.suppressedUrl;

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <SiteHeader />

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Collections Strategy – Results
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              The uploaded file has been processed. Download the channel output
              files below to see which customers received which treatments and
              messages.
            </p>
          </div>
        </div>

        {/* Success panel */}
        <div className="rounded-3xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800 flex gap-3 items-start">
          <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold">
              Collections strategy completed successfully
            </div>
            <div className="mt-1 text-xs md:text-sm text-green-900">
              Output files were written to your S3 bucket under{" "}
              <span className="font-mono">results/collections/…</span>. Secure
              pre-signed links are generated on demand so you can download each
              file from this page.
            </div>
            {objectKey && (
              <div className="mt-2 text-[11px] text-green-900">
                <span className="font-semibold">Input object key: </span>
                <span className="font-mono break-all">{objectKey}</span>
              </div>
            )}
          </div>
        </div>

        {renderStatus()}

        {/* Download card */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm text-sm space-y-4">
          <h2 className="text-base md:text-lg font-semibold mb-1">
            Download channel output files
          </h2>
          <p className="text-xs text-slate-500 mb-3">
            Each file contains one row per eligible account with segment,
            treatment, channel, scores and the resolved message template
            (message_id, subject, body).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* SMS */}
            <a
              href={downloadsReady ? urls.smsUrl : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium"
              aria-disabled={!downloadsReady}
              onClick={(e) => {
                if (!downloadsReady) e.preventDefault();
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download SMS file
            </a>

            {/* Email */}
            <a
              href={downloadsReady ? urls.emailUrl : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium"
              aria-disabled={!downloadsReady}
              onClick={(e) => {
                if (!downloadsReady) e.preventDefault();
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Email file
            </a>

            {/* Dialler */}
            <a
              href={downloadsReady ? urls.diallerUrl : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium"
              aria-disabled={!downloadsReady}
              onClick={(e) => {
                if (!downloadsReady) e.preventDefault();
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Dialler file
            </a>

            {/* Suppressed */}
            <a
              href={downloadsReady ? urls.suppressedUrl : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium"
              aria-disabled={!downloadsReady}
              onClick={(e) => {
                if (!downloadsReady) e.preventDefault();
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Suppressed file
            </a>
          </div>

          <p className="text-[11px] text-slate-400 mt-3">
            Links are pre-signed and expire after a short period. For repeated
            analysis, download and store the files locally or in your analytics
            environment.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            to="/collections-upload"
            className="btn-primary rounded-xl px-5 py-2.5 text-sm font-medium inline-flex items-center gap-2"
          >
            ← Upload another collections file
          </Link>
          <Link
            to="/solutions/collections"
            className="rounded-xl px-4 py-2.5 text-xs font-medium border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 inline-flex items-center gap-2"
          >
            View collections solution overview
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

