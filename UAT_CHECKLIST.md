# UAT Checklist

## Scope
- FastAPI backend API routes
- Dashboard UI rendering
- Frontend/backend data handshake
- Next.js build validation

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
- Screenshot captured as `dashboard-final.png`

### Build validation
- `npm install` completed successfully
- `npm run build` completed successfully

### Notes
- Source files were checked for project-side `console.log` / `console.warn` / `console.error` usage and no project-side console logging was found.
- The active backend route fixes and fallback handling remain in place.
