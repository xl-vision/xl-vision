/* eslint-disable */
import React from 'react'
import { env } from '@xl-vision/utils'
import createIcon from './utils/createIcon';

const svg = ({{&svg}})

export default !env.isProduction ? createIcon(svg, '{{name}}') : createIcon(svg);
