/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64M288 421a48.01 48.01 0 0 1 96 0 48.01 48.01 0 0 1-96 0m384 200c0 4.4-3.6 8-8 8H360c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h304c4.4 0 8 3.6 8 8zm16-152a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96" /></svg>)

export default !isProduction ? createIcon(svg, 'MehFilled') : createIcon(svg);
