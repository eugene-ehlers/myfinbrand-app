// src/components/resources/ResourcesHeader.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function ResourcesHeader({
  title,
  description,
  helper, // optional: React node (e.g., cross-link line)
  featuredTitle = "Recommended starting points",
  featured, // optional: array of items
  isDocument, // function(item) => boolean
  filters, // optional: React node (your filter controls)
}) {
  const hasFeatured = Array.isArray(featured) && featured.length > 0;

  return (
    <header className="relative overflow-hidden border-b bg-white/70 backdrop-blur">
      {/* subtle glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, rgba(2,6,23,0.35) 0%, rgba(2,6,23,0.0) 70%)",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, rgba(43,212,224,0.28) 0%, rgba(43,212,224,0.0) 70%)",
          }}
        />
      </div>

      <div className="page-container mx-auto max-w-5xl px-4 pt-10 pb-6 relative">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs"
          style={{
            background: "rgba(43,212,224,0.10)",
            border: "1px solid rgba(43,212,224,0.22)",
            color: "rgb(15 23 42)",
          }}
        >
          Resources
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>

        {description ? (
          <p className="mt-2 text-slate-700">{description}</p>
        ) : null}

        {helper ? <div className="mt-1 text-sm text-slate-500">{helper}</div> : null}

        {hasFeatured ? (
          <section className="mt-6 rounded-3xl border bg-white/70 backdrop-blur p-4">
            <h2 className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
              {featuredTitle}
            </h2>

            <div className="mt-3 grid gap-4 md:grid-cols-3">
              {featured.map((a) => {
                const doc = isDocument?.(a);
                const Wrapper = doc ? "a" : Link;
                const wrapperProps = doc
                  ? { href: a.path, target: "_blank", rel: "noopener noreferrer" }
                  : { to: a.path };

                return (
                  <Wrapper
                    key={a.slug || a.path}
                    {...wrapperProps}
                    className="rounded-2xl border bg-white p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>{a.type}</span>
                      <span>{a.date}</span>
                    </div>

                    <h3 className="mt-2 text-sm font-semibold leading-snug">
                      {a.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-700 line-clamp-4">
                      {a.summary}
                    </p>
                  </Wrapper>
                );
              })}
            </div>
          </section>
        ) : null}

        {filters ? <div className="mt-8">{filters}</div> : null}
      </div>
    </header>
  );
}
