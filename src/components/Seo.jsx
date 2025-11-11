import React, { useEffect } from "react";

/** Minimal, dependency-free SEO head writer for SPAs (React 19 compatible). */
export default function Seo({
  title,
  description,
  canonical,
  ogType = "website",
  rssHref,           // optional RSS link
  jsonLd = null,     // object or array of objects
}) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;

    const added = [];

    const upsertMeta = (attr, key, value) => {
      if (!value) return null;
      let el = document.head.querySelector(`${attr}[${key}="${attr === "meta" ? key : ""}"]`);
      // the selector above is awkward; do direct find:
      el = document.head.querySelector(`${attr}[${key}]${attr==="meta"?"":""}`);
      // Simpler: always create fresh
      el = document.createElement(attr);
      el.setAttribute(key.split("=")[0], key.split("=")[1] || "");
      return el;
    };

    const addMeta = (attrs) => {
      const el = document.createElement("meta");
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      document.head.appendChild(el);
      added.push(el);
    };

    const addLink = (attrs) => {
      const el = document.createElement("link");
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      document.head.appendChild(el);
      added.push(el);
    };

    // Basic tags
    if (description) addMeta({ name: "description", content: description });
    if (title)       addMeta({ property: "og:title", content: title });
    if (description) addMeta({ property: "og:description", content: description });
    if (ogType)      addMeta({ property: "og:type", content: ogType });
    if (canonical)   addLink({ rel: "canonical", href: canonical });
    if (rssHref)     addLink({ rel: "alternate", type: "application/rss+xml", title: "RSS", href: rssHref });

    // JSON-LD
    const scripts = [];
    const addJsonLd = (obj) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.text = JSON.stringify(obj);
      document.head.appendChild(s);
      scripts.push(s);
    };
    if (jsonLd) {
      if (Array.isArray(jsonLd)) jsonLd.forEach(addJsonLd);
      else addJsonLd(jsonLd);
    }

    return () => {
      // cleanup added nodes and restore title
      added.forEach((n) => n.remove());
      scripts.forEach((s) => s.remove());
      document.title = prevTitle;
    };
  }, [title, description, canonical, ogType, rssHref, JSON.stringify(jsonLd)]);

  return null;
}
