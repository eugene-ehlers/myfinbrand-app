// src/components/FounderBio.jsx
import React from "react";

export default function FounderBio() {
  return (
    <section id="founder" className="mt-16 border-t pt-10">
      <h2 className="text-xl font-semibold tracking-tight">
        About the Founder
      </h2>
      <p className="mt-3 text-slate-700">
        Eugene Ehlers is a seasoned credit executive, data strategist, and founder
        of <span className="font-semibold">The Smart Decision Group</span>, with
        over two decades of experience transforming how organisations make
        decisions. His career spans banking, retail, insurance, and consulting—
        often in environments facing strategic, operational, or financial pressure.
      </p>
      <p className="mt-3 text-slate-700">
        Eugene’s expertise sits at the intersection of{" "}
        <span className="font-semibold">
          credit risk, predictive modelling, data science, and automated decisioning
        </span>
        . He has led multiple enterprise-wide turnarounds by modernising data
        platforms, introducing scorecards and machine learning models, and deploying
        scalable decision engines.
      </p>
      <p className="mt-3 text-slate-700">
        Before founding The Smart Decision Group, he held senior roles including
        Credit Executive, Head of Enterprise Risk Management, Head of Pricing &
        Profitability, and Head of Underwriting at large South African financial
        institutions. He also served as Treasurer and Manco member at SACRRA,
        contributing to the governance and quality of national credit data.
      </p>
      <p className="mt-3 text-slate-700">
        Today, Eugene helps organisations modernise their decision capabilities
        through <span className="font-semibold">data, analytics, automation, and
        model-as-a-service offerings</span>, enabling them to compete confidently
        in the digital economy.
      </p>
    </section>
  );
}
