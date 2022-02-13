import { styled } from '@xl-vision/react';

const InlineCode = styled('code')(
  ({ theme }) => `
  display: inline-block;
  margin: 0 0.2em;
  padding: 0.1em 0.4em;
  font-size: 0.8em;
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  background-color: ${theme.color.emphasize(theme.color.background.paper, 0.18)};
  border-radius: 3px;
`,
);

export default InlineCode;
