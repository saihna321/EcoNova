# EcoNova API Setup

EcoNova should keep satellite credentials out of the React app. The frontend should call your own backend at `VITE_API_BASE_URL`, and the backend should call Sentinel Hub with OAuth credentials.

For now, keep the existing React project as the repo root and use `backend/` as a small backend project inside it. You do not need to move the frontend into a new `frontend/` folder unless the project becomes larger.

## Frontend Structure

```text
src/
  api/
    apiConfig.js
    httpClient.js
    index.js
    rehabilitationRepository.js
    sentinelHub/
      evalscripts.js
      sentinelHubClient.js
      transformers.js
  data/
    demo*.jsx
  components/
```

## Current Repo Structure

```text
econova/
  backend/
    src/
      config/
      middleware/
      routes/
      sentinelHub/
      server.js
    .env.example
    package.json
  src/
    api/
    components/
    data/
  .env.example
  package.json
```

## Local Commands

```bash
npm run dev
npm run backend:dev
```

Use two terminals: one for the Vite frontend and one for the backend.

To configure the backend:

```bash
copy backend\.env.example backend\.env
```

Then set real Sentinel Hub credentials in `backend/.env`.

## Backend Proxy Endpoints To Add Later

```text
POST /api/sentinel-hub/catalog/search
POST /api/sentinel-hub/statistics
POST /api/sentinel-hub/process
```

The backend should:

- Read `SENTINEL_HUB_CLIENT_ID` and `SENTINEL_HUB_CLIENT_SECRET` from server-only env vars.
- Cache OAuth access tokens until expiration.
- Forward allowed requests to Sentinel Hub.
- Validate AOI geometry, date range, and max cloud cover before forwarding.
- Return only the data the frontend needs.

## Required Sentinel Hub APIs

- OAuth token endpoint for backend authentication.
- Catalog API to find available Sentinel-2 L2A scenes.
- Statistical API for mean NDVI, histograms, valid pixels, and time series.
- Process API for RGB and NDVI map images.

## Data Flow

```text
Dashboard / Reports / Sites
  -> rehabilitationRepository
  -> sentinelHubClient
  -> /api/sentinel-hub/*
  -> backend proxy
  -> Sentinel Hub
```

Until the backend exists, keep using `src/data/demo*.jsx`.
