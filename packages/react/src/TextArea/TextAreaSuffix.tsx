import { useConstantFn, useResizeObserver, useUnmount, useForkRef } from '@xl-vision/hooks';
import React from 'react';
import clsx from 'clsx';
import { env } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { useTheme } from '../ThemeProvider';
import { raf } from '../utils/transition';

export type TextAreaSuffixProps = React.HTMLAttributes<HTMLSpanElement> & {
  value?: string;
};

const displayName = 'TextAreaSuffix';

const TextAreaSuffix: React.FunctionComponent<TextAreaSuffixProps> = (props) => {
  const { className, style, value, ...others } = props;

  const { clsPrefix } = useTheme();

  const [overflow, setOverflow] = React.useState(false);

  const ref = React.useRef<HTMLSpanElement>(null);

  const rafCancelFnRef = React.useRef<() => void>();

  const checkOverflow = useConstantFn(() => {
    rafCancelFnRef.current?.();

    rafCancelFnRef.current = raf(() => {
      const el = ref.current;
      if (!el) {
        return;
      }

      const height = el.clientHeight;

      const children = el.childNodes;
      let totalHeight = 0;

      children.forEach((child) => {
        totalHeight += (child as HTMLElement).offsetHeight;
      });

      setOverflow(height < totalHeight);
    });
  });

  const resizeRef = useResizeObserver<HTMLSpanElement>(checkOverflow);

  const forkRef = useForkRef(resizeRef, ref);

  React.useEffect(() => {
    checkOverflow();
  }, [value, checkOverflow]);

  useUnmount(() => {
    rafCancelFnRef.current?.();
  });

  const rootClassName = clsx(`${clsPrefix}-textarea__suffix`);

  const classes = clsx(
    rootClassName,
    {
      [`${rootClassName}--overflow`]: overflow,
    },
    className,
  );

  return (
    <span {...others} className={classes} style={{ height: '100%', ...style }} ref={forkRef} />
  );
};

if (env.isDevelopment) {
  TextAreaSuffix.displayName = displayName;
  TextAreaSuffix.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.string,
  };
}

export default TextAreaSuffix;
