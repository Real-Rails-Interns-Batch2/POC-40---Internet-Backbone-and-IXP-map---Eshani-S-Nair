# Real Rails Intelligence Library: Internet Backbone & IXP Map
> PoC ID: 40 | Category: Data & Intelligence

An enterprise-grade, real-time interactive intelligence dashboard mapping the global physical internet infrastructure. This platform visualizes critical network nodes (IXPs), routing authorities (ASNs), and physical transoceanic pathways (submarine cables) to assess data path concentration and route failure resilience.

---

## 🧬 Real Rails DNA & Architectural Constraints

### 1. Visual Identity (The "Look")
Adheres strictly to the high-end Fintech Terminal design specification:
* **Background:** `#030712` (Obsidian Black) — **MANDATORY**
* **Surface / Cards:** `#0B1117` (Deep Navy Grey)
* **Primary Accent:** `#38BDF8` (Electric Cyan) — Utilized for active states, selection glows, and data pulses
* **Secondary Accent:** `#818CF8` (Indigo) — Utilized for secondary data overlays and network lines
* **Borders:** `#1F2937` (Slate-800), 1px width
* **Typography:** Inter / Geist Sans with tight letter-spacing
* **Effects:** Subtle glassmorphism and `0.5px` primary accent glow on active interactive components

### 2. Layout Protocol (The "Skeleton")
Implements a rigid **2-Column Split Layout** (`v-screen h-screen overflow-hidden`):
* **Main Stage (70% Width):** High-performance geospatial visualization engine combining Mapbox GL JS, Deck.gl, and React-Leaflet.
* **Intelligence Sidebar (30% Width):** Fixed-width informational anchor broken into five mandated zones:
    * *Section A:* Title & High-level Infrastructure Concentration Metrics.
    * *Section B (Why This Matters):* Digital infrastructure story focused on global power concentration.
    * *Section C (Who Controls the Rail):* Analysis of hyper-concentrated infrastructure and institutional dependencies (IXPs, ASNs, Submarine Cables).
    * *Section D:* Core UI filters (Layer toggles, ASN search) and contextual metadata tooltips.
    * *Section E:* Download Sample Data capability.

---

## 🛠 Tech Stack & Core Libraries

* **Framework:** Next.js 14 (App Router) with TypeScript
* **Styling:** Tailwind CSS + `shadcn/ui` components (custom-themed to Real Rails specs)
* **Geospatial & Vector Projection:** Mapbox GL JS, Deck.gl, React-Leaflet, and `Turf.js`
* **Data Orchestration & Analytics:** D3.js, TanStack Table, and Recharts

*Note: In accordance with the project Guardrails, manual SVG or mathematical transformations for spatial coordinates are strictly banned. All geospatial rendering utilizes professional projection layers.*

---

## 📊 Ingested Data Sources
Data feeds are synthesized and structured directly from major telecommunication and routing registries:
1.  **PeeringDB:** Internet Exchange Point (IXP) locations, participant counts, and peak traffic metrics.
2.  **RIPEstat:** Autonomous System Number (ASN) routing authority, IP prefix ownership, and tier categorization.
3.  **TeleGeography Submarine Cable Map:** Spatial path vectors, landing stations, and corporate ownership profiles of transoceanic links.

---

## ⚡ Key Features

* **Interactive IXP Mapping:** Dynamic rendering of international exchange hubs segmented by operational tiering.
* **Granular ASN Filtering:** Real-time data filtration by routing authority without requiring a full page refresh.
* **Path Concentration Analytics:** Instant UI updates detailing infrastructure choke-points and risk exposure.
* **BGP Route Failure Simulation:** Interactive module permitting users to simulate node/cable failures to evaluate BGP reconvergence estimates and alternate routing candidates.
* **Automated Mock Fallback:** Under the **2-Hour Rule**, if a live external API connection experiences downtime or rate-limiting, the application instantly flags the status change and rolls over to the local `src/lib/mock.ts` dataset to ensure seamless terminal uptime.

---

## 🚀 Local Development Setup

### Prerequisites
Ensure you have Node.js (v18.x or later) installed.

### 1. Installation
Clone the repository, navigate into the project directory, and install dependencies:
```bash
cd "C:\Users\eshan\Documents\Sinternship-S6\Internet - backbone ixp map\real-rails-nextjs"
npm install
