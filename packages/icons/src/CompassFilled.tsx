/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64M327.3 702.4c-2 .9-4.4 0-5.3-2.1-.4-1-.4-2.2 0-3.2l98.7-225.5 132.1 132.1zm375.1-375.1-98.7 225.5-132.1-132.1L697.1 322c2-.9 4.4 0 5.3 2.1.4 1 .4 2.1 0 3.2" /></svg>)

export default !isProduction ? createIcon(svg, 'CompassFilled') : createIcon(svg);
