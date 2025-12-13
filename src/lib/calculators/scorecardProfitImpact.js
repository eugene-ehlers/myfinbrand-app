// src/lib/calculators/scorecardProfitImpact.js
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function computeScorecardProfitImpact(inputs) {
  const {
    monthlyApplications,
    badRatePct,

    truePositiveRatePct, // sensitivity (goods correctly approved)
    falsePositiveRatePct, // bads incorrectly approved

    profitPerGood,
    lossPerBad,
    opportunityCostPerGoodRejected,
  } = inputs;

  const apps = clamp(Number(monthlyApplications) || 0, 0, 1e12);
  const badRate = clamp(Number(badRatePct) || 0, 0, 100) / 100;
  const goodRate = 1 - badRate;

  const tpr = clamp(Number(truePositiveRatePct) || 0, 0, 100) / 100;
  const fpr = clamp(Number(falsePositiveRatePct) || 0, 0, 100) / 100;

  const profitGood = Number(profitPerGood) || 0;
  const lossBad = Number(lossPerBad) || 0;
  const oppCost = Number(opportunityCostPerGoodRejected) || 0;

  // Base populations
  const totalGoods = apps * goodRate;
  const totalBads = apps * badRate;

  // Confusion matrix (counts)
  const tp = totalGoods * tpr;
  const fn = totalGoods * (1 - tpr);
  const fp = totalBads * fpr;
  const tn = totalBads * (1 - fpr);

  // Economic attribution
  const profitFromGoods = tp * profitGood;
  const lossFromBads = fp * lossBad;
  const opportunityCost = fn * oppCost;

  const netProfit = profitFromGoods - (lossFromBads + opportunityCost);

  const approvals = tp + fp;
  const rejections = fn + tn;

  return {
    confusionMatrix: { tp, fp, fn, tn },
    economics: {
      profitFromGoods,
      lossFromBads,
      opportunityCost,
      netProfit,
    },
    derived: {
      approvals,
      rejections,
      approvalRatePct: apps > 0 ? (approvals / apps) * 100 : 0,
      profitPerThousandApps: apps > 0 ? (netProfit / apps) * 1000 : 0,
    },
  };
}
