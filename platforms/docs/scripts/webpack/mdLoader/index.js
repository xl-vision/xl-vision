/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-object-spread */
const mdx = require('@mdx-js/mdx');
const rehypePrism = require('@mapbox/rehype-prism');
const demoPlugin = require('./demoPlugin');

const DEFAULT_RENDERER = `
import React from 'react'
import { mdx } from '@mdx-js/react'
`;

const emojiPromise = import('remark-emoji');

const loader = async function demoLoader(content) {
  const callback = this.async();
  const emoji = (await emojiPromise).default;

  const options = Object.assign({}, this.getOptions(), {
    filepath: this.resourcePath,
    remarkPlugins: [demoPlugin, emoji],
    rehypePlugins: [rehypePrism],
  });

  try {
    const { renderer = DEFAULT_RENDERER } = options;
    const result = await mdx(content, options);
    return callback(null, `${renderer}\n${result}`);
  } catch (err) {
    return callback(err);
  }
};

module.exports = loader;
