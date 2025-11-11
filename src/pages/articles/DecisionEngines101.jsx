import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";

export default function Insights() {
  const articles = [
    {
      title: "Decision Engines 101: From Rules to ROI",
      summary:
        "A practical primer on decision automation: architecture, governance, and a 90-day rollout plan.",
      path: "/insights/decision-engines-101",
      date: "2025-11-10",
      read: "8 min read",
      tags: ["Decision Automation", "Credit", "Risk"],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Seo
        title="Insights | The Smart Decision Group"
        description="White papers and practical guides on decision engines, credit origination automation, and analytics ROI."
        canonical="https://www.tsdg.co.za/insights"
        ogType="website"
        rssHref="https://www.tsdg.co.za/feed.xml"
      />

      <header className="page-container mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Insights</h1>
        <p className="mt-2 text-slate-600">
          Research notes, white papers, and how-tos for decision intelligence leaders.
        </p>
      </header>

      <main className="page-container mx-auto max-5xl px-4 pb-16">
        <div className="grid gap-5 sm:grid-cols-2">
          {articles.map((a) => (
            <Link key={a.path} to={a.path} className="rounded-2xl border p-5 hover:shadow transition-shadow">
              <div className="text-sm text-slate-500">{a.date} • {a.read}</div>
              <h2 className="mt-1 text-xl font-semibold">{a.title}</h2>
              <p className="mt-2 text-slate-700">{a.summary}</p>
              <div className="mt-3 flex gap-2 flex-wrap">
                {a.tags.map(t => (
                  <span key={t} className="text-xs rounded-full border px-2 py-0.5">{t}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
