/* eslint-disable */
import React from 'react'
import { env } from '@xl-vision/utils'
import createIcon from './utils/createIcon';

export default createIcon(<svg viewBox="0 0 1024 1024"><path d="M112 476h160v72H112zm320 0h160v72H432zm320 0h160v72H752z" /></svg>, !env.isProduction && 'DashOutlined');
