/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32m-600 72h560v208H232zm560 480H232V408h560zm0 272H232V680h560zM496 208H312c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8M312 544h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H312c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8m328 244a40 40 0 1 0 80 0 40 40 0 1 0-80 0" /></svg>)

export default !isProduction ? createIcon(svg, 'HddOutlined') : createIcon(svg);
