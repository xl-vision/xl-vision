/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = ({{&svg}})

export default !isProduction ? createIcon(svg, '{{name}}') : createIcon(svg);
