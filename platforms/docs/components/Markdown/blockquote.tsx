import { styled } from '@xl-vision/react';
import { emphasize } from '@xl-vision/react/utils/color';

export default styled('blockquote')(({ theme }) => {
  return {
    margin: '1rem 0',
    padding: '0.25rem 0 0.25rem 1rem',
    lineHeight: 2,
    backgroundColor: emphasize(theme.color.background.paper, 0.1),
    borderLeft: `4px solid ${theme.color.divider}`,

    p: {
      margin: 0,
    },

    '& + &': {
      marginTop: ' -1rem',
    },
  };
});
