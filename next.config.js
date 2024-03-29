/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    disableStaticImages: true,
    domains: ["firebasestorage.googleapis.com"],
  },
};
