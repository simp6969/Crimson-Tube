/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This ensures the yt-dlp binary is bundled with your API routes
    outputFileTracingIncludes: {
      "/api/**/*": ["./node_modules/youtube-dl-exec/bin/**/*"],
    },
  },
};

export default nextConfig;
