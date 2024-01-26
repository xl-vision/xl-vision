/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="M176 511a56 56 0 1 0 112 0 56 56 0 1 0-112 0m280 0a56 56 0 1 0 112 0 56 56 0 1 0-112 0m280 0a56 56 0 1 0 112 0 56 56 0 1 0-112 0" /></svg>)

export default !isProduction ? createIcon(svg, 'EllipsisOutlined') : createIcon(svg);
