/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="M523.8 191.4v288.9h382V128.1zm0 642.2 382 62.2v-352h-382zM120.1 480.2H443V201.9l-322.9 53.5zm0 290.4L443 823.2V543.8H120.1z" /></svg>)

export default !isProduction ? createIcon(svg, 'WindowsFilled') : createIcon(svg);
