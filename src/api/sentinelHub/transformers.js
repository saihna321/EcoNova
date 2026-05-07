export const ndviClasses = [
  { key: "bare", labelKey: "dashboard.bare", min: -1, max: 0.15 },
  { key: "sparse", labelKey: "dashboard.sparse", min: 0.15, max: 0.3 },
  { key: "moderate", labelKey: "dashboard.moderate", min: 0.3, max: 0.45 },
  { key: "good", labelKey: "dashboard.good", min: 0.45, max: 0.6 },
  { key: "dense", labelKey: "dashboard.dense", min: 0.6, max: 1 },
];

export function getRecoveryStatus(ndvi, targetNdvi) {
  const ratio = ndvi / targetNdvi;
  if (ratio >= 1) return "achieved";
  if (ratio >= 0.75) return "on-track";
  if (ratio >= 0.5) return "at-risk";
  return "critical";
}

export function getValidPixelPercent(stats) {
  const sampleCount = stats?.sampleCount ?? 0;
  const noDataCount = stats?.noDataCount ?? 0;
  if (!sampleCount) return 0;
  return Math.round(((sampleCount - noDataCount) / sampleCount) * 100);
}

export function mapStatsIntervalToNdviPoint(interval, baselineNdvi, targetNdvi) {
  const band = interval.outputs?.ndvi?.bands?.B0;
  const stats = band?.stats ?? {};
  const mean = stats.mean ?? 0;

  return {
    from: interval.interval?.from,
    to: interval.interval?.to,
    meanNdvi: mean,
    medianNdvi: band?.stats?.percentiles?.["50.0"] ?? mean,
    minNdvi: stats.min ?? mean,
    maxNdvi: stats.max ?? mean,
    baselineNdvi,
    targetNdvi,
    ndviChange: mean - baselineNdvi,
    status: getRecoveryStatus(mean, targetNdvi),
    validPixels: getValidPixelPercent(stats),
  };
}

export function mapStatsResponseToTimeSeries(response, baselineNdvi, targetNdvi) {
  return (response?.data ?? []).map((interval) =>
    mapStatsIntervalToNdviPoint(interval, baselineNdvi, targetNdvi)
  );
}
