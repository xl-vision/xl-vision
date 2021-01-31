import { CreateGlobalStyle } from '@xl-vision/styled-engine-types';
import { createGlobalStyle as scCreateGlobalStyle } from 'styled-components';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const createGlobalStyle: CreateGlobalStyle = scCreateGlobalStyle as CreateGlobalStyle;

export default createGlobalStyle;
