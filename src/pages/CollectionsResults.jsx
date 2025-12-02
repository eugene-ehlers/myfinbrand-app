// src/pages/CollectionsResults.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle2, Download } from "lucide-react";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

const COLLECTIONS_BUCKET = "myfinbrand-collections-dev"; // adjust if needed

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function buildResultsKeys(objectKey) {
  if (!objectKey) return null;

  // Mirror the logic in CollectionsIngest:
  // raw/collections/.../file.csv  ->  results/collections/.../file_sms.csv etc.
  const resultsPrefix = objectKey.replace(
    "raw/collections/",
    "results/collections/"
  );
  const basePrefix = resultsPrefix.replace(/\.[^.]+$/, ""); // strip .csv / .xlsx

  return {
    smsKey: `${basePrefix}_sms.csv`,
    emailKey: `${basePrefix}_email.csv`,
    diallerKey: `${basePrefix}_dialler.csv`,
    suppressedKey: `${basePrefix}_suppressed.csv`,
  };
}

function s3UrlForKey(bucket, key) {
  if (!bucket || !key) return "#";
  // Encode each path segment to be safe
  const encodedKey = key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `https://${bucket}.s3.amazonaws.com/${encodedKey}`;
}

export default function CollectionsResults() {
  const query = useQuery();
  const objectKey = query.get("objectKey");

  const keys = buildResultsKeys(objectKey);

  const smsUrl = keys
    ? s3UrlForKey(COLLECTIONS_BUCKET, keys.smsKey)
    : "#";
  const emailUrl = keys
    ? s3UrlForKey(COLLECTIONS_BUCKET, keys.emailKey)
    : "#";
  const diallerUrl = keys
    ? s3UrlForKey(COLLECTIONS_BUCKET, keys.diallerKey)
    : "#";
  const suppressedUrl = keys
    ? s3UrlForKey(COLLECTIONS_BUCKET, keys.suppressedKey)
    : "#";

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
              The uploaded file has been processed. Download the channel
              output files below to see which customers received which
              treatments and messages.
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
              <span className="font-mono">
                results/collections/…
              </span>
              . Use the buttons below to download each channel file for
              analysis or to load into your SMS, email or dialler systems.
            </div>
            {objectKey && (
              <div className="mt-2 text-[11px] text-green-900">
                <span className="font-semibold">Input object key: </span>
                <span className="font-mono break-all">{objectKey}</span>
              </div>
            )}
          </div>
        </div>

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
              href={smsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download SMS file
            </a>

            {/* Email */}
            <a
              href={emailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Email file
            </a>

            {/* Dialler */}
            <a
              href={diallerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Dialler file
            </a>

            {/* Suppressed */}
            <a
              href={suppressedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Suppressed file
            </a>
          </div>

          <p className="text-[11px] text-slate-400 mt-3">
            Note: for this demo, files are accessed directly via S3 object
            URLs. In a production setup you would typically expose these via
            pre-signed URLs or a backend API.
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
