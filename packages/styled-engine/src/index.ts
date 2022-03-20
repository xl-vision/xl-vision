import styled from './styled';

export default styled;

export type {
  ShouldForwardProp,
  SimpleInterpolation,
  StyledComponent,
  CSSKeyframes,
  CSSObject,
  CSSProperties,
  CSSPseudos,
  CreateGlobalStyle,
  CreateKeyframes,
  CreateStyledComponent,
  PropsOf,
  Styled,
  GlobalStyleComponent,
  FilteringStyledOptions,
  Interpolation,
  InterpolationPrimitive,
  Keyframes,
  FunctionInterpolation,
  ExtractProps,
} from '@xl-vision/styled-engine-types';

export { default as createGlobalStyles } from './createGlobalStyles';
export { default as keyframes } from './keyframes';
export { default as StyledEngineProvider } from './StyledEngineProvider';
export { default as ThemeContext } from './ThemeContext';
