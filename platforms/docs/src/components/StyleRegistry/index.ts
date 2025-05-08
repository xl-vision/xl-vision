'use client';

import { css } from '@xl-vision/styled-engine';
import { css as scCss } from '@xl-vision/styled-engine-sc';
import EmotionRegistry from './EmotionRegistry';
import StyledComponentsRegistry from './StyledComponentsRegistry';

const isStyledComponents = css === scCss;

console.log(isStyledComponents, '======')

export default isStyledComponents ? StyledComponentsRegistry : EmotionRegistry;
