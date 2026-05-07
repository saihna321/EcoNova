import { request } from "../httpClient";
import {
  ndviImageEvalscript,
  ndviStatsEvalscript,
  rgbImageEvalscript,
} from "./evalscripts";

const SENTINEL_HUB_PROXY_PATH = "/sentinel-hub";
const SENTINEL_2_L2A_COLLECTION = "sentinel-2-l2a";
const SENTINEL_HUB_REQUEST_TIMEOUT_MS = 120000;
const PROCESSED_IMAGE_WIDTH = 2500;
const PROCESSED_IMAGE_HEIGHT = 1875;
const WGS84_CRS = "http://www.opengis.net/def/crs/EPSG/0/4326";
const SENTINEL_2_RESOLUTION_DEGREES = 0.0001;

export function searchSentinel2Scenes(params) {
  const {
    bbox,
    from,
    geometry,
    limit = 10,
    maxCloudCover = 30,
    signal,
    to,
  } = params;

  return request(`${SENTINEL_HUB_PROXY_PATH}/catalog/search`, {
    method: "POST",
    body: {
      bbox,
      intersects: geometry,
      datetime: `${from}/${to}`,
      collections: [SENTINEL_2_L2A_COLLECTION],
      limit,
      filter: `eo:cloud_cover <= ${maxCloudCover}`,
      fields: {
        include: [
          "id",
          "geometry",
          "properties.datetime",
          "properties.eo:cloud_cover",
        ],
      },
    },
    signal,
    timeoutMs: SENTINEL_HUB_REQUEST_TIMEOUT_MS,
  });
}

export function getNdviStatistics(params) {
  const {
    aggregationInterval = "P30D",
    from,
    geometry,
    maxCloudCover = 30,
    resolution = SENTINEL_2_RESOLUTION_DEGREES,
    signal,
    to,
  } = params;

  return request(`${SENTINEL_HUB_PROXY_PATH}/statistics`, {
    method: "POST",
    body: {
      input: {
        bounds: {
          geometry,
          properties: { crs: WGS84_CRS },
        },
        data: [
          {
            type: SENTINEL_2_L2A_COLLECTION,
            dataFilter: {
              timeRange: { from, to },
              maxCloudCoverage: maxCloudCover,
              mosaickingOrder: "leastCC",
              previewMode: "DETAIL",
            },
            processing: {
              upsampling: "BICUBIC",
              downsampling: "BICUBIC",
            },
          },
        ],
      },
      aggregation: {
        timeRange: { from, to },
        aggregationInterval: { of: aggregationInterval },
        resx: resolution,
        resy: resolution,
        evalscript: ndviStatsEvalscript,
      },
      calculations: {
        ndvi: {
          statistics: {
            default: {
              percentiles: { k: [10, 50, 90] },
            },
          },
          histograms: {
            default: {
              bins: [-1.000001, 0.15, 0.3, 0.45, 0.6, 1.000001],
            },
          },
        },
      },
    },
    signal,
    timeoutMs: SENTINEL_HUB_REQUEST_TIMEOUT_MS,
  });
}

export function getNdviImage(params) {
  return getProcessedImage({
    ...params,
    evalscript: ndviImageEvalscript,
    outputMimeType: "image/png",
  });
}

export function getRgbImage(params) {
  return getProcessedImage({
    ...params,
    evalscript: rgbImageEvalscript,
    outputMimeType: "image/png",
  });
}

function getProcessedImage(params) {
  const {
    evalscript,
    from,
    geometry,
    height = PROCESSED_IMAGE_HEIGHT,
    maxCloudCover = 30,
    outputMimeType,
    signal,
    to,
    width = PROCESSED_IMAGE_WIDTH,
  } = params;

  return request(`${SENTINEL_HUB_PROXY_PATH}/process`, {
    method: "POST",
    body: {
      input: {
        bounds: {
          geometry,
          properties: { crs: WGS84_CRS },
        },
        data: [
          {
            type: SENTINEL_2_L2A_COLLECTION,
            dataFilter: {
              timeRange: { from, to },
              maxCloudCoverage: maxCloudCover,
              mosaickingOrder: "leastCC",
              previewMode: "DETAIL",
            },
            processing: {
              upsampling: "BICUBIC",
              downsampling: "BICUBIC",
            },
          },
        ],
      },
      output: {
        width,
        height,
        responses: [
          {
            identifier: "default",
            format: { type: outputMimeType },
          },
        ],
      },
      evalscript,
    },
    signal,
    timeoutMs: SENTINEL_HUB_REQUEST_TIMEOUT_MS,
  });
}
