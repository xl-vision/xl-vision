/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="M448 804a64 64 0 1 0 128 0 64 64 0 1 0-128 0m32-168h64c4.4 0 8-3.6 8-8V164c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v464c0 4.4 3.6 8 8 8" /></svg>)

export default !isProduction ? createIcon(svg, 'ExclamationOutlined') : createIcon(svg);
