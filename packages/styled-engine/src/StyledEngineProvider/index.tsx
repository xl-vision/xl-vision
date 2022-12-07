import PropTypes from 'prop-types';
import { ReactNode, FC } from 'react';

export type StyledEngineProviderProps = {
  children: ReactNode;
  injectFirst?: boolean;
};

const StyledEngineProvider: FC<StyledEngineProviderProps> = (props) => {
  const { injectFirst, children } = props;

  if (injectFirst && typeof window !== 'undefined') {
    const { head } = document;
    if (!head.querySelector('[data-styled="active"]')) {
      const injectFirstNode = document.createElement('style');
      injectFirstNode.setAttribute('data-styled', 'active');
      head.insertBefore(injectFirstNode, head.firstChild);
    }
  }

  return <>{children}</>;
};

if (process.env.NODE_ENV !== 'production') {
  StyledEngineProvider.displayName = 'StyledEngineProvider';
  StyledEngineProvider.propTypes = {
    children: PropTypes.element.isRequired,
    injectFirst: PropTypes.bool,
  };
}

export default StyledEngineProvider;
