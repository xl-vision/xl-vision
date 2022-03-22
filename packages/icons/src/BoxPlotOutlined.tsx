/* eslint-disable */
import React from 'react';
import { env } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="M952 224h-52c-4.4 0-8 3.6-8 8v248h-92V304c0-4.4-3.6-8-8-8H232c-4.4 0-8 3.6-8 8v176h-92V232c0-4.4-3.6-8-8-8H72c-4.4 0-8 3.6-8 8v560c0 4.4 3.6 8 8 8h52c4.4 0 8-3.6 8-8V548h92v172c0 4.4 3.6 8 8 8h560c4.4 0 8-3.6 8-8V548h92v244c0 4.4 3.6 8 8 8h52c4.4 0 8-3.6 8-8V232c0-4.4-3.6-8-8-8zM296 368h88v288h-88V368zm432 288H448V368h280v288z" /></svg>)

export default !env.isProduction ? createIcon(svg, 'BoxPlotOutlined') : createIcon(svg);
