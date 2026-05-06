export const dateRange = [
  { label: "May 2025", ndvi: 0.65 },
  { label: "Apr 2025", ndvi: 0.62 },
  { label: "Mar 2025", ndvi: 0.58 },
  { label: "Feb 2025", ndvi: 0.55 },
  { label: "Jan 2025", ndvi: 0.53 },
  { label: "Dec 2024", ndvi: 0.50 },
  { label: "Nov 2024", ndvi: 0.47 },
  { label: "Oct 2024", ndvi: 0.45 },
];

export const bandOptions = [
  { id: "ndvi", label: "NDVI", description: "Vegetation Index" },
  { id: "rgb", label: "True Color", description: "RGB Composite" },
];

export const satellites = ["Sentinel-2"];

export const imageUrls = [
  "https://images.unsplash.com/photo-1570979872224-a1ea9f1248b0?w=1080&q=80",
  "https://images.unsplash.com/photo-1776012203102-a024822685cc?w=1080&q=80",
  "https://images.unsplash.com/photo-1686011872096-4010d5203166?w=1080&q=80",
  "https://images.unsplash.com/photo-1661619135472-4c85cdb3dc90?w=1080&q=80",
];

export const ndviLegendStops = [
  { value: "< 0", color: "#1a1a7a", label: "Water" },
  { value: "0.0", color: "#8B0000" },
  { value: "0.1", color: "#FF4500" },
  { value: "0.2", color: "#FF8C00" },
  { value: "0.3", color: "#FFD700" },
  { value: "0.4", color: "#9ACD32" },
  { value: "0.5", color: "#32CD32" },
  { value: "0.6", color: "#00CC66" },
  { value: "0.7+", color: "#00FF88" },
];
