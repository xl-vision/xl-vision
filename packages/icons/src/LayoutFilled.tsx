/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="M384 912h496c17.7 0 32-14.3 32-32V340H384zm496-800H384v164h528V144c0-17.7-14.3-32-32-32m-768 32v736c0 17.7 14.3 32 32 32h176V112H144c-17.7 0-32 14.3-32 32" /></svg>)

export default !isProduction ? createIcon(svg, 'LayoutFilled') : createIcon(svg);
