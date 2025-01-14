import createCache, { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import PropTypes from 'prop-types';
import { ReactNode, FC } from 'react';

export type StyledEngineProviderProps = {
  children: ReactNode;
  injectFirst?: boolean;
};

let cache: EmotionCache | undefined;

if (typeof window !== 'undefined') {
  const { head } = document;

  let insertionPoint = document.querySelector<HTMLElement>('[name="emotion-insertion-point"]');

  if (!insertionPoint) {
    insertionPoint = document.createElement('style');
    insertionPoint.setAttribute('name', 'emotion-insertion-point');
    head.insertBefore(insertionPoint, head.firstChild);
  }

  cache = createCache({
    key: 'xl',
    insertionPoint,
  });
}

const StyledEngineProvider: FC<StyledEngineProviderProps> = (props) => {
  const { injectFirst, children } = props;

  return injectFirst && cache ? (
    <CacheProvider value={cache}>{children}</CacheProvider>
  ) : (
    <>{children}</>
  );
};

if (process.env.NODE_ENV !== 'production') {
  StyledEngineProvider.displayName = 'StyledEngineProvider';
  StyledEngineProvider.propTypes = {
    children: PropTypes.element.isRequired,
    injectFirst: PropTypes.bool,
  };
}

export default StyledEngineProvider;
