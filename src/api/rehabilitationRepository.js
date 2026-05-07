import { demoAlerts } from "../data/demoAlerts";
import {
  dashboardKpis,
  ndviTrend,
  portfolioNdviClasses,
  recentImagery,
  reportEvidence,
  siteProgress,
} from "../data/demoNdviData";
import { demoReports } from "../data/demoReports";
import { demoSites } from "../data/demoSites";
import {
  getNdviImage,
  getNdviStatistics,
  getRgbImage,
  searchSentinel2Scenes,
} from "./sentinelHub/sentinelHubClient";
import { mapStatsResponseToTimeSeries } from "./sentinelHub/transformers";

export function getDemoRehabilitationData() {
  return {
    alerts: demoAlerts,
    dashboardKpis,
    ndviTrend,
    portfolioNdviClasses,
    recentImagery,
    reportEvidence,
    reports: demoReports,
    siteProgress,
    sites: demoSites,
  };
}

export async function getLiveSiteEvidence(params) {
  const {
    baselineNdvi,
    from,
    geometry,
    maxCloudCover = 30,
    signal,
    targetNdvi,
    to,
  } = params;

  let cloudLimit = maxCloudCover;
  let scenes = await searchSentinel2Scenes({
    geometry,
    from,
    maxCloudCover: cloudLimit,
    signal,
    to,
  });

  if (!scenes.features?.length && cloudLimit < 100) {
    cloudLimit = 100;
    scenes = await searchSentinel2Scenes({
      geometry,
      from,
      maxCloudCover: cloudLimit,
      signal,
      to,
    });
  }

  const [stats, ndviImage, rgbImage] = await Promise.all([
    getNdviStatistics({ geometry, from, maxCloudCover: cloudLimit, signal, to }),
    getNdviImage({ geometry, from, maxCloudCover: cloudLimit, signal, to }),
    getRgbImage({ geometry, from, maxCloudCover: cloudLimit, signal, to }),
  ]);

  return {
    cloudLimit,
    scenes,
    timeSeries: mapStatsResponseToTimeSeries(stats, baselineNdvi, targetNdvi),
    ndviImage,
    rgbImage,
  };
}
