import { isProduction } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { HTMLAttributes, FC } from 'react';
import ConfigProvider, { useConfig } from '../ConfigProvider';
import { styled } from '../styles';
import { ComponentSize } from '../ThemeProvider';

export type InputGroupProps = HTMLAttributes<HTMLDivElement> & {
  size?: ComponentSize;
};

const displayName = 'InputGroup';

const InputGroupRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})<{ size: ComponentSize }>(({ theme, styleProps, clsPrefix }) => {
  const { styleSize } = theme;

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

const InputGroup: FC<InputGroupProps> = (props) => {
  const { clsPrefix, size: configSize } = useConfig();

  const { className, size = configSize, children, ...others } = props;

  const rootClassName = `${clsPrefix}-input-group`;

  const classes = clsx(`${rootClassName}--size-${size}`, className);

  return (
    // 内部组件都需要根据size大小变化
    <ConfigProvider size={size}>
      <InputGroupRoot {...others} className={classes} styleProps={{ size }}>
        {children}
      </InputGroupRoot>
    </ConfigProvider>
  );
};

if (!isProduction) {
  InputGroup.displayName = displayName;
  InputGroup.propTypes = {
    className: PropTypes.string,
  };
}

export default InputGroup;
