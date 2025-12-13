// src/lib/calculators/scorecardProfitImpact.js

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function computeScorecardProfitImpact(inputs) {
  const {
    monthlyApplications,
    badRatePct,

    approvalRatePct,
    truePositiveRatePct, // sensitivity
    falsePositiveRatePct,

    profitPerGood,
    lossPerBad,
    opportunityCostPerGoodRejected,
  } = inputs;

  const apps = clamp(Number(monthlyApplications) || 0, 0, 1e12);
  const badRate = clamp(Number(badRatePct) || 0, 0, 100) / 100;
  const goodRate = 1 - badRate;

  const approvalRate = clamp(Number(approvalRatePct) || 0, 0, 100) / 100;
  const tpr = clamp(Number(truePositiveRatePct) || 0, 0, 100) / 100;
  const fpr = clamp(Number(falsePositiveRatePct) || 0, 0, 100) / 100;

  const profitGood = Number(profitPerGood) || 0;
  const lossBad = Number(lossPerBad) || 0;
  const oppCost = Number(opportunityCostPerGoodRejected) || 0;

  // Base populations
  const totalGoods = apps * goodRate;
  const totalBads = apps * badRate;

  // Confusion matrix
  const tp = totalGoods * tpr;
  const fn = totalGoods * (1 - tpr);
  const fp = totalBads * fpr;
  const tn = totalBads * (1 - fpr);

  // Economic attribution
  const profitFromGoods = tp * profitGood;
  const lossFromBads = fp * lossBad;
  const opportunityCost = fn * oppCost;

  const grossValue = profitFromGoods;
  const grossCost = lossFromBads + opportunityCost;

  const netProfit = grossValue - grossCost;

  return {
    confusionMatrix: { tp, fp, fn, tn },
    economics: {
      profitFromGoods,
      lossFromBads,
      opportunityCost,
      netProfit,
    },
    derived: {
      approvals: tp + fp,
      rejections: fn + tn,
      profitPerThousandApps: (netProfit / apps) * 1000,
    },
  };
}
