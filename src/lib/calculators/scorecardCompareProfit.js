// src/lib/calculators/scorecardCompareProfit.js
import { computeScorecardProfitImpact } from "./scorecardProfitImpact.js";

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/**
 * Champion vs Challenger scorecard comparison
 *
 * Inputs are split into:
 *  - shared: portfolio + unit economics
 *  - champion: tpr/fpr at champion cut-off
 *  - challenger: tpr/fpr at challenger cut-off (or new scorecard)
 *
 * Returns:
 *  - champion results (same shape as computeScorecardProfitImpact)
 *  - challenger results
 *  - delta: challenger - champion (economics + key derived metrics)
 *  - technical: practical operating metrics (approval rate, bads booked per 1k, bad-rate-on-book, etc.)
 */
export function computeScorecardCompareProfit(inputs) {
  const {
    shared = {},
    champion = {},
    challenger = {},
  } = inputs || {};

  // Shared inputs (portfolio + economics)
  const monthlyApplications = clamp(Number(shared.monthlyApplications) || 0, 0, 1e12);
  const badRatePct = clamp(Number(shared.badRatePct) || 0, 0, 100);

  const profitPerGood = Number(shared.profitPerGood) || 0;
  const lossPerBad = Number(shared.lossPerBad) || 0;
  const opportunityCostPerGoodRejected =
    Number(shared.opportunityCostPerGoodRejected) || 0;

  // Champion performance
  const championTPR = clamp(Number(champion.truePositiveRatePct) || 0, 0, 100);
  const championFPR = clamp(Number(champion.falsePositiveRatePct) || 0, 0, 100);

  // Challenger performance
  const challengerTPR = clamp(Number(challenger.truePositiveRatePct) || 0, 0, 100);
  const challengerFPR = clamp(Number(challenger.falsePositiveRatePct) || 0, 0, 100);

  // Run both through the same engine (ensures consistency with your single-scorecard tool)
  const championResult = computeScorecardProfitImpact({
    monthlyApplications,
    badRatePct,
    truePositiveRatePct: championTPR,
    falsePositiveRatePct: championFPR,
    profitPerGood,
    lossPerBad,
    opportunityCostPerGoodRejected,
  });

  const challengerResult = computeScorecardProfitImpact({
    monthlyApplications,
    badRatePct,
    truePositiveRatePct: challengerTPR,
    falsePositiveRatePct: challengerFPR,
    profitPerGood,
    lossPerBad,
    opportunityCostPerGoodRejected,
  });

  // Convenience refs
  const c = championResult;
  const n = challengerResult;

  const safeDiv = (a, b) => (b && Number(b) !== 0 ? Number(a) / Number(b) : 0);

  // Operational/technical metrics (more meaningful than raw AUC/Gini for execs)
  const championApprovals = c.derived?.approvals ?? (c.confusionMatrix.tp + c.confusionMatrix.fp);
  const challengerApprovals = n.derived?.approvals ?? (n.confusionMatrix.tp + n.confusionMatrix.fp);

  const championBadRateOnBook = safeDiv(c.confusionMatrix.fp, championApprovals);
  const challengerBadRateOnBook = safeDiv(n.confusionMatrix.fp, challengerApprovals);

  const championBadsPer1k = safeDiv(c.confusionMatrix.fp, monthlyApplications) * 1000;
  const challengerBadsPer1k = safeDiv(n.confusionMatrix.fp, monthlyApplications) * 1000;

  const championGoodsPer1k = safeDiv(c.confusionMatrix.tp, monthlyApplications) * 1000;
  const challengerGoodsPer1k = safeDiv(n.confusionMatrix.tp, monthlyApplications) * 1000;

  // Delta (challenger - champion)
  const delta = {
    economics: {
      profitFromGoods: (n.economics.profitFromGoods || 0) - (c.economics.profitFromGoods || 0),
      lossFromBads: (n.economics.lossFromBads || 0) - (c.economics.lossFromBads || 0),
      opportunityCost: (n.economics.opportunityCost || 0) - (c.economics.opportunityCost || 0),
      netProfit: (n.economics.netProfit || 0) - (c.economics.netProfit || 0),
    },
    confusionMatrix: {
      tp: (n.confusionMatrix.tp || 0) - (c.confusionMatrix.tp || 0),
      fp: (n.confusionMatrix.fp || 0) - (c.confusionMatrix.fp || 0),
      fn: (n.confusionMatrix.fn || 0) - (c.confusionMatrix.fn || 0),
      tn: (n.confusionMatrix.tn || 0) - (c.confusionMatrix.tn || 0),
    },
    derived: {
      approvalRatePct: (n.derived.approvalRatePct || 0) - (c.derived.approvalRatePct || 0),
      profitPerThousandApps: (n.derived.profitPerThousandApps || 0) - (c.derived.profitPerThousandApps || 0),
      approvals: (n.derived.approvals || 0) - (c.derived.approvals || 0),
      rejections: (n.derived.rejections || 0) - (c.derived.rejections || 0),
    },
    technical: {
      badRateOnBookPct: (challengerBadRateOnBook - championBadRateOnBook) * 100,
      badsPer1k: challengerBadsPer1k - championBadsPer1k,
      goodsPer1k: challengerGoodsPer1k - championGoodsPer1k,
    },
  };

  const technical = {
    champion: {
      approvalRatePct: c.derived.approvalRatePct || 0,
      badRateOnBookPct: championBadRateOnBook * 100,
      badsPer1k: championBadsPer1k,
      goodsPer1k: championGoodsPer1k,
    },
    challenger: {
      approvalRatePct: n.derived.approvalRatePct || 0,
      badRateOnBookPct: challengerBadRateOnBook * 100,
      badsPer1k: challengerBadsPer1k,
      goodsPer1k: challengerGoodsPer1k,
    },
  };

  return {
    champion: championResult,
    challenger: challengerResult,
    delta,
    technical,
  };
}
