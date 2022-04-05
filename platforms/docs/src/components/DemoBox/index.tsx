import React from 'react';
import PropTypes from 'prop-types';
import { styled, CollapseTransition, Button, Tooltip } from '@xl-vision/react';
import { CodeOutlined, DownOutlined } from '@xl-vision/icons';
import { useRouter } from 'next/router';
import { useConstantFn } from '@xl-vision/hooks';
import Code from './Code';
import useIsDebugMode from '../../hooks/useIsDebugMode';

export type DemoBoxProps = {
  children: [React.ReactNode, React.ReactNode, React.ReactNode];
  jsCode: string;
  tsCode: string;
  tsCodeNode: React.ReactNode;
  jsCodeNode: React.ReactNode;
  debug?: boolean;
  id?: string;
};

const Wrapper = styled('div')<{ debug: boolean }>(({ theme, styleProps }) => {
  const { styleSize, color } = theme;

  const { debug } = styleProps;

  return {
    borderRadius: 4,
    overflow: 'hidden',
    border: `${styleSize.middle.border}px solid ${
      debug ? color.themes.error.color : color.divider
    }`,
    margin: `32px 0`,
  };
});

const Preview = styled('div')`
  padding: 42px 24px 50px;
`;

const InfoWrapper = styled('div')<{ debug: boolean }>(({ theme, styleProps }) => {
  const { styleSize, color } = theme;

  const { debug } = styleProps;

  return {
    position: 'relative',
    fontSize: 14,
    borderTop: `${styleSize.middle.border}px solid ${
      debug ? color.themes.error.color : color.divider
    }`,
    color: color.text.primary,
  };
});

const TitleWrapper = styled('div')(({ theme }) => {
  return {
    position: 'absolute',
    backgroundColor: theme.color.background.paper,
    top: -12,
    marginLeft: 16,
    padding: '0px 8px',
    ...theme.typography.subtitle2.style,
  };
});

const DescWrapper = styled('div')(() => {
  return {
    padding: '8px 40px 8px 24px',
  };
});

const CodeWrapper = styled('div')(
  ({ theme }) => `
  border-top: ${theme.styleSize.middle.border}px solid ${theme.color.divider};

  &.slide-enter-active,
  &.slide-leave-active {
    transition: ${theme.transition.standard('all')};
  }

  &.slide-enter-from,
  &.slide-leave-to {
    opacity: 0.4;
  }

  &.slide-enter-to,
  &.slide-leave-from {
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

const ExpandWrapper = styled(DownOutlined)<{ expand: boolean }>(({ theme, styleProps }) => {
  const { expand } = styleProps;
  return {
    transition: theme.transition.standard('transform'),
    transform: `rotate(${expand ? '0deg' : '-90deg'})`,
  };
});

const DemoBox: React.FunctionComponent<DemoBoxProps> = ({
  id,
  jsCodeNode,
  tsCodeNode,
  children,
  jsCode,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tsCode: _,
  debug = false,
}) => {
  const [titleNode, descNode, preview] = children;

  const router = useRouter();

  const [isExpand, setExpand] = React.useState(false);

  const handleCode = useConstantFn(() => {
    router
      .push({
        pathname: '/playground',
        query: {
          code: Buffer.from(jsCode).toString('base64'),
        },
      })
      .catch(console.error);
  });

  const handleExpand = React.useCallback(() => {
    setExpand((prev) => !prev);
  }, []);

  const isDebugMode = useIsDebugMode();

  if (debug && !isDebugMode) {
    return null;
  }

  return (
    <Wrapper styleProps={{ debug }} id={id}>
      <Preview>{preview}</Preview>
      <InfoWrapper styleProps={{ debug }}>
        <TitleWrapper>{titleNode}</TitleWrapper>
        <DescWrapper>{descNode}</DescWrapper>
        <ButtonWrapper>
          <Tooltip content='Playground'>
            <Button
              color='primary'
              round={true}
              variant='text'
              prefixIcon={<CodeOutlined />}
              onClick={handleCode}
            />
          </Tooltip>
          <Button
            aria-label={isExpand ? 'Expand' : 'Close'}
            color='primary'
            round={true}
            variant='text'
            onClick={handleExpand}
            prefixIcon={<ExpandWrapper styleProps={{ expand: isExpand }} />}
          />
        </ButtonWrapper>
      </InfoWrapper>
      <CollapseTransition in={isExpand} transitionClasses='slide'>
        <CodeWrapper>
          <Code>
            {tsCodeNode}
            {jsCodeNode}
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
