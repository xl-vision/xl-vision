/* eslint-disable */
import React from 'react';
import { env } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="M894 462c30.9 0 43.8-39.7 18.7-58L530.8 126.2a31.81 31.81 0 0 0-37.6 0L111.3 404c-25.1 18.2-12.2 58 18.8 58H192v374h-72c-4.4 0-8 3.6-8 8v52c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-52c0-4.4-3.6-8-8-8h-72V462h62zM512 196.7l271.1 197.2H240.9L512 196.7zM264 462h117v374H264V462zm189 0h117v374H453V462zm307 374H642V462h118v374z" /></svg>)

export default !env.isProduction ? createIcon(svg, 'BankOutlined') : createIcon(svg);
