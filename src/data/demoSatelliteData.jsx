export const dateRange = [
  { label: "May 2025", ndvi: 0.65, validPixels: 96, cloudCover: 4 },
  { label: "Apr 2025", ndvi: 0.62, validPixels: 94, cloudCover: 6 },
  { label: "Mar 2025", ndvi: 0.58, validPixels: 92, cloudCover: 8 },
  { label: "Feb 2025", ndvi: 0.55, validPixels: 89, cloudCover: 11 },
  { label: "Jan 2025", ndvi: 0.53, validPixels: 91, cloudCover: 9 },
  { label: "Dec 2024", ndvi: 0.50, validPixels: 93, cloudCover: 7 },
  { label: "Nov 2024", ndvi: 0.47, validPixels: 95, cloudCover: 5 },
  { label: "Oct 2024", ndvi: 0.45, validPixels: 90, cloudCover: 10 },
];

export const bandOptions = [
  { id: "ndvi", label: "NDVI", description: "Vegetation Index" },
  { id: "rgb", label: "True Color", description: "RGB Composite" },
];

export const satellites = ["Sentinel-2"];

export const imageUrls = [
  "https://images.unsplash.com/photo-1570979872224-a1ea9f1248b0?w=1080&q=80",
  "https://images.unsplash.com/photo-1776012203102-a024822685cc?w=1080&q=80",
  "https://images.unsplash.com/photo-1661619135472-4c85cdb3dc90?w=1080&q=80",
];

export const ndviLegendStops = [
  { value: "< 0", color: "#313695", label: "Water / shadow" },
  { value: "0.0", color: "#a50026", label: "Bare soil" },
  { value: "0.18", color: "#d73027", label: "Very sparse" },
  { value: "0.32", color: "#f46d43", label: "Sparse" },
  { value: "0.48", color: "#fdae61", label: "Moderate" },
  { value: "0.62", color: "#fee08b", label: "Recovering" },
  { value: "0.74", color: "#66bd63", label: "Healthy" },
  { value: "0.8+", color: "#006837", label: "Dense" },
];
