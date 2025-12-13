// src/lib/calculators/manualUnderwritingCost.js

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function computeManualUnderwritingCost(inputs) {
  const {
    monthlyCases,
    avgMinutesPerCase,
    reworkRatePct,
    reworkMinutesPerCase,

    fullyLoadedHourlyCost,
    workHoursPerFtePerMonth,

    peakToAverageRatio, // 1.0 = flat, 1.3 = 30% peak
    targetSlaDays, // optional, informative only
  } = inputs;

  const cases = clamp(Number(monthlyCases) || 0, 0, 1e12);
  const mins = clamp(Number(avgMinutesPerCase) || 0, 0, 1e6);

  const reworkRate = clamp(Number(reworkRatePct) || 0, 0, 100) / 100;
  const reworkMins = clamp(Number(reworkMinutesPerCase) || 0, 0, 1e6);

  const hourly = clamp(Number(fullyLoadedHourlyCost) || 0, 0, 1e9);
  const fteHours = clamp(Number(workHoursPerFtePerMonth) || 0, 1, 1e6);

  const peak = clamp(Number(peakToAverageRatio) || 1, 1, 10);

  // Effective time per case includes rework component
  const effectiveMinutesPerCase = mins + reworkRate * reworkMins;

  // Monthly workload
  const monthlyTotalMinutes = cases * effectiveMinutesPerCase;
  const monthlyTotalHours = monthlyTotalMinutes / 60;

  // FTE needed at average
  const fteRequiredAvg = monthlyTotalHours / fteHours;

  // Peak month workload and FTE
  const peakMonthlyHours = monthlyTotalHours * peak;
  const fteRequiredPeak = peakMonthlyHours / fteHours;

  // Cost
  const monthlyCostAvg = monthlyTotalHours * hourly;
  const monthlyCostPeak = peakMonthlyHours * hourly;

  // “Peak premium” vs average (not exactly overtime, but shows capacity strain)
  const peakPremiumCost = Math.max(0, monthlyCostPeak - monthlyCostAvg);

  // Optional SLA messaging (kept as derived only; no hard modelling)
  const slaDays = clamp(Number(targetSlaDays) || 0, 0, 365);

  return {
    derived: {
      effectiveMinutesPerCase,
      monthlyTotalHours,
      peakMonthlyHours,
      fteRequiredAvg,
      fteRequiredPeak,
      monthlyCostAvg,
      monthlyCostPeak,
      peakPremiumCost,
      slaDays,
    },
  };
}
