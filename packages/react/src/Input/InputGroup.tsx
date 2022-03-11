import { env } from '@xl-vision/utils';
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ComponentSize, useTheme, ThemeContext } from '../ThemeProvider';
import { styled } from '../styles';

export type InputGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: ComponentSize;
};

const displayName = 'InputGroup';

const InputGroupRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})<{ size: ComponentSize }>(({ theme, styleProps }) => {
  const { clsPrefix, styleSize } = theme;

  const { size } = styleProps;

  const themeSize = styleSize[size];

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

const InputGroup: React.FunctionComponent<InputGroupProps> = (props) => {
  const theme = useTheme();

  const { clsPrefix, componentSize } = theme;

  const { className, size = componentSize, children, ...others } = props;

  const rootClassName = `${clsPrefix}-input-group`;

  const classes = clsx(rootClassName, `${rootClassName}--size-${size}`, className);

  const newTheme = React.useMemo(() => {
    return {
      ...theme,
      componentSize: size,
    };
  }, [theme, size]);

  return (
    // 内部组件都需要根据size大小变化
    <ThemeContext.Provider value={newTheme}>
      <InputGroupRoot {...others} styleProps={{ size }} className={classes}>
        {children}
      </InputGroupRoot>
    </ThemeContext.Provider>
  );
};

if (env.isDevelopment) {
  InputGroup.displayName = displayName;
  InputGroup.propTypes = {
    className: PropTypes.string,
  };
}

export default InputGroup;
