/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="m64 556.9 264.2 173.5L512.5 577 246.8 412.7zm896-290.3L696.8 95 512.5 248.5l265.2 164.2L512.5 577l184.3 153.4L960 558.8 777.7 412.7zM513 609.8 328.2 763.3l-79.4-51.5v57.8L513 928l263.7-158.4v-57.8l-78.9 51.5zM328.2 95 64 265.1l182.8 147.6 265.7-164.2zM64 556.9" /></svg>)

export default !isProduction ? createIcon(svg, 'DropboxOutlined') : createIcon(svg);
