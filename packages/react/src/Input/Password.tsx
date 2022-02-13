import { EyeInvisibleOutlined, EyeOutlined } from '@xl-vision/icons';
import { env } from '@xl-vision/utils';
import { useConstantFn } from '@xl-vision/hooks';
import PropTypes from 'prop-types';
import React from 'react';
import Input, { InputProps } from './Input';
import { styled } from '../styles';

export type PasswordProps = Omit<InputProps, 'type' | 'suffix'> & {
  renderIcon?: (visible: boolean) => React.ReactNode;
};

const displayName = 'Password';

const PasswordIcon = styled('span', {
  name: displayName,
  slot: 'PasswordIcon',
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

const Password = React.forwardRef<HTMLSpanElement, PasswordProps>((props, ref) => {
  const { renderIcon = defaultRenderIcon, ...others } = props;

  const [visible, setVisible] = React.useState(false);

  const type = visible ? 'text' : 'password';

  const handleClick = useConstantFn(() => {
    setVisible((prev) => !prev);
  });

  const handlePrevent = useConstantFn((e: React.MouseEvent) => {
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

  return <Input {...others} type={type} ref={ref} suffix={suffix} />;
});

if (env.isDevelopment) {
  Password.displayName = displayName;
  Password.propTypes = {
    renderIcon: PropTypes.func,
  };
}

export default Password;
