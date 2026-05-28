"use client";
import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("@/components/Dashboard"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#030712",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <div className="spin" />
      <div className="ltext">INITIALISING LEAFLET MAP ENGINE...</div>
    </div>
  ),
});

export default function Home() {
  return <Dashboard />;
}
