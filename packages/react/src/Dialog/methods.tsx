import ReactDOM from 'react-dom';
import React from 'react';
import { ThemeContext as StyledThemeContext } from '@xl-vision/styled-engine';
import { isServer } from '../utils/env';
import createMessageDialog, { MessageDialogType, MessageDialogProps } from './message';
import { voidFn } from '../utils/function';
import warningLog from '../utils/warning';
import { Theme, ThemeContext } from '../ThemeProvider';
import { LocalizationContext, LocalizationContextProps } from '../LocalizationProvider';
import defaultTheme from '../ThemeProvider/defaultTheme';
import { locales, defaultLanguage } from '../locale';

export interface MethodDialogFunctionRenderProps extends MessageDialogProps, MessageDialogProps {
  themeContext?: Theme;
  localizationContext?: LocalizationContextProps;
}
export interface MethodDialogFunctionProps
  extends Omit<MethodDialogFunctionRenderProps, 'visible' | 'defaultVisible'> {}

export type MessageDialogFunctionUpdate = (
  props:
    | Partial<MethodDialogFunctionProps>
    | ((prev: MethodDialogFunctionProps) => Partial<MethodDialogFunctionProps>),
) => void;

export type MessageDialogFunctionReturnType = {
  destroy: () => void;
  update: MessageDialogFunctionUpdate;
};

const defaultThemeContext: Theme = defaultTheme;

const defaultLocalizationContext: LocalizationContextProps = {
  locale: locales[defaultLanguage],
  language: defaultLanguage,
};

const destroyFunctions: Array<() => void> = [];

const method = (
  props: MethodDialogFunctionProps,
  type?: MessageDialogType,
): MessageDialogFunctionReturnType => {
  if (isServer) {
    return {
      destroy: voidFn,
      update: voidFn,
    };
  }

  const Dialog = createMessageDialog(type);

  const div = document.createElement('div');
  document.body.appendChild(div);

  let currentProps: MethodDialogFunctionRenderProps = {
    ...props,
    visible: false,
    defaultVisible: true,
    onAfterClosed: () => {
      props.onAfterClosed?.();
      destroyDOM();
    },
  };

  let destroyState = false;

  const render = (renderProps: MethodDialogFunctionRenderProps) => {
    const { localizationContext, themeContext, ...others } = renderProps;

    setTimeout(() => {
      ReactDOM.render(
        <LocalizationContext.Provider value={localizationContext || defaultLocalizationContext}>
          <ThemeContext.Provider value={themeContext || defaultThemeContext}>
            <StyledThemeContext.Provider value={themeContext || defaultThemeContext}>
              <Dialog getContainer={null} {...others} />
            </StyledThemeContext.Provider>
          </ThemeContext.Provider>
        </LocalizationContext.Provider>,
        div,
      );
    });
  };

  const update: MessageDialogFunctionUpdate = (updateProps) => {
    const newProps = typeof updateProps === 'function' ? updateProps(currentProps) : updateProps;

    currentProps = {
      ...currentProps,
      ...newProps,
    };

    const { onAfterClosed: afterClose } = currentProps;

    currentProps.onAfterClosed = () => {
      afterClose?.();
      destroyDOM();
    };

    render(currentProps);
  };

  const destroyDOM = () => {
    if (destroyState) {
      return warningLog(
        true,
        `The dialog instance was destroyed, please do not update or destroy it again.`,
      );
    }
    destroyState = true;
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
    const i = destroyFunctions.indexOf(destroy);
    if (i > -1) {
      destroyFunctions.splice(i, 1);
    }
  };

  const destroy = () => {
    const { onAfterClosed: afterClose } = currentProps;
    render({
      ...currentProps,
      visible: false,
      onAfterClosed: () => {
        destroyState = true;
        afterClose?.();
        destroyDOM();
      },
    });
  };

  destroyFunctions.push(destroy);

  render(currentProps);

  return {
    destroy,
    update,
  };
};

export const open = (props: MethodDialogFunctionProps) => method(props);
export const info = (props: MethodDialogFunctionProps) => method(props, 'info');
export const success = (props: MethodDialogFunctionProps) => method(props, 'success');
export const warning = (props: MethodDialogFunctionProps) => method(props, 'warning');
export const error = (props: MethodDialogFunctionProps) => method(props, 'error');
export const confirm = (props: MethodDialogFunctionProps) => method(props, 'confirm');
