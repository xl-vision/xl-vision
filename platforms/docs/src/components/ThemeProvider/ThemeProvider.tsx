import { FC, } from 'react';
import InnerThemeProvider, { KEY, InnerThemeProviderProps } from './InnerThemeProvider';
import CookieProvider from '../CookieProvider';

export type ThemeProviderProps = Omit<InnerThemeProviderProps, 'value'>

const ThemeProvider: FC<ThemeProviderProps> = (props) => {

  const { children } = props;

  return (
    <CookieProvider cookieKey={KEY}>
      {({ cookieValue }) =>
        <InnerThemeProvider {...props} cookieValue={cookieValue}>{children}</InnerThemeProvider>
      }
    </CookieProvider>
  );
};

export default ThemeProvider;
