// eslint-disable-next-line import-x/no-extraneous-dependencies
const babel = require('@babel/core');
const path = require('node:path');
// eslint-disable-next-line import-x/no-extraneous-dependencies
const prettier = require('prettier');
const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

loadLanguages();

let prettierOptions;

module.exports = async function demoLoader(content) {
  const callback = this.async();

  if (!prettierOptions) {
    prettierOptions = await prettier.resolveConfig(process.cwd(), {
      editorconfig: true,
      useCache: true,
    });
  }

  const filePath = this.resourcePath;

  if (!/.tsx?$/.test(filePath)) {
    throw new Error(`file is not end with '.ts' or '.tsx': ${filePath}`);
  }

  const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);

  try {
    const tsCode = content.replaceAll(/^["'|]use client["'|];?\n+/g, '');
    let { code: jsCode } = await babel.transformAsync(tsCode, {
      configFile: false,
      filename: absolutePath,
      compact: false,
      retainLines: true,
      presets: [
        // '@babel/preset-react',
        '@babel/preset-typescript',
      ],
    });

    jsCode = await prettier.format(jsCode, {
      ...prettierOptions,
      parser: 'babel',
      filePath: absolutePath,
    });

    const result = `
import React from 'react';

export const tsCodeNode = ${highlight(tsCode, 'tsx')};
export const jsCodeNode = ${highlight(jsCode, 'jsx')};
export const tsCode = ${JSON.stringify(tsCode)};
export const jsCode = ${JSON.stringify(jsCode)};
`;

    return callback(null, result);
  } catch (error) {
    return callback(error);
  }
};

function highlight(code, lang) {
  const content = Prism.highlight(code, Prism.languages[lang], lang);

  return `<code className='language-${lang}' dangerouslySetInnerHTML={{__html: ${JSON.stringify(
    content,
  )}}}/>`;
}
