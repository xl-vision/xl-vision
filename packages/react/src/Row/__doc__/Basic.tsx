import React from 'react';
import { Row, styled } from '@xl-vision/react';

const Wrapper = styled('div')(
  ({ theme }) => `
  padding: 0.5rem;
  background-color: ${theme.color.divider};
  border-radius: 4px;

  & + & {
    margin-top: 1rem;
  }
`,
);

const Box = styled('div')(
  ({ theme }) => `
  padding: 0.5rem;
  color: ${theme.color.themes.primary.text.primary};
  text-align: center;
  background-color: ${theme.color.themes.primary.color};
  border-radius: 5px;
`,
);

export default () => {
  return (
    <div>
      <Wrapper>
        <Row gutter={10} type='flex'>
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
      </Wrapper>
      <Wrapper>
        <Row gutter={10}>
          <Row.Col column={6}>
            <Box>col1</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box>col2</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box>col3</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box>col4</Box>
          </Row.Col>
        </Row>
      </Wrapper>
      <Wrapper>
        <Row gutter={10}>
          <Row.Col column={8}>
            <Box>col1</Box>
          </Row.Col>
          <Row.Col column={0}>
            <Box>col2</Box>
          </Row.Col>
          <Row.Col column={8}>
            <Box>col3</Box>
          </Row.Col>
          <Row.Col column={8}>
            <Box>col4</Box>
          </Row.Col>
        </Row>
      </Wrapper>
    </div>
  );
};
