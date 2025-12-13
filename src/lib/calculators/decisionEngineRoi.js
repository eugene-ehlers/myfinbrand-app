// src/lib/calculators/decisionEngineRoi.js

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function computeDecisionEngineRoi(inputs) {
  const {
    monthlyApplications,
    avgMinutesPerDecision,
    fullyLoadedHourlyCost,

    currentApprovalRatePct,
    upliftApprovalPctPoints,

    avgGrossProfitPerApproved, // contribution margin per approved account
    currentLossRatePct, // of principal / exposure, simplified
    avgExposurePerApproved, // average principal / exposure
    lossReductionPctPoints,

    oneOffImplementationCost,
    monthlyPlatformCost,
  } = inputs;

  // Basic validations / clamps
  const apps = clamp(Number(monthlyApplications) || 0, 0, 1e9);
  const minutes = clamp(Number(avgMinutesPerDecision) || 0, 0, 1e5);
  const hourly = clamp(Number(fullyLoadedHourlyCost) || 0, 0, 1e9);

  const appr0 = clamp(Number(currentApprovalRatePct) || 0, 0, 100) / 100;
  const uplift = clamp(Number(upliftApprovalPctPoints) || 0, -100, 100) / 100;

  const grossPerApproved = clamp(Number(avgGrossProfitPerApproved) || 0, 0, 1e12);

  const lossRate0 = clamp(Number(currentLossRatePct) || 0, 0, 100) / 100;
  const exposure = clamp(Number(avgExposurePerApproved) || 0, 0, 1e12);
  const lossRed = clamp(Number(lossReductionPctPoints) || 0, -100, 100) / 100;

  const impl = clamp(Number(oneOffImplementationCost) || 0, 0, 1e12);
  const platform = clamp(Number(monthlyPlatformCost) || 0, 0, 1e12);

  // 1) Cost-to-serve savings: assume automation eliminates most manual handling time.
  // Conservative assumption: 70% of handling time saved (changeable per your preference).
  const timeSavedFactor = 0.7;
  const monthlyHoursSaved = (apps * minutes * timeSavedFactor) / 60;
  const monthlyOpsSavings = monthlyHoursSaved * hourly;

  // 2) Conversion (approval uplift) value: incremental approvals × gross profit per approved.
  const approvals0 = apps * appr0;
  const approvals1 = apps * clamp(appr0 + uplift, 0, 1);
  const incrementalApprovals = Math.max(0, approvals1 - approvals0);
  const monthlyConversionValue = incrementalApprovals * grossPerApproved;

  // 3) Loss reduction value: approvals × exposure × (loss rate reduction).
  // Using baseline approvals (or approvals1). Conservative: apply to approvals1.
  const lossRate1 = clamp(lossRate0 - lossRed, 0, 1);
  const monthlyExpectedLoss0 = approvals1 * exposure * lossRate0;
  const monthlyExpectedLoss1 = approvals1 * exposure * lossRate1;
  const monthlyLossAvoidance = Math.max(0, monthlyExpectedLoss0 - monthlyExpectedLoss1);

  // Costs
  const monthlyTotalCost = platform;
  const monthlyGrossValue =
    monthlyOpsSavings + monthlyConversionValue + monthlyLossAvoidance;

  const monthlyNetValue = monthlyGrossValue - monthlyTotalCost;

  const annualNetValue = monthlyNetValue * 12;
  const annualGrossValue = monthlyGrossValue * 12;
  const annualCost = monthlyTotalCost * 12;

  // Payback (months) on one-off cost, using monthly net value (if positive)
  const paybackMonths =
    monthlyNetValue > 0 ? impl / monthlyNetValue : null;

  // Simple 12-month ROI multiple on one-off cost (ignores time value)
  const roiMultiple =
    impl > 0 ? (annualNetValue - impl) / impl : null;

  return {
    breakdown: {
      monthlyOpsSavings,
      monthlyConversionValue,
      monthlyLossAvoidance,
      monthlyGrossValue,
      monthlyTotalCost,
      monthlyNetValue,
    },
    headline: {
      annualNetValue,
      annualGrossValue,
      annualCost,
      paybackMonths,
      roiMultiple,
      incrementalApprovals,
      monthlyHoursSaved,
    },
    derived: {
      approvals0,
      approvals1,
      lossRate0,
      lossRate1,
    },
  };
}
