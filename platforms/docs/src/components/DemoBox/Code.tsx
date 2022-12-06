import { Button, styled } from '@xl-vision/react';
import { ReactNode, FC, useState } from 'react';

enum CodeType {
  TYPESCRIPT,
  JAVASCRIPT,
}

export type CodeProps = {
  children: [ReactNode, ReactNode];
};

const Wrapper = styled('div')``;

const Bar = styled('div')(
  ({ theme }) => `
  border-bottom: ${theme.styleSize.middle.border}px solid ${theme.color.divider};
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
    pre: {
      borderRadius: '0 !important',
    },
  };
});

const Code: FC<CodeProps> = (props) => {
  const { children } = props;

  const [tsx, jsx] = children;

  const [codeType, setCodeType] = useState(CodeType.TYPESCRIPT);

  return (
    <Wrapper>
      <Bar>
        <Button
          color={codeType === CodeType.TYPESCRIPT ? 'primary' : 'default'}
          size='small'
          variant='text'
          onClick={() => setCodeType(CodeType.TYPESCRIPT)}
        >
          Typescript
        </Button>
        <Button
          color={codeType === CodeType.JAVASCRIPT ? 'primary' : 'default'}
          size='small'
          variant='text'
          onClick={() => setCodeType(CodeType.JAVASCRIPT)}
        >
          Javascript
        </Button>
      </Bar>
      <Content>{codeType === CodeType.TYPESCRIPT ? tsx : jsx}</Content>
    </Wrapper>
  );
};

export default Code;
