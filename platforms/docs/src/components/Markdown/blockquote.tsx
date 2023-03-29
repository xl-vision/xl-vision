import { styled } from '@xl-vision/react';

const Blockquote = styled('blockquote')(({ theme }) => {
  return {
    margin: '1rem 0',
    padding: '0.25rem 0 0.25rem 1rem',
    lineHeight: 2,
    // backgroundColor: theme.color.emphasize(theme.color.background.paper, 0.1),
    borderLeft: `4px solid ${theme.colors.divider.primary}`,

    p: {
      margin: 0,
    },

    '& + &': {
      marginTop: ' -1rem',
    },
  };
});

export default Blockquote;
