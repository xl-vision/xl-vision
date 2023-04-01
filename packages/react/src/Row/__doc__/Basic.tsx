import { Row, styled } from '@xl-vision/react';

const Wrapper = styled('div')(
  ({ theme }) => `
  padding: 0.5rem;
  background-color: ${theme.colors.background.default};
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
  background-color: ${theme.colors.themes.primary.foreground.enabled};
  border-radius: 5px;
`,
);

const Basic = () => {
  return (
    <div>
      <Wrapper>
        <Row gutter={10}>
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
      <Wrapper>
        <Row gutter={10} removeOnUnvisible={true}>
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

export default Basic;
