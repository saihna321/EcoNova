export const dashboardKpis = [
  {
    labelKey: "dashboard.vegetationHealth",
    value: "65%",
    change: "+12%",
    positive: true,
    iconKey: "leaf",
    subKey: "dashboard.healthSub",
    color: "mint",
  },
  {
    labelKey: "dashboard.trend",
    value: "+12%",
    change: "+4%",
    positive: true,
    iconKey: "activity",
    subKey: "dashboard.trendSub",
    color: "blue",
  },
  {
    labelKey: "dashboard.lastUpdated",
    value: "Today",
    change: "Sentinel-2",
    positive: null,
    iconKey: "mapPin",
    subKey: "dashboard.lastUpdatedSub",
    color: "violet",
  },
  {
    labelKey: "dashboard.alertStatus",
    value: "Stable",
    change: "0 critical",
    positive: null,
    iconKey: "alertTriangle",
    subKey: "dashboard.alertStatusSub",
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
  { site: "Oyu Tolgoi Sector A", ndvi: 0.65, target: 0.70, area: 124, status: "on-track" },
  { site: "Tavan Tolgoi West", ndvi: 0.58, target: 0.65, area: 287, status: "on-track" },
  { site: "Erdenet North Pit", ndvi: 0.61, target: 0.63, area: 95, status: "achieved" },
  { site: "Nariin Sukhait Zone B", ndvi: 0.44, target: 0.60, area: 212, status: "at-risk" },
  { site: "Baganuur Rehabilitation Area", ndvi: 0.50, target: 0.62, area: 341, status: "on-track" },
];

export const radarData = [
  { metric: "Vegetation Cover", value: 72 },
  { metric: "Soil Stability", value: 68 },
  { metric: "Species Diversity", value: 55 },
  { metric: "Canopy Height", value: 48 },
  { metric: "Water Retention", value: 63 },
  { metric: "Carbon Seq.", value: 41 },
];

export const recentImagery = [
  {
    id: 1,
    site: "Oyu Tolgoi Sector A",
    date: "May 3, 2025",
    satellite: "Sentinel-2",
    ndvi: 0.65,
    url: "https://images.unsplash.com/photo-1570979872224-a1ea9f1248b0?w=400&q=80",
  },
  {
    id: 2,
    site: "Tavan Tolgoi West",
    date: "May 2, 2025",
    satellite: "Sentinel-2",
    ndvi: 0.58,
    url: "https://images.unsplash.com/photo-1776012203102-a024822685cc?w=400&q=80",
  },
  {
    id: 3,
    site: "Erdenet North Pit",
    date: "May 1, 2025",
    satellite: "Sentinel-2",
    ndvi: 0.61,
    url: "https://images.unsplash.com/photo-1686011872096-4010d5203166?w=400&q=80",
  },
  {
    id: 4,
    site: "Nariin Sukhait Zone B",
    date: "Apr 30, 2025",
    satellite: "Sentinel-2",
    ndvi: 0.44,
    url: "https://images.unsplash.com/photo-1661619135472-4c85cdb3dc90?w=400&q=80",
  },
];

export const quarterlyNdvi = [
  { q: "Q2 2022", kalN: 0.18, pilW: 0.12, mtI: 0.25, hunV: 0.14, bowB: 0.09 },
  { q: "Q3 2022", kalN: 0.21, pilW: 0.14, mtI: 0.28, hunV: 0.17, bowB: 0.11 },
  { q: "Q4 2022", kalN: 0.24, pilW: 0.17, mtI: 0.32, hunV: 0.20, bowB: 0.12 },
  { q: "Q1 2023", kalN: 0.28, pilW: 0.19, mtI: 0.37, hunV: 0.23, bowB: 0.13 },
  { q: "Q2 2023", kalN: 0.31, pilW: 0.22, mtI: 0.41, hunV: 0.26, bowB: 0.15 },
  { q: "Q3 2023", kalN: 0.35, pilW: 0.25, mtI: 0.46, hunV: 0.30, bowB: 0.18 },
  { q: "Q4 2023", kalN: 0.38, pilW: 0.27, mtI: 0.50, hunV: 0.33, bowB: 0.20 },
  { q: "Q1 2024", kalN: 0.41, pilW: 0.30, mtI: 0.53, hunV: 0.36, bowB: 0.22 },
  { q: "Q2 2024", kalN: 0.44, pilW: 0.32, mtI: 0.56, hunV: 0.39, bowB: 0.24 },
  { q: "Q3 2024", kalN: 0.47, pilW: 0.34, mtI: 0.58, hunV: 0.41, bowB: 0.26 },
  { q: "Q4 2024", kalN: 0.49, pilW: 0.36, mtI: 0.60, hunV: 0.42, bowB: 0.27 },
  { q: "Q1 2025", kalN: 0.52, pilW: 0.38, mtI: 0.61, hunV: 0.44, bowB: 0.29 },
];

export const annualProgress = [
  { year: "2022", completed: 8, ongoing: 4, notStarted: 10 },
  { year: "2023", completed: 14, ongoing: 8, notStarted: 7 },
  { year: "2024", completed: 18, ongoing: 10, notStarted: 4 },
  { year: "2025", completed: 22, ongoing: 12, notStarted: 2 },
];

export const siteColors = {
  kalN: "#00FF88",
  pilW: "#3b82f6",
  mtI: "#a855f7",
  hunV: "#f59e0b",
  bowB: "#ef4444",
};

export const siteLabels = {
  kalN: "Oyu Tolgoi",
  pilW: "Tavan Tolgoi",
  mtI: "Erdenet",
  hunV: "Nariin Sukhait",
  bowB: "Baganuur",
};
