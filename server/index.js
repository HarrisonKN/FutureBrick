import "dotenv/config";
import process from "node:process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, "..", "dist");
const INDEX_HTML = path.join(DIST_DIR, "index.html");

app.use(cors());
app.use(express.json());

// ── Melbourne CBD distance lookup ─────────────────────────────────────────────
const CBD_DISTANCES = {
  "Richmond": 4.2, "Fitzroy": 3.0, "Fitzroy North": 3.8, "Hawthorn": 7.1,
  "Footscray": 5.5, "St Kilda": 6.2, "Glen Waverley": 22.0, "Brunswick": 5.0,
  "Williamstown": 11.0, "Carlton": 2.0, "South Yarra": 4.0, "Prahran": 4.5,
  "Collingwood": 3.5, "Northcote": 6.0, "Preston": 9.0, "Coburg": 8.0,
  "Reservoir": 11.0, "Heidelberg": 14.0, "Box Hill": 14.5, "Camberwell": 10.0,
  "Balwyn": 11.0, "Doncaster": 16.0, "Ringwood": 25.0, "Blackburn": 20.0,
  "Burwood": 14.0, "Clayton": 19.0, "Caulfield": 9.5, "Brighton": 11.0,
  "Elsternwick": 9.0, "Moonee Ponds": 7.5, "Essendon": 10.0, "Sunshine": 12.0,
  "Dandenong": 29.0, "Frankston": 40.0, "Werribee": 32.0, "Melton": 35.0,
  "Pakenham": 55.0, "Berwick": 43.0, "Cranbourne": 45.0, "Doncaster East": 17.0,
  "Glen Iris": 9.0, "Malvern": 8.0, "Toorak": 6.5, "Armadale": 7.0,
  "Kew": 8.0, "Ivanhoe": 11.0, "South Melbourne": 2.5, "Port Melbourne": 3.5,
  "Albert Park": 4.0, "Middle Park": 5.0, "Elwood": 7.5, "Bentleigh": 14.0,
  "Oakleigh": 16.0, "Cheltenham": 17.0, "Mentone": 22.0, "Templestowe": 18.0,
  "Eltham": 22.0, "Mill Park": 20.0, "Moorabbin": 15.0, "Ascot Vale": 6.5,
  "Flemington": 4.8, "Kensington": 3.8, "Thornbury": 7.0, "Abbotsford": 3.2,
  "Newport": 8.5, "Yarraville": 6.8, "Seddon": 7.0, "Altona": 14.0,
};

// ── Mock listings database ────────────────────────────────────────────────────
// Shape mirrors the Domain API transform output exactly — ready to swap for
// live Domain API data by restoring the proxy version of this file.
const MOCK_LISTINGS = [
  {
    id: 2001,
    address: "14 Elm Street",
    suburb: "Richmond",
    state: "VIC",
    postcode: "3121",
    price: 1250000,
    displayPrice: "$1,250,000",
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    landSize: 312,
    propertyType: "House",
    description: "Beautifully renovated Victorian terrace on a quiet tree-lined street, walking distance to Bridge Road cafes and Richmond station. Features period detail with modern finishes throughout.",
    image: null,
    allImages: [],
    daysOnMarket: 8,
    distanceToCBD: CBD_DISTANCES["Richmond"],
    listingUrl: "https://www.domain.com.au/14-elm-street-richmond-vic-3121",
    agencyName: "Marshall White Richmond",
    isNew: false,
    hasFloorplan: true,
    hasVideo: false,
    auctionDate: "2026-04-26T11:00:00",
    inspectionTimes: [{ openingTime: "2026-04-13T11:00:00", closingTime: "2026-04-13T11:30:00" }],
    dateListed: "2026-04-03",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2002,
    address: "7/22 Fitzroy Street",
    suburb: "St Kilda",
    state: "VIC",
    postcode: "3182",
    price: 620000,
    displayPrice: "$620,000",
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    landSize: null,
    propertyType: "Apartment",
    description: "Stylish top-floor apartment with sweeping bay views from the private balcony. Light-filled open plan living, stone kitchen benchtops, and secure basement parking. Walk to the beach and Acland Street.",
    image: null,
    allImages: [],
    daysOnMarket: 14,
    distanceToCBD: CBD_DISTANCES["St Kilda"],
    listingUrl: "https://www.domain.com.au/7-22-fitzroy-street-st-kilda-vic-3182",
    agencyName: "Hocking Stuart St Kilda",
    isNew: false,
    hasFloorplan: true,
    hasVideo: true,
    auctionDate: null,
    inspectionTimes: [{ openingTime: "2026-04-12T10:00:00", closingTime: "2026-04-12T10:30:00" }],
    dateListed: "2026-03-28",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2003,
    address: "88 Brunswick Road",
    suburb: "Brunswick",
    state: "VIC",
    postcode: "3056",
    price: 980000,
    displayPrice: "$980,000",
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    landSize: 404,
    propertyType: "House",
    description: "Character-filled Edwardian with a stunning rear extension. Open-plan kitchen and dining flow to a north-facing deck and landscaped garden. Double garage, polished boards, and solar panels.",
    image: null,
    allImages: [],
    daysOnMarket: 5,
    distanceToCBD: CBD_DISTANCES["Brunswick"],
    listingUrl: "https://www.domain.com.au/88-brunswick-road-brunswick-vic-3056",
    agencyName: "Nelson Alexander Brunswick",
    isNew: true,
    hasFloorplan: true,
    hasVideo: false,
    auctionDate: "2026-04-27T10:30:00",
    inspectionTimes: [{ openingTime: "2026-04-13T10:00:00", closingTime: "2026-04-13T10:30:00" }],
    dateListed: "2026-04-06",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2004,
    address: "3 Hawthorn Grove",
    suburb: "Hawthorn",
    state: "VIC",
    postcode: "3122",
    price: 2100000,
    displayPrice: "$2,100,000",
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    landSize: 620,
    propertyType: "House",
    description: "Grand Edwardian family home on a premier street, meticulously updated while retaining original character. Formal lounge, modern kitchen, alfresco entertaining area, and landscaped rear garden with pool.",
    image: null,
    allImages: [],
    daysOnMarket: 21,
    distanceToCBD: CBD_DISTANCES["Hawthorn"],
    listingUrl: "https://www.domain.com.au/3-hawthorn-grove-hawthorn-vic-3122",
    agencyName: "Jellis Craig Hawthorn",
    isNew: false,
    hasFloorplan: true,
    hasVideo: true,
    auctionDate: "2026-04-19T11:00:00",
    inspectionTimes: [{ openingTime: "2026-04-12T12:30:00", closingTime: "2026-04-12T13:00:00" }],
    dateListed: "2026-03-21",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2005,
    address: "12 Market Street",
    suburb: "Footscray",
    state: "VIC",
    postcode: "3011",
    price: 760000,
    displayPrice: "$760,000",
    bedrooms: 3,
    bathrooms: 1,
    parking: 1,
    landSize: 336,
    propertyType: "House",
    description: "Classic workers cottage on a generous block, perfect for renovation or development (STCA). Walking distance to Footscray Market, cafes and the train station. Huge upside potential in a rapidly gentrifying suburb.",
    image: null,
    allImages: [],
    daysOnMarket: 31,
    distanceToCBD: CBD_DISTANCES["Footscray"],
    listingUrl: "https://www.domain.com.au/12-market-street-footscray-vic-3011",
    agencyName: "Barry Plant Footscray",
    isNew: false,
    hasFloorplan: false,
    hasVideo: false,
    auctionDate: null,
    inspectionTimes: [],
    dateListed: "2026-03-11",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2006,
    address: "45/1 Southbank Boulevard",
    suburb: "South Melbourne",
    state: "VIC",
    postcode: "3006",
    price: 890000,
    displayPrice: "$890,000",
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    landSize: null,
    propertyType: "Apartment",
    description: "High-floor apartment in the prestigious Eureka precinct with uninterrupted city and bay views. Floor-to-ceiling glazing, premium finishes, concierge, resort-style pool and gym.",
    image: null,
    allImages: [],
    daysOnMarket: 18,
    distanceToCBD: CBD_DISTANCES["South Melbourne"],
    listingUrl: "https://www.domain.com.au/45-1-southbank-boulevard-south-melbourne-vic-3006",
    agencyName: "RT Edgar Melbourne",
    isNew: false,
    hasFloorplan: true,
    hasVideo: false,
    auctionDate: null,
    inspectionTimes: [{ openingTime: "2026-04-13T14:00:00", closingTime: "2026-04-13T14:30:00" }],
    dateListed: "2026-03-24",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2007,
    address: "19 Camberwell Road",
    suburb: "Camberwell",
    state: "VIC",
    postcode: "3124",
    price: 1650000,
    displayPrice: "$1,650,000",
    bedrooms: 4,
    bathrooms: 2,
    parking: 2,
    landSize: 720,
    propertyType: "House",
    description: "Stunning renovated family home on a 720sqm allotment. Spacious open-plan living, gourmet kitchen with butler's pantry, master retreat with ensuite and WIR, and a heated pool in the private garden.",
    image: null,
    allImages: [],
    daysOnMarket: 12,
    distanceToCBD: CBD_DISTANCES["Camberwell"],
    listingUrl: "https://www.domain.com.au/19-camberwell-road-camberwell-vic-3124",
    agencyName: "Fletchers Canterbury",
    isNew: false,
    hasFloorplan: true,
    hasVideo: true,
    auctionDate: "2026-04-26T10:00:00",
    inspectionTimes: [{ openingTime: "2026-04-12T11:00:00", closingTime: "2026-04-12T11:30:00" }],
    dateListed: "2026-03-30",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2008,
    address: "5 Toorak Avenue",
    suburb: "Toorak",
    state: "VIC",
    postcode: "3142",
    price: 3800000,
    displayPrice: "$3,800,000",
    bedrooms: 5,
    bathrooms: 4,
    parking: 3,
    landSize: 980,
    propertyType: "House",
    description: "Architecturally designed masterpiece behind secure gates on one of Toorak's finest avenues. Soaring ceilings, bespoke kitchen, wine cellar, home theatre, heated pool and spa, and a triple garage.",
    image: null,
    allImages: [],
    daysOnMarket: 44,
    distanceToCBD: CBD_DISTANCES["Toorak"],
    listingUrl: "https://www.domain.com.au/5-toorak-avenue-toorak-vic-3142",
    agencyName: "Kay & Burton South Yarra",
    isNew: false,
    hasFloorplan: true,
    hasVideo: true,
    auctionDate: null,
    inspectionTimes: [{ openingTime: "2026-04-12T13:00:00", closingTime: "2026-04-12T13:30:00" }],
    dateListed: "2026-02-27",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2009,
    address: "31 Beach Street",
    suburb: "Brighton",
    state: "VIC",
    postcode: "3186",
    price: 2450000,
    displayPrice: "$2,450,000",
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    landSize: 580,
    propertyType: "House",
    description: "Immaculate contemporary family home moments from the beach and Church Street village. Entertainer's kitchen, luxe master suite, heated pool, and a double lock-up garage. In the zone for Brighton Grammar and Firbank.",
    image: null,
    allImages: [],
    daysOnMarket: 9,
    distanceToCBD: CBD_DISTANCES["Brighton"],
    listingUrl: "https://www.domain.com.au/31-beach-street-brighton-vic-3186",
    agencyName: "Buxton Brighton",
    isNew: true,
    hasFloorplan: true,
    hasVideo: false,
    auctionDate: "2026-04-26T11:30:00",
    inspectionTimes: [{ openingTime: "2026-04-13T11:30:00", closingTime: "2026-04-13T12:00:00" }],
    dateListed: "2026-04-02",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2010,
    address: "2/8 Albert Road",
    suburb: "South Yarra",
    state: "VIC",
    postcode: "3141",
    price: 780000,
    displayPrice: "$780,000",
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    landSize: null,
    propertyType: "Apartment",
    description: "Bright and spacious apartment in a boutique block. Generous open-plan living, stone kitchen, private courtyard and secure parking. Walk to Chapel Street, Prahran Market and South Yarra station.",
    image: null,
    allImages: [],
    daysOnMarket: 22,
    distanceToCBD: CBD_DISTANCES["South Yarra"],
    listingUrl: "https://www.domain.com.au/2-8-albert-road-south-yarra-vic-3141",
    agencyName: "Hocking Stuart South Yarra",
    isNew: false,
    hasFloorplan: false,
    hasVideo: false,
    auctionDate: null,
    inspectionTimes: [{ openingTime: "2026-04-13T10:30:00", closingTime: "2026-04-13T11:00:00" }],
    dateListed: "2026-03-20",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2011,
    address: "67 Victoria Parade",
    suburb: "Fitzroy",
    state: "VIC",
    postcode: "3065",
    price: 1480000,
    displayPrice: "$1,480,000",
    bedrooms: 4,
    bathrooms: 2,
    parking: 1,
    landSize: 280,
    propertyType: "Terrace",
    description: "Magnificent double-fronted terrace over three levels with sweeping city views from the rooftop deck. Architect-designed interiors, custom kitchen, hydronic heating, and polished concrete floors.",
    image: null,
    allImages: [],
    daysOnMarket: 7,
    distanceToCBD: CBD_DISTANCES["Fitzroy"],
    listingUrl: "https://www.domain.com.au/67-victoria-parade-fitzroy-vic-3065",
    agencyName: "Woodards Fitzroy",
    isNew: true,
    hasFloorplan: true,
    hasVideo: false,
    auctionDate: "2026-04-27T11:00:00",
    inspectionTimes: [{ openingTime: "2026-04-12T10:30:00", closingTime: "2026-04-12T11:00:00" }],
    dateListed: "2026-04-04",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2012,
    address: "10 Malvern Road",
    suburb: "Malvern",
    state: "VIC",
    postcode: "3144",
    price: 1920000,
    displayPrice: "$1,920,000",
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    landSize: 650,
    propertyType: "House",
    description: "Substantial Californian Bungalow with a superb contemporary extension. Formal and informal living areas, stone kitchen, master suite with dual WIR, pool and cabana, and a double carport.",
    image: null,
    allImages: [],
    daysOnMarket: 15,
    distanceToCBD: CBD_DISTANCES["Malvern"],
    listingUrl: "https://www.domain.com.au/10-malvern-road-malvern-vic-3144",
    agencyName: "Biggin & Scott Malvern",
    isNew: false,
    hasFloorplan: true,
    hasVideo: true,
    auctionDate: "2026-04-19T10:00:00",
    inspectionTimes: [{ openingTime: "2026-04-12T14:00:00", closingTime: "2026-04-12T14:30:00" }],
    dateListed: "2026-03-27",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2013,
    address: "25 Church Street",
    suburb: "Abbotsford",
    state: "VIC",
    postcode: "3067",
    price: 1150000,
    displayPrice: "$1,150,000",
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    landSize: 240,
    propertyType: "Townhouse",
    description: "Sleek freestanding townhouse moments from the Yarra Trail and Victoria Street restaurant strip. Rooftop terrace, open-plan living, secure parking, and high-end appliances throughout.",
    image: null,
    allImages: [],
    daysOnMarket: 3,
    distanceToCBD: CBD_DISTANCES["Abbotsford"],
    listingUrl: "https://www.domain.com.au/25-church-street-abbotsford-vic-3067",
    agencyName: "Jellis Craig Fitzroy",
    isNew: true,
    hasFloorplan: true,
    hasVideo: false,
    auctionDate: "2026-04-26T12:00:00",
    inspectionTimes: [{ openingTime: "2026-04-12T09:30:00", closingTime: "2026-04-12T10:00:00" }],
    dateListed: "2026-04-08",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2014,
    address: "9 Esplanade",
    suburb: "Elwood",
    state: "VIC",
    postcode: "3184",
    price: 1750000,
    displayPrice: "$1,750,000",
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    landSize: 350,
    propertyType: "House",
    description: "Art Deco gem directly opposite the beach with original period features and a stunning modern renovation. Sunlit living areas, north-facing courtyard, and a short stroll to Elwood village.",
    image: null,
    allImages: [],
    daysOnMarket: 10,
    distanceToCBD: CBD_DISTANCES["Elwood"],
    listingUrl: "https://www.domain.com.au/9-esplanade-elwood-vic-3184",
    agencyName: "Buxton St Kilda",
    isNew: false,
    hasFloorplan: true,
    hasVideo: false,
    auctionDate: "2026-04-27T12:00:00",
    inspectionTimes: [{ openingTime: "2026-04-13T12:00:00", closingTime: "2026-04-13T12:30:00" }],
    dateListed: "2026-04-01",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2015,
    address: "4 Yarraville Place",
    suburb: "Yarraville",
    state: "VIC",
    postcode: "3013",
    price: 870000,
    displayPrice: "$870,000",
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    landSize: 370,
    propertyType: "House",
    description: "Beautifully presented weatherboard home in the heart of the village. Updated kitchen and bathrooms, polished floorboards, off-street parking for two, and a private rear deck surrounded by established gardens.",
    image: null,
    allImages: [],
    daysOnMarket: 19,
    distanceToCBD: CBD_DISTANCES["Yarraville"],
    listingUrl: "https://www.domain.com.au/4-yarraville-place-yarraville-vic-3013",
    agencyName: "Jas Stephens Yarraville",
    isNew: false,
    hasFloorplan: false,
    hasVideo: false,
    auctionDate: "2026-04-26T09:30:00",
    inspectionTimes: [{ openingTime: "2026-04-13T09:00:00", closingTime: "2026-04-13T09:30:00" }],
    dateListed: "2026-03-23",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2016,
    address: "101 Heidelberg Road",
    suburb: "Heidelberg",
    state: "VIC",
    postcode: "3084",
    price: 1050000,
    displayPrice: "$1,050,000",
    bedrooms: 4,
    bathrooms: 2,
    parking: 2,
    landSize: 680,
    propertyType: "House",
    description: "Solid brick family home on a large 680sqm block with subdivision potential (STCA). Three living areas, updated kitchen, in-ground pool, double garage, and plenty of room to extend.",
    image: null,
    allImages: [],
    daysOnMarket: 38,
    distanceToCBD: CBD_DISTANCES["Heidelberg"],
    listingUrl: "https://www.domain.com.au/101-heidelberg-road-heidelberg-vic-3084",
    agencyName: "Ray White Heidelberg",
    isNew: false,
    hasFloorplan: false,
    hasVideo: false,
    auctionDate: null,
    inspectionTimes: [{ openingTime: "2026-04-12T11:30:00", closingTime: "2026-04-12T12:00:00" }],
    dateListed: "2026-03-04",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2017,
    address: "8/50 Queens Road",
    suburb: "Albert Park",
    state: "VIC",
    postcode: "3206",
    price: 1100000,
    displayPrice: "$1,100,000",
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    landSize: null,
    propertyType: "Apartment",
    description: "Stunning full-floor apartment overlooking Albert Park Lake. North-facing entertainers terrace, premium stone finishes, climate control, concierge, and direct park access.",
    image: null,
    allImages: [],
    daysOnMarket: 6,
    distanceToCBD: CBD_DISTANCES["Albert Park"],
    listingUrl: "https://www.domain.com.au/8-50-queens-road-albert-park-vic-3206",
    agencyName: "Marshall White Port Phillip",
    isNew: true,
    hasFloorplan: true,
    hasVideo: true,
    auctionDate: null,
    inspectionTimes: [{ openingTime: "2026-04-13T13:00:00", closingTime: "2026-04-13T13:30:00" }],
    dateListed: "2026-04-05",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2018,
    address: "55 Nicholson Street",
    suburb: "Coburg",
    state: "VIC",
    postcode: "3058",
    price: 840000,
    displayPrice: "$840,000",
    bedrooms: 3,
    bathrooms: 1,
    parking: 1,
    landSize: 450,
    propertyType: "House",
    description: "Charming Victorian cottage on a good-sized block, retaining original fireplaces and cornices. Recently updated kitchen and bathroom. A tram stop on the doorstep and a short walk to Sydney Road.",
    image: null,
    allImages: [],
    daysOnMarket: 27,
    distanceToCBD: CBD_DISTANCES["Coburg"],
    listingUrl: "https://www.domain.com.au/55-nicholson-street-coburg-vic-3058",
    agencyName: "Nelson Alexander Coburg",
    isNew: false,
    hasFloorplan: false,
    hasVideo: false,
    auctionDate: "2026-04-19T10:30:00",
    inspectionTimes: [{ openingTime: "2026-04-12T10:00:00", closingTime: "2026-04-12T10:30:00" }],
    dateListed: "2026-03-15",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2019,
    address: "22 High Street",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
    price: 2800000,
    displayPrice: "$2,800,000",
    bedrooms: 5,
    bathrooms: 3,
    parking: 2,
    landSize: 850,
    propertyType: "House",
    description: "Exceptional period family home of grand proportions. Five bedrooms, formal and informal living, gourmet kitchen, alfresco dining, in-ground pool, and a large rear garden. In the prestigious Kew East school zones.",
    image: null,
    allImages: [],
    daysOnMarket: 16,
    distanceToCBD: CBD_DISTANCES["Kew"],
    listingUrl: "https://www.domain.com.au/22-high-street-kew-vic-3101",
    agencyName: "Jellis Craig Kew",
    isNew: false,
    hasFloorplan: true,
    hasVideo: true,
    auctionDate: "2026-04-26T10:30:00",
    inspectionTimes: [{ openingTime: "2026-04-13T10:00:00", closingTime: "2026-04-13T10:30:00" }],
    dateListed: "2026-03-26",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2020,
    address: "3/77 Flemington Road",
    suburb: "Flemington",
    state: "VIC",
    postcode: "3031",
    price: 550000,
    displayPrice: "$550,000",
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    landSize: null,
    propertyType: "Apartment",
    description: "Spacious apartment in a well-maintained complex, freshly painted with new carpet. Two good-sized bedrooms, updated kitchen and bathroom, covered parking, and a private courtyard.",
    image: null,
    allImages: [],
    daysOnMarket: 42,
    distanceToCBD: CBD_DISTANCES["Flemington"],
    listingUrl: "https://www.domain.com.au/3-77-flemington-road-flemington-vic-3031",
    agencyName: "Raine & Horne Kensington",
    isNew: false,
    hasFloorplan: false,
    hasVideo: false,
    auctionDate: null,
    inspectionTimes: [{ openingTime: "2026-04-12T15:00:00", closingTime: "2026-04-12T15:30:00" }],
    dateListed: "2026-02-28",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2021,
    address: "14 Waverley Drive",
    suburb: "Glen Waverley",
    state: "VIC",
    postcode: "3150",
    price: 1380000,
    displayPrice: "$1,380,000",
    bedrooms: 4,
    bathrooms: 2,
    parking: 2,
    landSize: 720,
    propertyType: "House",
    description: "Family home in the prestigious Glen Waverley Secondary College zone. Four bedrooms plus study, formal and family living, renovated kitchen, alfresco deck, in-ground pool, and double garage.",
    image: null,
    allImages: [],
    daysOnMarket: 11,
    distanceToCBD: CBD_DISTANCES["Glen Waverley"],
    listingUrl: "https://www.domain.com.au/14-waverley-drive-glen-waverley-vic-3150",
    agencyName: "Ray White Glen Waverley",
    isNew: false,
    hasFloorplan: true,
    hasVideo: false,
    auctionDate: "2026-04-26T11:00:00",
    inspectionTimes: [{ openingTime: "2026-04-13T11:00:00", closingTime: "2026-04-13T11:30:00" }],
    dateListed: "2026-03-31",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2022,
    address: "6 Preston Avenue",
    suburb: "Preston",
    state: "VIC",
    postcode: "3072",
    price: 920000,
    displayPrice: "$920,000",
    bedrooms: 3,
    bathrooms: 1,
    parking: 1,
    landSize: 520,
    propertyType: "House",
    description: "Solid brick home on a wide 520sqm block with rear ROW access and a large garage. Renovated kitchen with stone benchtops, open-plan living to a sun-drenched deck, and a generous backyard.",
    image: null,
    allImages: [],
    daysOnMarket: 24,
    distanceToCBD: CBD_DISTANCES["Preston"],
    listingUrl: "https://www.domain.com.au/6-preston-avenue-preston-vic-3072",
    agencyName: "Nelson Alexander Preston",
    isNew: false,
    hasFloorplan: false,
    hasVideo: false,
    auctionDate: "2026-04-19T11:30:00",
    inspectionTimes: [{ openingTime: "2026-04-12T09:00:00", closingTime: "2026-04-12T09:30:00" }],
    dateListed: "2026-03-18",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2023,
    address: "18 Thornbury Lane",
    suburb: "Thornbury",
    state: "VIC",
    postcode: "3071",
    price: 1050000,
    displayPrice: "$1,050,000",
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    landSize: 310,
    propertyType: "House",
    description: "Stylish renovated home blending original character with modern living. Open-plan kitchen and dining, polished hardwood floors, heated bathroom floors, and a private north-facing courtyard. Walk to High Street.",
    image: null,
    allImages: [],
    daysOnMarket: 4,
    distanceToCBD: CBD_DISTANCES["Thornbury"],
    listingUrl: "https://www.domain.com.au/18-thornbury-lane-thornbury-vic-3071",
    agencyName: "Woodards Northcote",
    isNew: true,
    hasFloorplan: true,
    hasVideo: false,
    auctionDate: "2026-04-26T10:00:00",
    inspectionTimes: [{ openingTime: "2026-04-13T10:00:00", closingTime: "2026-04-13T10:30:00" }],
    dateListed: "2026-04-07",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2024,
    address: "33 Caulfield Road",
    suburb: "Caulfield",
    state: "VIC",
    postcode: "3162",
    price: 1420000,
    displayPrice: "$1,420,000",
    bedrooms: 4,
    bathrooms: 2,
    parking: 2,
    landSize: 590,
    propertyType: "House",
    description: "Beautifully updated family home set back from the street in a whisper-quiet pocket. Spacious formal lounge, open-plan living and dining, granite kitchen, master with ensuite, and a sunny rear garden.",
    image: null,
    allImages: [],
    daysOnMarket: 20,
    distanceToCBD: CBD_DISTANCES["Caulfield"],
    listingUrl: "https://www.domain.com.au/33-caulfield-road-caulfield-vic-3162",
    agencyName: "Gary Peer Caulfield",
    isNew: false,
    hasFloorplan: true,
    hasVideo: false,
    auctionDate: "2026-04-26T10:30:00",
    inspectionTimes: [{ openingTime: "2026-04-12T12:00:00", closingTime: "2026-04-12T12:30:00" }],
    dateListed: "2026-03-22",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
  {
    id: 2025,
    address: "77 Newport Street",
    suburb: "Newport",
    state: "VIC",
    postcode: "3015",
    price: 1180000,
    displayPrice: "$1,180,000",
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    landSize: 430,
    propertyType: "House",
    description: "Architecturally extended Victorian on a quiet street minutes from Newport station and the bay. Soaring raked ceilings, polished concrete kitchen, main bedroom retreat, and a generous north-facing garden.",
    image: null,
    allImages: [],
    daysOnMarket: 13,
    distanceToCBD: CBD_DISTANCES["Newport"],
    listingUrl: "https://www.domain.com.au/77-newport-street-newport-vic-3015",
    agencyName: "Jas Stephens Newport",
    isNew: false,
    hasFloorplan: true,
    hasVideo: false,
    auctionDate: "2026-04-27T10:00:00",
    inspectionTimes: [{ openingTime: "2026-04-12T13:30:00", closingTime: "2026-04-12T14:00:00" }],
    dateListed: "2026-03-29",
    schoolRating: null, capitalGrowthPct: null, rentalYield: null, walkScore: null,
  },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function roundToNearest(value, step = 5000) {
  return Math.round(value / step) * step;
}

function formatDisplayPrice(value) {
  return `$${Number(value).toLocaleString()}`;
}

function createVariantAddress(address, variantIndex) {
  if (variantIndex === 0) return address;
  if (/^\d+\/\d+/.test(address)) {
    return address.replace(/^(\d+)\//, (_, unit) => `${Number(unit) + variantIndex}/`);
  }
  if (/^\d+/.test(address)) {
    return address.replace(/^(\d+)/, (_, number) => String(Number(number) + variantIndex * 2));
  }
  return `${address} ${variantIndex === 1 ? "North" : "East"}`;
}

function estimateWalkScore(listing) {
  const distance = Number(listing.distanceToCBD ?? 12);
  const typeBonus = listing.propertyType === "Apartment" ? 6 : listing.propertyType === "Townhouse" ? 2 : -1;
  return clamp(Math.round(95 - distance * 2.4 + typeBonus), 42, 97);
}

function estimateSchoolRating(listing) {
  const familyBias = (listing.bedrooms ?? 0) >= 3 ? 0.5 : 0;
  const suburbBias = ["Hawthorn", "Camberwell", "Kew", "Toorak", "Glen Waverley"].includes(listing.suburb) ? 1.4 : 0;
  const value = 6.2 + familyBias + suburbBias - (Number(listing.distanceToCBD ?? 10) > 20 ? 0.8 : 0);
  return Number(clamp(value, 5.4, 9.7).toFixed(1));
}

function estimateRentalYield(listing) {
  const price = Number(listing.price ?? 0) || 800000;
  const base = listing.propertyType === "Apartment" ? 4.3 : listing.propertyType === "Townhouse" ? 3.9 : 3.3;
  const affordabilityBias = price < 850000 ? 0.4 : price > 1800000 ? -0.5 : 0;
  return Number((base + affordabilityBias).toFixed(1));
}

function estimateCapitalGrowth(listing) {
  const walkScore = estimateWalkScore(listing);
  const locationBias = walkScore >= 85 ? 1.1 : walkScore >= 72 ? 0.6 : 0.1;
  const houseBias = listing.propertyType === "House" ? 0.6 : 0.2;
  return Number((4.6 + locationBias + houseBias).toFixed(1));
}

function createVariantListing(listing, index, variantIndex) {
  const variantProfiles = [
    { priceFactor: 1, landFactor: 1, daysDelta: 0, bedDelta: 0, bathDelta: 0, parkingDelta: 0 },
    { priceFactor: 0.95, landFactor: 0.92, daysDelta: 8, bedDelta: 0, bathDelta: 0, parkingDelta: 0 },
    { priceFactor: 1.08, landFactor: 1.07, daysDelta: -4, bedDelta: listing.propertyType === "Apartment" ? 0 : 1, bathDelta: 1, parkingDelta: 1 },
  ];
  const profile = variantProfiles[variantIndex];
  const nextPrice = roundToNearest((listing.price || 700000) * profile.priceFactor + index * 2500 * variantIndex, 5000);
  const nextListing = {
    ...listing,
    id: listing.id * 10 + variantIndex,
    address: createVariantAddress(listing.address, variantIndex),
    price: nextPrice,
    displayPrice: formatDisplayPrice(nextPrice),
    bedrooms: clamp((listing.bedrooms ?? 1) + profile.bedDelta, 1, 6),
    bathrooms: clamp((listing.bathrooms ?? 1) + profile.bathDelta, 1, 4),
    parking: clamp((listing.parking ?? 0) + profile.parkingDelta, 0, 4),
    landSize: listing.landSize ? Math.max(0, Math.round(listing.landSize * profile.landFactor)) : listing.landSize,
    daysOnMarket: Math.max(2, (listing.daysOnMarket ?? 12) + profile.daysDelta + (index % 4)),
    listingUrl: `${listing.listingUrl}?variant=${variantIndex}`,
    description: variantIndex === 0
      ? listing.description
      : `${listing.description} ${variantIndex === 1 ? "Slightly more budget-friendly configuration with similar fundamentals." : "Larger upgraded variant with extra amenity and stronger family appeal."}`,
  };

  return {
    ...nextListing,
    walkScore: estimateWalkScore(nextListing),
    schoolRating: estimateSchoolRating(nextListing),
    rentalYield: estimateRentalYield(nextListing),
    capitalGrowthPct: estimateCapitalGrowth(nextListing),
  };
}

const SEARCHABLE_MOCK_LISTINGS = MOCK_LISTINGS.flatMap((listing, index) => [
  createVariantListing(listing, index, 0),
  createVariantListing(listing, index, 1),
  createVariantListing(listing, index, 2),
]);

// ── Suburb autocomplete data ───────────────────────────────────────────────────
const SUBURBS = [
  { suburb: "Abbotsford", state: "VIC", postcode: "3067" },
  { suburb: "Albert Park", state: "VIC", postcode: "3206" },
  { suburb: "Armadale", state: "VIC", postcode: "3143" },
  { suburb: "Ascot Vale", state: "VIC", postcode: "3032" },
  { suburb: "Balwyn", state: "VIC", postcode: "3103" },
  { suburb: "Bentleigh", state: "VIC", postcode: "3204" },
  { suburb: "Box Hill", state: "VIC", postcode: "3128" },
  { suburb: "Brighton", state: "VIC", postcode: "3186" },
  { suburb: "Brunswick", state: "VIC", postcode: "3056" },
  { suburb: "Burwood", state: "VIC", postcode: "3125" },
  { suburb: "Camberwell", state: "VIC", postcode: "3124" },
  { suburb: "Carlton", state: "VIC", postcode: "3053" },
  { suburb: "Caulfield", state: "VIC", postcode: "3162" },
  { suburb: "Cheltenham", state: "VIC", postcode: "3192" },
  { suburb: "Clayton", state: "VIC", postcode: "3168" },
  { suburb: "Coburg", state: "VIC", postcode: "3058" },
  { suburb: "Collingwood", state: "VIC", postcode: "3066" },
  { suburb: "Dandenong", state: "VIC", postcode: "3175" },
  { suburb: "Doncaster", state: "VIC", postcode: "3108" },
  { suburb: "Elwood", state: "VIC", postcode: "3184" },
  { suburb: "Essendon", state: "VIC", postcode: "3040" },
  { suburb: "Fitzroy", state: "VIC", postcode: "3065" },
  { suburb: "Fitzroy North", state: "VIC", postcode: "3068" },
  { suburb: "Flemington", state: "VIC", postcode: "3031" },
  { suburb: "Footscray", state: "VIC", postcode: "3011" },
  { suburb: "Frankston", state: "VIC", postcode: "3199" },
  { suburb: "Glen Iris", state: "VIC", postcode: "3146" },
  { suburb: "Glen Waverley", state: "VIC", postcode: "3150" },
  { suburb: "Hawthorn", state: "VIC", postcode: "3122" },
  { suburb: "Heidelberg", state: "VIC", postcode: "3084" },
  { suburb: "Ivanhoe", state: "VIC", postcode: "3079" },
  { suburb: "Kensington", state: "VIC", postcode: "3031" },
  { suburb: "Kew", state: "VIC", postcode: "3101" },
  { suburb: "Malvern", state: "VIC", postcode: "3144" },
  { suburb: "Mentone", state: "VIC", postcode: "3194" },
  { suburb: "Middle Park", state: "VIC", postcode: "3206" },
  { suburb: "Moonee Ponds", state: "VIC", postcode: "3039" },
  { suburb: "Moorabbin", state: "VIC", postcode: "3189" },
  { suburb: "Newport", state: "VIC", postcode: "3015" },
  { suburb: "Northcote", state: "VIC", postcode: "3070" },
  { suburb: "Oakleigh", state: "VIC", postcode: "3166" },
  { suburb: "Port Melbourne", state: "VIC", postcode: "3207" },
  { suburb: "Prahran", state: "VIC", postcode: "3181" },
  { suburb: "Preston", state: "VIC", postcode: "3072" },
  { suburb: "Reservoir", state: "VIC", postcode: "3073" },
  { suburb: "Richmond", state: "VIC", postcode: "3121" },
  { suburb: "Ringwood", state: "VIC", postcode: "3134" },
  { suburb: "Seddon", state: "VIC", postcode: "3011" },
  { suburb: "South Melbourne", state: "VIC", postcode: "3205" },
  { suburb: "South Yarra", state: "VIC", postcode: "3141" },
  { suburb: "St Kilda", state: "VIC", postcode: "3182" },
  { suburb: "Sunshine", state: "VIC", postcode: "3020" },
  { suburb: "Templestowe", state: "VIC", postcode: "3106" },
  { suburb: "Thornbury", state: "VIC", postcode: "3071" },
  { suburb: "Toorak", state: "VIC", postcode: "3142" },
  { suburb: "Werribee", state: "VIC", postcode: "3030" },
  { suburb: "Williamstown", state: "VIC", postcode: "3016" },
  { suburb: "Yarraville", state: "VIC", postcode: "3013" },
];

// ── Routes ────────────────────────────────────────────────────────────────────

/**
 * GET /api/properties
 * Query params: suburb, state, type, minBeds, minPrice, maxPrice,
 *               listingType, pageSize, pageNumber
 */
app.get("/api/properties", (req, res) => {
  const { suburb, type, minBeds, minPrice, maxPrice, pageSize = 60, pageNumber = 1 } = req.query;

  let results = [...SEARCHABLE_MOCK_LISTINGS];

  if (suburb && suburb.trim()) {
    const q = suburb.trim().toLowerCase();
    results = results.filter((p) => p.suburb.toLowerCase().includes(q));
  }

  if (type && type !== "All") {
    const TYPE_MAP = {
      House: ["House"],
      Apartment: ["Apartment"],
      Terrace: ["Terrace"],
      Townhouse: ["Townhouse"],
    };
    const allowed = TYPE_MAP[type];
    if (allowed) results = results.filter((p) => allowed.includes(p.propertyType));
  }

  if (minBeds) results = results.filter((p) => p.bedrooms != null && p.bedrooms >= Number(minBeds));
  if (minPrice) results = results.filter((p) => p.price != null && p.price >= Number(minPrice));
  if (maxPrice) results = results.filter((p) => p.price != null && p.price <= Number(maxPrice));

  const size = Math.min(Number(pageSize), 120);
  const page = Math.max(Number(pageNumber), 1);
  const paginated = results.slice((page - 1) * size, page * size);

  res.json({ total: results.length, properties: paginated });
});

/**
 * GET /api/suburbs?q=rich
 */
app.get("/api/suburbs", (req, res) => {
  const { q = "" } = req.query;
  const query = q.trim().toLowerCase();
  if (!query) return res.json([]);

  const matches = SUBURBS
    .filter((s) => s.suburb.toLowerCase().includes(query))
    .slice(0, 8)
    .map((s) => ({
      suburb: s.suburb,
      state: s.state,
      postcode: s.postcode,
      display: `${s.suburb}, ${s.state} ${s.postcode}`,
    }));

  res.json(matches);
});

/**
 * POST /api/rank
 * Body: { properties: [], weights: [{ key, weight, higherIsBetter }] }
 */
app.post("/api/rank", (req, res) => {
  const { properties = [], weights = [] } = req.body;
  const active = weights.filter((w) => w.weight > 0);
  if (active.length === 0) {
    return res.json(properties.map((p) => ({ ...p, score: 0 })));
  }

  const ranges = {};
  active.forEach(({ key }) => {
    const vals = properties.map((p) => p[key]).filter((v) => v != null && !isNaN(v));
    ranges[key] = vals.length
      ? { min: Math.min(...vals), max: Math.max(...vals) }
      : { min: 0, max: 1 };
  });

  const scored = properties.map((p) => {
    let sum = 0, used = 0;
    active.forEach(({ key, weight, higherIsBetter }) => {
      const val = p[key];
      if (val == null || isNaN(val)) return;
      const { min, max } = ranges[key];
      let norm = (val - min) / (max - min || 1);
      if (!higherIsBetter) norm = 1 - norm;
      sum += norm * weight;
      used += weight;
    });
    return { ...p, score: used > 0 ? Math.round((sum / used) * 100) : 0 };
  });

  scored.sort((a, b) => b.score - a.score);
  res.json(scored);
});

app.use(express.static(DIST_DIR));

app.get(/^\/(?!api\/).*/, (req, res, next) => {
  return res.sendFile(INDEX_HTML, (err) => {
    if (err) {
      next(err);
    }
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

const server = app.listen(PORT, () => {
  console.log(`FutureBrick API running at http://localhost:${PORT}`);
  console.log(`Mode: MOCK DATA — 25 Melbourne listings across 25 suburbs`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} already in use. Kill the other process first.`);
    process.exit(1);
  }
  throw err;
});
