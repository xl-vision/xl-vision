/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="M800 64H224c-35.3 0-64 28.7-64 64v768c0 35.3 28.7 64 64 64h576c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64m-8 824H232V136h560zM472 784a40 40 0 1 0 80 0 40 40 0 1 0-80 0" /></svg>)

export default !isProduction ? createIcon(svg, 'TabletOutlined') : createIcon(svg);
