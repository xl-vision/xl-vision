import { useConstantFn } from '@xl-vision/hooks';
import { EyeInvisibleOutlined, EyeOutlined } from '@xl-vision/icons';
import { isProduction } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { ReactNode, forwardRef, useState, MouseEvent } from 'react';
import Input, { InputProps } from './Input';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';

export type PasswordProps = Omit<InputProps, 'type' | 'suffix'> & {
  renderIcon?: (visible: boolean) => ReactNode;
};

const displayName = 'Password';

const PasswordIcon = styled('span', {
  name: displayName,
  slot: 'Icon',
})(({ theme }) => {
  const { colors, transitions } = theme;

  return {
    display: 'inline-flex',
    lineHeight: 1,
    alignItems: 'center',
    cursor: 'pointer',
    transition: transitions.standard('color'),
    color: colors.text.hint,
    '&:hover': {
      color: colors.text.secondary,
    },
  };
});

const defaultRenderIcon = (visible: boolean) =>
  visible ? <EyeInvisibleOutlined /> : <EyeOutlined />;

const Password = forwardRef<HTMLSpanElement, PasswordProps>((props, ref) => {
  const { clsPrefix } = useTheme();
  const { renderIcon = defaultRenderIcon, className, ...others } = props;

  const [visible, setVisible] = useState(false);

  const type = visible ? 'text' : 'password';

  const handleClick = useConstantFn(() => {
    setVisible((prev) => !prev);
  });

  const handlePrevent = useConstantFn((e: MouseEvent) => {
    e.preventDefault();
  });

  const suffix = (
    <PasswordIcon
      role='button'
      tabIndex={-1}
      onClick={handleClick}
      onMouseDown={handlePrevent}
      onMouseUp={handlePrevent}
    >
      {renderIcon(visible)}
    </PasswordIcon>
  );

  const rootClassName = `${clsPrefix}-password`;

  return (
    <Input
      {...others}
      className={clsx(rootClassName, className)}
      ref={ref}
      suffix={suffix}
      type={type}
    />
  );
});

if (!isProduction) {
  Password.displayName = displayName;
  Password.propTypes = {
    renderIcon: PropTypes.func,
  };
}

export default Password;
