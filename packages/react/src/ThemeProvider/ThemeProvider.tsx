import { useEnhancedMemo } from '@xl-vision/hooks';
import { ThemeContext as StyledThemeContext } from '@xl-vision/styled-engine';
import { isProduction, deepMerge } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactNode, FC, createContext, useContext, useMemo } from 'react';
import createTheme, { ThemeInput } from './createTheme';
import ThemeContext from './ThemeContext';

export type ThemeProviderProps = ThemeInput & {
  children: ReactNode;
};

const ThemeProvider: FC<ThemeProviderProps> = (props) => {
  const { children, ...others } = props;

  const parentTheme = useContext(ThemePropsContext);

  const themeConfig = useEnhancedMemo(
    () => others,
    [others],
    ([prevConfig], [currentConfig]) => {
      const prevKeys = Object.keys(prevConfig) as Array<keyof typeof prevConfig>;
      const currentKeys = Object.keys(currentConfig) as Array<keyof typeof prevConfig>;
      return (
        prevKeys.length !== currentKeys.length ||
        prevKeys.some((key) => prevConfig[key] !== currentConfig[key])
      );
    },
  );

  // 可能存在多个主题嵌套的情况，子主题应该继承父主题
  const mergedThemeProps = useMemo(() => {
    return deepMerge(parentTheme, themeConfig, { clone: true });
  }, [parentTheme, themeConfig]);

  const value = useMemo(() => {
    return createTheme(mergedThemeProps);
  }, [mergedThemeProps]);

  return (
    <ThemePropsContext.Provider value={mergedThemeProps}>
      {/* both self ThemeContext and styled-engine ThemeContext */}
      <ThemeContext.Provider value={value}>
        <StyledThemeContext.Provider value={value}>{children}</StyledThemeContext.Provider>
      </ThemeContext.Provider>
    </ThemePropsContext.Provider>
  );
};

if (!isProduction) {
  ThemeProvider.displayName = 'ThemeProvider';

  ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
}

export default ThemeProvider;

const ThemePropsContext = createContext<ThemeInput>({});
