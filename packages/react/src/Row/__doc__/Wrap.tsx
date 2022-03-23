import React from 'react';
import { Row, styled } from '@xl-vision/react';

const Box = styled('div')(
  ({ theme }) => `
  padding: 0.5rem;
  color: ${theme.color.themes.primary.text.primary};
  text-align: center;
  background-color: ${theme.color.themes.primary.color};
  border-radius: 5px;
`,
);

const Basic = () => {
  return (
    <Row gutter={10} wrap={true}>
      <Row.Col column={4}>
        <Box>col1</Box>
      </Row.Col>
      <Row.Col column={5}>
        <Box>col2</Box>
      </Row.Col>
      <Row.Col column={7}>
        <Box>col3</Box>
      </Row.Col>
      <Row.Col column={8}>
        <Box>col4</Box>
      </Row.Col>
    </Row>
  );
};

export default Basic;
