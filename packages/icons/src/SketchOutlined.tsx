/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="m925.6 405.1-203-253.7a6.5 6.5 0 0 0-5-2.4H306.4c-1.9 0-3.8.9-5 2.4l-203 253.7a6.5 6.5 0 0 0 .2 8.3l408.6 459.5c1.2 1.4 3 2.1 4.8 2.1 1.8 0 3.5-.8 4.8-2.1l408.6-459.5a6.5 6.5 0 0 0 .2-8.3M645.2 206.4l34.4 133.9-132.5-133.9zm8.2 178.5H370.6L512 242zM378.8 206.4h98.1L344.3 340.3zm-53.4 7-44.1 171.5h-93.1zM194.6 434.9H289l125.8 247.7zM512 763.4 345.1 434.9h333.7zm97.1-80.8L735 434.9h94.4zm133.6-297.7-44.1-171.5 137.2 171.5z" /></svg>)

export default !isProduction ? createIcon(svg, 'SketchOutlined') : createIcon(svg);
