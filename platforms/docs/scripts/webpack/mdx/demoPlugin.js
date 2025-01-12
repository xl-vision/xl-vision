const { pinyin } = require('pinyin');

const DEMO_REGEX_START = /^:::[\t\f ]*demo[\t\f ]+(.+)/;
const DEMO_REGEX_END = /^:::[\t\f ]*/;

const codeLoaderPath = require.resolve('./codeLoader').replaceAll('\\', '\\\\');

module.exports = function demoPlugin() {
  const self = this;

  return async (tree) => {
    const { children } = tree;

    let start = 0;

    while (start !== undefined) {
      start = createDemoBox(children, start, self);
    }

    const titles = [];

    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (node.type === 'heading') {
        const title = getText(node.children);
        const id = getId(title);
        titles.push({
          id,
          title,
          level: node.depth,
        });

        children[i] = {
          type: 'mdxJsxFlowElement',
          name: `h${node.depth}`,
          children: node.children,
          attributes: [
            {
              name: 'id',
              value: id,
              type: 'mdxJsxAttribute',
            },
          ],
        };
      } else if (node.id && node.title) {
        titles.push({
          id: node.id,
          title: node.title,
          level: 3,
          debug: node.debug,
        });
      }
    }

    const titleNode = toNestNode(titles);

    const exportOutline = self.parse(`export const outline = ${JSON.stringify(titleNode, null, 2)}`)
      .children[0];

    children.push(exportOutline);
  };
};

// 根据level将数组转为嵌套结构
function toNestNode(titles) {
  const heading = {
    children: [],
    level: Number.MIN_VALUE,
  };
  let now = heading;
  for (const title of titles) {
    while (now) {
      if (now.level < title.level) {
        break;
      }
      now = now.parent;
    }
    const node = {
      ...title,
      children: [],
      parent: now,
    };
    now.children.push(node);
    now = node;
  }

  // 去除parent

  function removeParent(nodes) {
    nodes.forEach((node) => {
      delete node.parent;
      removeParent(node.children || []);
    });
  }

  const nodes = heading.children;

  removeParent(nodes);

  return nodes;
}

function createDemoBox(nodes, start, ctx) {
  const len = nodes.length;

  let startIndex = start;

  let params;

  for (; startIndex < len; startIndex++) {
    const child = nodes[startIndex];
    if (child.type !== 'paragraph') {
      continue;
    }
    if (child.children.length !== 1 || child.children[0].type !== 'text') {
      continue;
    }
    const content = child.children[0].value;

    const match = content.match(DEMO_REGEX_START);

    if (!match) {
      continue;
    }

    params = match[1]
      .trim()
      .replaceAll(/\s*=\s*/g, '=')
      .split(/\s+/);
    break;
  }

  let endIndex = startIndex + 1;

  for (; endIndex < len; endIndex++) {
    const child = nodes[endIndex];
    if (child.type !== 'paragraph') {
      continue;
    }
    if (child.children.length !== 1 || child.children[0].type !== 'text') {
      continue;
    }
    const content = child.children[0].value;
    if (DEMO_REGEX_END.test(content)) {
      break;
    }
  }

  if (endIndex >= len) {
    return;
  }

  // params 必存在
  const [filePath, ...options] = params;

  let titleIndex = startIndex + 1;

  for (; titleIndex < endIndex; titleIndex++) {
    const node = nodes[titleIndex];

    if (node.type === 'paragraph' && node.children.length) {
      break;
    }
  }

  const demoName = `Demo${start}`;

  const jsCode = `${demoName}JsCode`;
  const jsCodeNode = `${jsCode}Node`;
  const tsCode = `${demoName}TsCode`;
  const tsCodeNode = `${tsCode}Node`;

  const codeImport = ctx.parse(
    `import {tsCode as ${tsCode}, tsCodeNode as ${tsCodeNode}, jsCode as ${jsCode}, jsCodeNode as ${jsCodeNode}} from '${filePath}.jsx!=!${codeLoaderPath}!${filePath}'`,
  ).children[0];

  const demoImport = ctx.parse(`import ${demoName} from '${filePath}'`).children[0];

  const titleNode = nodes[titleIndex].children;
  const descNode = nodes.slice(titleIndex + 1, endIndex);

  const title = getText(titleNode);

  const id = getId(title);

  const demoBoxCode = [
    `<DemoBox`,
    options.join('\n'),
    `  id='${id}'`,
    // `  tsCode={${tsCode}}`,
    `  jsCode={${jsCode}}`,
    `  tsCodeNode={<pre className='language-tsx'>{${tsCodeNode}}</pre>}`,
    `  jsCodeNode={<pre className='language-jsx'>{${jsCodeNode}}</pre>}`,
    `>`,
    `  {<${demoName} />}`,
    `</DemoBox>`,
  ].join('\n');

  const demoBox = ctx.parse(demoBoxCode).children[0];

  demoBox.id = id;
  demoBox.title = title;
  demoBox.debug = options.includes('debug');

  const demoBoxChildren = demoBox.children;

  demoBoxChildren.unshift(
    {
      type: 'mdxJsxTextElement',
      name: null,
      attributes: [],
      children: titleNode,
    },
    {
      type: 'mdxJsxTextElement',
      name: null,
      attributes: [],
      children: descNode,
    },
  );

  nodes.splice(startIndex, endIndex - startIndex + 1, demoBox);
  nodes.unshift(demoImport, codeImport);

  return endIndex + 2 - (endIndex - startIndex) + 1;
}

function getText(node) {
  node = Array.isArray(node) ? node : [node];
  return node
    .map((it) => {
      if (it.type === 'text') {
        return it.value;
      }
      return getText(node.children || []);
    })
    .join('');
}

function getId(text) {
  return pinyin(text, {
    style: pinyin.STYLE_NORMAL,
  })
    .join('')
    .replaceAll(/\s+/g, '');
}
