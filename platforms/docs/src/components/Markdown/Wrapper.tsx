import PropTypes from 'prop-types';
import React from 'react';

export type WrapperProps = {
  children: React.ReactNode;
  name: string;
  className?: string;
};

const Wrapper: React.FunctionComponent<WrapperProps> = (props) => {
  const { children, name, ...others } = props;

  React.useEffect(() => {
    const { title } = document;
    document.title = `${name} | xl-vision`;

    return () => {
      document.title = title;
    };
  }, [name]);

  return <main {...others}>{children}</main>;
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
};

export default Wrapper;
