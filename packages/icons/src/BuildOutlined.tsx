/* eslint-disable */
import React from 'react'
import { env } from '@xl-vision/utils'
import createIcon from './utils/createIcon';

export default createIcon(<svg viewBox="0 0 1024 1024"><path d="M916 210H376c-17.7 0-32 14.3-32 32v236H108c-17.7 0-32 14.3-32 32v272c0 17.7 14.3 32 32 32h540c17.7 0 32-14.3 32-32V546h236c17.7 0 32-14.3 32-32V242c0-17.7-14.3-32-32-32zm-504 68h200v200H412V278zm-68 468H144V546h200v200zm268 0H412V546h200v200zm268-268H680V278h200v200z" /></svg>, !env.isProduction && 'BuildOutlined');
