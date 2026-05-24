// Real Rails — Mock Data Adapter
// Document 4: Mock Fallback — if live API returns error/rate-limit,
// system MUST automatically switch to this data to keep UI functional

import type { IXP, ASN, SubmarineCable } from "@/types";

export const MOCK_IXPS: IXP[] = [
  { id:1,  name:"DE-CIX Frankfurt",      city:"Frankfurt",    country:"DE", lat:50.11, lon:8.68,    member_count:1000, traffic_peak_tbps:12.6, tier:1, website:"https://de-cix.net",     source:"PeeringDB/mock" },
  { id:2,  name:"AMS-IX Amsterdam",      city:"Amsterdam",    country:"NL", lat:52.37, lon:4.90,    member_count:953,  traffic_peak_tbps:10.3, tier:1, website:"https://ams-ix.net",     source:"PeeringDB/mock" },
  { id:3,  name:"LINX London",           city:"London",       country:"GB", lat:51.51, lon:-0.09,   member_count:900,  traffic_peak_tbps:8.8,  tier:1, website:"https://linx.net",       source:"PeeringDB/mock" },
  { id:4,  name:"NYIIX New York",        city:"New York",     country:"US", lat:40.71, lon:-74.01,  member_count:400,  traffic_peak_tbps:7.4,  tier:1, website:"https://nyiix.net",      source:"PeeringDB/mock" },
  { id:5,  name:"Equinix IX Chicago",    city:"Chicago",      country:"US", lat:41.88, lon:-87.63,  member_count:320,  traffic_peak_tbps:6.0,  tier:1, website:"https://equinix.com",    source:"PeeringDB/mock" },
  { id:6,  name:"JPIX Tokyo",            city:"Tokyo",        country:"JP", lat:35.69, lon:139.69,  member_count:500,  traffic_peak_tbps:5.0,  tier:1, website:"https://jpix.ad.jp",     source:"PeeringDB/mock" },
  { id:7,  name:"Netnod Stockholm",      city:"Stockholm",    country:"SE", lat:59.33, lon:18.07,   member_count:280,  traffic_peak_tbps:3.5,  tier:2, website:"https://netnod.se",      source:"PeeringDB/mock" },
  { id:8,  name:"MSK-IX Moscow",         city:"Moscow",       country:"RU", lat:55.75, lon:37.62,   member_count:520,  traffic_peak_tbps:4.1,  tier:2, website:"https://msk-ix.ru",      source:"PeeringDB/mock" },
  { id:9,  name:"Equinix IX Singapore",  city:"Singapore",    country:"SG", lat:1.35,  lon:103.82,  member_count:410,  traffic_peak_tbps:4.8,  tier:1, website:"https://equinix.com",    source:"PeeringDB/mock" },
  { id:10, name:"MIX Milano",            city:"Milan",        country:"IT", lat:45.46, lon:9.19,    member_count:235,  traffic_peak_tbps:2.2,  tier:2, website:"https://mix-it.net",     source:"PeeringDB/mock" },
  { id:11, name:"PCH Sydney",            city:"Sydney",       country:"AU", lat:-33.87,lon:151.21,  member_count:190,  traffic_peak_tbps:1.9,  tier:2, website:"https://pch.net",        source:"PeeringDB/mock" },
  { id:12, name:"LAIIX Los Angeles",     city:"Los Angeles",  country:"US", lat:34.05, lon:-118.24, member_count:280,  traffic_peak_tbps:3.1,  tier:2, website:"",                       source:"PeeringDB/mock" },
  { id:13, name:"PTT São Paulo",         city:"São Paulo",    country:"BR", lat:-23.55,lon:-46.63,  member_count:340,  traffic_peak_tbps:2.8,  tier:2, website:"https://ptt.br",         source:"PeeringDB/mock" },
  { id:14, name:"JINX Johannesburg",     city:"Johannesburg", country:"ZA", lat:-26.20,lon:28.04,   member_count:80,   traffic_peak_tbps:0.4,  tier:3, website:"",                       source:"PeeringDB/mock" },
  { id:15, name:"DE-CIX Mumbai",         city:"Mumbai",       country:"IN", lat:19.08, lon:72.88,   member_count:180,  traffic_peak_tbps:1.6,  tier:2, website:"https://de-cix.net",     source:"PeeringDB/mock" },
  { id:16, name:"FICIX Helsinki",        city:"Helsinki",     country:"FI", lat:60.17, lon:24.94,   member_count:110,  traffic_peak_tbps:0.8,  tier:3, website:"",                       source:"PeeringDB/mock" },
  { id:17, name:"PLIX Warsaw",           city:"Warsaw",       country:"PL", lat:52.23, lon:21.01,   member_count:130,  traffic_peak_tbps:0.9,  tier:3, website:"",                       source:"PeeringDB/mock" },
  { id:18, name:"France-IX Paris",       city:"Paris",        country:"FR", lat:48.86, lon:2.35,    member_count:320,  traffic_peak_tbps:4.2,  tier:2, website:"https://france-ix.net",  source:"PeeringDB/mock" },
  { id:19, name:"Equinix IX Hong Kong",  city:"Hong Kong",    country:"HK", lat:22.32, lon:114.17,  member_count:300,  traffic_peak_tbps:3.2,  tier:2, website:"https://equinix.com",    source:"PeeringDB/mock" },
  { id:20, name:"KCIX Seoul",            city:"Seoul",        country:"KR", lat:37.57, lon:126.98,  member_count:145,  traffic_peak_tbps:1.1,  tier:3, website:"",                       source:"PeeringDB/mock" },
  { id:21, name:"DE-CIX Madrid",         city:"Madrid",       country:"ES", lat:40.42, lon:-3.70,   member_count:200,  traffic_peak_tbps:1.8,  tier:2, website:"https://de-cix.net",     source:"PeeringDB/mock" },
  { id:22, name:"Nairobi IXP",           city:"Nairobi",      country:"KE", lat:-1.29, lon:36.82,   member_count:55,   traffic_peak_tbps:0.2,  tier:3, website:"",                       source:"PeeringDB/mock" },
  { id:23, name:"BBIX Tokyo",            city:"Tokyo",        country:"JP", lat:35.65, lon:139.75,  member_count:160,  traffic_peak_tbps:1.4,  tier:2, website:"",                       source:"PeeringDB/mock" },
  { id:24, name:"NAPAfrica JHB",         city:"Johannesburg", country:"ZA", lat:-26.10,lon:28.05,   member_count:115,  traffic_peak_tbps:0.6,  tier:3, website:"https://napAfrica.co.za",source:"PeeringDB/mock" },
  { id:25, name:"IX.br Fortaleza",       city:"Fortaleza",    country:"BR", lat:-3.72, lon:-38.54,  member_count:88,   traffic_peak_tbps:0.5,  tier:3, website:"",                       source:"PeeringDB/mock" },
  { id:26, name:"SGIX Singapore",        city:"Singapore",    country:"SG", lat:1.29,  lon:103.85,  member_count:220,  traffic_peak_tbps:2.1,  tier:2, website:"",                       source:"PeeringDB/mock" },
  { id:27, name:"QIXP Doha",             city:"Doha",         country:"QA", lat:25.29, lon:51.53,   member_count:45,   traffic_peak_tbps:0.3,  tier:3, website:"",                       source:"PeeringDB/mock" },
  { id:28, name:"Datahop Mumbai",        city:"Mumbai",       country:"IN", lat:19.10, lon:72.90,   member_count:95,   traffic_peak_tbps:0.7,  tier:3, website:"",                       source:"PeeringDB/mock" },
  { id:29, name:"SAex Cape Town",        city:"Cape Town",    country:"ZA", lat:-33.92,lon:18.42,   member_count:70,   traffic_peak_tbps:0.35, tier:3, website:"",                       source:"PeeringDB/mock" },
  { id:30, name:"Equinix IX Sydney",     city:"Sydney",       country:"AU", lat:-33.88,lon:151.20,  member_count:175,  traffic_peak_tbps:1.7,  tier:2, website:"",                       source:"PeeringDB/mock" },
];

export const MOCK_ASNS: ASN[] = [
  { asn:7922,  org:"Comcast",             prefixes:7100, tier:"T1", country:"US", source:"RIPEstat/mock" },
  { asn:1299,  org:"Telia Carrier",       prefixes:5800, tier:"T1", country:"SE", source:"RIPEstat/mock" },
  { asn:3356,  org:"Lumen (Level 3)",     prefixes:5500, tier:"T1", country:"US", source:"RIPEstat/mock" },
  { asn:2914,  org:"NTT Communications",  prefixes:5200, tier:"T1", country:"JP", source:"RIPEstat/mock" },
  { asn:1221,  org:"Telstra",             prefixes:4800, tier:"T1", country:"AU", source:"RIPEstat/mock" },
  { asn:6939,  org:"Hurricane Electric",  prefixes:4400, tier:"T1", country:"US", source:"RIPEstat/mock" },
  { asn:3257,  org:"GTT Communications",  prefixes:3900, tier:"T2", country:"US", source:"RIPEstat/mock" },
  { asn:6453,  org:"TATA Communications", prefixes:3600, tier:"T2", country:"IN", source:"RIPEstat/mock" },
];

export const MOCK_CABLES: SubmarineCable[] = [
  { name:"AEConnect-1",      from:[40.71,-74.01], to:[53.33,-6.25],    color:"#38BDF8", w:2.2 },
  { name:"FLAG Atlantic-1",  from:[40.71,-74.01], to:[51.50,-0.12],    color:"#38BDF8", w:1.8 },
  { name:"TAT-14",           from:[38.90,-77.04], to:[52.37,4.90],     color:"#38BDF8", w:1.5 },
  { name:"FASTER",           from:[34.05,-118.24],to:[35.69,139.69],   color:"#818CF8", w:2.2 },
  { name:"UNITY",            from:[33.75,-118.19],to:[35.69,139.69],   color:"#818CF8", w:1.8 },
  { name:"SJC-2",            from:[34.05,-118.24],to:[1.35,103.82],    color:"#818CF8", w:1.5 },
  { name:"SEA-ME-WE 4",      from:[50.11,8.68],   to:[1.35,103.82],    color:"#38BDF8", w:2.2 },
  { name:"SMW-5",            from:[51.50,-0.12],  to:[19.08,72.88],    color:"#38BDF8", w:1.5 },
  { name:"WACS",             from:[51.50,-0.12],  to:[-33.92,18.42],   color:"#F59E0B", w:1.8 },
  { name:"SEACOM",           from:[-26.20,28.04], to:[19.08,72.88],    color:"#F59E0B", w:1.5 },
  { name:"Australia-Japan",  from:[35.69,139.69], to:[-33.87,151.21],  color:"#818CF8", w:1.8 },
  { name:"ARCOS-1",          from:[40.71,-74.01], to:[-23.55,-46.63],  color:"#F59E0B", w:1.8 },
  { name:"MAREA",            from:[40.71,-74.01], to:[40.42,-3.70],    color:"#38BDF8", w:1.5 },
  { name:"Dunant",           from:[40.71,-74.01], to:[43.30,5.37],     color:"#38BDF8", w:1.5 },
  { name:"PEACE Cable",      from:[19.08,72.88],  to:[4.05,9.70],      color:"#F59E0B", w:1.5 },
  { name:"APG",              from:[35.69,139.69], to:[1.35,103.82],    color:"#818CF8", w:1.8 },
  { name:"EAC-C2C",          from:[35.69,139.69], to:[34.05,-118.24],  color:"#818CF8", w:1.5 },
  { name:"Hawaiki",          from:[34.05,-118.24],to:[-33.87,151.21],  color:"#818CF8", w:1.5 },
  { name:"SAex",             from:[-33.92,18.42], to:[-23.55,-46.63],  color:"#F59E0B", w:1.5 },
  { name:"AMX-1",            from:[40.71,-74.01], to:[4.60,-74.08],    color:"#F59E0B", w:1.2 },
];

// Data source labels — Document 3
export const DATA_SOURCES = {
  ixps:   "PeeringDB",
  asns:   "RIPEstat",
  cables: "TeleGeography",
} as const;