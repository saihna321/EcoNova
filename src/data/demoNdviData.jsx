export const dashboardKpis = [
  {
    labelKey: "dashboard.meanNdvi",
    value: "0.56",
    change: "+0.18",
    positive: true,
    iconKey: "leaf",
    subKey: "dashboard.meanNdviSub",
    color: "mint",
  },
  {
    labelKey: "dashboard.vegetatedArea",
    value: "486 ha",
    change: "78%",
    positive: true,
    iconKey: "mapPin",
    subKey: "dashboard.vegetatedAreaSub",
    color: "blue",
  },
  {
    labelKey: "dashboard.baselineGain",
    value: "+0.36",
    change: "+12%",
    positive: true,
    iconKey: "activity",
    subKey: "dashboard.baselineGainSub",
    color: "violet",
  },
  {
    labelKey: "dashboard.dataConfidence",
    value: "94%",
    change: "Sentinel-2",
    positive: null,
    iconKey: "alertTriangle",
    subKey: "dashboard.dataConfidenceSub",
    color: "mint",
  },
];

export const ndviTrend = [
  { month: "Jun '24", ndvi: 0.21, baseline: 0.18 },
  { month: "Jul '24", ndvi: 0.23, baseline: 0.18 },
  { month: "Aug '24", ndvi: 0.25, baseline: 0.18 },
  { month: "Sep '24", ndvi: 0.28, baseline: 0.18 },
  { month: "Oct '24", ndvi: 0.32, baseline: 0.18 },
  { month: "Nov '24", ndvi: 0.35, baseline: 0.18 },
  { month: "Dec '24", ndvi: 0.38, baseline: 0.18 },
  { month: "Jan '25", ndvi: 0.36, baseline: 0.18 },
  { month: "Feb '25", ndvi: 0.40, baseline: 0.18 },
  { month: "Mar '25", ndvi: 0.43, baseline: 0.18 },
  { month: "Apr '25", ndvi: 0.46, baseline: 0.18 },
  { month: "May '25", ndvi: 0.48, baseline: 0.18 },
];

export const siteProgress = [
  {
    site: "Oyu Tolgoi Sector A",
    ndvi: 0.65,
    baseline: 0.22,
    target: 0.70,
    change: 0.43,
    area: 124,
    vegetatedArea: 108,
    decliningArea: 3,
    validPixels: 96,
    cloudCover: 4,
    status: "on-track",
  },
  {
    site: "Tavan Tolgoi West",
    ndvi: 0.58,
    baseline: 0.19,
    target: 0.65,
    change: 0.39,
    area: 287,
    vegetatedArea: 223,
    decliningArea: 12,
    validPixels: 91,
    cloudCover: 9,
    status: "on-track",
  },
  {
    site: "Nariin Sukhait Zone B",
    ndvi: 0.44,
    baseline: 0.18,
    target: 0.60,
    change: 0.26,
    area: 212,
    vegetatedArea: 155,
    decliningArea: 31,
    validPixels: 94,
    cloudCover: 6,
    status: "at-risk",
  },
];

export const portfolioNdviClasses = [
  { labelKey: "dashboard.bare", range: "< 0.15", area: 42, color: "#ef4444" },
  { labelKey: "dashboard.sparse", range: "0.15-0.30", area: 95, color: "#f97316" },
  { labelKey: "dashboard.moderate", range: "0.30-0.45", area: 167, color: "#eab308" },
  { labelKey: "dashboard.good", range: "0.45-0.60", area: 198, color: "#84cc16" },
  { labelKey: "dashboard.dense", range: "> 0.60", area: 121, color: "#22c55e" },
];

export const reportEvidence = [
  {
    labelKey: "dashboard.reportMap",
    value: "NDVI + RGB",
    subKey: "dashboard.reportMapSub",
  },
  {
    labelKey: "dashboard.reportStats",
    value: "Mean / min / max",
    subKey: "dashboard.reportStatsSub",
  },
  {
    labelKey: "dashboard.reportTrend",
    value: "12-month series",
    subKey: "dashboard.reportTrendSub",
  },
  {
    labelKey: "dashboard.reportAlerts",
    value: "3 flags",
    subKey: "dashboard.reportAlertsSub",
  },
];

export const recentImagery = [
  {
    id: 1,
    site: "Oyu Tolgoi Sector A",
    date: "May 3, 2025",
    satellite: "Sentinel-2",
    ndvi: 0.65,
    baseline: 0.22,
    target: 0.70,
    validPixels: 96,
    cloudCover: 4,
    url: "https://images.unsplash.com/photo-1570979872224-a1ea9f1248b0?w=400&q=80",
  },
  {
    id: 2,
    site: "Tavan Tolgoi West",
    date: "May 2, 2025",
    satellite: "Sentinel-2",
    ndvi: 0.58,
    baseline: 0.19,
    target: 0.65,
    validPixels: 91,
    cloudCover: 9,
    url: "https://images.unsplash.com/photo-1776012203102-a024822685cc?w=400&q=80",
  },
  {
    id: 3,
    site: "Nariin Sukhait Zone B",
    date: "Apr 30, 2025",
    satellite: "Sentinel-2",
    ndvi: 0.44,
    baseline: 0.18,
    target: 0.60,
    validPixels: 94,
    cloudCover: 6,
    url: "https://images.unsplash.com/photo-1661619135472-4c85cdb3dc90?w=400&q=80",
  },
];

export const quarterlyNdvi = [
  { q: "Q2 2022", oyu: 0.18, tavan: 0.12, nariin: 0.14 },
  { q: "Q3 2022", oyu: 0.21, tavan: 0.14, nariin: 0.17 },
  { q: "Q4 2022", oyu: 0.24, tavan: 0.17, nariin: 0.20 },
  { q: "Q1 2023", oyu: 0.28, tavan: 0.19, nariin: 0.23 },
  { q: "Q2 2023", oyu: 0.31, tavan: 0.22, nariin: 0.26 },
  { q: "Q3 2023", oyu: 0.35, tavan: 0.25, nariin: 0.30 },
  { q: "Q4 2023", oyu: 0.38, tavan: 0.27, nariin: 0.33 },
  { q: "Q1 2024", oyu: 0.41, tavan: 0.30, nariin: 0.36 },
  { q: "Q2 2024", oyu: 0.44, tavan: 0.32, nariin: 0.39 },
  { q: "Q3 2024", oyu: 0.47, tavan: 0.34, nariin: 0.41 },
  { q: "Q4 2024", oyu: 0.49, tavan: 0.36, nariin: 0.42 },
  { q: "Q1 2025", oyu: 0.52, tavan: 0.38, nariin: 0.44 },
];

export const siteColors = {
  oyu: "#22c55e",
  tavan: "#3b82f6",
  nariin: "#f59e0b",
};

export const siteLabels = {
  oyu: "Oyu Tolgoi",
  tavan: "Tavan Tolgoi",
  nariin: "Nariin Sukhait",
};
