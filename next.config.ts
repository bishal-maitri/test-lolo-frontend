import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig = (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  // BUILD_ID injected during Cloud Build
  const buildId = process.env.BUILD_ID || Date.now().toString();

  // Static bucket for uploading assets
  const staticBucket = process.env._STATIC_BUCKET || "lolo-frontend-static-assets";

  console.log("Using BUILD_ID:", buildId);

  return {
    output: "standalone",

    // Ensure Next.js uses the same build ID for all static assets
    generateBuildId: async () => buildId,

    // Prefix static assets with GCS HTTPS URL + build ID
    assetPrefix: isDev ? undefined : `https://storage.googleapis.com/${staticBucket}/${buildId}`,

    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "storage.googleapis.com",
          pathname: `/${staticBucket}/**`,
        },
        {
          protocol: "https",
          hostname: "lh3.googleusercontent.com",
        },
        {
          protocol: "https",
          hostname: "googleapis.com",
        },
      ],
      minimumCacheTTL: 60 * 60 * 24 * 30,
      formats: ["image/avif", "image/webp"],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    async headers() {
      return [
        {
          source: "/_next/static/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        {
          source: "/_next/image",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=2592000, stale-while-revalidate=86400",
            },
          ],
        },
      ];
    },
  };
};

export default nextConfig;



// import type { NextConfig } from "next";
// import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// const nextConfig = (phase: string): NextConfig => {
//   const isDev = phase === PHASE_DEVELOPMENT_SERVER;

//   // BUILD_ID injected by Cloud Build
//   const buildId =
//     process.env.BUILD_ID ||
//     process.env.SHORT_SHA ||
//     Date.now().toString();

//   return {
//     output: "standalone",

//     // Use buildId / SHORT_SHA for immutable static assets
//     generateBuildId: async () => buildId,

//     // Prefix static assets with LB public IP + buildId
//     assetPrefix: isDev ? undefined : `http://34.111.25.82/${buildId}`,

//     // Image optimization configuration
//     images: {
//       // Allow images from LB IP and GCS
//       remotePatterns: [
//         {
//           protocol: "http",
//           hostname: "34.111.25.82",
//         },
//         {
//           protocol: "https",
//           hostname: "storage.googleapis.com",
//         },
//       ],
//       minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
//       formats: ["image/avif", "image/webp"],
//       deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
//       imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
//     },

//     async headers() {
//       return [
//         {
//           // Static assets: cache forever (content-hashed filenames)
//           source: "/_next/static/:path*",
//           headers: [
//             {
//               key: "Cache-Control",
//               value: "public, max-age=31536000, immutable",
//             },
//           ],
//         },
//         {
//           // Optimized images: cache at LB / CDN for 30 days
//           source: "/_next/image",
//           headers: [
//             {
//               key: "Cache-Control",
//               value: "public, max-age=2592000, stale-while-revalidate=86400",
//             },
//           ],
//         },
//       ];
//     },
//   };
// };

// export default nextConfig;
