/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32m-40 208H676V232h212zm0 224H676V432h212zM412 432h200v160H412zm200-64H412V232h200zm-476 64h212v160H136zm0-200h212v136H136zm0 424h212v136H136zm276 0h200v136H412zm476 136H676V656h212z" /></svg>)

export default !isProduction ? createIcon(svg, 'TableOutlined') : createIcon(svg);
