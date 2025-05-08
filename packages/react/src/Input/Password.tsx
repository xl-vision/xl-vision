import { useConstantFn } from '@xl-vision/hooks';
import { EyeInvisibleOutlined, EyeOutlined } from '@xl-vision/icons';
import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactNode, forwardRef, useState, MouseEvent } from 'react';
import Input, { InputInstance, InputProps } from './Input';
import memoStyled from '../memoStyled';

export type PasswordProps = Omit<InputProps, 'type' | 'suffix'> & {
  renderIcon?: (visible: boolean) => ReactNode;
};

export type PasswordInstance = InputInstance;

const displayName = 'Password';

const PasswordRoot = memoStyled(Input, {
  name: displayName,
  slot: 'Root',
})(() => {
  return {};
});

const PasswordIcon = memoStyled('span', {
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

const Password = forwardRef<PasswordInstance, PasswordProps>((props, ref) => {
  const { renderIcon = defaultRenderIcon, ...others } = props;

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

  return <PasswordRoot {...others} ref={ref} suffix={suffix} type={type} />;
});

if (!isProduction) {
  Password.displayName = displayName;
  Password.propTypes = {
    renderIcon: PropTypes.func,
  };
}

export default Password;
