/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // 静态导出必须设置
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 确保不生成 .next/server 相关文件
  distDir: '.next',
};

module.exports = nextConfig;
