// src/pages/CollectionsResults.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function CollectionsResults() {
  const query = useQuery();
  const objectKey = query.get("objectKey");

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "rgb(var(--surface))" }}
    >
      <SiteHeader />

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
          Collections Strategy – Results
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Your collections file was uploaded successfully. The decision engine is
          processing the batch and writing SMS, email and dialler files to S3.
        </p>

        <div className="rounded-3xl border bg-white p-6 shadow-sm text-sm space-y-3">
          <div>
            <div className="font-medium text-slate-800">S3 object key</div>
            <div className="text-slate-600 break-all">
              {objectKey || "(no objectKey provided)"}
            </div>
          </div>

          <p className="text-xs text-slate-500">
            In the full demo, this page will list the generated action files
            (sms_actions.csv, email_actions.csv, dialler_actions.csv,
            suppressed.csv) and allow you to download them.
          </p>

          <div className="pt-3">
            <Link
              to="/collections-upload"
              className="text-xs text-blue-600 hover:underline"
            >
              ← Upload another collections file
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
