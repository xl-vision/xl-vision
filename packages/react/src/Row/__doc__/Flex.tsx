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
  display: flex;
  padding: 0.5rem;
  color: ${theme.colors.themes.primary.text.primary};
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.themes.primary.foreground.enabled};
  border-radius: 5px;
`,
);

const Flex = () => {
  return (
    <div>
      <Wrapper>
        <Row align='top' gutter={10}>
          <Row.Col column={6}>
            <Box style={{ height: 100 }}>col1</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box style={{ height: 50 }}>col2</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box style={{ height: 120 }}>col3</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box style={{ height: 60 }}>col4</Box>
          </Row.Col>
        </Row>
      </Wrapper>
      <Wrapper>
        <Row align='middle' gutter={10}>
          <Row.Col column={6}>
            <Box style={{ height: 100 }}>col1</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box style={{ height: 50 }}>col2</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box style={{ height: 120 }}>col3</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box style={{ height: 60 }}>col4</Box>
          </Row.Col>
        </Row>
      </Wrapper>
      <Wrapper>
        <Row align='bottom' gutter={10}>
          <Row.Col column={6}>
            <Box style={{ height: 100 }}>col1</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box style={{ height: 50 }}>col2</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box style={{ height: 120 }}>col3</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box style={{ height: 60 }}>col4</Box>
          </Row.Col>
        </Row>
      </Wrapper>
      <Wrapper>
        <Row gutter={10} justify='start'>
          <Row.Col column={6}>
            <Box>col1</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box>col2</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box>col3</Box>
          </Row.Col>
        </Row>
      </Wrapper>
      <Wrapper>
        <Row gutter={10} justify='center'>
          <Row.Col column={6}>
            <Box>col1</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box>col2</Box>
          </Row.Col>
          <Row.Col column={6}>
            <Box>col3</Box>
          </Row.Col>
        </Row>
      </Wrapper>
      <Wrapper>
        <Row gutter={10} justify='end'>
          <Row.Col column={6}>
            <Box>col1</Box>
          </Row.Col>
          <Row.Col column={6}>
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

export default Flex;
