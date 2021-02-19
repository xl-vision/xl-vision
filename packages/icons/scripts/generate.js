/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const path = require('path');
const fs = require('fs-extra');
const Mustache = require('mustache');
const format = require('./format');

const basePath = path.resolve(__dirname, '../third/material-design-icons/src');

const metadataPath = path.resolve(__dirname, '../metadata.json');

const destPath = path.resolve(__dirname, '../src');

// 有重复的文件，忽略其中一个
const ignoreNames = ['addchart'];

async function generate() {
  const exist = fs.existsSync(destPath);
  if (exist) {
    await fs.remove(destPath);
  }
  await fs.mkdirp(destPath);
  const metadata = {};
  const files = await fs.readdir(basePath);

  const template = await fs.readFile(path.resolve(__dirname, 'template.tsx'), 'utf-8');

  let indexContent = '/* eslint-disable */\n';

  for (const category of files) {
    const dir = path.resolve(basePath, category);
    const icons = await fs.readdir(dir);
    for (const icon of icons) {
      const subdir = path.resolve(dir, icon);
      const iconTypes = await fs.readdir(subdir);

      if (ignoreNames.includes(icon)) {
        // eslint-disable-next-line no-continue
        continue;
      }

      for (const type of iconTypes) {
        let realType = type.replace(/^materialicons/, '');

        if (!realType) {
          realType = 'filled';
        }

        const iconName = toCamel(`${icon}_${realType}`);

        const data = await fs.readFile(path.resolve(subdir, type, '24px.svg'), 'utf-8');

        const svg = await format(data);

        const component = Mustache.render(template, {
          svg,
          name: iconName,
        });

        const array = metadata[category] || [];

        array.push(iconName);

        metadata[category] = array;

        indexContent += `export { default as ${iconName} } from './${iconName}'\n`;

        await fs.writeFile(path.resolve(destPath, `${iconName}.tsx`), component);
      }
    }
  }

  await fs.writeJSON(metadataPath, metadata);

  await fs.writeFile(path.resolve(destPath, 'index.ts'), indexContent);
}

const mapping = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function num2Char(num) {
  const str = String(num);
  let newStr = '';
  for (let i = 0; i < str.length; i++) {
    const newNum = parseInt(str[i], 10);
    newStr += mapping[newNum];
  }
  return newStr;
}

function toCamel(name) {
  // 首字母不能是数字
  name = name.replace(/^\d+/, (match) => num2Char(match));

  // 下划线转驼峰
  name = name.replace(/_(.)/g, (_, char) => {
    return char.toUpperCase();
  });

  // 首字母大写
  name = name.charAt(0).toUpperCase() + name.substring(1);

  return name;
}

generate();
