/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-template */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

let demoCount = 0;

const TYPE = 'demo';

const TYPE_TITLE = TYPE + '_title';
const TYPE_DESC = TYPE + '_desc';

module.exports = function createDemoPlugin(ctx) {
  return function demoPlugin() {
    const Parser = this.Parser;

    // Inject blockTokenizer
    const blockTokenizers = Parser.prototype.blockTokenizers;
    const blockMethods = Parser.prototype.blockMethods;

    if (blockTokenizers[TYPE]) {
      return;
    }

    blockTokenizers[TYPE] = blockTokenizer;

    blockMethods.unshift(TYPE);

    return async function parse(tree, vfile) {
      const basePath = vfile.dirname;
      const nodes = visit(tree, TYPE);

      const pathSet = new Set();

      for (const node of nodes) {
        const filePath = node.path;

        if (!filePath.match(/.tsx?$/)) {
          throw new Error(`file is not end with '.ts' or '.tsx': ${filePath}`);
        }

        const absolutePath = path.isAbsolute(filePath)
          ? filePath
          : path.resolve(basePath, filePath);

        pathSet.add(absolutePath);

        const tsCode = await new Promise((resolve, reject) => {
          fs.readFile(absolutePath, (err, data) => {
            if (err) {
              return reject(err);
            }
            resolve(data);
          });
        });

        let jsCode = (
          await babel.transformAsync(tsCode, {
            filename: path.basename(filePath),
            presets: [
              // '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          })
        ).code;

        const prettierOptions = await prettier.resolveConfig(process.cwd(), {
          editorconfig: true,
          useCache: true,
        });

        // prettier
        jsCode = prettier.format(jsCode, {
          ...prettierOptions,
          parser: 'babel',
          filePath: absolutePath,
        });

        const demoName = `Demo_${demoCount++}`;

        node.type = 'element';

        tree.children.unshift({
          type: 'import',
          value: `import ${demoName} from '${filePath}'`,
        });

        node.children.unshift({
          type: 'jsx',
          value: '<DemoBox>',
        });

        node.children.push({
          type: 'code',
          value: tsCode,
          lang: 'tsx',
        });

        node.children.push({
          type: 'code',
          value: jsCode,
          lang: 'jsx',
        });

        node.children.push({
          type: 'jsx',
          value: `<${demoName} />`,
        });

        node.children.push({
          type: 'jsx',
          value: '</DemoBox>',
        });
      }

      pathSet.forEach((filepath) => {
        ctx.addDependency(filepath);
      });
    };
  };
};

const REGEX_START = /^:::[\t\f ]*demo[\t\f ]+(\S+)[\t\f ]*(\r?\n)+/;

const REGEX_CONTNET = /^[\t\n\f ]*(.+)\n+([\S\s]+)$/;

function blockTokenizer(eat, value) {
  const now = eat.now();

  const matches = value.match(REGEX_START);

  if (!matches) {
    return;
  }

  const filePath = matches[1];

  const lines = value.split('\n');

  let i = 1;

  for (; i < lines.length; i++) {
    const line = lines[i];
    const trimLine = line.trim();
    if (trimLine === ':::') {
      break;
    }
  }

  if (i === lines.length) {
    return;
  }

  const content = lines.slice(1, i).join('\n');

  const matchString = lines.slice(0, i + 1).join('\n');

  const matchContent = content.match(REGEX_CONTNET);

  const title = matchContent[1];

  const desc = matchContent[2];

  const add = eat(matchString);

  const exit = this.enterBlock();

  const descContent = {
    type: TYPE_DESC,
    children: this.tokenizeBlock(desc, now),
  };

  exit();

  const titleContent = {
    type: TYPE_TITLE,
    children: this.tokenizeInline(title, now),
  };

  return add({
    type: TYPE,
    path: filePath,
    children: [titleContent, descContent],
  });
}

function visit(tree, type) {
  const nodes = [];
  if (!tree) {
    return nodes;
  }

  if (tree.type === type) {
    nodes.push(tree);
  }

  const children = tree.children || [];
  for (const child of children) {
    nodes.push(...visit(child, type));
  }

  return nodes;
}
