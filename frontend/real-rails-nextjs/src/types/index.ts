export interface IXP {
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
  fetched_at?: string;
}

export interface ASN {
  asn: number;
  org?: string;
  organization?: string;
  prefixes?: number;
  prefixes_v4?: number;
  prefixes_v6?: number;
  tier: "T1" | "T2" | "T3";
  country: string;
  source?: string;
}

export interface SubmarineCable {
  name: string;
  from: [number, number];
  to: [number, number];
  color: string;
  w: number;
  owners?: string[];
  length_km?: number;
}

export interface ConcentrationMetric {
  top_n: number;
  concentration_pct: number;
  risk_level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
}

export interface IXPApiResponse {
  count: number;
  ixps: IXP[];
  intelligence: {
    concentration: ConcentrationMetric;
    insight: string;
  };
  fetched_at: string;
}

export interface ASNApiResponse {
  count: number;
  asns: ASN[];
  fetched_at: string;
}

export interface SimulationResult {
  simulation: string;
  failed_node: string;
  affected_routes_estimate: number;
  bgp_reconvergence_estimate_sec: number;
  reroute_candidates: string[];
  impact_level: "CRITICAL" | "HIGH" | "MEDIUM";
}

export type LayerKey = "ixp" | "cable" | "bgp" | "t1";

export interface LayerState {
  ixp: boolean;
  cable: boolean;
  bgp: boolean;
  t1: boolean;
}

export type DataSource = "PeeringDB" | "RIPEstat" | "TeleGeography" | "mock";
