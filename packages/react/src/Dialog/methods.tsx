import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@xl-vision/icons';
import React from 'react';
import ReactDOM from 'react-dom';
import Icon from '../Icon';
import { defaultLanguage, locales } from '../locale';
import { LocalizationContextProps } from '../LocalizationProvider';
import LocalizationContext from '../LocalizationProvider/LocalizationContext';
import { Theme } from '../ThemeProvider/createTheme';
import defaultTheme from '../ThemeProvider/defaultTheme';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { isServer } from '../utils/env';
import { voidFn } from '../utils/function';
import MethodDialog, { MethodDialogProps } from './MethodDialog';

let destoryFunctions: Array<() => void> = [];

export interface DialogMethodProps extends MethodDialogProps {
  localeContext?: LocalizationContextProps;
  themeContext?: Theme;
}

export type DialogMethodReturnType = {
  destroy: () => void;
  update: (props: Partial<DialogMethodProps>) => void;
};

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

export const destroyAll = () => {
  let fn = destoryFunctions.pop();

  while (fn) {
    fn();
    fn = destoryFunctions.pop();
  }
};

export const info = (props: DialogMethodProps) => {
  const {
    themeContext = defaultThemeContext,
    localeContext = defaultLocaleContext,
    onClosed,
    ...others
  } = props;

  const onClosedWrapper = () => {
    onClosed?.();
    ret.destroy();
  };

  const ret = method({
    icon: (
      <Icon style={{ color: themeContext.color.themes.info.color }}>
        <InfoCircleOutlined />
      </Icon>
    ),
    confirmText: localeContext.locale.MethodDialog.infoText,
    prompt: true,
    localeContext,
    themeContext,
    defaultVisible: true,
    onClosed: onClosedWrapper,
    ...others,
  });

  return ret;
};

export const success = (props: DialogMethodProps) => {
  const {
    themeContext = defaultThemeContext,
    localeContext = defaultLocaleContext,
    onClosed,
    ...others
  } = props;

  const onClosedWrapper = () => {
    onClosed?.();
    ret.destroy();
  };

  const ret = method({
    icon: (
      <Icon style={{ color: themeContext.color.themes.primary.color }}>
        <CheckCircleOutlined />
      </Icon>
    ),
    confirmText: localeContext.locale.MethodDialog.successText,
    prompt: true,
    localeContext,
    themeContext,
    defaultVisible: true,
    onClosed: onClosedWrapper,
    ...others,
  });

  return ret;
};

export const error = (props: DialogMethodProps) => {
  const {
    themeContext = defaultThemeContext,
    localeContext = defaultLocaleContext,
    onClosed,
    ...others
  } = props;

  const onClosedWrapper = () => {
    onClosed?.();
    ret.destroy();
  };

  const ret = method({
    icon: (
      <Icon style={{ color: themeContext.color.themes.error.color }}>
        <CloseCircleOutlined />
      </Icon>
    ),
    confirmText: localeContext.locale.MethodDialog.errorText,
    prompt: true,
    localeContext,
    themeContext,
    defaultVisible: true,
    onClosed: onClosedWrapper,
    ...others,
  });
  return ret;
};

export const warning = (props: DialogMethodProps) => {
  const {
    themeContext = defaultThemeContext,
    localeContext = defaultLocaleContext,
    onClosed,
    ...others
  } = props;

  const onClosedWrapper = () => {
    onClosed?.();
    ret.destroy();
  };

  const ret = method({
    icon: (
      <Icon style={{ color: themeContext.color.themes.warning.color }}>
        <ExclamationCircleOutlined />
      </Icon>
    ),
    confirmText: localeContext.locale.MethodDialog.warningText,
    prompt: true,
    localeContext,
    themeContext,
    defaultVisible: true,
    onClosed: onClosedWrapper,
    ...others,
  });
  return ret;
};

export const confirm = (props: DialogMethodProps) => {
  const {
    themeContext = defaultThemeContext,
    localeContext = defaultLocaleContext,
    onClosed,
    ...others
  } = props;

  const onClosedWrapper = () => {
    onClosed?.();
    ret.destroy();
  };

  const ret = method({
    icon: (
      <Icon style={{ color: themeContext.color.themes.primary.color }}>
        <ExclamationCircleOutlined />
      </Icon>
    ),
    confirmText: localeContext.locale.MethodDialog.confirm.confirmText,
    cancelText: localeContext.locale.MethodDialog.confirm.cancelText,
    localeContext,
    themeContext,
    defaultVisible: true,
    onClosed: onClosedWrapper,
    ...others,
  });
  return ret;
};
