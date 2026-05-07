const MONTH_INDEX = new Map([
  ["jan", 0],
  ["feb", 1],
  ["mar", 2],
  ["apr", 3],
  ["may", 4],
  ["jun", 5],
  ["jul", 6],
  ["aug", 7],
  ["sep", 8],
  ["oct", 9],
  ["nov", 10],
  ["dec", 11],
]);

export function parseSiteCoordinate(coords) {
  const match = coords.match(/([\d.]+)\s*([NS]),\s*([\d.]+)\s*([EW])/i);
  if (!match) {
    throw new Error(`Unsupported coordinate format: ${coords}`);
  }

  const latitude = Number(match[1]) * (match[2].toUpperCase() === "S" ? -1 : 1);
  const longitude = Number(match[3]) * (match[4].toUpperCase() === "W" ? -1 : 1);

  return { latitude, longitude };
}

export function makeSquareGeometryFromSite(site) {
  const { latitude, longitude } = parseSiteCoordinate(site.coords);
  const areaSquareMeters = site.area * 10000;
  const halfSideMeters = Math.sqrt(areaSquareMeters) / 2;
  const latDelta = halfSideMeters / 111320;
  const lonDelta = halfSideMeters / (111320 * Math.cos((latitude * Math.PI) / 180));

  return {
    type: "Polygon",
    coordinates: [[
      [longitude - lonDelta, latitude - latDelta],
      [longitude + lonDelta, latitude - latDelta],
      [longitude + lonDelta, latitude + latDelta],
      [longitude - lonDelta, latitude + latDelta],
      [longitude - lonDelta, latitude - latDelta],
    ]],
  };
}

export function makeMonthDateRange(label) {
  const [monthName, yearText] = label.split(/\s+/);
  const month = MONTH_INDEX.get(monthName.slice(0, 3).toLowerCase());
  const year = Number(yearText);

  if (!Number.isInteger(month) || !Number.isInteger(year)) {
    throw new Error(`Unsupported date label: ${label}`);
  }

  const from = new Date(Date.UTC(year, month, 1));
  const to = new Date(Date.UTC(year, month + 1, 1));

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}
