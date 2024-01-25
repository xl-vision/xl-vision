'use client';

import { Row, styled } from '@xl-vision/react';

const Box = styled('div')(
  ({ theme }) => `
  padding: 0.5rem;
  color: ${theme.colors.themes.primary.text.primary};
  text-align: center;
  background-color: ${theme.colors.themes.primary.foreground.enabled};
  border-radius: 5px;
`,
);

const ResponsiveColumn = () => {
  return (
    <div>
      <Row
        gutter={{
          xs: 10,
          md: 15,
          lg: 20,
          xl: 25,
          xxl: 30,
        }}
      >
        <Row.Col
          column={{
            xs: 0,
            md: 4,
            lg: 6,
          }}
        >
          <Box>col1</Box>
        </Row.Col>
        <Row.Col
          column={{
            xs: 8,
            md: 5,
            lg: 10,
            xxl: 6,
          }}
        >
          <Box>col2</Box>
        </Row.Col>
        <Row.Col
          column={{
            xs: 8,
            md: 7,
            lg: 4,
            xl: 0,
            xxl: 6,
          }}
        >
          <Box>col3</Box>
        </Row.Col>
        <Row.Col
          column={{
            xs: 8,
            md: 8,
            lg: 4,
            xl: 8,
            xxl: 6,
          }}
        >
          <Box>col4</Box>
        </Row.Col>
      </Row>
    </div>
  );
};

export default ResponsiveColumn;
