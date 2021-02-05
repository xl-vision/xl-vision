import { CreateGlobalStyle } from '@xl-vision/styled-engine-types';
import { createGlobalStyle as scCreateGlobalStyle } from 'styled-components';

const createGlobalStyle: CreateGlobalStyle = scCreateGlobalStyle as CreateGlobalStyle;

export default createGlobalStyle;
