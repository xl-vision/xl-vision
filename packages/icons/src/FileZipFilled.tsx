/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="M854.6 288.7c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4zM790.2 326 602 137.8V326zM296 136v64h64v-64zm64 64v64h64v-64zm-64 64v64h64v-64zm64 64v64h64v-64zm-64 64v64h64v-64zm64 64v64h64v-64zm-64 64v64h64v-64zm0 64v160h128V584zm48 48h32v64h-32z" /></svg>)

export default !isProduction ? createIcon(svg, 'FileZipFilled') : createIcon(svg);
