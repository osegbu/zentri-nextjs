/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["obinnasocialmedia.s3.us-east-1.amazonaws.com"],
    deviceSizes: [128, 256, 512, 1024],
    imageSizes: [128, 256, 512],
    minimumCacheTTL: 60,
    formats: ["image/webp"],
    loader: "default",
  },
};

export default nextConfig;
