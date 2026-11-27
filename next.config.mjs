/** @type {import('next').NextConfig} */

// Observation-only policy: review browser/collector reports before enforcing.
// Next.js currently emits inline bootstrap scripts, and the site uses inline
// React/CSS styles. Keep these allowances during the Report-Only phase.
// The fonts imported with next/font/google are bundled and served from 'self'.
const cspReportOnly = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://scripts.clarity.ms",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://www.google-analytics.com https://*.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://c.bing.com",
  "connect-src 'self' https://ipapi.co https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://c.bing.com",
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "media-src 'self' blob: data:",
  "manifest-src 'self'",
  "report-uri /api/csp-report",
  "report-to csp-endpoint",
].join("; ")

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  agentRules: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), payment=()" },
          { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
          { key: "Reporting-Endpoints", value: 'csp-endpoint="/api/csp-report"' },
        ],
      },
    ]
  },
}

export default nextConfig
