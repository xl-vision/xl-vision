import { isProduction } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { HTMLAttributes, FC } from 'react';
import { InputRoot } from './Input';
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
})<{ size: ComponentSize }>(
  ({ theme, styleProps }) => {
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
    };
  },
  ({ theme, styleProps }) => {
    const { styleSize } = theme;

    const { size } = styleProps;

    const themeSize = styleSize[size];

    console.log('aaa', InputRoot.toString())

    return `
  ${InputRoot} {
    & > * {
      border-radius: 0;
    }
    &:first-child {
      & > * {
        &:first-child {
          border-top-left-radius: ${themeSize.borderRadius}px;
          border-bottom-left-radius: ${themeSize.borderRadius}px;
        }
      }
    }
    &:last-child {
      & > * {
        &:last-child {
          border-top-right-radius: ${themeSize.borderRadius}px;
          border-bottom-right-radius: ${themeSize.borderRadius}px;
        }
      }
    }
  }
  `;
  },
);

const InputGroup: FC<InputGroupProps> = (props) => {
  const { clsPrefix, size: configSize } = useConfig();

  const { className, size = configSize, children, ...others } = props;

  const rootClassName = `${clsPrefix}-input-group`;

  const classes = clsx(rootClassName, `${rootClassName}--size-${size}`, className);

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
