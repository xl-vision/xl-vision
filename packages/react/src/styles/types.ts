import { StyledComponent as InnerStyledComponent } from '@xl-vision/styled-engine';
import { StyledComponentKey } from './constants';

export type StyledComponent = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [StyledComponentKey]?: InnerStyledComponent<any, any>;
};
