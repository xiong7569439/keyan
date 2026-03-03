/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

// Cloudflare Pages 适配器
const { withNextOnPages } = require('@cloudflare/next-on-pages');

module.exports = withNextOnPages(nextConfig);
