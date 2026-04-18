// Ranking category definitions used by both the UI and the scoring engine.
// `key` must match the field name returned by the server's transformed listing shape.

export const RANKING_CATEGORIES = [
  {
    key: "bedrooms",
    label: "Bedrooms",
    description: "Number of bedrooms",
    higherIsBetter: true,
  },
  {
    key: "bathrooms",
    label: "Bathrooms",
    description: "Number of bathrooms",
    higherIsBetter: true,
  },
  {
    key: "parking",
    label: "Parking Spaces",
    description: "Number of car spaces",
    higherIsBetter: true,
  },
  {
    key: "landSize",
    label: "Land Size",
    description: "Land area in sqm",
    higherIsBetter: true,
  },
  {
    key: "price",
    label: "Affordability",
    description: "Lower price scores higher",
    higherIsBetter: false,
  },
  {
    key: "distanceToCBD",
    label: "CBD Proximity",
    description: "Distance to Melbourne CBD (km) — lower is better",
    higherIsBetter: false,
  },
  {
    key: "daysOnMarket",
    label: "Days on Market",
    description: "Fewer days on market scores higher",
    higherIsBetter: false,
  },
  // These fields are null from the basic Domain API but are kept for
  // when enrichment data is connected (Phase 2 of the roadmap).
  {
    key: "schoolRating",
    label: "School Quality",
    description: "Nearby school rating — requires enrichment data",
    higherIsBetter: true,
  },
  {
    key: "capitalGrowthPct",
    label: "Capital Growth",
    description: "5yr avg annual growth % — requires enrichment data",
    higherIsBetter: true,
  },
  {
    key: "rentalYield",
    label: "Rental Yield",
    description: "Gross rental yield % — requires enrichment data",
    higherIsBetter: true,
  },
  {
    key: "walkScore",
    label: "Walkability",
    description: "Walk score 0-100 — requires enrichment data",
    higherIsBetter: true,
  },
];

export const PROPERTY_TYPES = ["All", "House", "Apartment", "Terrace", "Townhouse", "Land"];

const configuredApiBase = import.meta.env.VITE_API_BASE?.trim();

export const API_BASE = configuredApiBase || "";
