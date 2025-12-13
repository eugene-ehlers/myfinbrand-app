// src/lib/calculators/buildVsRentModels.js

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function computeBuildVsRentModels(inputs) {
  const {
    years, // default 3

    // In-house build assumptions
    oneOffBuildCost, // once-off build (team time etc.) or leave 0 and use staffing
    monthlyRunCost, // baseline monthly run cost for infra/tooling
    monthlyGovernanceCost, // monitoring, back-testing, reporting
    maintenancePctPerYear, // % of one-off build per year for enhancements/maintenance

    // Optional staffing model (if you prefer to estimate build/run from roles)
    useStaffingModel,
    buildMonths,
    dsMonthlyCost,
    deMonthlyCost,
    mlopsMonthlyCost,
    riskMonthlyCost,
    pmMonthlyCost,
    buildFteDs,
    buildFteDe,
    buildFteMlops,
    buildFteRisk,
    buildFtePm,

    // Rent / MaaS assumptions
    maasMonthlyFee,
    maasOneOffSetup,

    // Business impact: time-to-value (optional informational)
    inHouseTimeToValueMonths,
    maasTimeToValueMonths,
  } = inputs;

  const horizonYears = clamp(Number(years) || 3, 1, 10);
  const horizonMonths = horizonYears * 12;

  const maintenancePct = clamp(Number(maintenancePctPerYear) || 0, 0, 200) / 100;

  const inHouseMonthlyRun = clamp(Number(monthlyRunCost) || 0, 0, 1e12);
  const inHouseMonthlyGov = clamp(Number(monthlyGovernanceCost) || 0, 0, 1e12);
  const inHouseOneOff = clamp(Number(oneOffBuildCost) || 0, 0, 1e12);

  const rentMonthly = clamp(Number(maasMonthlyFee) || 0, 0, 1e12);
  const rentOneOff = clamp(Number(maasOneOffSetup) || 0, 0, 1e12);

  // Staffing build cost (optional)
  const staffingOn = Boolean(useStaffingModel);
  const bMonths = clamp(Number(buildMonths) || 0, 0, 60);

  const staffCost =
    (clamp(Number(dsMonthlyCost) || 0, 0, 1e12) * clamp(Number(buildFteDs) || 0, 0, 100) +
      clamp(Number(deMonthlyCost) || 0, 0, 1e12) * clamp(Number(buildFteDe) || 0, 0, 100) +
      clamp(Number(mlopsMonthlyCost) || 0, 0, 1e12) *
        clamp(Number(buildFteMlops) || 0, 0, 100) +
      clamp(Number(riskMonthlyCost) || 0, 0, 1e12) * clamp(Number(buildFteRisk) || 0, 0, 100) +
      clamp(Number(pmMonthlyCost) || 0, 0, 1e12) * clamp(Number(buildFtePm) || 0, 0, 100)) *
    bMonths;

  const effectiveOneOffBuild = staffingOn ? staffCost : inHouseOneOff;

  // Maintenance over horizon (annual % of one-off build)
  const maintenanceTotal = effectiveOneOffBuild * maintenancePct * horizonYears;

  // Total costs over horizon
  const inHouseTotal =
    effectiveOneOffBuild +
    maintenanceTotal +
    (inHouseMonthlyRun + inHouseMonthlyGov) * horizonMonths;

  const rentTotal = rentOneOff + rentMonthly * horizonMonths;

  const delta = inHouseTotal - rentTotal; // positive means MaaS cheaper

  const inHouseTtv = clamp(Number(inHouseTimeToValueMonths) || 0, 0, 120);
  const rentTtv = clamp(Number(maasTimeToValueMonths) || 0, 0, 120);

  return {
    horizon: { years: horizonYears, months: horizonMonths },
    inHouse: {
      oneOffBuild: effectiveOneOffBuild,
      maintenanceTotal,
      runTotal: inHouseMonthlyRun * horizonMonths,
      governanceTotal: inHouseMonthlyGov * horizonMonths,
      total: inHouseTotal,
      ttvMonths: inHouseTtv,
    },
    rent: {
      oneOffSetup: rentOneOff,
      feeTotal: rentMonthly * horizonMonths,
      total: rentTotal,
      ttvMonths: rentTtv,
    },
    comparison: {
      delta,
      cheaperOption: delta > 0 ? "Models-as-a-Service" : delta < 0 ? "In-house" : "Equal",
    },
  };
}
