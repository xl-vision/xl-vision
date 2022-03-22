import { env } from '@xl-vision/utils';
import React from 'react';
import PropTypes from 'prop-types';
import { useConstantFn, useResizeObserver } from '@xl-vision/hooks';
import clsx from 'clsx';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';

export type AffixProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'target' | 'onChange'> & {
  target?: Window | HTMLElement | (() => Window | HTMLElement);
  offsetTop?: number;
  offsetButtom?: number;
  onChange?: (affixed: boolean) => void;
};

const displayName = 'Affix';

const AffixRoot = styled('div')(() => {
  return {};
});

const getDefaultTarget = () => {
  return window;
};

const Affix: React.FunctionComponent<AffixProps> = (props) => {
  const { clsPrefix } = useTheme();

  const {
    target = getDefaultTarget,
    onChange,
    offsetButtom,
    offsetTop,
    className,
    ...others
  } = props;

  const getTarget = useConstantFn(() => {
    if (typeof target === 'function') {
      return target();
    }
    return target;
  });

  const rootClassName = `${clsPrefix}-affix`;

  const classes = clsx(rootClassName, className);

  return <AffixRoot {...others} className={classes} />;
};

if (!env.isProduction) {
  Affix.displayName = displayName;
  Affix.propTypes = {
    target: PropTypes.func,
    onChange: PropTypes.func,
    offsetButtom: PropTypes.number,
    offsetTop: PropTypes.number,
    className: PropTypes.string,
  };
}

export default Affix;
