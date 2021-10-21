import { styled } from '@xl-vision/react';
import React from 'react';

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
      padding: ' 1rem',
      borderBottom: `1px solid ${theme.color.divider}`,
    },
    th: {
      // color: $title-color;
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      textAlign: 'left',
    },
    tbody: {
      td: {
        ':nth-child(3)': {
          color: theme.color.themes.secondary.color,
        },
      },
    },
  };
});

export type TableProps = React.TableHTMLAttributes<HTMLTableElement>;

const Table: React.FunctionComponent<TableProps> = (props) => {
  return (
    <Wrapper>
      <TableWrapper {...props} />
    </Wrapper>
  );
};

export default Table;
