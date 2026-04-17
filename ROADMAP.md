# FutureBrick — Product Roadmap & Technical Plan

> This is the internal planning document for the FutureBrick property search & ranking platform.
> The concept website in this repo is the starting baseline. Everything below describes the path to production.

---

## Concept Summary
A property search and ranking tool targeting the Melbourne market (expandable nationally).
Users search for properties, shortlist them, and rank their shortlist using custom weighted criteria
(schools, growth, walkability, safety, yield, etc.). Scores are calculated dynamically.

---

## Phase 0 — Concept (Current State ✅)
- React + Vite frontend with mock data
- Live scoring engine with weighted categories
- Search, filter, shortlist, and ranked comparison views
- Express/Node API layer (ready to swap mock data for real data)

---

## Phase 1 — Data & Infrastructure

### 1.1 Google Cloud Project Setup
- Create a GCP project under the business name **FutureBrick**
- Use startup credits (new accounts receive free credits)
- Services needed:
  - **Cloud Storage** — raw scrape data (JSON) + property images
  - **BigQuery** — queryable property dataset, analytics
  - **Cloud Run** — host the Java/Node backend (serverless, scales to zero)
  - **Firebase Hosting** (optional) — fast static hosting for the React frontend

### 1.2 Scraping with Apify
- **First choice:** Use Apify's existing built-in scrapers for Domain.com.au and Realestate.com.au
  - Search the Apify Store for "Domain" or "Realestate Australia"
  - If a ready-made actor meets requirements, use it directly
- **Fallback:** Build a custom Python scraper deployed as an Apify Actor
  - Claude can write the scraper given the target site structure
  - Deploy to Apify platform, schedule weekly runs
- **Cadence:** Weekly base scrape for new listings (Monday AM suggested)
- **Images:** Download a limited set per listing to start (e.g. 2–3 images max) to manage storage costs
- **Output:** Scraper writes JSON to a GCS bucket, triggers a BigQuery load job

### 1.3 Connect Scraper → Storage → BigQuery
```
Apify Actor
    └──► Cloud Storage bucket  (raw JSON + images)
              └──► BigQuery load job  (scheduled or triggered)
                        └──► Normalized property table
```

---

## Phase 2 — Core Website Architecture

### Tech Stack
| Layer       | Technology                       | Notes                              |
|-------------|----------------------------------|------------------------------------|
| Frontend    | React + Vite (current)           | Swap mock data for API calls       |
| Backend API | Java (Spring Boot) on Cloud Run  | REST endpoints, auth, ranking logic|
| Database    | BigQuery (analytics) + Firestore (real-time user data) | |
| Storage     | Google Cloud Storage             | Images, scrape archives            |
| Auth        | Firebase Authentication          | Google sign-in for users           |

### Backend (Java on GCP)
- Tell Claude: *"Build a Spring Boot REST API deployed on GCP Cloud Run. It queries BigQuery for property data and exposes endpoints identical to server/index.js in the concept repo."*
- Endpoints to build:
  - `GET /properties` with filters
  - `GET /properties/:id`
  - `POST /rank` (scoring engine — Java port of `src/utils/ranking.js`)
  - `GET /suburbs`
  - `POST /shortlist` (save user shortlist to Firestore)
  - `GET /shortlist/:userId`

### Frontend Updates
- Replace `src/data/properties.js` mock with `fetch()` calls to the real API
- Add authentication (Firebase Auth) for saving shortlists across sessions
- Add a map view (Google Maps JS API) showing pin locations of search results

---

## Phase 3 — Claude Code Integration
- Subscribe to Claude Pro
- Open Claude Code in the terminal inside this repo
- Provide Claude Code with:
  1. This roadmap document
  2. The existing `server/index.js` and `src/` as context
  3. Instruction: *"Port the backend to Java Spring Boot targeting GCP Cloud Run, connect to BigQuery"*
- Claude Code can generate:
  - `pom.xml` / Gradle build files
  - `PropertyController.java`, `RankingService.java`
  - `application.properties` with GCP credentials
  - `Dockerfile` for Cloud Run deployment
  - `cloudbuild.yaml` for CI/CD

---

## Phase 4 — Intelligence Layer (Future)
> Build this AFTER Phase 2 is stable and live.

### Ideas
- **Automated suburb scoring:** Pull council data, ABS census, NAPLAN results to enrich property records
- **Price prediction:** Train a model in BigQuery ML using historical scraped prices
- **Personalisation:** Track user search/shortlist behaviour, suggest properties matching their implicit criteria
- **Alerts:** User sets saved search → Cloud Scheduler checks weekly scrape for matches → email/push notification
- **Comparables:** For any property, show nearby sold prices (sourced from Domain/CoreLogic API)
- **AI property summary:** Pass raw listing text to Gemini Pro (via GCP Vertex AI) to generate a
  structured pros/cons summary in the user's chosen ranking context

---

## Questions to Ask Claude When Starting Phase 2
1. *"I'm building a real estate search platform on GCP using Java Spring Boot. My data lives in BigQuery. How do I query BigQuery from Spring Boot on Cloud Run?"*
2. *"Here is my ranking algorithm in JavaScript (paste ranking.js). Can you port it to a Java service?"*
3. *"How do I set up a scheduled Apify actor to write JSON to a Google Cloud Storage bucket and trigger a BigQuery load job?"*
4. *"How do I use Firebase Authentication in a React + Vite app with a Java Spring Boot backend on Cloud Run?"*

---

## Cost Estimates (Rough, Melbourne-scale)
| Item                         | Est. Monthly Cost           |
|------------------------------|-----------------------------|
| GCP startup credits          | Free (first ~$300 AUD)      |
| Apify scraper runs (weekly)  | ~$5–$20 USD/mo depending on volume |
| BigQuery storage + queries   | <$5/mo at this scale        |
| Cloud Run (backend)          | ~$0–$5/mo (scales to zero)  |
| GCS image storage (limited)  | ~$2–$10/mo                  |
| Firebase Auth                | Free (up to 50k users/mo)   |

---

*Last updated: April 2026*
