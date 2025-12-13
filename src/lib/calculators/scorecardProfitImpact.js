// src/lib/calculators/scorecardProfitImpact.js

/**
 * Clamp numeric values to safe ranges
 */
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/**
 * Compute profit impact of a credit scorecard using
 * a confusion-matrix-based economic model.
 *
 * IMPORTANT:
 * - This evaluates a scorecard at a GIVEN cut-off
 * - It does NOT optimise technical metrics (AUC, Gini, KS)
 * - Focus is purely on business profitability
 */
export function computeScorecardProfitImpact(inputs) {
  const {
    monthlyApplications,
    badRatePct,

    truePositiveRatePct,  // % of goods correctly approved
    falsePositiveRatePct, // % of bads incorrectly approved

    profitPerGood,
    lossPerBad,
    opportunityCostPerGoodRejected,
  } = inputs;

  // ---- Base volumes ----
  const apps = clamp(Number(monthlyApplications) || 0, 0, 1e12);

  const badRate = clamp(Number(badRatePct) || 0, 0, 100) / 100;
  const goodRate = 1 - badRate;

  const totalGoods = apps * goodRate;
  const totalBads = apps * badRate;

  // ---- Scorecard performance ----
  const tpr = clamp(Number(truePositiveRatePct) || 0, 0, 100) / 100;
  const fpr = clamp(Number(falsePositiveRatePct) || 0, 0, 100) / 100;

  // ---- Confusion matrix (counts) ----
  const truePositives = totalGoods * tpr;
  const falseNegatives = totalGoods * (1 - tpr);

  const falsePositives = totalBads * fpr;
  const trueNegatives = totalBads * (1 - fpr);

  // ---- Economics ----
  const profitGood = Number(profitPerGood) || 0;
  const lossBad = Number(lossPerBad) || 0;
  const oppCost = Number(opportunityCostPerGoodRejected) || 0;

  const profitFromGoods = truePositives * profitGood;
  const lossFromBads = falsePositives * lossBad;
  const opportunityCost = falseNegatives * oppCost;

  const netProfit =
    profitFromGoods - (lossFromBads + opportunityCost);

  const approvals = truePositives + falsePositives;
  const rejections = falseNegatives + trueNegatives;

  // ---- Derived business metrics ----
  const approvalRatePct =
    apps > 0 ? (approvals / apps) * 100 : 0;

  const profitPerThousandApps =
    apps > 0 ? (netProfit / apps) * 1000 : 0;

  return {
    confusionMatrix: {
      tp: truePositives,
      fp: falsePositives,
      fn: falseNegatives,
      tn: trueNegatives,
    },
    economics: {
      profitFromGoods,
      lossFromBads,
      opportunityCost,
      netProfit,
    },
    derived: {
      approvals,
      rejections,
      approvalRatePct,
      profitPerThousandApps,
    },
  };
}

