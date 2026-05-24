# Real Rails — Internet Backbone & IXP Map
## FastAPI Backend | Rail: Data & Intelligence | ID: 40

### Quick Start
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your API keys
uvicorn main:app --reload
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/ixps | All IXPs (PeeringDB → mock fallback) |
| GET | /api/ixps/{id} | Single IXP detail |
| GET | /api/asns | ASN prefix counts (RIPEstat) |
| GET | /api/cables | Submarine cable GeoJSON |
| GET | /api/concentration | Path concentration metrics |
| GET | /api/simulate/failure | Route failure simulation |
| GET | /api/download/sample | Download sample data (Section E) |

### Data Sources
- **PeeringDB**: Live IXP member/facility data  
- **RIPEstat**: ASN routing table stats  
- **TeleGeography**: Submarine cable routes (mock shape — licence required for prod)  

### Fallback Protocol (Document 4)
All live API calls wrap in try/except. On failure, the system reads `mock_data.json` automatically. The UI stays functional for demo.
