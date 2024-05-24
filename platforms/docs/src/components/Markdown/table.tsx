'use client';

import { styled } from '@xl-vision/react';
import { TableHTMLAttributes, FC } from 'react';

const Wrapper = styled('div')(() => {
  return {
    width: '100%',
    overflow: 'auto',
  };
});

const TableWrapper = styled('table')(({ theme }) => {
  return {
    minWidth: '100%',
    // display: 'block',
    fontSize: '1rem',
    lineHeight: ' 1.5rem',
    borderCollapse: 'collapse',
    borderSpacing: 0,
    'td, th': {
      padding: '1rem 0.4rem',
      borderBottom: `${theme.sizes.middle.border}px solid ${theme.colors.divider.primary}`,
    },
    th: {
      // color: $title-color;
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      textAlign: 'left',
    },
    tbody: {
      td: {
        ':nth-child(1)': {
          fontWeight: theme.typography.fontWeight.medium,
        },
        ':nth-child(3)': {
          color: theme.colors.themes.error.foreground.default,
        },
      },
    },
  };
});

export type TableProps = TableHTMLAttributes<HTMLTableElement>;

const Table: FC<TableProps> = (props) => {
  return (
    <Wrapper>
      <TableWrapper {...props} />
    </Wrapper>
  );
};

export default Table;
