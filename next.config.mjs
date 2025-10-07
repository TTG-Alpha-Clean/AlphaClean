/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimize chunk loading
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
        },
      };
    }
    return config;
  },
  // Generate unique build IDs to avoid cache issues
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

export default nextConfig;