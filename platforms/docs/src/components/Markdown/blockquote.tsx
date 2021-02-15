import { styled } from '@xl-vision/react';
import { emphasize } from '@xl-vision/react/utils/color';

export default styled('blockquote')(
  ({ theme }) => `
  margin: 1rem 0;
  padding: 0.25rem 0 0.25rem 1rem;
  line-height: 2;
  background-color: ${emphasize(theme.color.background)};
  border-left: 4px solid ${theme.color.divider};

  p {
    margin: 0;
  }

  & + & {
    margin-top: -1rem;
  }
`,
);
