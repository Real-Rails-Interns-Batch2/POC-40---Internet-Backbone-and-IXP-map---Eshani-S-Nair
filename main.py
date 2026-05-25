"""
Real Rails — Internet Backbone & IXP Map
FastAPI Backend | Rail: Data & Intelligence | ID: 40

Sources: PeeringDB (live), RIPEstat (live), TeleGeography (mock shape)
Fallback: local mock_data.json when live APIs are unavailable
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
import httpx
import pandas as pd
import json
import os
from datetime import datetime
from typing import Optional
from pathlib import Path

app = FastAPI(
    title="Real Rails — IXP Intelligence API",
    description="Internet Backbone & IXP Map data orchestration layer",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MOCK_DATA_PATHS = [
    Path(__file__).parent / "mock_data.json",
    Path(__file__).parent / "real-rails-nextjs" / "src" / "lib" / "mock_data.json",
]
FRONTEND_PATH  = Path(__file__).parent / "frontend.html"
PEERINGDB_BASE = "https://www.peeringdb.com/api"
RIPESTAT_BASE  = "https://stat.ripe.net/data"


# ── MOCK FALLBACK ──────────────────────────────────────────────────────────────
def load_mock() -> dict:
    for path in MOCK_DATA_PATHS:
        if path.exists():
            with open(path) as f:
                return json.load(f)
    raise FileNotFoundError("No mock_data.json file was found for fallback data.")


def resolve_mock_data_path() -> Path:
    for path in MOCK_DATA_PATHS:
        if path.exists():
            return path
    raise FileNotFoundError("No mock_data.json file was found for fallback data.")


# ── HELPERS ───────────────────────────────────────────────────────────────────
def enrich_ixp(raw: dict) -> dict:
    member_count = raw.get("member_count", 0) or 0
    return {
        "id":           raw.get("id"),
        "name":         raw.get("name", "Unknown"),
        "city":         raw.get("city", ""),
        "country":      raw.get("country", ""),
        "lat":          raw.get("lat"),
        "lon":          raw.get("lon"),
        "member_count": member_count,
        "traffic_peak_tbps": raw.get("traffic_peak_tbps", "N/A"),
        "tier":         1 if member_count > 500 else (2 if member_count > 100 else 3),
        "source":       raw.get("source", "PeeringDB"),
        "fetched_at":   datetime.utcnow().isoformat(),
    }


def concentration_metric(df: pd.DataFrame, top_n: int = 5) -> dict:
    if df.empty or "traffic_peak_tbps" not in df.columns:
        return {"top_n": top_n, "concentration_pct": None, "risk_level": "UNKNOWN"}
    df2 = df.copy()
    df2["t"] = pd.to_numeric(df2["traffic_peak_tbps"], errors="coerce")
    df2 = df2.dropna(subset=["t"])
    total = df2["t"].sum()
    top   = df2.nlargest(top_n, "t")["t"].sum()
    pct   = round(top / total * 100, 1) if total > 0 else 0
    risk  = "CRITICAL" if pct > 70 else "HIGH" if pct > 50 else "MEDIUM"
    return {"top_n": top_n, "concentration_pct": pct, "risk_level": risk}


# ── ROUTES ────────────────────────────────────────────────────────────────────

@app.get("/", response_class=HTMLResponse, include_in_schema=False)
async def serve_frontend():
    """Serve the Real Rails dashboard frontend."""
    if FRONTEND_PATH.exists():
        return HTMLResponse(content=FRONTEND_PATH.read_text(encoding="utf-8"))
    return HTMLResponse(content="<h2>Frontend not found. Place frontend.html next to main.py</h2>", status_code=404)


@app.get("/health")
async def health():
    return {"status": "ok", "rail": "Data & Intelligence", "project": "IXP Backbone Map"}


@app.get("/api/ixps")
async def get_ixps(
    tier: Optional[int]    = Query(None, description="Filter by tier (1, 2, 3)"),
    country: Optional[str] = Query(None, description="ISO2 country code, e.g. DE"),
    limit: int             = Query(100, le=500),
):
    """Fetch IXP list — PeeringDB live, falls back to mock_data.json."""
    try:
        mock = load_mock()
        mock_map = {x["name"]: x for x in mock.get("ixps", [])}

        async with httpx.AsyncClient(timeout=8.0) as client:
            params = {"limit": limit}
            if country:
                params["country"] = country.upper()
            resp = await client.get(f"{PEERINGDB_BASE}/ix", params=params)
            resp.raise_for_status()
            raw_list = resp.json().get("data", [])
            # PeeringDB records won't have lat/lon directly; merge from mock for coords
            for r in raw_list:
                name = r.get("name", "")
                if name in mock_map:
                    r.setdefault("lat", mock_map[name].get("lat"))
                    r.setdefault("lon", mock_map[name].get("lon"))
                    r.setdefault("traffic_peak_tbps", mock_map[name].get("traffic_peak_tbps"))
    except Exception:
        try:
            mock = load_mock()
            raw_list = mock.get("ixps", [])
            for r in raw_list:
                r["source"] = "mock"
        except Exception:
            raise HTTPException(status_code=503, detail="Unable to load fallback IXP data")

    enriched = [enrich_ixp(r) for r in raw_list]
    if tier:
        enriched = [x for x in enriched if x["tier"] == tier]

    df = pd.DataFrame(enriched)
    concentration = concentration_metric(df)

    return {
        "count": len(enriched),
        "ixps":  enriched,
        "intelligence": {
            "concentration": concentration,
            "insight": (
                f"Top {concentration['top_n']} IXPs handle an estimated "
                f"{concentration['concentration_pct']}% of measured global traffic — "
                f"concentration risk is {concentration['risk_level']}."
            ),
        },
        "fetched_at": datetime.utcnow().isoformat(),
    }


@app.get("/api/asns")
async def get_asns(asn_list: Optional[str] = Query(None)):
    """ASN prefix counts — RIPEstat live, falls back to mock."""
    default_asns = [7922, 1299, 3356, 2914, 1221, 6939, 3257, 6453]
    asns = [int(a) for a in asn_list.split(",")] if asn_list else default_asns
    results = []
    mock = None
    try:
        mock = load_mock()
        mock_map = {x.get("asn"): x for x in mock.get("asns", [])}
    except Exception:
        mock_map = {}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            for asn in asns:
                try:
                    url = f"{RIPESTAT_BASE}/routing-status/data.json?resource=AS{asn}"
                    resp = await client.get(url)
                    resp.raise_for_status()
                    d = resp.json().get("data", {})
                    results.append({
                        "asn": asn,
                        "prefixes_v4": d.get("announced_space", {}).get("v4", {}).get("prefixes", 0),
                        "prefixes_v6": d.get("announced_space", {}).get("v6", {}).get("prefixes", 0),
                        "source": "RIPEstat",
                    })
                except Exception:
                    fallback = mock_map.get(asn)
                    if fallback is not None:
                        fallback = dict(fallback)
                        fallback["source"] = "mock"
                        results.append(fallback)
                    else:
                        results.append({"asn": asn, "prefixes": 0, "source": "mock"})
    except Exception:
        for asn in asns:
            fallback = mock_map.get(asn)
            if fallback is not None:
                fallback = dict(fallback)
                fallback["source"] = "mock"
                results.append(fallback)
            else:
                results.append({"asn": asn, "prefixes": 0, "source": "mock"})

    return {"count": len(results), "asns": results, "fetched_at": datetime.utcnow().isoformat()}


@app.get("/api/cables")
async def get_cables():
    """Submarine cable GeoJSON — mock data shaped after TeleGeography schema."""
    mock = load_mock()
    cables = mock.get("submarine_cables", [])
    features = []
    for c in cables:
        features.append({
            "type": "Feature",
            "properties": {"name": c.get("name"), "owners": c.get("owners", []),
                           "length_km": c.get("length_km"), "rfs": c.get("rfs"),
                           "source": "TeleGeography/mock"},
            "geometry": {"type": "LineString",
                         "coordinates": [[pt[1], pt[0]] for pt in c.get("endpoints", [])]},
        })
    return {"type": "FeatureCollection", "features": features}


@app.get("/api/concentration")
async def get_concentration(top_n: int = Query(5, ge=1, le=20)):
    mock = load_mock()
    enriched = [enrich_ixp(r) for r in mock.get("ixps", [])]
    df = pd.DataFrame(enriched)
    metric = concentration_metric(df, top_n=top_n)
    top = df.nlargest(top_n, "member_count")[["name","country","member_count","tier"]].to_dict(orient="records") if not df.empty else []
    return {"concentration": metric, "top_ixps": top,
            "insight": f"Top {top_n} IXPs handle ~{metric['concentration_pct']}% of global traffic. Risk: {metric['risk_level']}."}


@app.get("/api/simulate/failure")
async def simulate_failure(ixp_id: Optional[int] = Query(None)):
    mock = load_mock()
    ixps = mock.get("ixps", [])
    failed = next((x for x in ixps if x.get("id") == ixp_id), ixps[0] if ixps else {})
    reroutes = [x.get("name") for x in ixps if x.get("id") != ixp_id][:3]
    members = failed.get("member_count", 500)
    return {
        "simulation": "route_failure",
        "failed_node": failed.get("name", "Unknown"),
        "affected_routes_estimate": members * 800,
        "bgp_reconvergence_estimate_sec": round(members * 0.5),
        "reroute_candidates": reroutes,
        "impact_level": "CRITICAL" if failed.get("tier") == 1 else "HIGH",
    }


@app.get("/api/download/sample")
async def download_sample():
    try:
        path = resolve_mock_data_path()
    except FileNotFoundError:
        raise HTTPException(404, "Sample data not found")

    return FileResponse(path, media_type="application/json",
                        filename="real-rails-ixp-sample.json")