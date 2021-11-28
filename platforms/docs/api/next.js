const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

module.exports = (req, res) => {
  const parsedUrl = parse(req.url, true);
  handle(req, res, parsedUrl);
};
