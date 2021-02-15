import React from 'react';
import PropTypes from 'prop-types';
import { styled, CollapseTransition } from '@xl-vision/react';
import Code from './Code';

export type DemoBoxProps = {
  children: [React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode];
};

const Wrapper = styled('div')(
  ({ theme }) => `
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid ${theme.color.divider};
  margin: 8px 0;
`,
);

const Preview = styled('div')`
  padding: 42px 24px 50px;
`;

const InfoWrapper = styled('div')(
  ({ theme }) => `
  position: relative;
  font-size: 14px;
  border-top: 1px solid ${theme.color.divider};
  color: ${theme.color.text.primary};
`,
);

const TitleWrapper = styled('div')(
  ({ theme }) => `
  position: absolute;
  background-color: ${theme.color.background};
  top: -12px;
  margin-left: 16px;
  padding: 0px 8px;
`,
);

const DescWrapper = styled('div')`
  padding: 18px 24px 12px;
`;

const CodeWrapper = styled('div')(
  ({ theme }) => `
  border-top: 1px solid ${theme.color.divider};

  &.slide-enter-active,
  &.slide-leave-active {
    transition: ${theme.animation.standard('all')};
  }

  &.slide-enter,
  &.slide-leave-to {
    opacity: 0.4;
  }

  &.slide-enter-to,
  &.slide-leave {
    opacity: 1;
  }
`,
);

const Button = styled('button')(
  ({ theme }) => `
  position: absolute;
  right: 10px;
  top: 10px;
  background: ${theme.color.background};
  border: 1px solid ${theme.color.divider};
`,
);

const DemoBox: React.FunctionComponent<DemoBoxProps> = ({ children }) => {
  const [title, desc, tsxCode, jsxCode, preview] = children;

  const [isExpand, setExpand] = React.useState(false);

  return (
    <Wrapper>
      <Preview>{preview}</Preview>
      <InfoWrapper>
        <TitleWrapper>{title}</TitleWrapper>
        <DescWrapper>{desc}</DescWrapper>
        <Button onClick={() => setExpand(!isExpand)}>{isExpand ? '隐藏' : '展开'}</Button>
      </InfoWrapper>
      <CollapseTransition in={isExpand} transitionClasses='slide'>
        <CodeWrapper>
          <Code>
            {tsxCode}
            {jsxCode}
          </Code>
        </CodeWrapper>
      </CollapseTransition>
    </Wrapper>
  );
};

DemoBox.propTypes = {
  children: PropTypes.any,
};

export default DemoBox;
