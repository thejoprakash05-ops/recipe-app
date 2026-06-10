/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  allowedDevOrigins: ['10.0.0.93'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.spoonacular.com' },
      { protocol: 'https', hostname: 'spoonacular.com' },
    ],
  },
};

export default nextConfig;
