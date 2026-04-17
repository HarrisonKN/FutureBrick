/* ── FutureBrick – spreadsheet data model ── */

let _nextId = 100;
let _nextCriterionId = 0;

export const LIVE_RESULTS_PAGE_SIZE = 60;

export const SHEET_CRITERIA = [
  { key: "priceScore", label: "Price",       defaultWeight: 1.8,  helper: "Lower price is better" },
  { key: "masterBedroom", label: "Master bed",  defaultWeight: 1.6,  helper: "Comfort of the main bedroom" },
  { key: "otherRooms", label: "Other rooms", defaultWeight: 1.45, helper: "Flexibility of extra rooms" },
  { key: "kitchen", label: "Kitchen",     defaultWeight: 1.2,  helper: "Layout, finish, and usability" },
  { key: "loungeRoom", label: "Lounge",      defaultWeight: 1.1,  helper: "How strong the living zone feels" },
  { key: "bathroomsScore", label: "Bathrooms",   defaultWeight: 1.45, helper: "How well the bathrooms rate" },
  { key: "yard", label: "BackYard",        defaultWeight: 1.4,  helper: "Outdoor space and usability" },
  { key: "location", label: "Location",    defaultWeight: 1.9,  helper: "How strong the location feels" },
  { key: "specialties", label: "Specialties", defaultWeight: 1.15, helper: "Unique advantages or extras" },
];

export function createCustomCriterion() {
  _nextCriterionId += 1;
  return {
    key: `customCriterion${_nextCriterionId}`,
    label: `Extra ${_nextCriterionId}`,
    defaultWeight: 1,
    weight: 1,
    helper: "Custom criterion",
    isCustom: true,
  };
}

export function withAllScores(row, criteria = SHEET_CRITERIA) {
  const scores = { ...(row.scores ?? {}) };
  for (const criterion of criteria) {
    if (!Object.prototype.hasOwnProperty.call(scores, criterion.key)) {
      scores[criterion.key] = 3;
    }
  }

  return {
    ...row,
    scores,
  };
}

export function createEmptyRow(criteria = SHEET_CRITERIA) {
  _nextId += 1;
  return withAllScores({
    id: `new-${_nextId}`,
    address: "",
    price: 0,
    priceDisplay: "",
    dateInspected: "",
    bedrooms: 0,
    bathrooms: 0,
    toilets: 0,
    scores: {},
    notes: "",
  }, criteria);
}

const SAMPLE_ROW_LIBRARY = [
  {
    id: "sheet-1",
    address: "14 Elm Street, Northcote",
    suburb: "Northcote",
    propertyType: "Victorian terrace",
    price: 1250000,
    priceDisplay: "$1,250,000",
    dateInspected: "13 Apr",
    bedrooms: 3,
    bathrooms: 2,
    toilets: 2,
    parking: 1,
    landSize: 278,
    daysOnMarket: 11,
    scores: {
      priceScore: 4,
      masterBedroom: 5,
      otherRooms: 3,
      kitchen: 4,
      loungeRoom: 3,
      bathroomsScore: 4,
      yard: 3,
      location: 5,
      specialties: 4,
    },
    notes: "Strong inner-north location and great main bedroom, but the secondary bedrooms feel tight for long-term family use.",
  },
  {
    id: "sheet-2",
    address: "7/22 Fitzroy Street, St Kilda",
    suburb: "St Kilda",
    propertyType: "Apartment",
    price: 620000,
    priceDisplay: "$620,000",
    dateInspected: "12 Apr",
    bedrooms: 2,
    bathrooms: 1,
    toilets: 1,
    parking: 1,
    landSize: 0,
    daysOnMarket: 6,
    scores: {
      priceScore: 5,
      masterBedroom: 3,
      otherRooms: 2,
      kitchen: 4,
      loungeRoom: 4,
      bathroomsScore: 3,
      yard: 1,
      location: 5,
      specialties: 4,
    },
    notes: "Affordable bay-side option with good light and strong rental appeal, but no real outdoor space and limited flexibility.",
  },
  {
    id: "sheet-3",
    address: "88 Brunswick Road, Brunswick East",
    suburb: "Brunswick East",
    propertyType: "House",
    price: 980000,
    priceDisplay: "$980,000",
    dateInspected: "13 Apr",
    bedrooms: 3,
    bathrooms: 2,
    toilets: 2,
    parking: 2,
    landSize: 462,
    daysOnMarket: 19,
    scores: {
      priceScore: 4,
      masterBedroom: 4,
      otherRooms: 4,
      kitchen: 5,
      loungeRoom: 4,
      bathroomsScore: 4,
      yard: 5,
      location: 5,
      specialties: 5,
    },
    notes: "Very balanced family candidate: excellent backyard, strong kitchen renovation, and no obvious fatal flaw.",
  },
  {
    id: "sheet-4",
    address: "3 Hawthorn Grove, Hawthorn",
    suburb: "Hawthorn",
    propertyType: "Family house",
    price: 2100000,
    priceDisplay: "$2,100,000",
    dateInspected: "12 Apr",
    bedrooms: 4,
    bathrooms: 3,
    toilets: 3,
    parking: 2,
    landSize: 640,
    daysOnMarket: 9,
    scores: {
      priceScore: 2,
      masterBedroom: 5,
      otherRooms: 5,
      kitchen: 5,
      loungeRoom: 5,
      bathroomsScore: 5,
      yard: 5,
      location: 4,
      specialties: 5,
    },
    notes: "Premium turnkey family home with almost everything, but the price asks you to compromise hard on value.",
  },
  {
    id: "sheet-5",
    address: "12 Market Street, Footscray",
    suburb: "Footscray",
    propertyType: "Weatherboard",
    price: 760000,
    priceDisplay: "$760,000",
    dateInspected: "11 Apr",
    bedrooms: 3,
    bathrooms: 1,
    toilets: 1,
    parking: 0,
    landSize: 390,
    daysOnMarket: 34,
    scores: {
      priceScore: 5,
      masterBedroom: 3,
      otherRooms: 3,
      kitchen: 2,
      loungeRoom: 2,
      bathroomsScore: 2,
      yard: 4,
      location: 4,
      specialties: 2,
    },
    notes: "Classic renovator play: great entry price and decent land, but clearly behind on kitchen, bathrooms, and overall finish.",
  },
  {
    id: "sheet-6",
    address: "45/1 Southbank Boulevard, Southbank",
    suburb: "Southbank",
    propertyType: "Apartment",
    price: 890000,
    priceDisplay: "$890,000",
    dateInspected: "13 Apr",
    bedrooms: 2,
    bathrooms: 2,
    toilets: 1,
    parking: 1,
    landSize: 0,
    daysOnMarket: 14,
    scores: {
      priceScore: 4,
      masterBedroom: 3,
      otherRooms: 2,
      kitchen: 4,
      loungeRoom: 5,
      bathroomsScore: 4,
      yard: 1,
      location: 5,
      specialties: 5,
    },
    notes: "City lifestyle option with standout views and building amenities, though it trades away yard and layout flexibility.",
  },
  {
    id: "sheet-7",
    address: "9 Agnes Lane, Yarraville",
    suburb: "Yarraville",
    propertyType: "Townhouse",
    price: 1085000,
    priceDisplay: "$1,085,000",
    dateInspected: "10 Apr",
    bedrooms: 3,
    bathrooms: 2,
    toilets: 3,
    parking: 2,
    landSize: 210,
    daysOnMarket: 8,
    scores: {
      priceScore: 3,
      masterBedroom: 4,
      otherRooms: 3,
      kitchen: 4,
      loungeRoom: 4,
      bathroomsScore: 5,
      yard: 2,
      location: 4,
      specialties: 4,
    },
    notes: "Low-maintenance and polished with excellent bathroom count, but it doesn’t offer much outdoor room for kids or pets.",
  },
  {
    id: "sheet-8",
    address: "121 Union Road, Ascot Vale",
    suburb: "Ascot Vale",
    propertyType: "Edwardian",
    price: 1395000,
    priceDisplay: "$1,395,000",
    dateInspected: "09 Apr",
    bedrooms: 3,
    bathrooms: 2,
    toilets: 2,
    parking: 1,
    landSize: 301,
    daysOnMarket: 21,
    scores: {
      priceScore: 3,
      masterBedroom: 5,
      otherRooms: 3,
      kitchen: 5,
      loungeRoom: 4,
      bathroomsScore: 4,
      yard: 3,
      location: 4,
      specialties: 5,
    },
    notes: "Beautiful character home with a standout renovation; the compromise is mainly price relative to land size.",
  },
  {
    id: "sheet-9",
    address: "2 Merino Court, Werribee",
    suburb: "Werribee",
    propertyType: "House",
    price: 695000,
    priceDisplay: "$695,000",
    dateInspected: "14 Apr",
    bedrooms: 4,
    bathrooms: 2,
    toilets: 2,
    parking: 2,
    landSize: 612,
    daysOnMarket: 17,
    scores: {
      priceScore: 5,
      masterBedroom: 4,
      otherRooms: 5,
      kitchen: 3,
      loungeRoom: 4,
      bathroomsScore: 4,
      yard: 5,
      location: 2,
      specialties: 2,
    },
    notes: "Very strong value and family space story, but commute and location quality are the obvious tradeoff.",
  },
  {
    id: "sheet-10",
    address: "16 Peel Street, Collingwood",
    suburb: "Collingwood",
    propertyType: "Warehouse conversion",
    price: 1480000,
    priceDisplay: "$1,480,000",
    dateInspected: "15 Apr",
    bedrooms: 2,
    bathrooms: 2,
    toilets: 2,
    parking: 1,
    landSize: 0,
    daysOnMarket: 25,
    scores: {
      priceScore: 2,
      masterBedroom: 4,
      otherRooms: 2,
      kitchen: 5,
      loungeRoom: 5,
      bathroomsScore: 4,
      yard: 1,
      location: 5,
      specialties: 5,
    },
    notes: "Lifestyle-led choice with huge character and entertaining appeal, but expensive and not ideal for growing into extra rooms.",
  },
  {
    id: "sheet-11",
    address: "4 Peppercorn Drive, Point Cook",
    suburb: "Point Cook",
    propertyType: "New build",
    price: 940000,
    priceDisplay: "$940,000",
    dateInspected: "08 Apr",
    bedrooms: 4,
    bathrooms: 2,
    toilets: 2,
    parking: 2,
    landSize: 448,
    daysOnMarket: 13,
    scores: {
      priceScore: 4,
      masterBedroom: 4,
      otherRooms: 4,
      kitchen: 4,
      loungeRoom: 4,
      bathroomsScore: 4,
      yard: 4,
      location: 2,
      specialties: 3,
    },
    notes: "Comfortable all-rounder with no renovation risk, though it lacks a clear edge and sits in a weaker lifestyle location.",
  },
  {
    id: "sheet-12",
    address: "31 Vale Street, Flemington",
    suburb: "Flemington",
    propertyType: "Single-fronted terrace",
    price: 1120000,
    priceDisplay: "$1,120,000",
    dateInspected: "16 Apr",
    bedrooms: 2,
    bathrooms: 1,
    toilets: 1,
    parking: 0,
    landSize: 188,
    daysOnMarket: 5,
    scores: {
      priceScore: 3,
      masterBedroom: 4,
      otherRooms: 1,
      kitchen: 4,
      loungeRoom: 3,
      bathroomsScore: 2,
      yard: 2,
      location: 5,
      specialties: 4,
    },
    notes: "Beautifully presented and very well located, but clearly constrained on room count and long-term flexibility.",
  },
  {
    id: "sheet-13",
    address: "18 Bayview Parade, Altona",
    suburb: "Altona",
    propertyType: "House",
    price: 1310000,
    priceDisplay: "$1,310,000",
    dateInspected: "",
    bedrooms: 4,
    bathrooms: 2,
    toilets: 2,
    parking: 2,
    landSize: 530,
    daysOnMarket: 42,
    scores: {
      priceScore: 3,
      masterBedroom: 4,
      otherRooms: 4,
      kitchen: 3,
      loungeRoom: 4,
      bathroomsScore: 4,
      yard: 5,
      location: 3,
      specialties: 3,
    },
    notes: "Near-beach family option with excellent outdoor utility. Older presentation and missing inspection details make it feel slightly less certain.",
  },
  {
    id: "sheet-14",
    address: "5/77 High Street, Preston",
    suburb: "Preston",
    propertyType: "Unit",
    price: 0,
    priceDisplay: "Contact Agent",
    dateInspected: "17 Apr",
    bedrooms: 2,
    bathrooms: 1,
    toilets: 1,
    parking: 1,
    landSize: 96,
    daysOnMarket: 3,
    scores: {
      priceScore: 3,
      masterBedroom: 3,
      otherRooms: 2,
      kitchen: 3,
      loungeRoom: 3,
      bathroomsScore: 3,
      yard: 1,
      location: 4,
      specialties: 2,
    },
    notes: "Useful uncertainty case: compact, practical unit with no disclosed asking price yet, so value is harder to judge.",
  },
];

export const SAMPLE_SHEET_ROWS = [
  SAMPLE_ROW_LIBRARY[0],
  SAMPLE_ROW_LIBRARY[1],
  SAMPLE_ROW_LIBRARY[2],
  SAMPLE_ROW_LIBRARY[4],
  SAMPLE_ROW_LIBRARY[8],
  SAMPLE_ROW_LIBRARY[11],
];

/* ── helpers ── */

export function clampScore(value, min = 1, max = 5) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function formatCurrency(value) {
  if (!Number.isFinite(Number(value)) || Number(value) === 0) return "";
  return `$${Number(value).toLocaleString()}`;
}

export function weightedTotal(row, criteria) {
  return criteria.reduce((sum, c) => {
    const score = Number(row.scores?.[c.key] || 0);
    const weight = Number(c.weight ?? c.defaultWeight ?? 0);
    return sum + score * weight;
  }, 0);
}

export function attachTotals(rows, criteria) {
  return rows.map((row) => ({ ...row, total: weightedTotal(row, criteria) }));
}

export function sortByTotal(rows, criteria) {
  return [...attachTotals(rows, criteria)].sort((a, b) => b.total - a.total);
}

/* ── live row builder (Domain API → sheet rows) ── */

function normalizeScore(value, min, max, inverse = false) {
  if (!Number.isFinite(Number(value))) return 3;
  const range = max - min || 1;
  const normalized = Math.max(0, Math.min(1, (Number(value) - min) / range));
  const adjusted = inverse ? 1 - normalized : normalized;
  return clampScore(1 + adjusted * 4);
}

export function buildLiveSheetRows(properties = []) {
  const prices = properties.map((p) => p.price).filter(Number.isFinite);
  const dists  = properties.map((p) => p.distanceToCBD).filter(Number.isFinite);
  const lands  = properties.map((p) => p.landSize).filter(Number.isFinite);

  const minP = prices.length ? Math.min(...prices) : 0, maxP = prices.length ? Math.max(...prices) : 1;
  const minD = dists.length  ? Math.min(...dists)  : 0, maxD = dists.length  ? Math.max(...dists)  : 1;
  const minL = lands.length  ? Math.min(...lands)  : 0, maxL = lands.length  ? Math.max(...lands)  : 1;

  return properties.slice(0, LIVE_RESULTS_PAGE_SIZE).map((p, i) => {
    const beds = Number(p.bedrooms || 0);
    const baths = Number(p.bathrooms || 0);
    const land = Number(p.landSize || 0);
    const scores = p.scores || {
      priceScore:     normalizeScore(p.price, minP, maxP, true),
      masterBedroom:  clampScore(beds + (p.isNew ? 1 : 0) + ((p.description || "").length > 110 ? 1 : 0)),
      otherRooms:     clampScore(Math.max(1, beds - 1) + (land > 350 ? 1 : 0)),
      kitchen:        clampScore(3 + (["House", "Townhouse"].includes(p.propertyType) ? 1 : 0) + ((p.description || "").length > 120 ? 1 : 0)),
      loungeRoom:     clampScore(3 + (beds >= 4 ? 1 : 0) + (p.propertyType === "House" ? 1 : 0)),
      bathroomsScore: clampScore(baths + (p.parking > 1 ? 1 : 0)),
      yard:           normalizeScore(land, minL, maxL, false),
      location:       normalizeScore(p.distanceToCBD ?? maxD, minD, maxD, true),
      specialties:    clampScore(2 + [p.isNew, p.hasFloorplan, p.hasVideo, p.auctionDate].filter(Boolean).length),
    };
    return {
      id: String(p.id ?? `live-${i}`),
      address: p.address || p.suburb || `Property ${i + 1}`,
      price: p.price,
      priceDisplay: p.displayPrice || formatCurrency(p.price),
      dateInspected: p.inspectionTimes?.[0]?.openingTime
        ? new Date(p.inspectionTimes[0].openingTime).toLocaleDateString("en-AU", { day: "numeric", month: "short" })
        : p.dateListed || "—",
      bedrooms: p.bedrooms ?? 0,
      bathrooms: p.bathrooms ?? 0,
      toilets: p.bathrooms ?? 0,
      parking: p.parking ?? 0,
      landSize: p.landSize ?? 0,
      daysOnMarket: p.daysOnMarket ?? null,
      suburb: p.suburb ?? "",
      propertyType: p.propertyType ?? "",
      agencyName: p.agencyName ?? "",
      listingUrl: p.listingUrl ?? "",
      schoolRating: p.schoolRating ?? null,
      capitalGrowthPct: p.capitalGrowthPct ?? null,
      rentalYield: p.rentalYield ?? null,
      walkScore: p.walkScore ?? null,
      scores,
      notes: p.description || "",
      source: p,
      isSearchResult: true,
    };
  });
}

export function buildLiveSheetRowsWithCriteria(properties = [], criteria = SHEET_CRITERIA) {
  return buildLiveSheetRows(properties).map((row) => withAllScores(row, criteria));
}
