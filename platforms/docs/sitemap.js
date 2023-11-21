// use sitemap.js instead of next-sitemap.js.
// see https://github.com/iamvishnusankar/next-sitemap/issues/61#issuecomment-725999452

let baseUrl = process.env.VERCEL_URL || 'xl-vision.8910.xyz';

if (process.env.VERCEL_ENV === 'production') {
  baseUrl = 'xl-vision.8910.xyz';
}
/**
 * @type {import('next-sitemap').IConfig}
 */
module.exports = {
  siteUrl: `https://${baseUrl}`,
  generateRobotsTxt: true,
  changefreq: 'weekly',
};
