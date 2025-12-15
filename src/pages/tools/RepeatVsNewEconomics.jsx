import React, { useState } from "react";
import Seo from "../../components/Seo.jsx";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";

export default function RepeatVsNewEconomics() {
  const [inputs, setInputs] = useState({
    newRevenue: 100,
    newCost: 60,
    repeatRevenue: 100,
    repeatCost: 30,
  });

  const handleChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: Number(e.target.value) });

  const newProfit = inputs.newRevenue - inputs.newCost;
  const repeatProfit = inputs.repeatRevenue - inputs.repeatCost;

  return (
    <div className="min-h-screen bg-[rgb(var(--surface))] text-slate-900">
      <Seo
        title="Repeat vs New Customer Economics | TSDG"
        description="A simple comparison of profitability and cost-to-serve between new and repeat customers."
      />

      <SiteHeader />

      <main className="page-container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold">
          Repeat vs New Customer Economics
        </h1>

        <p className="mt-4 text-slate-700">
          This tool helps you compare the economics of acquiring new customers
          versus serving repeat or loyal ones.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-4">
            <h2 className="font-semibold">New customer</h2>

            <label className="block mt-3 text-sm">
              Revenue per customer
              <input
                name="newRevenue"
                type="number"
                value={inputs.newRevenue}
                onChange={handleChange}
                className="mt-1 w-full border rounded p-2"
              />
            </label>

            <label className="block mt-3 text-sm">
              Cost-to-serve
              <input
                name="newCost"
                type="number"
                value={inputs.newCost}
                onChange={handleChange}
                className="mt-1 w-full border rounded p-2"
              />
            </label>

            <div className="mt-4 text-sm">
              <strong>Profit:</strong> {newProfit}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-4">
            <h2 className="font-semibold">Repeat customer</h2>

            <label className="block mt-3 text-sm">
              Revenue per customer
              <input
                name="repeatRevenue"
                type="number"
                value={inputs.repeatRevenue}
                onChange={handleChange}
                className="mt-1 w-full border rounded p-2"
              />
            </label>

            <label className="block mt-3 text-sm">
              Cost-to-serve
              <input
                name="repeatCost"
                type="number"
                value={inputs.repeatCost}
                onChange={handleChange}
                className="mt-1 w-full border rounded p-2"
              />
            </label>

            <div className="mt-4 text-sm">
              <strong>Profit:</strong> {repeatProfit}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border bg-slate-50 p-6">
          <h2 className="text-lg font-semibold">What this suggests</h2>

          <p className="mt-3 text-slate-700">
            {repeatProfit > newProfit
              ? "Repeat customers appear materially more profitable under your assumptions. Improving speed, consistency, and automation for repeat decisions often has outsized impact."
              : "New customer acquisition appears more profitable under your assumptions. Ensure this accounts for effort, volatility, and long-term sustainability."}
          </p>

          <p className="mt-4 text-sm text-slate-600">
            This comparison is illustrative. The value lies in understanding
            relative economics, not exact figures.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
