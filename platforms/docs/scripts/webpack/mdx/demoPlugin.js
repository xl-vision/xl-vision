const DEMO_REGEX_START = /^:::[\t\f ]*demo[\t\f ]+(.+)/;
const DEMO_REGEX_END = /^:::[\t\f ]*/;

let demoCount = 0;

const codeLoaderPath = require.resolve('../codeLoader').replace(/\\/g, '\\\\');

module.exports = function demoPlugin() {
  const that = this;

  return (tree) => {
    const { children } = tree;

    let startIndex = 0;

    let params;

    for (; startIndex < children.length; startIndex++) {
      const child = children[startIndex];
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
        .replace(/\s*=\s*/g, '=')
        .split(/\s+/);
      break;
    }

    let endIndex = startIndex + 1;

    for (; endIndex < children.length; endIndex++) {
      const child = children[startIndex];
      if (child.type !== 'paragraph') {
        continue;
      }
      if (child.children.length !== 1 || child.children[0].type !== 'text') {
        continue;
      }
      const content = child.children[0].value;
      if (content.match(DEMO_REGEX_END)) {
        break;
      }
    }

    if (startIndex === children.length || endIndex === children.length) {
      return;
    }

    // params 必存在
    const [filePath, ...options] = params;

    let titleIndex = startIndex + 1;

    for (; titleIndex < endIndex; titleIndex++) {
      const node = children[titleIndex];

      if (node.type === 'paragraph' && node.children.length) {
        break;
      }
    }

    // const titleNode = children[titleIndex];
    // const descNode = children.slice(titleIndex + 1, endIndex);

    const demoName = `Demo_${demoCount++}`;

    const jsCode = `${demoName}_js`;
    const jsCodeNode = `${jsCode}_node`;
    const tsCode = `${demoName}_ts`;
    const tsCodeNode = `${tsCode}_node`;

    const importInfoNode = that.parse(
      `import {tsCode as ${tsCode}, tsCodeNode as ${tsCodeNode}, jsCode as ${jsCode}, jsCodeNode as ${jsCodeNode}} from '${filePath}.jsx!=!${codeLoaderPath}!${filePath}'`,
    ).children[0];

    const importDemoNode = that.parse(`import ${demoName} from '${filePath}'`).children[0];

    const nodeWrap = that.parse(
      `<DemoBox tsCode={A} jsCode={${jsCode}} tsCodeNode={${tsCodeNode}} jsCodeNode={${jsCodeNode}}>{${demoName}}</DemoBox>`,
    ).children;

    const node = nodeWrap[0].children[0];

    node.type = 'mdxJsxFlowElement';

    children.splice(startIndex, endIndex - startIndex, node);
    children.unshift(importInfoNode, importDemoNode);

    return tree;
  };
};
