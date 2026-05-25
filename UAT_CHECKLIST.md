# UAT Checklist

## Scope
- FastAPI backend API routes
- Dashboard UI rendering
- Frontend/backend data handshake
- Sidebar metadata sync
- Next.js build validation

## Pass / Fail / Improve

| Check | Status | Evidence |
| --- | --- | --- |
| `/api/ixps` returns success | Pass | Live verification returned HTTP `200`. |
| `/api/asns` returns success | Pass | Live verification returned HTTP `200`. |
| `/api/cables` returns success | Pass | Live verification returned HTTP `200`. |
| `/api/download/sample` returns success | Pass | Live verification returned HTTP `200`. |
| Dashboard loads at `http://127.0.0.1:8000` | Pass | Browser verification loaded the page successfully. |
| Page title matches expectation | Pass | Title is `Real Rails — Internet Backbone & IXP Map`. |
| Key sections render | Pass | Intelligence panel, entity list, controls, ASN table, simulation, and download button were present. |
| Selected IXP metadata updates the sidebar | Pass | Clicking the first entity row updated the title, tier, location, member count, traffic, and share. |
| Data source label reflects live backend state | Pass | Footer reported `Data source: API`. |
| Next.js build completes | Pass | `npm run build` completed successfully in `real-rails-nextjs`. |
| Console logging hygiene | Pass | No project-side `console.log`, `console.warn`, `console.error`, or `print(` statements were found. |

## Verification results

### Backend API checks
- `/api/ixps` → `200`
- `/api/asns` → `200`
- `/api/cables` → `200`
- `/api/download/sample` → `200`

### Browser / dashboard checks
- Dashboard loads at `http://127.0.0.1:8000`
- Page title is `Real Rails — Internet Backbone & IXP Map`
- Key sections render: intelligence panel, filters, ASN table, route failure simulation, download button
- Selected IXP metadata updates in the sidebar
- Screenshot captured as `dashboard-final.png`

### Build validation
- `npm install` completed successfully
- `npm run build` completed successfully

### Improve
- Add a browser test that directly exercises a map marker click to mirror the entity-row check.
- If the protocol requires a workbook export, generate a companion spreadsheet from this checklist.
