/**
 * Plain JS config and plain <img> tags on purpose: shared hosting with an old
 * glibc cannot load SWC-compiled TS configs or sharp (see Kavé's DEPLOY.md).
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  ...(process.env.NEXT_OUTPUT_STANDALONE === "1" ? { output: "standalone" } : {}),
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
