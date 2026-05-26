import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Real Rails — Internet Backbone & IXP Map",
  description: "Internet Backbone & IXP Intelligence Map — Data & Intelligence Rail",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          precedence="default"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}