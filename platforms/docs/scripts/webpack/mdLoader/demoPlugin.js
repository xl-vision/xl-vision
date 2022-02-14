/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */

let demoCount = 0;

const TYPE = 'demo';

const TYPE_TITLE = `${TYPE}_title`;
const TYPE_DESC = `${TYPE}_desc`;

const codeLoaderPath = require.resolve('../codeLoader').replace(/\\/g, '\\\\');

module.exports = function demoPlugin() {
  const Parser = this.Parser;

  // Inject blockTokenizer
  const blockTokenizers = Parser.prototype.blockTokenizers;
  const blockMethods = Parser.prototype.blockMethods;

  if (blockTokenizers[TYPE]) {
    return;
  }

  blockTokenizers[TYPE] = blockTokenizer;

  blockMethods.unshift(TYPE);

  return async function parse(tree) {
    visit(tree, TYPE, (node, parent) => {
      if (!parent) {
        return;
      }

      const filePath = node.path;
      const options = node.options;

      const demoName = `Demo_${demoCount++}`;

      const demo = demoName;
      const jsCode = `${demoName}_js`;
      const tsCode = `${demoName}_ts`;

      const nodes = [...node.children];

      node.type = 'element';

      tree.children.unshift({
        type: 'import',
        value: `import {tsCode as ${tsCode}, jsCode as ${jsCode}} from '${filePath}.jsx!=!${codeLoaderPath}!${filePath}'`,
      });

      tree.children.unshift({
        type: 'import',
        value: `import ${demo} from '${filePath}'`,
      });

      const paramsString = Object.keys(options)
        .map((k) => {
          const v = options[k];
          return `${k}={${JSON.stringify(v)}}`;
        })
        .join(' ');

      nodes.unshift({
        type: 'jsx',
        value: `<DemoBox ${paramsString}>`,
      });

      nodes.push({
        type: 'jsx',
        value: `<pre className='language-tsx'>{${tsCode}}</pre>`,
      });

      nodes.push({
        type: 'jsx',
        value: `<pre className='language-jsx'>{${jsCode}}</pre>`,
      });

      nodes.push({
        type: 'jsx',
        value: `<${demo} />`,
      });

      nodes.push({
        type: 'jsx',
        value: '</DemoBox>',
      });

      const children = parent.children;

      for (let i = 0; i < children.length; i++) {
        if (children[i] === node) {
          children.splice(i, 1, ...nodes);
        }
      }
    });
  };
};

const REGEX_START = /^:::[\t\f ]*demo[\t\f ]+(.+)[\t\f ]*(\r?\n)+/;

const REGEX_CONTNET = /^[\t\n\f ]*(.+)\n+([\S\s]+)$/;

function blockTokenizer(eat, value) {
  const matches = value.match(REGEX_START);

  if (!matches) {
    return;
  }

  const params = matches[1]
    .trim()
    .replace(/\s*=\s*/g, '=')
    .split(/\s+/);

  if (!params.length) {
    return;
  }

  const [filePath, ...others] = params;

  const options = {};

  others.forEach((field) => {
    const [k, v] = field.split('=').map((it) => (it || '').trim());
    if (k) {
      options[k] = v || true;
    }
  });

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

  const now = eat.now();
  const exit = this.enterBlock();

  const content = lines.slice(1, i).join('\n');

  const matchString = lines.slice(0, i + 1).join('\n');

  const matchContent = content.match(REGEX_CONTNET);

  const title = matchContent[1];

  const desc = matchContent[2];

  const add = eat(matchString);

  const descContent = {
    type: TYPE_DESC,
    children: this.tokenizeBlock(desc, now),
  };

  const titleContent = {
    type: TYPE_TITLE,
    children: this.tokenizeInline(title, now),
  };

  add({
    type: TYPE,
    path: filePath,
    options,
    children: [titleContent, descContent],
  });
  exit();
}

function visit(tree, type, cb, parent) {
  if (!tree) {
    return;
  }

  if (tree.type === type) {
    cb(tree, parent);
  }

  const children = tree.children || [];
  for (const child of children) {
    visit(child, type, cb, tree);
  }
}
