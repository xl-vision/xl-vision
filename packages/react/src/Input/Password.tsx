import { useConstantFn } from '@xl-vision/hooks';
import { EyeInvisibleOutlined, EyeOutlined } from '@xl-vision/icons';
import { isProduction } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { ReactNode, forwardRef, useState, MouseEvent } from 'react';
import Input, { InputProps } from './Input';
import { useConfig } from '../ConfigProvider';
import { styled } from '../styles';

export type PasswordProps = Omit<InputProps, 'type' | 'suffix'> & {
  renderIcon?: (visible: boolean) => ReactNode;
};

const displayName = 'Password';

const PasswordIcon = styled('span', {
  name: displayName,
  slot: 'Icon',
})(({ theme }) => {
  const { color, transition } = theme;

  return {
    display: 'inline-flex',
    lineHeight: 1,
    alignItems: 'center',
    cursor: 'pointer',
    transition: transition.standard('color'),
    color: color.text.hint,
    '&:hover': {
      color: color.text.secondary,
    },
  };
});

const defaultRenderIcon = (visible: boolean) =>
  visible ? <EyeInvisibleOutlined /> : <EyeOutlined />;

const Password = forwardRef<HTMLSpanElement, PasswordProps>((props, ref) => {
  const { clsPrefix } = useConfig();
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
