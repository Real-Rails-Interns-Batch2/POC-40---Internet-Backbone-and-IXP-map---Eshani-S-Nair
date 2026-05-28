/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["leaflet", "react-leaflet"],
  webpack: (config) => {
    // Leaflet uses window, disable SSR for it
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'http://127.0.0.1:8000/api/:path*' },
    ];
  },
  transpilePackages: ["leaflet", "react-leaflet"],
};

export default nextConfig;
