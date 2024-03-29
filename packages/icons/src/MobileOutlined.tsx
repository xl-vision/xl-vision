/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="M744 62H280c-35.3 0-64 28.7-64 64v768c0 35.3 28.7 64 64 64h464c35.3 0 64-28.7 64-64V126c0-35.3-28.7-64-64-64m-8 824H288V134h448zM472 784a40 40 0 1 0 80 0 40 40 0 1 0-80 0" /></svg>)

export default !isProduction ? createIcon(svg, 'MobileOutlined') : createIcon(svg);
