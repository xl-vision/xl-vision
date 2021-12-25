// use sitemap.js instead of next-sitemap.js.
// see https://github.com/iamvishnusankar/next-sitemap/issues/61#issuecomment-725999452

const baseUrl = process.env.VERCEL_URL || 'xl-vision.8910.xyz';

module.exports = {
  siteUrl: `https://${baseUrl}`,
  generateRobotsTxt: true,
  changefreq: 'weekly',
};
