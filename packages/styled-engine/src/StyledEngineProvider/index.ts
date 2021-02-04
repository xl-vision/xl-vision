import PropTypes from 'prop-types';

export type StyledEngineProviderProps = {
  injectFirst?: boolean;
  children: React.ReactElement;
};

const StyledEngineProvider: React.FunctionComponent<StyledEngineProviderProps> = (props) => {
  const { injectFirst, children } = props;

  if (injectFirst && typeof window !== 'undefined') {
    const { head } = document;
    if (!head.querySelector('[data-styled="active"]')) {
      const injectFirstNode = document.createElement('style');
      injectFirstNode.setAttribute('data-styled', 'active');
      head.insertBefore(injectFirstNode, head.firstChild);
    }
  }

  return children;
};

StyledEngineProvider.propTypes = {
  children: PropTypes.element.isRequired,
  injectFirst: PropTypes.bool,
};

export default StyledEngineProvider;
