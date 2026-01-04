// src/pages/tools/collections/scorecards/:scorecardKey/outcome/CollectionsScorecardOutcome.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Download, AlertCircle } from "lucide-react";
import SiteHeader from "../../../../../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../../../../../components/layout/SiteFooter.jsx";

/**
 * Route:
 *   /tools/collections/scorecards/:scorecardKey/outcome?objectKey=...
 *
 * Purpose:
 * - Fetch presigned download link(s) for a single scorecard run.
 * - Provide a "Download output" button (and optional "Download errors").
 *
 * Backend expectations:
 * - You need a Lambda URL (or API endpoint) that returns pre-signed GET URLs for scorecard outputs.
 * - This page calls it via POST with { objectKey, scorecardKey }.
 *
 * Recommended response shape:
 * {
 *   outputUrl: "https://...",
 *   errorsUrl: "https://..." (optional),
 *   summary: { rowsIn, rowsOut, rowsRejected } (optional)
 * }
 *
 * NOTE:
 * - If your existing results Lambda (used by CollectionsResults.jsx) is different, set SCORECARD_RESULTS_URL_FUNCTION accordingly.
 */

const SCORECARD_RESULTS_URL_FUNCTION =
  "https://3mxonnyr3li26y3drvcx2bw64q0akzky.lambda-url.us-east-1.on.aws/";

// Friendly names for display (optional)
const SCORECARD_LABELS = {
  behaviour: "Behaviour Scorecard",
  affordability: "Affordability Scorecard",
  ptp: "Propensity to Pay (PTP) Scorecard",
  contactability: "Contactability Scorecard",
  vulnerability: "Vulnerability Scorecard",
};

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function CollectionsScorecardOutcome() {
  const navigate = useNavigate();
  const { scorecardKey } = useParams();
  const query = useQuery();
  const objectKey = query.get("objectKey");

  const [data, setData] = useState(null); // { outputUrl, errorsUrl?, summary? }
  const [status, setStatus] = useState({
    type: "info",
    message: "Preparing scorecard result links…",
  });

  useEffect(() => {
    async function fetchLinks() {
      if (!objectKey) {
        setStatus({
          type: "error",
          message: "No objectKey provided. Please re-run the scorecard upload.",
        });
        return;
      }

      try {
        setStatus({
          type: "info",
          message: "Fetching secure download links…",
        });

        const res = await fetch(SCORECARD_RESULTS_URL_FUNCTION, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            objectKey,
            scorecardKey,
            pipeline: "scorecard_run", // harmless if backend ignores
          }),
        });

        if (!res.ok) {
          console.error("Scorecard result link fetch failed", res.status);
          setStatus({
            type: "error",
            message: `Could not prepare scorecard download links (HTTP ${res.status}). Check that the output file exists in S3.`,
          });
          return;
        }

        const payload = await res.json();

        // Support both a dedicated schema and a fallback schema, without breaking:
        // - Preferred: { outputUrl, errorsUrl, summary }
        // - Accept: { url } or { output } as outputUrl equivalents
        const normalized = {
          outputUrl: payload.outputUrl || payload.url || payload.output || null,
          errorsUrl: payload.errorsUrl || payload.errorUrl || payload.errors || null,
          summary: payload.summary || null,
        };

        if (!normalized.outputUrl) {
          setStatus({
            type: "error",
            message:
              "Result links response did not include an outputUrl. Update the results Lambda to return { outputUrl } for scorecard runs.",
          });
          setData(normalized);
          return;
        }

        setData(normalized);
        setStatus({
          type: "success",
          message: "Download links are ready.",
        });
      } catch (err) {
        console.error(err);
        setStatus({
          type: "error",
          message:
            "Unexpected error while fetching scorecard result links. Please refresh and try again.",
        });
      }
    }

    fetchLinks();
  }, [objectKey, scorecardKey]);

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

    return (
      <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs md:text-sm text-slate-800 flex gap-2">
        <AlertCircle className="h-4 w-4 mt-0.5" />
        <span>{status.message}</span>
      </div>
    );
  }

  const label = SCORECARD_LABELS[scorecardKey] || `Scorecard: ${scorecardKey}`;
  const outputReady = !!data?.outputUrl;

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
              {label} – Results
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Your uploaded file has been processed. Download the enriched output
              file below.
            </p>
          </div>
        </div>

        {/* Success panel */}
        <div className="rounded-3xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800 flex gap-3 items-start">
          <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold">Scorecard run completed</div>
            <div className="mt-1 text-xs md:text-sm text-green-900">
              Output was written to your S3 bucket under{" "}
              <span className="font-mono">results/collections/…</span>. Secure
              pre-signed links are generated on demand from this page.
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

        {/* Optional summary */}
        {data?.summary && (
          <div className="rounded-3xl border bg-white p-6 shadow-sm text-sm">
            <div className="text-base font-semibold mb-2">Run summary</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-2xl border bg-slate-50 p-4">
                <div className="text-slate-500">Rows in</div>
                <div className="mt-1 font-mono text-slate-900">
                  {String(data.summary.rowsIn ?? "—")}
                </div>
              </div>
              <div className="rounded-2xl border bg-slate-50 p-4">
                <div className="text-slate-500">Rows out</div>
                <div className="mt-1 font-mono text-slate-900">
                  {String(data.summary.rowsOut ?? "—")}
                </div>
              </div>
              <div className="rounded-2xl border bg-slate-50 p-4">
                <div className="text-slate-500">Rows rejected</div>
                <div className="mt-1 font-mono text-slate-900">
                  {String(data.summary.rowsRejected ?? "—")}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Download card */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm text-sm space-y-4">
          <h2 className="text-base md:text-lg font-semibold mb-1">
            Download files
          </h2>
          <p className="text-xs text-slate-500 mb-3">
            The output contains your original columns plus the scorecard’s
            calculated fields. If validation errors occurred, you can download
            an errors file (if available).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Output */}
            <a
              href={outputReady ? data.outputUrl : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium"
              aria-disabled={!outputReady}
              onClick={(e) => {
                if (!outputReady) e.preventDefault();
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download output
            </a>

            {/* Errors (optional) */}
            <a
              href={data?.errorsUrl ? data.errorsUrl : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-4 py-2.5 text-sm font-medium border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 inline-flex items-center justify-center"
              aria-disabled={!data?.errorsUrl}
              onClick={(e) => {
                if (!data?.errorsUrl) e.preventDefault();
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download errors (optional)
            </a>
          </div>

          <p className="text-[11px] text-slate-400 mt-3">
            Links are pre-signed and expire after a short period. For repeated
            analysis, download and store files locally or in your analytics
            environment.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-primary rounded-xl px-5 py-2.5 text-sm font-medium inline-flex items-center gap-2"
            onClick={() =>
              navigate(
                `/tools/collections/scorecards/${encodeURIComponent(
                  scorecardKey
                )}/upload`
              )
            }
          >
            ← Run again
          </button>

          <button
            type="button"
            className="rounded-xl px-4 py-2.5 text-xs font-medium border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 inline-flex items-center gap-2"
            onClick={() => navigate("/tools/collections")}
          >
            Back to Collections tools
          </button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

