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

const ResponsiveOffset = () => {
  return (
    <div>
      <Wrapper>
        <Row gutter={10}>
          <Row.Col column={6}>
            <Box>col1</Box>
          </Row.Col>
          <Row.Col
            column={6}
            offset={{
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 5,
              xxl: 6,
            }}
          >
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
          <Row.Col column={6}>
            <Box>col2</Box>
          </Row.Col>
          <Row.Col
            column={6}
            push={{
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 5,
              xxl: 6,
            }}
          >
            <Box>col3</Box>
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
          <Row.Col
            column={6}
            offset={6}
            pull={{
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 5,
              xxl: 6,
            }}
          >
            <Box>col3</Box>
          </Row.Col>
        </Row>
      </Wrapper>
    </div>
  );
};

export default ResponsiveOffset;
