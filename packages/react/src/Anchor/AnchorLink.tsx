import { useConstantFn } from '@xl-vision/hooks';
import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import {
  HTMLAttributes,
  ReactNode,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import AnchorContext from './AnchorContext';
import { styled } from '../styles';
import { RefInstance } from '../types';

export type AnchorLinkProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  title: ReactNode;
  href: string;
};

export type AnchorLinkInstance = RefInstance<HTMLDivElement>;

const displayName = 'AnchorLink';

const AnchorLinkRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})<{ active: boolean }>(() => {
  return {
    padding: '4px 0 4px 12px',
    lineHeight: 1,
  };
});

const AnchorLinkTitle = styled('a', {
  name: displayName,
  slot: 'Title',
})<{ active: boolean }>(({ theme, styleProps }) => {
  const { colors, typography, transitions } = theme;

  const { active } = styleProps;

  return {
    ...typography.subtitle2.style,
    color: active ? colors.themes.primary.foreground.active : colors.text.primary,
    textDecoration: 'none',
    display: 'block',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    transition: transitions.standard('color'),

    '&:hover': {
      color: colors.themes.primary.foreground.hover,
    },
  };
});

const AnchorLink = forwardRef<AnchorLinkInstance, AnchorLinkProps>((props, ref) => {
  const { title, href, children, ...others } = props;

  const rootRef = useRef<HTMLDivElement>(null);

  const { activeLink, registerLink, unregisterLink, scrollTo } = useContext(AnchorContext);

  useImperativeHandle(ref, () => {
    return {
      get nativeElement() {
        return rootRef.current;
      },
    };
  });

  const handleClick = useConstantFn(() => {
    scrollTo(href);
  });

  useEffect(() => {
    registerLink(href);
    return () => {
      unregisterLink(href);
    };
  }, [registerLink, unregisterLink, href]);

  const active = activeLink === href;

  return (
    <AnchorLinkRoot {...others} ref={rootRef} styleProps={{ active }}>
      <AnchorLinkTitle
        href={href}
        styleProps={{ active }}
        title={typeof title === 'string' ? title : ''}
        onClick={handleClick}
      >
        {title}
      </AnchorLinkTitle>
      {children}
    </AnchorLinkRoot>
  );
});

if (!isProduction) {
  AnchorLink.displayName = displayName;
  AnchorLink.propTypes = {
    href: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
  };
}

export default AnchorLink;
