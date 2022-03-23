// idea from: https://github.com/react-component/resize-observer/blob/79e6df6e76321a9f94db6772b43f7f23f58df6ae/src/SingleObserver/DomWrapper.tsx
import { env } from '@xl-vision/utils';
import React from 'react';
import PropTypes from 'prop-types';

export interface DomWrapperProps {
  children: React.ReactElement;
}

class DomWrapper extends React.Component<DomWrapperProps> {
  render() {
    const { children } = this.props;
    return children;
  }
}

if (!env.isProduction) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  (DomWrapper as any).propTypes = {
    children: PropTypes.element.isRequired,
  };
}

export default DomWrapper;
