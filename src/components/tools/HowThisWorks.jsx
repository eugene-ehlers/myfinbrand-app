// src/components/tools/HowThisWorks.jsx
import React from "react";

export default function HowThisWorks({
  title = "How this calculator works",
  teaser,
  defaultOpen = false,
  children,
}) {
  return (
    <details
      className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm overflow-hidden"
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none select-none">
        <div className="p-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">{title}</div>
            {teaser ? (
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                {teaser}
              </div>
            ) : null}
          </div>

          {/* Chevron */}
          <div className="mt-0.5 shrink-0 text-slate-500">
            <span className="inline-block align-middle">▾</span>
          </div>
        </div>

        <div className="px-5 pb-4">
          <div className="h-px bg-slate-200" />
        </div>
      </summary>

      <div className="px-5 pb-5">
        <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-li:leading-relaxed">
          {children}
        </div>
      </div>

      {/* Small style tweaks for summary marker + open state */}
      <style>{`
        details > summary::-webkit-details-marker { display: none; }
        details[open] > summary span { transform: rotate(180deg); display: inline-block; }
      `}</style>
    </details>
  );
}
