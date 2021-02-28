import { styled } from '@xl-vision/react';

export default styled('table')(({ theme }) => {
  return {
    width: '100%',
    display: 'block',
    fontSize: '1rem',
    lineHeight: ' 1.5rem',
    borderCollapse: 'collapse',
    borderSpacing: 0,
    overflow: 'auto',
    'td, th': {
      padding: ' 1rem',
      borderBottom: `1px solid ${theme.color.divider}`,
    },
    th: {
      // color: $title-color;
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      textAlign: 'left',
    },
    td: {
      // color: $base-color;
    },
  };
});
