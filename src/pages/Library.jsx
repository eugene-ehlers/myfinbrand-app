// src/pages/Library.jsx

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";
import ResourcesHeader from "../components/resources/ResourcesHeader.jsx";

import { LIBRARY, LIBRARY_CATEGORIES, LIBRARY_TYPES } from "../data/libraryContent";

export default function Library() {
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");

  const sorted = useMemo(() => {
    return [...(LIBRARY || [])].sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return b.date.localeCompare(a.date);
    });
  }, []);

  const filtered = sorted.filter((item) => {
    const matchCategory =
      category === "All" ||
      item.category === category ||
      (Array.isArray(item.category) && item.category.includes(category));

    const matchType = type === "All" || item.type === type;
    return matchCategory && matchType;
  });

  const featured = useMemo(() => {
    return sorted
      .filter((i) => i.featured)
      .sort((a, b) => {
        const ar = Number.isFinite(a.featuredRank) ? a.featuredRank : 9999;
        const br = Number.isFinite(b.featuredRank) ? b.featuredRank : 9999;
        return ar - br || (b.date || "").localeCompare(a.date || "");
      });
  }, [sorted]);

  // If later you add PDFs to library, this keeps behaviour consistent
  const isDocument = (item) =>
    typeof item.path === "string" &&
    (item.path.endsWith(".pdf") || item.path.startsWith("/docs/"));

  const Filters = (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs uppercase tracking-wide text-slate-500">
          Category
        </span>
        <button
          type="button"
          onClick={() => setCategory("All")}
          className={`text-xs px-3 py-1 rounded-full border ${
            category === "All"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-700"
          }`}
        >
          All
        </button>
        {LIBRARY_CATEGORIES.map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => setCategory(c)}
            className={`text-xs px-3 py-1 rounded-full border ${
              category === c
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs uppercase tracking-wide text-slate-500">
          Type
        </span>
        <button
          type="button"
          onClick={() => setType("All")}
          className={`text-xs px-3 py-1 rounded-full border ${
            type === "All"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-700"
          }`}
        >
          All
        </button>
        {LIBRARY_TYPES.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setType(t)}
            className={`text-xs px-3 py-1 rounded-full border ${
              type === t ? "bg-slate-900 text-white" : "bg-white text-slate-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-slate-900" style={{ background: "rgb(var(--surface))
