/** @type {import('next').NextConfig} */
const nextConfig = {
  // 全站 SSG + ISR：详情页/分类页每日 revalidate
  experimental: {},
  // live 数据源在构建期采集（registry + GitHub + npm 网络请求），
  // 冷缓存下单页首次渲染会触发整批采集，默认 60s 不够 → 放宽到 300s。
  // 有磁盘缓存后（.cache/）后续构建近乎瞬时。
  staticPageGenerationTimeout: 300,
};

export default nextConfig;
