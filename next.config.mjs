/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This tells Next.js to include these files in the serverless bundle
    outputFileTracingIncludes: {
      "/api/**/*": ["./node_modules/youtube-dl-exec/bin/**/*"],
    },
  },
};

export default nextConfig;
