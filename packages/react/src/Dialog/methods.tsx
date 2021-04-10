import React from 'react';
import ReactDOM from 'react-dom';
import { defaultLanguage, locales } from '../locale';
import { LocalizationContextProps } from '../LocalizationProvider';
import LocalizationContext from '../LocalizationProvider/LocalizationContext';
import { Theme } from '../ThemeProvider/createTheme';
import defaultTheme from '../ThemeProvider/defaultTheme';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { isServer } from '../utils/env';
import { voidFn } from '../utils/function';
import { DialogProps } from './Dialog';
import MethodDialog from './MethodDialog';

const destoryFunctions: Array<() => void> = [];

export type DialogMethodReturnType = {
  destroy: () => void;
  update: (props: DialogProps) => void;
};

export interface DialogMethodProps extends DialogProps {
  localeContext?: LocalizationContextProps;
  themeContext?: Theme;
}

const defaultLocaleContext: LocalizationContextProps = {
  locale: locales[defaultLanguage],
  language: defaultLanguage,
};
const defaultThemeContext = defaultTheme;

export const method = (props: DialogMethodProps): DialogMethodReturnType => {
  if (isServer) {
    return {
      destroy: voidFn,
      update: voidFn,
    };
  }

  let currentProps = props;

  const render = (renderProps: DialogMethodProps, init?: boolean) => {
    setTimeout(() => {
      const {
        localeContext = defaultLocaleContext,
        themeContext = defaultThemeContext,
        ...others
      } = renderProps;

      ReactDOM.render(
        <LocalizationContext.Provider value={localeContext}>
          <ThemeContext.Provider value={themeContext}>
            <MethodDialog getContainer={null} {...others} init={init} />
          </ThemeContext.Provider>
        </LocalizationContext.Provider>,
        div,
      );
    });
  };

  const div = document.createElement('div');
  document.body.appendChild(div);

  const destroyDOM = () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  };

  const destroy = () => {};
};
