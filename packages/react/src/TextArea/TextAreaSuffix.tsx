import { ResizeObserverHandler, useConstantFn, useResizeObserver } from '@xl-vision/hooks';
import React from 'react';
import clsx from 'clsx';
import { env } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { useTheme } from '../ThemeProvider';

export type TextAreaSuffixProps = React.HTMLAttributes<HTMLSpanElement>;

const displayName = 'TextAreaSuffix';

const TextAreaSuffix: React.FunctionComponent<TextAreaSuffixProps> = (props) => {
  const { className, style, ...others } = props;

  const { clsPrefix } = useTheme();

  const [overflow, setOverflow] = React.useState(false);

  const handleResizeObserver: ResizeObserverHandler<HTMLSpanElement> = useConstantFn(
    ({ height }, target) => {
      const children = target.childNodes;

      let totalHeight = 0;

      children.forEach((child) => {
        totalHeight += (child as HTMLElement).offsetHeight;
      });

      setOverflow(height < totalHeight);
    },
  );

  const ref = useResizeObserver(handleResizeObserver);

  const rootClassName = clsx(`${clsPrefix}-textarea__suffix`);

  const classes = clsx(
    rootClassName,
    {
      [`${rootClassName}--overflow`]: overflow,
    },
    className,
  );

  return <span {...others} className={classes} style={{ height: '100%', ...style }} ref={ref} />;
};

if (env.isDevelopment) {
  TextAreaSuffix.displayName = displayName;
  TextAreaSuffix.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
  };
}

export default TextAreaSuffix;
