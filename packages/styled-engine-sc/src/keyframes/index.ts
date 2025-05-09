import { CreateKeyframes } from '@xl-vision/styled-engine-types';
import { keyframes as scKeyframes } from 'styled-components';

const keyframes: CreateKeyframes = scKeyframes as unknown as CreateKeyframes;

export default keyframes;
