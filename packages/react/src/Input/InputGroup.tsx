import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { HTMLAttributes, forwardRef, useImperativeHandle, useRef } from 'react';
import memoStyled from '../memoStyled';
import { ThemeProvider, SizeVariant, useTheme } from '../ThemeProvider';
import { RefInstance } from '../types';

export type InputGroupProps = HTMLAttributes<HTMLDivElement> & {
  size?: SizeVariant;
};

export type InputGroupInstance = RefInstance<HTMLDivElement>;

const displayName = 'InputGroup';

const InputGroupRoot = memoStyled('div', {
  name: displayName,
  slot: 'Root',
})<{ size: SizeVariant }>(({ theme }) => {
  const { sizes, clsPrefix } = theme;

  return {
    display: 'flex',
    flexDirection: 'row',
    [`& > *, & > .${clsPrefix}-button`]: {
      borderRadius: 0,
    },
    [`.${clsPrefix}-input`]: {
      '& > *': {
        borderRadius: 0,
      },
    },
    variants: Object.keys(sizes).map((k) => {
      const sizeKey = k as SizeVariant;
      const themeSize = sizes[sizeKey];

      return {
        props: {
          size: sizeKey,
        },
        style: {
          '& > *': {
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
        },
      };
    }),
  };
});

const InputGroup = forwardRef<InputGroupInstance, InputGroupProps>((props, ref) => {
  const { sizeVariant } = useTheme();

  const { size = sizeVariant, children, ...others } = props;

  const rootRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => {
    return {
      get nativeElement() {
        return rootRef.current;
      },
    };
  }, []);

  return (
    // 内部组件都需要根据size大小变化
    <ThemeProvider sizeVariant={size}>
      <InputGroupRoot {...others} ref={rootRef} styleProps={{ size }}>
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
