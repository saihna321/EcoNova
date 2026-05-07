export const ndviStatsEvalscript = `//VERSION=3
function setup() {
  return {
    input: ["B04", "B08", "SCL", "dataMask"],
    output: [
      { id: "ndvi", bands: 1, sampleType: "FLOAT32" },
      { id: "dataMask", bands: 1 }
    ]
  };
}

function isCloud(sample) {
  return sample.SCL === 3 || sample.SCL === 8 || sample.SCL === 9 || sample.SCL === 10 || sample.SCL === 11;
}

function evaluatePixel(sample) {
  const ndvi = index(sample.B08, sample.B04);
  return {
    ndvi: [ndvi],
    dataMask: [sample.dataMask && !isCloud(sample) ? 1 : 0]
  };
}`;

export const ndviImageEvalscript = `//VERSION=3
function setup() {
  return {
    input: ["B04", "B08", "SCL", "dataMask"],
    output: { bands: 4 }
  };
}

function isCloud(sample) {
  return sample.SCL === 3 || sample.SCL === 8 || sample.SCL === 9 || sample.SCL === 10 || sample.SCL === 11;
}

function evaluatePixel(sample) {
  if (!sample.dataMask || isCloud(sample)) return [0, 0, 0, 0];
  const ndvi = index(sample.B08, sample.B04);
  if (ndvi < 0.15) return [0.94, 0.27, 0.20, 1];
  if (ndvi < 0.30) return [0.98, 0.55, 0.10, 1];
  if (ndvi < 0.45) return [0.92, 0.70, 0.13, 1];
  if (ndvi < 0.60) return [0.52, 0.80, 0.09, 1];
  return [0.13, 0.77, 0.37, 1];
}`;

export const rgbImageEvalscript = `//VERSION=3
function setup() {
  return {
    input: ["B02", "B03", "B04", "dataMask"],
    output: { bands: 4 }
  };
}

function evaluatePixel(sample) {
  return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02, sample.dataMask];
}`;
