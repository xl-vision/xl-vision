/* eslint-disable prefer-object-spread */
const { getOptions } = require('loader-utils');
const mdx = require('@mdx-js/mdx');
const rehypePrism = require('@mapbox/rehype-prism');
const emoji = require('remark-emoji');
const demoPlugin = require('./demoPlugin');

const DEFAULT_RENDERER = `
import React from 'react'
import { mdx } from '@mdx-js/react'
`;

const loader = async function demoLoader(content) {
  const callback = this.async();
  const options = Object.assign({}, getOptions(this), {
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
