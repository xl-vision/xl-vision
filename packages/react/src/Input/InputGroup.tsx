import { isProduction } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { HTMLAttributes, forwardRef, useImperativeHandle, useRef } from 'react';
import { styled } from '../styles';
import { ThemeProvider, SizeVariant, useTheme } from '../ThemeProvider';
import { RefInstance } from '../types';

export type InputGroupProps = HTMLAttributes<HTMLDivElement> & {
  size?: SizeVariant;
};

export type InputGroupInstance = RefInstance<HTMLDivElement>;

const displayName = 'InputGroup';

const InputGroupRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})<{ size: SizeVariant }>(({ theme, styleProps }) => {
  const { sizes, clsPrefix } = theme;

  const { size } = styleProps;

  const themeSize = sizes[size];

  return {
    display: 'flex',
    flexDirection: 'row',

    '& > *': {
      borderRadius: 0,
      '&:not(:last-child)': {
        marginRight: -themeSize.border,
      },
      '&:first-child': {
        borderTopLeftRadius: themeSize.borderRadius,
        borderBottomLeftRadius: themeSize.borderRadius,
      },
      '&:last-child': {
        borderTopRightRadius: themeSize.borderRadius,
        borderBottomRightRadius: themeSize.borderRadius,
      },
    },
    [`.${clsPrefix}-input`]: {
      '& > *': {
        borderRadius: 0,
      },
      '&:first-child': {
        '& > *': {
          '&:first-child': {
            borderTopLeftRadius: themeSize.borderRadius,
            borderBottomLeftRadius: themeSize.borderRadius,
          },
        },
      },
      '&:last-child': {
        '& > *': {
          '&:last-child': {
            borderTopRightRadius: themeSize.borderRadius,
            borderBottomRightRadius: themeSize.borderRadius,
          },
        },
      },
    },
  };
});

const InputGroup = forwardRef<InputGroupInstance, InputGroupProps>((props, ref) => {
  const { clsPrefix, sizeVariant } = useTheme();

  const { className, size = sizeVariant, children, ...others } = props;

  const rootRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => {
    return {
      get nativeElement() {
        return rootRef.current;
      },
    };
  }, []);

  const rootClassName = `${clsPrefix}-input-group`;

  const classes = clsx(`${rootClassName}--size-${size}`, className);

  return (
    // 内部组件都需要根据size大小变化
    <ThemeProvider sizeVariant={size}>
      <InputGroupRoot {...others} className={classes} ref={rootRef} styleProps={{ size }}>
        {children}
      </InputGroupRoot>
    </ThemeProvider>
  );
});

if (!isProduction) {
  InputGroup.displayName = displayName;
  InputGroup.propTypes = {
    className: PropTypes.string,
  };
}

export default InputGroup;
