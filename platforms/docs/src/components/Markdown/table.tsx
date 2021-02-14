import { styled } from '@xl-vision/react';

export default styled('table')(
  ({ theme }) => `
  min-width: 100%;
  font-size: 1rem;
  line-height: 1.5rem;
  border-collapse: collapse;
  border-spacing: 0;

  // tbody{
  //   tr{
  //     &:nth-child(odd){
  //       background-color: #d8d8d8;
  //     }
  //   }
  // }
  td,
  th {
    padding: 1rem;
    border-bottom: 1px solid ${theme.color.divider};
  }

  th {
    // color: $title-color;
    font-weight: bold;
    white-space: nowrap;
    text-align: left;
  }

  td {
    // color: $base-color;
  }
`,
);
