import React from 'react';
import PropTypes from 'prop-types';
import { styled, CollapseTransition, Button, Icon } from '@xl-vision/react';
import Expand from '@xl-vision/icons/ExpandMoreFilled';
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
  background-color: ${theme.color.background.paper};
  top: -12px;
  margin-left: 16px;
  padding: 0px 8px;
`,
);

const DescWrapper = styled('div')(() => {
  return {
    padding: '8px 40px 8px 24px',
  };
});

const CodeWrapper = styled('div')(
  ({ theme }) => `
  border-top: 1px solid ${theme.color.divider};

  &.slide-enter-active,
  &.slide-leave-active {
    transition: ${theme.transition.standard('all')};
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

const ButtonWrapper = styled('div')(() => {
  return {
    position: 'absolute',
    right: 5,
    top: 10,
  };
});

const ExpandWrapper = styled(Expand)<{ expand: boolean }>(({ theme, styleProps }) => {
  const { expand } = styleProps;
  return {
    transition: theme.transition.standard('transform'),
    transform: `rotate(${expand ? '0deg' : '-90deg'})`,
  };
});

const DemoBox: React.FunctionComponent<DemoBoxProps> = ({ children }) => {
  const [title, desc, tsxCode, jsxCode, preview] = children;

  const [isExpand, setExpand] = React.useState(false);

  const handleExpand = React.useCallback(() => {
    setExpand((prev) => !prev);
  }, []);

  return (
    <Wrapper>
      <Preview>{preview}</Preview>
      <InfoWrapper>
        <TitleWrapper>{title}</TitleWrapper>
        <DescWrapper>{desc}</DescWrapper>
        <ButtonWrapper>
          <Button
            theme='primary'
            round={true}
            size='large'
            variant='text'
            onClick={handleExpand}
            prefixIcon={
              <Icon>
                <ExpandWrapper styleProps={{ expand: isExpand }} />
              </Icon>
            }
          />
        </ButtonWrapper>
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
