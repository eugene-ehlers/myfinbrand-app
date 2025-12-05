export function computeRiskScore({ ratios, flags }) {
  let score = 70;

  if (flags?.length > 0) score -= 20;

  if (ratios.inflow_outflow_ratio < 1) score -= 15;

  return Math.max(0, Math.min(100, score));
}
