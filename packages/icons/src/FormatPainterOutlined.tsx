/* eslint-disable */
import React from 'react';
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><defs/><path d="M840 192h-56v-72c0-13.3-10.7-24-24-24H168c-13.3 0-24 10.7-24 24v272c0 13.3 10.7 24 24 24h592c13.3 0 24-10.7 24-24V256h32v200H465c-22.1 0-40 17.9-40 40v136h-44c-4.4 0-8 3.6-8 8v228c0 .6.1 1.3.2 1.9-.1 2-.2 4.1-.2 6.1 0 46.4 37.6 84 84 84s84-37.6 84-84c0-2.1-.1-4.1-.2-6.1.1-.6.2-1.2.2-1.9V640c0-4.4-3.6-8-8-8h-44V520h351c22.1 0 40-17.9 40-40V232c0-22.1-17.9-40-40-40zM720 352H208V160h512v192zM477 876c0 11-9 20-20 20s-20-9-20-20V696h40v180z" /></svg>)

export default !isProduction ? createIcon(svg, 'FormatPainterOutlined') : createIcon(svg);
