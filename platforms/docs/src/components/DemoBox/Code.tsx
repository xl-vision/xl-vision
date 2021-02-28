import { Button, styled } from '@xl-vision/react';
import PropTypes from 'prop-types';
import React from 'react';

enum CodeType {
  TYPESCRIPT,
  JAVASCRIPT,
}

export type CodeProps = {
  children: [React.ReactNode, React.ReactNode];
};

const Wrapper = styled('div')``;

const Bar = styled('div')(
  ({ theme }) => `
  border-bottom: 1px solid ${theme.color.divider};
  text-align: center;
  font-size: 14px;
  color: ${theme.color.themes.primary.color};
  padding: 10px 0;
`,
);

const Content = styled('div')(() => {
  return {
    maxHeight: '700px',
    overflow: 'auto',
  };
});

const Code: React.FunctionComponent<CodeProps> = (props) => {
  const { children } = props;

  const [tsx, jsx] = children;

  const [codeType, setCodeType] = React.useState(CodeType.TYPESCRIPT);

  return (
    <Wrapper>
      <Bar>
        <Button
          variant='text'
          size='small'
          theme={codeType === CodeType.TYPESCRIPT ? 'primary' : 'default'}
          onClick={() => setCodeType(CodeType.TYPESCRIPT)}
        >
          Typescript
        </Button>
        <Button
          variant='text'
          size='small'
          theme={codeType === CodeType.JAVASCRIPT ? 'primary' : 'default'}
          onClick={() => setCodeType(CodeType.JAVASCRIPT)}
        >
          Javascript
        </Button>
      </Bar>
      <Content>{codeType === CodeType.TYPESCRIPT ? tsx : jsx}</Content>
    </Wrapper>
  );
};

Code.propTypes = {
  children: PropTypes.any,
};

export default Code;
