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
    'removeElementsByAttr',
    'removeStyleElement',
    'removeScriptElement',
    { name: 'removeAttrs', params: { attrs: '(stroke|fill)' } },
  ],
};

module.exports = async (data) => {
  const result = await svgo.optimize(data, config);

  const svg = result.data
    .replace(/"\/>/g, '" />')
    .replace(/fill-opacity=/g, 'fillOpacity=')
    .replace(/xlink:href=/g, 'xlinkHref=')
    .replace(/clip-rule=/g, 'clipRule=')
    .replace(/fill-rule=/g, 'fillRule=')
    .replace(/ clip-path=".+?"/g, '') // Fix visibility issue and save some bytes.
    .replace(/<clipPath.+?<\/clipPath>/g, '')
    .replace(/ fill=".+?"/g, '')
    .replace(/ class=".+?"/g, '');

  return svg;
};
