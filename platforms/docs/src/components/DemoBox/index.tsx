'use client';

import { useConstantFn } from '@xl-vision/hooks';
import { CodeOutlined, DownOutlined } from '@xl-vision/icons';
import { styled, CollapseTransition, Button, Tooltip } from '@xl-vision/react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { ReactNode, FC, useState, useCallback } from 'react';
import useIsDebugMode from '@docs/hooks/useIsDebugMode';
import useLocale from '@docs/hooks/useLocale';
import Code from './Code';

const Wrapper = styled('div')<{ debug: boolean }>(({ theme, styleProps }) => {
  const { sizes, colors } = theme;

  const { debug } = styleProps;

  return {
    borderRadius: 4,
    overflow: 'hidden',
    border: `${sizes.middle.border}px solid ${
      debug ? colors.themes.error.foreground.default : colors.divider.primary
    }`,
    margin: `32px 0`,
  };
});

const Preview = styled('div')`
  padding: 42px 24px 50px;
`;

const InfoWrapper = styled('div')<{ debug: boolean }>(({ theme, styleProps }) => {
  const { sizes, colors } = theme;

  const { debug } = styleProps;

  return {
    position: 'relative',
    fontSize: 14,
    borderTop: `${sizes.middle.border}px solid ${
      debug ? colors.themes.error.foreground.default : colors.divider.primary
    }`,
    color: colors.text.primary,
  };
});

const TitleWrapper = styled('div')(({ theme }) => {
  return {
    position: 'absolute',
    backgroundColor: theme.colors.background.paper,
    top: -12,
    marginLeft: 16,
    padding: '0px 8px',
    ...theme.typography.subtitle2.style,
  };
});

const DescWrapper = styled('div')(() => {
  return {
    padding: '8px 70px 8px 24px',
  };
});

const CodeWrapper = styled('div')(
  ({ theme }) => `
  border-top: ${theme.sizes.middle.border}px solid ${theme.colors.divider.primary};

  &.slide-enter-active,
  &.slide-exit-active {
    transition: all 1s ease-in-out;
  }

  &.slide-enter-from,
  &.slide-exit-to {
    opacity: 0.4;
  }

  &.slide-enter-to,
  &.slide-exit {
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
    transition: theme.transitions.standard('transform'),
    transform: `rotate(${expand ? '0deg' : '-90deg'})`,
  };
});

export type DemoBoxProps = {
  children: [ReactNode, ReactNode, ReactNode];
  jsCode: string;
  // tsCode: string;
  jsCodeNode: ReactNode;
  tsCodeNode: ReactNode;
  debug?: boolean;
  id?: string;
};

const DemoBox: FC<DemoBoxProps> = ({
  id,
  jsCodeNode,
  tsCodeNode,
  children,
  jsCode,
  debug = false,
}) => {
  const [titleNode, descNode, preview] = children;

  const router = useRouter();
  const { lang } = useLocale();

  const [isExpand, setExpand] = useState(false);

  const handleCode = useConstantFn(() => {
    router.push(`/${lang}/playground?code=${encodeURIComponent(jsCode)}`);
  });

  const handleExpand = useCallback(() => {
    setExpand((prev) => !prev);
  }, []);

  const isDebugMode = useIsDebugMode();

  if (debug && !isDebugMode) {
    return null;
  }

  return (
    <Wrapper id={id} styleProps={{ debug }}>
      <Preview>{preview}</Preview>
      <InfoWrapper styleProps={{ debug }}>
        <TitleWrapper>{titleNode}</TitleWrapper>
        <DescWrapper>{descNode}</DescWrapper>
        <ButtonWrapper>
          <Tooltip content='Playground'>
            <Button
              color='primary'
              prefixIcon={<CodeOutlined />}
              round={true}
              variant='text'
              onClick={handleCode}
            />
          </Tooltip>
          <Button
            aria-label={isExpand ? 'Expand' : 'Close'}
            color='primary'
            prefixIcon={<ExpandWrapper styleProps={{ expand: isExpand }} />}
            round={true}
            variant='text'
            onClick={handleExpand}
          />
        </ButtonWrapper>
      </InfoWrapper>
      <CollapseTransition in={isExpand} transitionClassName='slide'>
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  children: PropTypes.arrayOf(PropTypes.node) as any,
};

export default DemoBox;
