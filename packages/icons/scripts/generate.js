/* eslint-disable no-await-in-loop */

const fs = require('fs-extra');
const Mustache = require('mustache');
const path = require('node:path');
const format = require('./format');

const basePath = path.resolve(__dirname, '../svg');

const metadataPath = path.resolve(__dirname, '../metadata.json');

const destPath = path.resolve(__dirname, '../src');

const templatePath = path.resolve(__dirname, 'template');

// 有重复的文件，忽略其中一个
const ignoreNames = [];

async function generate() {
  await fs.emptyDir(destPath);
  await fs.copy(path.resolve(templatePath, 'utils'), path.resolve(destPath, 'utils'), {
    recursive: true,
  });

  const metadata = {};
  const files = await fs.readdir(basePath);

  const template = await fs.readFile(path.resolve(templatePath, 'template.tsx'), 'utf8');

  let indexContent = `/* eslint-disable */\n\nexport { default as createIcon } from './utils/createIcon'\n`;

  for (const iconType of files) {
    const dir = path.resolve(basePath, iconType);
    const icons = await fs.readdir(dir);
    for (const icon of icons) {
      const iconBaseName = icon.replace(/.svg$/, '');
      if (ignoreNames.includes(iconBaseName)) {
        continue;
      }

      const iconFile = path.resolve(dir, icon);

      const iconName = toCamel(`${iconBaseName}-${iconType}`);

      const iconContent = await fs.readFile(iconFile, 'utf8');

      const svg = await format(iconContent);

      const component = Mustache.render(template, {
        svg,
        name: iconName,
      });

      const array = metadata[iconType] || [];

      array.push(iconName);

      metadata[iconType] = array;

      indexContent += `export { default as ${iconName} } from './${iconName}'\n`;

      await fs.writeFile(path.resolve(destPath, `${iconName}.tsx`), component);
    }
  }

  await fs.writeJSON(metadataPath, metadata, {
    spaces: 2,
  });

  await fs.writeFile(path.resolve(destPath, 'index.ts'), indexContent);
}

const mapping = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function num2Char(num) {
  const str = String(num);
  let newStr = '';
  for (let i = 0; i < str.length; i++) {
    const newNum = Number.parseInt(str[i], 10);
    newStr += mapping[newNum];
  }
  return newStr;
}

function toCamel(name) {
  // 首字母不能是数字
  name = name.replace(/^\d+/, (match) => num2Char(match));

  // 下划线转驼峰
  name = name.replaceAll(/-(.)/g, (_, char) => {
    return char.toUpperCase();
  });

  // 首字母大写
  name = name.charAt(0).toUpperCase() + name.slice(1);

  return name;
}

generate();
