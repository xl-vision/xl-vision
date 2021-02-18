/* eslint-disable import/no-extraneous-dependencies */
const svgo = require('svgo');

const config = {
  floatPrecision: 4,
  plugins: [
    'cleanupAttrs',
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeTitle',
    'removeDesc',
    'removeUselessDefs',
    'removeXMLNS',
    'removeEditorsNSData',
    'removeEmptyAttrs',
    'removeHiddenElems',
    'removeEmptyText',
    'removeEmptyContainers',
    'removeViewBox',
    'cleanupEnableBackground',
    'minifyStyles',
    'convertStyleToAttrs',
    'convertColors',
    'convertPathData',
    'convertTransform',
    'removeUnknownsAndDefaults',
    'removeNonInheritableGroupAttrs',
    'removeUnusedNS',
    'cleanupIDs',
    'cleanupNumericValues',
    'cleanupListOfValues',
    'moveElemsAttrsToGroup',
    'moveGroupAttrsToElems',
    'collapseGroups',
    'removeRasterImages',
    'mergePaths',
    'convertShapeToPath',
    'sortAttrs',
    'removeDimensions',
    'removeAttrs',
    'removeElementsByAttr',
    'removeStyleElement',
    'removeScriptElement',
    { name: 'removeAttrs', attrs: '(stroke|fill)' },
  ],
};

module.exports = async (data) => {
  const result = await svgo.optimize(data, config);

  return result.data;
};
