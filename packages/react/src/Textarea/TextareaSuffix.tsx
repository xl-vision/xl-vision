import { useConstantFn } from '@xl-vision/hooks';
import { getComputedStyle, isProduction, raf } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { HTMLAttributes, FC, useState, useRef, useEffect } from 'react';
import { useConfig } from '../ConfigProvider';
import ResizeObserver from '../ResizeObserver';

export type TextareaSuffixProps = HTMLAttributes<HTMLSpanElement> & {
  value?: string;
};

const displayName = 'TextareaSuffix';

const TextareaSuffix: FC<TextareaSuffixProps> = (props) => {
  const { className, value, style, ...others } = props;

  const { clsPrefix } = useConfig();

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

  useEffect(() => {
    return () => {
      rafCancelFnRef.current?.();
    };
  }, []);

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
      <span {...others} className={classes} ref={ref} style={{ height: '100%', ...style }} />
    </ResizeObserver>
  );
};

if (!isProduction) {
  TextareaSuffix.displayName = displayName;
  TextareaSuffix.propTypes = {
    className: PropTypes.string,
    style: PropTypes.shape({}),
    value: PropTypes.string,
  };
}

export default TextareaSuffix;
