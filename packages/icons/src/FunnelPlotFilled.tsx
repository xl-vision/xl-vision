/* eslint-disable */
import React from 'react'
import { env } from '@xl-vision/utils'
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="M336.7 586h350.6l84.9-148H251.8zm543.4-432H143.9c-24.5 0-39.8 26.7-27.5 48L215 374h594l98.7-172c12.2-21.3-3.1-48-27.6-48zM349 838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V650H349v188z" /></svg>)

export default !env.isProduction ? createIcon(svg, 'FunnelPlotFilled') : createIcon(svg);
