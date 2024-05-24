'use client';

import { Row, styled } from '@xl-vision/react';

const Wrapper = styled('div')(
  ({ theme }) => `
  padding: 0.5rem;
  background-color: ${theme.colors.divider.primary};
  border-radius: 4px;

  & + & {
    margin-top: 1rem;
  }
`,
);

const Box = styled('div')(
  ({ theme }) => `
  padding: 0.5rem;
  color: ${theme.colors.themes.primary.text.primary};
  text-align: center;
  background-color: ${theme.colors.themes.primary.foreground.default};
  border-radius: 5px;
`,
);

const Offset = () => {
  return (
    <div>
      <Wrapper>
        <Row gutter={10}>
          <Row.Col column={6}>
            <Box>col1</Box>
          </Row.Col>
          <Row.Col column={6} offset={6}>
            <Box>col2</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box>col3</Box>
          </Row.Col>
        </Row>
      </Wrapper>
      <Wrapper>
        <Row gutter={10}>
          <Row.Col column={6}>
            <Box>col1</Box>
          </Row.Col>
          <Row.Col column={6} push={6}>
            <Box>col2</Box>
          </Row.Col>
          <Row.Col column={6} pull={6}>
            <Box>col3</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box>col4</Box>
          </Row.Col>
        </Row>
      </Wrapper>
      <Wrapper>
        <Row gutter={10}>
          <Row.Col column={6} offset={6}>
            <Box>col1</Box>
          </Row.Col>
          <Row.Col column={6} pull={12}>
            <Box>col2</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box>col3</Box>
          </Row.Col>
        </Row>
      </Wrapper>
    </div>
  );
};

export default Offset;
