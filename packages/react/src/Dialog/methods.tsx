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

let destoryFunctions: Array<() => void> = [];

export type DialogMethodReturnType = {
  destroy: () => void;
  update: (props: Partial<DialogProps>) => void;
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

  const div = document.createElement('div');
  document.body.appendChild(div);

  let currentProps = props;

  const render = () => {
    setTimeout(() => {
      const {
        localeContext = defaultLocaleContext,
        themeContext = defaultThemeContext,
        ...others
      } = currentProps;

      ReactDOM.render(
        <LocalizationContext.Provider value={localeContext}>
          <ThemeContext.Provider value={themeContext}>
            <MethodDialog getContainer={null} {...others} />
          </ThemeContext.Provider>
        </LocalizationContext.Provider>,
        div,
      );
    });
  };

  const update = (renderProps: Partial<DialogMethodProps>) => {
    currentProps = { ...currentProps, ...renderProps };
    render();
  };

  const destroyDOM = () => {
    destoryFunctions = destoryFunctions.filter((it) => it !== destroy);
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  };

  const destroy = () => {
    if (!currentProps.visible) {
      destroyDOM();
      return;
    }
    update({
      visible: false,
      onClosed: () => {
        destroyDOM();
      },
    });
  };

  destoryFunctions.push(destroy);

  render();

  return {
    destroy,
    update,
  };
};
