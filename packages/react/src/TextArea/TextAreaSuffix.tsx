import { useConstantFn, useUnmount } from '@xl-vision/hooks';
import clsx from 'clsx';
import { getComputedStyle, isProduction, raf } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { HTMLAttributes, FC, useState, useRef, useEffect } from 'react';
import { useTheme } from '../ThemeProvider';
import ResizeObserver from '../ResizeObserver';

export type TextAreaSuffixProps = HTMLAttributes<HTMLSpanElement> & {
  value?: string;
};

const displayName = 'TextAreaSuffix';

const TextAreaSuffix: FC<TextAreaSuffixProps> = (props) => {
  const { className, value, style, ...others } = props;

  const { clsPrefix } = useTheme();

  const [overflow, setOverflow] = useState(false);

  const ref = useRef<HTMLSpanElement>(null);

  const rafCancelFnRef = useRef<() => void>();

  const handleOverflow = useConstantFn(() => {
    rafCancelFnRef.current?.();

    rafCancelFnRef.current = raf(() => {
      const el = ref.current;
      if (!el) {
        return;
      }

      const height = el.clientHeight;

      const computedStyle = getComputedStyle(el);

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

  useEffect(() => {
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

if (!isProduction) {
  TextAreaSuffix.displayName = displayName;
  TextAreaSuffix.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.string,
  };
}

export default TextAreaSuffix;
