"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

// ─── Types ──────────────────────────────────────────────────────────────────
interface IXP {
  id: number;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  member_count: number;
  traffic_peak_tbps: number;
  tier: 1 | 2 | 3;
  website?: string;
  source?: string;
}
interface ASN {
  asn: number;
  org?: string;
  organization?: string;
  prefixes?: number;
  prefixes_v4?: number;
  tier: string;
  country: string;
}
interface Cable {
  name: string;
  from: [number, number];
  to: [number, number];
  color: string;
  w: number;
}
interface FacilityCard {
  ix: IXP;
  x: number;
  y: number;
  nearestName: string;
  nearestDist: number;
  share: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_IXPS: IXP[] = [
  {id:1, name:"DE-CIX Frankfurt",     city:"Frankfurt",   country:"DE", lat:50.11, lon:8.68,   member_count:1000, traffic_peak_tbps:12.6, tier:1, website:"https://de-cix.net"},
  {id:2, name:"AMS-IX Amsterdam",     city:"Amsterdam",   country:"NL", lat:52.37, lon:4.90,   member_count:953,  traffic_peak_tbps:10.3, tier:1, website:"https://ams-ix.net"},
  {id:3, name:"LINX London",          city:"London",      country:"GB", lat:51.51, lon:-0.09,  member_count:900,  traffic_peak_tbps:8.8,  tier:1, website:"https://linx.net"},
  {id:4, name:"NYIIX New York",       city:"New York",    country:"US", lat:40.71, lon:-74.01, member_count:400,  traffic_peak_tbps:7.4,  tier:1, website:"https://nyiix.net"},
  {id:5, name:"Equinix IX Chicago",   city:"Chicago",     country:"US", lat:41.88, lon:-87.63, member_count:320,  traffic_peak_tbps:6.0,  tier:1, website:"https://equinix.com"},
  {id:6, name:"JPIX Tokyo",           city:"Tokyo",       country:"JP", lat:35.69, lon:139.69, member_count:500,  traffic_peak_tbps:5.0,  tier:1, website:"https://jpix.ad.jp"},
  {id:7, name:"Netnod Stockholm",     city:"Stockholm",   country:"SE", lat:59.33, lon:18.07,  member_count:280,  traffic_peak_tbps:3.5,  tier:2, website:"https://netnod.se"},
  {id:8, name:"MSK-IX Moscow",        city:"Moscow",      country:"RU", lat:55.75, lon:37.62,  member_count:520,  traffic_peak_tbps:4.1,  tier:2, website:"https://msk-ix.ru"},
  {id:9, name:"Equinix IX Singapore", city:"Singapore",   country:"SG", lat:1.35,  lon:103.82, member_count:410,  traffic_peak_tbps:4.8,  tier:1, website:"https://equinix.com"},
  {id:10,name:"MIX Milano",           city:"Milan",       country:"IT", lat:45.46, lon:9.19,   member_count:235,  traffic_peak_tbps:2.2,  tier:2, website:"https://mix-it.net"},
  {id:11,name:"PCH Sydney",           city:"Sydney",      country:"AU", lat:-33.87,lon:151.21, member_count:190,  traffic_peak_tbps:1.9,  tier:2, website:"https://pch.net"},
  {id:12,name:"LAIIX Los Angeles",    city:"Los Angeles", country:"US", lat:34.05, lon:-118.24,member_count:280,  traffic_peak_tbps:3.1,  tier:2, website:""},
  {id:13,name:"PTT São Paulo",        city:"São Paulo",   country:"BR", lat:-23.55,lon:-46.63, member_count:340,  traffic_peak_tbps:2.8,  tier:2, website:"https://ptt.br"},
  {id:14,name:"JINX Johannesburg",    city:"Johannesburg",country:"ZA", lat:-26.20,lon:28.04,  member_count:80,   traffic_peak_tbps:0.4,  tier:3, website:""},
  {id:15,name:"DE-CIX Mumbai",        city:"Mumbai",      country:"IN", lat:19.08, lon:72.88,  member_count:180,  traffic_peak_tbps:1.6,  tier:2, website:"https://de-cix.net"},
  {id:16,name:"FICIX Helsinki",       city:"Helsinki",    country:"FI", lat:60.17, lon:24.94,  member_count:110,  traffic_peak_tbps:0.8,  tier:3, website:""},
  {id:17,name:"PLIX Warsaw",          city:"Warsaw",      country:"PL", lat:52.23, lon:21.01,  member_count:130,  traffic_peak_tbps:0.9,  tier:3, website:""},
  {id:18,name:"France-IX Paris",      city:"Paris",       country:"FR", lat:48.86, lon:2.35,   member_count:320,  traffic_peak_tbps:4.2,  tier:2, website:"https://france-ix.net"},
  {id:19,name:"Equinix IX Hong Kong", city:"Hong Kong",   country:"HK", lat:22.32, lon:114.17, member_count:300,  traffic_peak_tbps:3.2,  tier:2, website:"https://equinix.com"},
  {id:20,name:"KCIX Seoul",           city:"Seoul",       country:"KR", lat:37.57, lon:126.98, member_count:145,  traffic_peak_tbps:1.1,  tier:3, website:""},
  {id:21,name:"DE-CIX Madrid",        city:"Madrid",      country:"ES", lat:40.42, lon:-3.70,  member_count:200,  traffic_peak_tbps:1.8,  tier:2, website:"https://de-cix.net"},
  {id:22,name:"Nairobi IXP",          city:"Nairobi",     country:"KE", lat:-1.29, lon:36.82,  member_count:55,   traffic_peak_tbps:0.2,  tier:3, website:""},
  {id:23,name:"BBIX Tokyo",           city:"Tokyo",       country:"JP", lat:35.65, lon:139.75, member_count:160,  traffic_peak_tbps:1.4,  tier:2, website:""},
  {id:24,name:"NAPAfrica JHB",        city:"Johannesburg",country:"ZA", lat:-26.10,lon:28.05,  member_count:115,  traffic_peak_tbps:0.6,  tier:3, website:""},
  {id:25,name:"IX.br Fortaleza",      city:"Fortaleza",   country:"BR", lat:-3.72, lon:-38.54, member_count:88,   traffic_peak_tbps:0.5,  tier:3, website:""},
  {id:26,name:"SGIX Singapore",       city:"Singapore",   country:"SG", lat:1.29,  lon:103.85, member_count:220,  traffic_peak_tbps:2.1,  tier:2, website:""},
  {id:27,name:"QIXP Doha",           city:"Doha",        country:"QA", lat:25.29, lon:51.53,  member_count:45,   traffic_peak_tbps:0.3,  tier:3, website:""},
  {id:28,name:"Datahop Mumbai",       city:"Mumbai",      country:"IN", lat:19.10, lon:72.90,  member_count:95,   traffic_peak_tbps:0.7,  tier:3, website:""},
  {id:29,name:"SAex Cape Town",       city:"Cape Town",   country:"ZA", lat:-33.92,lon:18.42,  member_count:70,   traffic_peak_tbps:0.35, tier:3, website:""},
  {id:30,name:"Equinix IX Sydney",    city:"Sydney",      country:"AU", lat:-33.88,lon:151.20, member_count:175,  traffic_peak_tbps:1.7,  tier:2, website:""},
];
const MOCK_ASNS: ASN[] = [
  {asn:7922, org:"Comcast",             prefixes:7100, tier:"T1", country:"US"},
  {asn:1299, org:"Telia Carrier",       prefixes:5800, tier:"T1", country:"SE"},
  {asn:3356, org:"Lumen (Level 3)",     prefixes:5500, tier:"T1", country:"US"},
  {asn:2914, org:"NTT Communications",  prefixes:5200, tier:"T1", country:"JP"},
  {asn:1221, org:"Telstra",             prefixes:4800, tier:"T1", country:"AU"},
  {asn:6939, org:"Hurricane Electric",  prefixes:4400, tier:"T1", country:"US"},
  {asn:3257, org:"GTT Communications",  prefixes:3900, tier:"T2", country:"US"},
  {asn:6453, org:"TATA Communications", prefixes:3600, tier:"T2", country:"IN"},
];
const MOCK_CABLES: Cable[] = [
  {name:"AEConnect-1",     from:[40.71,-74.01], to:[53.33,-6.25],   color:"#38BDF8", w:2.2},
  {name:"FLAG Atlantic-1", from:[40.71,-74.01], to:[51.50,-0.12],   color:"#38BDF8", w:1.8},
  {name:"TAT-14",          from:[38.90,-77.04], to:[52.37,4.90],    color:"#38BDF8", w:1.5},
  {name:"FASTER",          from:[34.05,-118.24],to:[35.69,139.69],  color:"#818CF8", w:2.2},
  {name:"UNITY",           from:[33.75,-118.19],to:[35.69,139.69],  color:"#818CF8", w:1.8},
  {name:"SJC-2",           from:[34.05,-118.24],to:[1.35,103.82],   color:"#818CF8", w:1.5},
  {name:"SEA-ME-WE 4",     from:[50.11,8.68],   to:[1.35,103.82],   color:"#38BDF8", w:2.2},
  {name:"SMW-5",           from:[51.50,-0.12],  to:[19.08,72.88],   color:"#38BDF8", w:1.5},
  {name:"WACS",            from:[51.50,-0.12],  to:[-33.92,18.42],  color:"#F59E0B", w:1.8},
  {name:"SEACOM",          from:[-26.20,28.04], to:[19.08,72.88],   color:"#F59E0B", w:1.5},
  {name:"Australia-Japan", from:[35.69,139.69], to:[-33.87,151.21], color:"#818CF8", w:1.8},
  {name:"ARCOS-1",         from:[40.71,-74.01], to:[-23.55,-46.63], color:"#F59E0B", w:1.8},
  {name:"MAREA",           from:[40.71,-74.01], to:[40.42,-3.70],   color:"#38BDF8", w:1.5},
  {name:"Dunant",          from:[40.71,-74.01], to:[43.30,5.37],    color:"#38BDF8", w:1.5},
  {name:"PEACE Cable",     from:[19.08,72.88],  to:[4.05,9.70],     color:"#F59E0B", w:1.5},
  {name:"APG",             from:[35.69,139.69], to:[1.35,103.82],   color:"#818CF8", w:1.8},
  {name:"EAC-C2C",         from:[35.69,139.69], to:[34.05,-118.24], color:"#818CF8", w:1.5},
  {name:"Hawaiki",         from:[34.05,-118.24],to:[-33.87,151.21], color:"#818CF8", w:1.5},
  {name:"SAex",            from:[-33.92,18.42], to:[-23.55,-46.63], color:"#F59E0B", w:1.5},
  {name:"AMX-1",           from:[40.71,-74.01], to:[4.60,-74.08],   color:"#F59E0B", w:1.2},
];

// ─── Turf distance helper (no import needed — loaded via CDN in useEffect) ──
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default function Dashboard() {
  const mapRef     = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const d3Ref      = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const layersRef   = useRef<Record<string, any>>({});
  const simRAF      = useRef<number | null>(null);

  const [clock, setClock] = useState("");
  const [ixps, setIxps]   = useState<IXP[]>([]);
  const [asns, setAsns]   = useState<ASN[]>([]);
  const [apiSrc, setApiSrc] = useState<"API" | "mock">("API");
  const [ixpCount, setIxpCount] = useState("—");
  const [concPct, setConcPct]   = useState("—");
  const [riskLabel, setRiskLabel] = useState("LOADING...");
  const [riskBarW, setRiskBarW]   = useState(0);
  const [loading, setLoading]     = useState(true);
  const [turfDist, setTurfDist]   = useState("—");
  const [tooltip, setTooltip]     = useState<{name:string; body:string; x:number; y:number; vis:boolean}>({name:"",body:"",x:0,y:0,vis:false});
  const [facilityCard, setFacilityCard] = useState<FacilityCard | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<{ix:IXP;share:string;src:string} | null>(null);
  const [layers, setLayers] = useState({ixp:true, cable:true, bgp:true, t1:false});
  const [asnSort, setAsnSort]   = useState<{col:string;dir:number}>({col:"prefixes",dir:-1});
  const [selectedASN, setSelectedASN] = useState<number|null>(null);
  const [simOn, setSimOn]       = useState(false);
  const [simText, setSimText]   = useState("");

  const ixpsRef   = useRef<IXP[]>([]);
  const apiSrcRef = useRef<"API"|"mock">("API");

  // Clock
  useEffect(() => {
    const tick = () => setClock(new Date().toUTCString().slice(17, 25) + " UTC");
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Load Turf.js script
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/Turf.js/6.5.0/turf.min.js";
    document.head.appendChild(s);
    return () => { document.head.removeChild(s); };
  }, []);

  // Main data fetch + map init
  useEffect(() => {
    let cancelled = false;

    async function init() {
      let fetchedIxps: IXP[] = [];
      let fetchedAsns: ASN[] = [];
      let fetchedCables: Cable[] = MOCK_CABLES;
      let src: "API" | "mock" = "API";

      try {
        const [ixpRes, asnRes] = await Promise.all([
          fetch("/api/ixps"),
          fetch("/api/asns"),
        ]);
        if (!ixpRes.ok || !asnRes.ok) throw new Error("API error");
        const ixpJson = await ixpRes.json();
        const asnJson = await asnRes.json();
        fetchedIxps = ixpJson.ixps.filter((x: IXP) => x.lat && x.lon);
        fetchedAsns = asnJson.asns;

        const conc = ixpJson.intelligence?.concentration;
        if (conc) {
          setConcPct(conc.concentration_pct + "%");
          setRiskLabel(conc.risk_level);
          setRiskBarW(Math.min(conc.concentration_pct, 100));
        }

        try {
          const cabRes = await fetch("/api/cables");
          const cabJson = await cabRes.json();
          fetchedCables = cabJson.features.map((f: any) => ({
            name:  f.properties.name,
            from:  [f.geometry.coordinates[0][1], f.geometry.coordinates[0][0]] as [number,number],
            to:    [f.geometry.coordinates[f.geometry.coordinates.length-1][1], f.geometry.coordinates[f.geometry.coordinates.length-1][0]] as [number,number],
            color: "#38BDF8", w: 2,
          }));
        } catch { /* use mock cables */ }
      } catch {
        src = "mock";
        fetchedIxps   = MOCK_IXPS;
        fetchedAsns   = MOCK_ASNS;
        fetchedCables = MOCK_CABLES;
        const total = MOCK_IXPS.reduce((s,x) => s + x.traffic_peak_tbps, 0);
        const top5  = [...MOCK_IXPS].sort((a,b) => b.traffic_peak_tbps - a.traffic_peak_tbps)
                                     .slice(0,5).reduce((s,x) => s + x.traffic_peak_tbps, 0);
        const pct   = Math.round(top5/total*100);
        setConcPct(pct + "%");
        setRiskLabel("CRITICAL");
        setRiskBarW(pct);
      }

      if (cancelled) return;

      setApiSrc(src);
      apiSrcRef.current = src;
      setIxps(fetchedIxps);
      ixpsRef.current = fetchedIxps;
      setAsns(fetchedAsns);
      setIxpCount(fetchedIxps.length + "+");

      // Build Leaflet map
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current || mapInstance.current) return;

      const map = L.map(mapRef.current, {
        center: [20, 10], zoom: 2, zoomControl: false,
        minZoom: 2, maxZoom: 10, preferCanvas: true,
      });
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "", maxZoom: 18,
      }).addTo(map);

      const cableLayer = L.layerGroup().addTo(map);
      const bgpLayer   = L.layerGroup().addTo(map);
      const t1Layer    = L.layerGroup();
      const ixpLayer   = L.layerGroup().addTo(map);
      layersRef.current = { ixp: ixpLayer, cable: cableLayer, bgp: bgpLayer, t1: t1Layer };

      // Draw cables (great circle via turf or straight lines fallback)
      function drawCables(cables: Cable[]) {
        cableLayer.clearLayers();
        cables.forEach((c) => {
          const turf = (window as any).turf;
          if (turf) {
            try {
              const from = turf.point([c.from[1], c.from[0]]);
              const to   = turf.point([c.to[1],   c.to[0]]);
              const gc   = turf.greatCircle(from, to, { npoints: 80 });
              const latlngs = gc.geometry.coordinates.map(([lng, lat]: [number,number]) => [lat, lng]);
              L.polyline(latlngs, { color: c.color, weight: c.w, opacity: 1, smoothFactor: 1 }).addTo(cableLayer);
              return;
            } catch { /* fallback */ }
          }
          L.polyline([c.from, c.to], { color: c.color, weight: c.w, opacity: 1 }).addTo(cableLayer);
        });
      }

      // Draw BGP
      function drawBGP() {
        bgpLayer.clearLayers();
        const links: [[number,number],[number,number]][] = [
          [[50.11,8.68],[52.37,4.90]], [[52.37,4.90],[51.51,-0.09]],
          [[50.11,8.68],[45.46,9.19]], [[50.11,8.68],[55.75,37.62]],
          [[50.11,8.68],[59.33,18.07]], [[40.71,-74.01],[41.88,-87.63]],
          [[40.71,-74.01],[34.05,-118.24]], [[41.88,-87.63],[34.05,-118.24]],
        ];
        links.forEach(([a,b]) => {
          L.polyline([a, b], { color: "#818CF8", weight: 1.5, opacity: 0.7, dashArray: "6 5" }).addTo(bgpLayer);
        });
      }

      // Draw IXP markers
      function drawIXPs(ixpList: IXP[]) {
        ixpLayer.clearLayers();
        ixpList.forEach((ix) => {
          const col  = ix.tier===1 ? "#38BDF8" : ix.tier===2 ? "#818CF8" : "#F59E0B";
          const r    = ix.tier===1 ? 12 : ix.tier===2 ? 8 : 6;

          if (ix.tier === 1) {
            L.circleMarker([ix.lat, ix.lon], {
              radius: r+8, color: col, weight: 1, fillColor: "transparent", fillOpacity: 0, opacity: 0.35,
              className: `ixp-ring tier-${ix.tier}`,
            }).addTo(ixpLayer);
            L.circleMarker([ix.lat, ix.lon], {
              radius: r+16, color: col, weight: 0.5, fillColor: "transparent", fillOpacity: 0, opacity: 0.15,
              className: `ixp-ring2 tier-${ix.tier}`,
            }).addTo(ixpLayer);
          }

          const marker = L.circleMarker([ix.lat, ix.lon], {
            radius: r, color: col, weight: 2, fillColor: col, fillOpacity: 1.0,
            className: `ixp-node tier-${ix.tier}`,
          });

          marker.on("mouseover", function(e: any) {
            const stg = mapRef.current!;
            const pt  = map.latLngToContainerPoint([ix.lat, ix.lon]);
            let tx = pt.x + 16, ty = pt.y - 14;
            if (tx + 260 > stg.clientWidth)  tx = pt.x - 270;
            if (ty + 160 > stg.clientHeight) ty = pt.y - 170;
            const body = `
              <div class="tr"><span>Country</span><span>${ix.country}</span></div>
              <div class="tr"><span>City</span><span>${ix.city}</span></div>
              <div class="tr"><span>Members</span><span>${ix.member_count}+ networks</span></div>
              <div class="tr"><span>Peak Traffic</span><span>${ix.traffic_peak_tbps} Tbps</span></div>
              <div class="tr"><span>Tier</span><span>T${ix.tier}</span></div>
              <div style="font-size:9px;color:var(--muted);margin-top:5px">Click to open facility card</div>`;
            setTooltip({ name: ix.name, body, x: tx, y: ty, vis: true });
          });
          marker.on("mouseout", () => setTooltip(t => ({...t, vis: false})));

          marker.on("click", (e: any) => {
            setTooltip(t => ({...t, vis: false}));
            const pt = map.latLngToContainerPoint([ix.lat, ix.lon]);
            const currentIxps = ixpsRef.current;
            const totalTraffic = currentIxps.reduce((s,x) => s + x.traffic_peak_tbps, 0);
            const share = ((ix.traffic_peak_tbps / totalTraffic) * 100).toFixed(1);
            const others = currentIxps.filter(x => x.id !== ix.id);
            let nearestName = "—", nearestDist = Infinity;
            others.forEach(o => {
              const d = haversineKm(ix.lat, ix.lon, o.lat, o.lon);
              if (d < nearestDist) { nearestDist = d; nearestName = o.name; }
            });
            const stg = mapRef.current!;
            let mx = pt.x + 14, my = pt.y - 20;
            if (mx + 295 > stg.clientWidth)  mx = pt.x - 295;
            if (my + 400 > stg.clientHeight) my = pt.y - 400;
            setFacilityCard({ ix, x: Math.max(8, mx), y: Math.max(8, my), nearestName, nearestDist: Math.round(nearestDist), share });
            setSelectedFacility({ ix, share, src: apiSrcRef.current });
          });

          marker.addTo(ixpLayer);
        });
      }

      // Turf nearest on mousemove
      map.on("mousemove", (e: any) => {
        const currentIxps = ixpsRef.current;
        if (!currentIxps.length) return;
        let minD = Infinity, minName = "—";
        currentIxps.forEach(ix => {
          const d = haversineKm(e.latlng.lat, e.latlng.lng, ix.lat, ix.lon);
          if (d < minD) { minD = d; minName = ix.name; }
        });
        setTurfDist(`${Math.round(minD).toLocaleString()} km → ${minName}`);
      });

      drawCables(fetchedCables);
      drawBGP();
      drawIXPs(fetchedIxps);
      setLoading(false);
    }

    init();
    return () => { cancelled = true; };
  }, []);

  // D3 donut chart
  useEffect(() => {
    if (!ixps.length || !d3Ref.current) return;
    d3Ref.current.innerHTML = "";
    const sorted    = [...ixps].sort((a,b) => b.traffic_peak_tbps - a.traffic_peak_tbps);
    const top5      = sorted.slice(0,5);
    const othersSum = sorted.slice(5).reduce((s,x) => s + x.traffic_peak_tbps, 0);
    const data      = [
      ...top5.map(x => ({ label: x.name.split(" ").slice(0,2).join(" "), value: x.traffic_peak_tbps })),
      { label: "All Others", value: othersSum },
    ];
    const W = 230, H = 130, R = 52, innerR = 30;
    const colors = ["#38BDF8","#4FC3F7","#818CF8","#A5B4FC","#F59E0B","#374151"];
    const svg = d3.select(d3Ref.current).append("svg").attr("width", W).attr("height", H).style("overflow","visible");
    const g   = svg.append("g").attr("transform", `translate(${H/2+8},${H/2})`);
    const pie = d3.pie<{label:string;value:number}>().value(d => d.value).sort(null);
    const arc  = d3.arc<any>().innerRadius(innerR).outerRadius(R);
    const arcH = d3.arc<any>().innerRadius(innerR).outerRadius(R+5);
    g.selectAll(".arc").data(pie(data)).enter().append("g").attr("class","arc")
      .append("path")
      .attr("d", arc)
      .attr("fill", (_,i) => colors[i])
      .attr("stroke", "#030712").attr("stroke-width", 1)
      .style("cursor","pointer")
      .on("mouseover", function() { d3.select(this).transition().duration(150).attr("d", arcH); })
      .on("mouseout",  function() { d3.select(this).transition().duration(150).attr("d", arc);  });
    const t = ixps.reduce((s,x) => s + x.traffic_peak_tbps, 0);
    const t5 = top5.reduce((s,x) => s + x.traffic_peak_tbps, 0);
    g.append("text").attr("text-anchor","middle").attr("dy","-0.3em")
      .style("fill","#38BDF8").style("font-size","13px").style("font-weight","700")
      .style("font-family","Inter,sans-serif").text(Math.round(t5/t*100)+"%");
    g.append("text").attr("text-anchor","middle").attr("dy","0.9em")
      .style("fill","#64748B").style("font-size","8px").style("font-family","Inter,sans-serif")
      .text("TOP 5 IXPs");
    const leg = svg.append("g").attr("transform", `translate(${H+12}, 10)`);
    data.forEach((d, i) => {
      const row = leg.append("g").attr("transform", `translate(0,${i*18})`);
      row.append("rect").attr("width",7).attr("height",7).attr("y",1).attr("fill",colors[i]).attr("rx",1);
      const lbl = d.label.length > 14 ? d.label.slice(0,14)+"…" : d.label;
      row.append("text").attr("x",12).attr("y",8)
        .style("fill","#64748B").style("font-size","8.5px").style("font-family","Inter,sans-serif")
        .text(`${lbl} · ${d.value}T`);
    });
  }, [ixps]);

  // Layer toggle handler
  const toggleLayer = useCallback((key: "ixp"|"cable"|"bgp"|"t1") => {
    const map = mapInstance.current;
    const lrs = layersRef.current;
    if (!map || !lrs[key]) return;
    setLayers(prev => {
      const next = {...prev, [key]: !prev[key]};
      if (next[key]) {
        if (key === "t1") {
          // Draw T1 paths (great circles with turf or fallback)
          const l = lrs.t1;
          l.clearLayers();
          const L = (window as any).L;
          if (!L) return next;
          const paths: [[number,number],[number,number]][] = [
            [[40.71,-74.01],[50.11,8.68]],
            [[40.71,-74.01],[35.69,139.69]],
            [[50.11,8.68],[1.35,103.82]],
          ];
          paths.forEach(([a,b]) => {
            const turf = (window as any).turf;
            if (turf) {
              try {
                const from = turf.point([a[1],a[0]]);
                const to   = turf.point([b[1],b[0]]);
                const gc   = turf.greatCircle(from, to, { npoints: 60 });
                const latlngs = gc.geometry.coordinates.map(([lng,lat]: [number,number]) => [lat,lng]);
                L.polyline(latlngs, { color: "#38BDF8", weight: 1.2, opacity: 0.5, dashArray: "3 8" }).addTo(l);
                return;
              } catch { /* fallback */ }
            }
            L.polyline([a, b], { color: "#38BDF8", weight: 1.2, opacity: 0.5, dashArray: "3 8" }).addTo(l);
          });
          l.addTo(map);
        } else {
          lrs[key].addTo(map);
        }
      } else {
        map.removeLayer(lrs[key]);
      }
      return next;
    });
  }, []);

  // Simulation
  const simCtxRef = useRef<CanvasRenderingContext2D|null>(null);
  const runSim = useCallback(async () => {
    const cv  = canvasRef.current;
    const stg = mapRef.current;
    if (!cv || !stg) return;

    setSimOn(prev => {
      if (!prev) {
        // start
        cv.width  = stg.clientWidth;
        cv.height = stg.clientHeight;
        simCtxRef.current = cv.getContext("2d");

        fetch("/api/simulate/failure?ixp_id=1")
          .then(r => r.json())
          .then(d => {
            setSimText(`⚠ ${d.failed_node} OFFLINE — Impact: <b>${d.impact_level}</b><br>
              <span style="color:var(--muted)">~${(d.affected_routes_estimate||800000).toLocaleString()} routes affected
              · Re-convergence ~${d.bgp_reconvergence_estimate_sec||500}s
              · Rerouting via: ${(d.reroute_candidates||["AMS-IX","LINX"]).join(", ")}</span>`);
          })
          .catch(() => {
            setSimText("⚠ DE-CIX FRANKFURT OFFLINE — BGP re-convergence in progress<br><span style=\"color:var(--muted)\">~800K routes affected · Rerouting via AMS-IX, LINX, Netnod</span>");
          });

        return true;
      } else {
        // stop
        if (simRAF.current) cancelAnimationFrame(simRAF.current);
        simCtxRef.current?.clearRect(0, 0, cv.width, cv.height);
        setSimText("");
        return false;
      }
    });
  }, []);

  useEffect(() => {
    if (!simOn) {
      if (simRAF.current) cancelAnimationFrame(simRAF.current);
      return;
    }
    const map = mapInstance.current;
    const cv  = canvasRef.current;
    const ctx = simCtxRef.current;
    if (!map || !cv || !ctx) return;

    let raf: number;
    function loop() {
      ctx!.clearRect(0, 0, cv!.width, cv!.height);
      const src = map.latLngToContainerPoint([50.11, 8.68]);
      const t   = (Date.now() % 1400) / 1400;
      ctx!.beginPath();
      ctx!.arc(src.x, src.y, 10 + t * 75, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(239,68,68,${0.85 * (1-t)})`;
      ctx!.lineWidth = 2.5;
      ctx!.stroke();

      const targets = [
        map.latLngToContainerPoint([52.37, 4.90]),
        map.latLngToContainerPoint([51.51, -0.09]),
        map.latLngToContainerPoint([59.33, 18.07]),
      ];
      const off = (Date.now() % 900) / 900;
      targets.forEach((dst: any) => {
        ctx!.beginPath();
        ctx!.moveTo(src.x, src.y);
        ctx!.lineTo(dst.x, dst.y);
        ctx!.setLineDash([7, 4]);
        ctx!.lineDashOffset = -off * 22;
        ctx!.strokeStyle = "rgba(239,68,68,0.6)";
        ctx!.lineWidth = 1.8;
        ctx!.stroke();
        ctx!.setLineDash([]);
      });
      ctx!.strokeStyle = "#EF4444"; ctx!.lineWidth = 2.5;
      ctx!.beginPath(); ctx!.moveTo(src.x-10,src.y-10); ctx!.lineTo(src.x+10,src.y+10); ctx!.stroke();
      ctx!.beginPath(); ctx!.moveTo(src.x+10,src.y-10); ctx!.lineTo(src.x-10,src.y+10); ctx!.stroke();
      raf = requestAnimationFrame(loop);
      simRAF.current = raf;
    }
    loop();
    return () => { cancelAnimationFrame(raf); };
  }, [simOn]);

  // ASN table
  const sortedAsns = [...asns].sort((a,b) => {
    const col = asnSort.col;
    const av: any = col === "prefixes" ? (a.prefixes_v4 ?? a.prefixes ?? 0) : (a as any)[col];
    const bv: any = col === "prefixes" ? (b.prefixes_v4 ?? b.prefixes ?? 0) : (b as any)[col];
    if (typeof av === "string") return asnSort.dir * av.localeCompare(bv);
    return asnSort.dir * ((av||0) - (bv||0));
  });

  const sortASN = (col: string) => {
    setAsnSort(prev => ({
      col, dir: prev.col === col ? prev.dir * -1 : -1,
    }));
  };

  // Fly to IXP
  const flyToIXP = (id: number) => {
    const ix = ixpsRef.current.find(x => x.id === id);
    if (!ix || !mapInstance.current) return;
    mapInstance.current.flyTo([ix.lat, ix.lon], 5, { duration: 1.2 });
    const totalTraffic = ixpsRef.current.reduce((s,x) => s + x.traffic_peak_tbps, 0);
    const share = ((ix.traffic_peak_tbps / totalTraffic) * 100).toFixed(1);
    setSelectedFacility({ ix, share, src: apiSrcRef.current });
  };

  const entityColors = [
    "linear-gradient(to right,#38BDF8,rgba(56,189,248,0.4))",
    "linear-gradient(to right,#38BDF8,rgba(56,189,248,0.35))",
    "linear-gradient(to right,#818CF8,rgba(129,140,248,0.5))",
    "linear-gradient(to right,#818CF8,rgba(129,140,248,0.4))",
    "linear-gradient(to right,#F59E0B,rgba(245,158,11,0.5))",
    "linear-gradient(to right,#F59E0B,rgba(245,158,11,0.4))",
    "linear-gradient(to right,#64748B,rgba(100,116,139,0.4))",
  ];
  const sortedIxps = [...ixps].sort((a,b) => b.traffic_peak_tbps - a.traffic_peak_tbps).slice(0,7);
  const maxTraffic = sortedIxps[0]?.traffic_peak_tbps || 1;

  return (
    <>
      {/* HEADER */}
      <div id="header">
        <div className="logo">
          <div className="pulse" />
          <span className="tag">REAL RAILS</span>
          <span className="htitle">Internet Backbone &amp; IXP Intelligence Map</span>
        </div>
        <div className="hmeta">DATA &amp; INTELLIGENCE RAIL &nbsp;·&nbsp; ID: 40 &nbsp;·&nbsp; {clock}</div>
      </div>

      <div id="wrap">
        {/* ═══ STAGE 70% ═══ */}
        <div id="stage">
          {loading && (
            <div id="loading">
              <div className="spin" />
              <div className="ltext">INITIALISING LEAFLET MAP ENGINE...</div>
            </div>
          )}

          <div id="map" ref={mapRef} />

          {/* Tooltip */}
          <div id="tip" style={{ left: tooltip.x, top: tooltip.y, opacity: tooltip.vis ? 1 : 0 }}>
            <div className="tn">{tooltip.name}</div>
            <div dangerouslySetInnerHTML={{ __html: tooltip.body }} />
          </div>

          {/* Facility Card Modal */}
          {facilityCard && (
            <div id="fc-modal" style={{ display: "block", left: facilityCard.x, top: facilityCard.y }}>
              <div className="fc-header">
                <div>
                  <div className="fc-title">{facilityCard.ix.name}</div>
                  <div className="fc-sub">{facilityCard.ix.city}, {facilityCard.ix.country} · FACILITY CARD</div>
                </div>
                <button className="fc-close" onClick={() => setFacilityCard(null)}>✕</button>
              </div>
              <div>
                {[
                  { k: "Peak Traffic",          v: `${facilityCard.ix.traffic_peak_tbps} Tbps`, bar: facilityCard.ix.traffic_peak_tbps/12.6 },
                  { k: "Member Networks",        v: `${facilityCard.ix.member_count}+` },
                  { k: "Global Traffic Share",   v: `${facilityCard.share}%`, bar: parseFloat(facilityCard.share)/100 },
                  { k: "Tier",                   v: `Tier ${facilityCard.ix.tier}` },
                  { k: "Location",               v: `${facilityCard.ix.city}, ${facilityCard.ix.country}` },
                  { k: "Website",                v: facilityCard.ix.website || "—" },
                ].map((r, i) => (
                  <div className="fc-row" key={i}>
                    <span className="fk">{r.k}</span>
                    {r.bar != null && (
                      <div className="fc-bar-wrap">
                        <div className="fc-bar-fill" style={{ width: `${Math.round((r.bar||0)*100)}%` }} />
                      </div>
                    )}
                    <span className="fv">{r.v}</span>
                  </div>
                ))}
              </div>
              <div id="fc-turf">
                <b style={{color:"var(--indigo)"}}>Turf.js →</b> Nearest IXP: <b>{facilityCard.nearestName}</b> · {facilityCard.nearestDist.toLocaleString()} km
              </div>
            </div>
          )}

          {/* Legend */}
          <div id="legend">
            <div className="lr"><div className="ld" style={{background:"#38BDF8",boxShadow:"0 0 5px #38BDF8"}} />Tier-1 IXP</div>
            <div className="lr"><div className="ld" style={{background:"#818CF8"}} />Tier-2 IXP</div>
            <div className="lr"><div className="ld" style={{background:"#F59E0B"}} />Regional IXP</div>
            <div className="lr"><div className="ll" style={{borderTop:"2px solid #38BDF8"}} />Submarine Cable (Cyan)</div>
            <div className="lr"><div className="ll" style={{borderTop:"2px dashed #818CF8"}} />Terrestrial BGP (Indigo)</div>
          </div>

          {/* Turf badge */}
          <div id="turf-badge">Turf.js &nbsp;·&nbsp; Nearest IXP: <span>{turfDist}</span></div>

          {/* Custom zoom */}
          <div id="zoom-ctrls">
            <button className="zb" onClick={() => mapInstance.current?.zoomIn()}>+</button>
            <button className="zb" onClick={() => mapInstance.current?.zoomOut()}>−</button>
          </div>

          {/* Sim canvas overlay */}
          <canvas id="sim-layer" ref={canvasRef} />
        </div>

        {/* ═══ SIDEBAR 30% ═══ */}
        <div id="sidebar">

          {/* A: Network Intelligence */}
          <div className="sec">
            <div className="slabel">▸ A &nbsp; Network Intelligence</div>
            <div className="mgrid">
              <div className="mc hi"><div className="mv">{ixpCount}</div><div className="ml">IXPs MAPPED</div></div>
              <div className="mc hi"><div className="mv">74K+</div><div className="ml">ACTIVE ASNs</div></div>
              <div className="mc"><div className="mv">530+</div><div className="ml">SUBMARINE CABLES</div></div>
              <div className="mc"><div className="mv danger">{concPct}</div><div className="ml">TRAFFIC VIA TOP 5</div></div>
            </div>
          </div>

          {/* B: Why This Matters */}
          <div className="sec">
            <div className="slabel">▸ B &nbsp; Why This Matters</div>
            <p className="prose">
              The internet&apos;s physical layer is <strong>far more concentrated than it appears.</strong>{" "}
              Behind every &quot;cloud&quot; service sits a handful of critical exchange points where thousands
              of networks physically swap traffic.<br /><br />
              A disruption at <strong>DE-CIX Frankfurt</strong> or <strong>AMS-IX Amsterdam</strong> can
              degrade connectivity for hundreds of millions of users across multiple continents. Builders
              routing around choke points and allocators tracking infrastructure risk need to understand
              where the real leverage points are — and who controls them.
            </p>
            <div className="cbar">
              <div className="cbrow">
                <span>Path Concentration Risk</span>
                <span className="crisk">{riskLabel}</span>
              </div>
              <div className="ctrack">
                <div className="cfill" style={{ width: `${riskBarW}%` }} />
              </div>
            </div>
          </div>

          {/* C: Who Controls the Rail */}
          <div className="sec">
            <div className="slabel">▸ C &nbsp; Who Controls the Rail</div>
            <p className="prose" style={{marginBottom:9}}>Top IXPs by peak traffic throughput. Select a node to sync the metadata panel.</p>
            <div id="entity-list">
              {sortedIxps.map((ix, i) => (
                <div className="entity" key={ix.id} onClick={() => flyToIXP(ix.id)}>
                  <span className="en">{ix.name}</span>
                  <div className="eb">
                    <div className="ef" style={{
                      width: `${Math.round(ix.traffic_peak_tbps/maxTraffic*100)}%`,
                      background: entityColors[i] || entityColors[6],
                    }} />
                  </div>
                  <span className="ep">{ix.traffic_peak_tbps} Tbps</span>
                </div>
              ))}
            </div>

            {selectedFacility && (
              <div className="selected-facility">
                <div className="sf-header">
                  <div>
                    <div className="sf-title">{selectedFacility.ix.name}</div>
                    <div className="sf-sub">
                      Selected from {selectedFacility.src.toUpperCase()} data · {selectedFacility.ix.website || "No website listed"}
                    </div>
                  </div>
                  <span className="sf-tag">T{selectedFacility.ix.tier}</span>
                </div>
                <div className="sf-grid">
                  <div><span>Location</span><strong>{selectedFacility.ix.city}, {selectedFacility.ix.country}</strong></div>
                  <div><span>Members</span><strong>{selectedFacility.ix.member_count}+ networks</strong></div>
                  <div><span>Peak Traffic</span><strong>{selectedFacility.ix.traffic_peak_tbps} Tbps</strong></div>
                  <div><span>Traffic Share</span><strong>{selectedFacility.share}%</strong></div>
                </div>
              </div>
            )}

            {/* D3 Donut chart */}
            <div id="d3-chart" ref={d3Ref} />
          </div>

          {/* D: Filters & Controls */}
          <div className="sec">
            <div className="slabel">▸ D &nbsp; Filters &amp; Controls</div>
            <div className="fgrid">
              {(["ixp","cable","bgp","t1"] as const).map(key => (
                <button
                  key={key}
                  className={`fb${layers[key] ? " on" : ""}`}
                  onClick={() => toggleLayer(key)}
                >
                  {key === "ixp" && "◈ IXP Nodes"}
                  {key === "cable" && "≋ Submarine Cables"}
                  {key === "bgp" && "─ Terrestrial BGP"}
                  {key === "t1" && "T1 ASN Paths"}
                </button>
              ))}
            </div>

            {/* ASN Table */}
            <div style={{marginTop:13}}>
              <div className="slabel" style={{marginBottom:5}}>▸ ASN Routing Table</div>
              <div id="asn-wrap">
                <div className="at-head">
                  {[["asn","ASN"],["org","ORGANIZATION"],["prefixes","PREFIXES"],["tier","TIER"]].map(([col,label]) => (
                    <div
                      key={col}
                      className={`ah${asnSort.col === col ? " sort" : ""}`}
                      style={{flex: col === "org" ? 2 : 1}}
                      onClick={() => sortASN(col)}
                    >
                      {label} ↕
                    </div>
                  ))}
                </div>
                <div>
                  {sortedAsns.map(a => {
                    const pfx  = a.prefixes_v4 || a.prefixes || 0;
                    const tier = a.tier || "T2";
                    return (
                      <div
                        key={a.asn}
                        className={`at-row${selectedASN === a.asn ? " sel" : ""}`}
                        onClick={() => setSelectedASN(prev => prev === a.asn ? null : a.asn)}
                      >
                        <div className="ac">AS{a.asn}</div>
                        <div className="ac" style={{flex:2}}>{a.org || a.organization || "—"}</div>
                        <div className="ac">{pfx ? (pfx/1000).toFixed(1)+"K" : "—"}</div>
                        <div className="ac">
                          <span className={`badge ${tier==="T1"?"t1b":"t2b"}`}>{tier}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Route Failure Simulation */}
            <div style={{marginTop:13}}>
              <div className="slabel" style={{marginBottom:5}}>▸ Route Failure Simulation</div>
              <p className="prose" style={{marginBottom:5}}>Simulate a Tier-1 IXP outage and visualise BGP re-routing cascades.</p>
              <button className="simbtn" onClick={runSim}>
                {simOn ? "■ STOP SIMULATION" : "⚠ SIMULATE DE-CIX FRANKFURT FAILURE"}
              </button>
              {simText && (
                <div id="simst" className="show" dangerouslySetInnerHTML={{ __html: simText }} />
              )}
            </div>
          </div>

          {/* E: Download */}
          <button id="dlbtn" onClick={() => { window.location.href = "/api/download/sample"; }}>
            ↓ &nbsp;Download Sample Data (JSON)
          </button>

          <div id="apist">
            Data source:{" "}
            <span className={apiSrc === "API" ? "ok" : "mock"}>{apiSrc}</span>
          </div>
        </div>
      </div>
    </>
  );
}
