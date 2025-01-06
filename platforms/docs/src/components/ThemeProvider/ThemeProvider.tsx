import { FC } from 'react';
import { DARK_MODE_KEY } from './constants';
import InnerThemeProvider, { InnerThemeProviderProps } from './InnerThemeProvider';
import CookieProvider from '../CookieProvider';

export type ThemeProviderProps = Omit<InnerThemeProviderProps, 'cookieValue'>;

const ThemeProvider: FC<ThemeProviderProps> = (props) => {
  return (
    <CookieProvider cookiekey={DARK_MODE_KEY}>
      <InnerThemeProvider {...props} />
    </CookieProvider>
  );
};

export default ThemeProvider;
