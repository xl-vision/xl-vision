/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><defs/><path d="M736 550H288c-8.8 0-16 7.2-16 16v176c0 8.8 7.2 16 16 16h448c8.8 0 16-7.2 16-16V566c0-8.8-7.2-16-16-16zm-56 136H344v-64h336v64zm208 130c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm0 96c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24zM736 266H288c-8.8 0-16 7.2-16 16v176c0 8.8 7.2 16 16 16h448c8.8 0 16-7.2 16-16V282c0-8.8-7.2-16-16-16zm-56 136H344v-64h336v64zm208-194c39.8 0 72-32.2 72-72s-32.2-72-72-72-72 32.2-72 72 32.2 72 72 72zm0-96c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24zM136 64c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm0 96c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24zm0 656c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm0 96c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24z" /></svg>)

export default !isProduction ? createIcon(svg, 'UngroupOutlined') : createIcon(svg);
