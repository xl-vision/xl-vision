import { styled } from '@xl-vision/react';
import { darken } from '@xl-vision/react/utils/color';

export default styled('code')(
  ({ theme }) => `
  display: inline-block;
  margin: 0 0.2em;
  padding: 0.1em 0.4em;
  font-size: 0.8em;
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  background-color: ${darken(theme.color.background, 0.1)};
  border-radius: 3px;
`,
);
