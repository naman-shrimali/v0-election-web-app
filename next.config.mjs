/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Prevent Next.js from trying to bundle puppeteer for the browser
  serverExternalPackages: ["puppeteer", "puppeteer-core"],
}

export default nextConfig
