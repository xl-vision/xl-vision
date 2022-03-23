import { useConstantFn, useUnmount } from '@xl-vision/hooks';
import React from 'react';
import clsx from 'clsx';
import { env } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { useTheme } from '../ThemeProvider';
import { raf } from '../utils/transition';
import ResizeObserver from '../ResizeObserver';

export type TextAreaSuffixProps = React.HTMLAttributes<HTMLSpanElement> & {
  value?: string;
};

const displayName = 'TextAreaSuffix';

const TextAreaSuffix: React.FunctionComponent<TextAreaSuffixProps> = (props) => {
  const { className, value, style, ...others } = props;

  const { clsPrefix } = useTheme();

  const [overflow, setOverflow] = React.useState(false);

  const ref = React.useRef<HTMLSpanElement>(null);

  const rafCancelFnRef = React.useRef<() => void>();

  const handleOverflow = useConstantFn(() => {
    rafCancelFnRef.current?.();

    rafCancelFnRef.current = raf(() => {
      const el = ref.current;
      if (!el) {
        return;
      }

      const height = el.clientHeight;

      const computedStyle = window.getComputedStyle(el);

      const paddingTop = parseFloat(computedStyle.paddingTop);
      const paddingBottom = parseFloat(computedStyle.paddingBottom);

      const children = el.childNodes;
      let totalHeight = 0;

      children.forEach((child) => {
        totalHeight += (child as HTMLElement).clientHeight;
      });

      setOverflow(height < totalHeight + paddingTop + paddingBottom);
    });
  });

  React.useEffect(() => {
    handleOverflow();
  }, [value, handleOverflow]);

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
    <ResizeObserver onResizeObserver={handleOverflow}>
      <span {...others} className={classes} style={{ height: '100%', ...style }} ref={ref} />
    </ResizeObserver>
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
