const fs = require('fs');
const path = require('path');

// const docsPath = require
//   .resolve(path.join(__dirname, '../../src/components/Docs/index.tsx'))
//   .replace(/\\/g, '\\\\');

module.exports = async function localeLoader() {
  const callback = this.async();

  const filePath = this.resourcePath;

  const fileName = path.basename(filePath);

  const splits = fileName.split('.');

  if (splits.length !== 3) {
    return callback(new Error(`file '${fileName}' is illegal.`));
  }

  const name = splits[0];

  const dir = path.dirname(filePath);

  try {
    const imports = [`import LocaleDocsRenderer from '@docs/components/LocaleDocsRenderer'`];

    // this.addDependency(docsPath);

    const locales = [];

    const files = await new Promise((resolve, reject) => {
      fs.readdir(dir, (err, names) => {
        if (err) {
          return reject(err);
        }
        resolve(names);
      });
    });

    files
      .map((it) => ({
        fileName: it,
        parts: it.split('.'),
      }))
      .filter((it) => {
        return it.parts.length === 3 && it.parts[0] === name;
      })
      .forEach((it) => {
        const contentName = `Locale_${it.parts[1].replace(/-/g, '_')}`;
        imports.push(
          `import {default as ${contentName}, outline as ${contentName}Outline} from './${it.fileName}'`,
        );
        locales.push(
          `'${it.parts[1]}': {
            docs: <${contentName} />,
            outline: ${contentName}Outline
          }`,
        );
        // if (it.fileName !== fileName) {
        //   this.addDependency(path.join(dir, it.fileName));
        // }
      });

    // const relativePath = path.relative(this.rootContext, filePath);

    // const componentName = `Locale_${relativePath.replace(/([./\\-])/g, '_')}`;

    const result = `${imports.join('\n')}\nconst localeDocsMap = {\n  ${locales.join(
      ',\n  ',
    )}\n}\nconst LocaleDocs = () => <LocaleDocsRenderer localeDocsMap={localeDocsMap} />\nexport default LocaleDocs`;

    callback(null, result);
  } catch (err) {
    callback(err);
  }
};
