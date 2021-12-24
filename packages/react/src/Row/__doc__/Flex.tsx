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
  display: flex;
  padding: 0.5rem;
  color: ${theme.color.themes.primary.text.primary};
  align-item: center;
  justify-content: center;
  background-color: ${theme.color.themes.primary.color};
  border-radius: 5px;
`,
);

const Flex = () => {
  return (
    <div>
      <Wrapper>
        <Row gutter={10} type='flex' align='top'>
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
        <Row gutter={10} type='flex' align='middle'>
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
        <Row gutter={10} type='flex' align='bottom'>
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
        <Row gutter={10} type='flex' justify='start'>
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
        <Row gutter={10} type='flex' justify='center'>
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
        <Row gutter={10} type='flex' justify='end'>
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
