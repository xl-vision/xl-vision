/* eslint-disable import/no-extraneous-dependencies */
const babel = require('@babel/core');
const prettier = require('prettier');
const path = require('path');
const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

loadLanguages();

const prettierOptions = prettier.resolveConfig.sync(process.cwd(), {
  editorconfig: true,
  useCache: true,
});

module.exports = async function demoLoader(content) {
  const callback = this.async();

  const filePath = this.resourcePath;

  if (!filePath.match(/.tsx?$/)) {
    throw new Error(`file is not end with '.ts' or '.tsx': ${filePath}`);
  }

  const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);

  try {
    const tsCode = content;
    let jsCode = (
      await babel.transformAsync(tsCode, {
        configFile: false,
        filename: absolutePath,
        presets: [
          // '@babel/preset-react',
          '@babel/preset-typescript',
        ],
      })
    ).code;

    jsCode = prettier.format(jsCode, {
      ...prettierOptions,
      parser: 'babel',
      filePath: absolutePath,
    });

    const result = `import React from 'react';export const tsCode = ${highlight(
      tsCode,
      'tsx',
    )};export const jsCode = ${highlight(jsCode, 'jsx')}`;

    return callback(null, result);
  } catch (err) {
    return callback(err);
  }
};

function highlight(code, lang) {
  const content = Prism.highlight(code, Prism.languages[lang], lang);

  return `<code className='language-${lang}' dangerouslySetInnerHTML={{__html: ${JSON.stringify(
    content,
  )}}}/>`;
}
