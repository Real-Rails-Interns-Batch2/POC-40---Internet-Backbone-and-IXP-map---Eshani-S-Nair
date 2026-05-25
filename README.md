# Real Rails — Internet Backbone & IXP Map

## Project Overview
Real Rails is a FastAPI-powered IXP intelligence dashboard that visualizes global internet infrastructure, route concentration, and resilience scenarios.

### Visual Identity
- **Background:** `#030712` (mandatory)
- **Primary accent:** `#38BDF8`
- **Secondary accent:** `#818CF8`
- **Typography:** Inter / Geist Sans
- **Effects:** subtle glassmorphism and active-state glow

### Layout Protocol
- **Main stage:** 70% width
- **Intelligence sidebar:** 30% width
- **Sidebar sections:** summary, why it matters, who controls the rail, filters, and download/sample data

### What the project delivers
- A FastAPI backend with live data integration and fallback handling
- A dashboard served from `frontend.html`
- A selected-entity workflow where clicking a stage or IXP row updates the sidebar
- Live/preview API status messaging in the UI
- Sample data download support
- A separate Next.js workspace under `real-rails-nextjs` for build validation

---

## Local Setup

### 1. Create and activate the Python virtual environment

#### Windows PowerShell
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

#### macOS / Linux
```bash
python -m venv .venv
source .venv/bin/activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure environment variables
```bash
cp .env.example .env
```

Update `.env` with your API keys if needed. The project will continue to function using the mock fallback data if live services are unavailable.

### 4. Start the backend
```bash
uvicorn main:app --reload
```

### 5. Open the dashboard
Visit:

- `http://127.0.0.1:8000`

The root route serves the dashboard from `frontend.html`.

---

## API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Health check for the API service |
| GET | `/api/ixps` | IXP list with live PeeringDB data and mock fallback |
| GET | `/api/asns` | ASN prefix counts using RIPEstat data and mock fallback |
| GET | `/api/cables` | Submarine cable GeoJSON payload |
| GET | `/api/concentration` | Path concentration metrics |
| GET | `/api/simulate/failure` | Failure simulation payload for the current route scenario |
| GET | `/api/download/sample` | Download the sample dataset (Section E deliverable) |

---

## Data Sources

- **PeeringDB**: live IXP data
- **RIPEstat**: live ASN routing information
- **TeleGeography**: mock-shaped submarine cable data
- **Local fallback**: `mock_data.json`

---

## Fallback and Resilience

The backend wraps live API calls in `try/except` handling. When upstream requests fail, it falls back to `mock_data.json` so the dashboard remains usable for demo and UAT scenarios.

This includes support for:
- live API success
- live API failure
- local mock fallback
- continued UI rendering without breaking the session

---

## Dashboard Requirements Covered

The delivered dashboard aligns with the project protocol and verification notes:

- **Background color** uses `#030712`
- **Layout** is a strict **70/30 split** between the main stage and sidebar
- **Selection behavior** updates the sidebar when an entity or stage is clicked
- **Data source status** is surfaced in the UI
- **Download and simulation controls** are present
- **Fallback behavior** keeps the experience functional when live data is unavailable

---

## Next.js Verification

A separate Next.js app exists in `real-rails-nextjs`.

### Build validation
```bash
cd real-rails-nextjs
npm install
npm run build
```

This workspace is kept in sync with the main project and is used to validate the front-end stack separately.

---

## Verification Notes

The current project has been verified for:

- backend health and API responses
- dashboard loading at `http://127.0.0.1:8000`
- sidebar updates on selection
- data-source handshake behavior
- successful Next.js build validation
- console logging hygiene

---

## Repository Files of Interest

- `main.py` — FastAPI backend and route handlers
- `frontend.html` — served dashboard UI
- `mock_data.json` — fallback dataset
- `.env.example` — environment variable template
- `requirements.txt` — Python dependencies
- `real-rails-nextjs/` — Next.js workspace for frontend build validation

If you want, I can also turn this into a **shorter upload-ready README** or add a **Windows-specific troubleshooting section**.
