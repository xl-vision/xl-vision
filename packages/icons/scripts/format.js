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
    'cleanupIds',
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

const format = async (data) => {
  const result = await svgo.optimize(data, config);

  const svg = result.data
    .replaceAll('"/>', '" />')
    .replaceAll('fill-opacity=', 'fillOpacity=')
    .replaceAll('xlink:href=', 'xlinkHref=')
    .replaceAll('clip-rule=', 'clipRule=')
    .replaceAll('fill-rule=', 'fillRule=')
    .replaceAll(/ clip-path=".+?"/g, '') // Fix visibility issue and save some bytes.
    .replaceAll(/<clipPath.+?<\/clipPath>/g, '')
    .replaceAll(/ fill=".+?"/g, '')
    .replaceAll(/ class=".+?"/g, '');

  return svg;
};
module.exports = format;
