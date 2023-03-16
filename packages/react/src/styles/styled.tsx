import {
  styled as innerStyled,
  CSSObject,
  ExtractProps,
  FunctionInterpolation,
  Interpolation,
  ShouldForwardProp,
} from '@xl-vision/styled-engine';
import { isProduction } from '@xl-vision/utils';
import clsx from 'clsx';
import { ComponentProps, ComponentType, forwardRef } from 'react';
import applyTheme from './applyTheme';
import { useConfig } from '../ConfigProvider';
import { Theme } from '../ThemeProvider/createTheme';
import { Style } from '../ThemeProvider/overrideStyles';

export type XlOptions = {
  name?: string;
  slot?: string;
};

const shouldForwardProp = (prop: PropertyKey) => prop !== 'theme' && prop !== 'styleProps';

const middleline = (str: string) => {
  const separator = '-';
  const split = /(?=[A-Z])/;

  return str.split(split).join(separator).toLowerCase();
};

const styled = <
  Tag extends keyof JSX.IntrinsicElements | ComponentType<ComponentProps<Tag>>,
  ForwardedProps extends keyof ExtractProps<Tag> = keyof ExtractProps<Tag>,
>(
  tag: Tag,
  options?: XlOptions,
) => {
  const { name, slot = 'Root' } = options || {};

  let displayName = '';
  let prefix = '';

  if (name) {
    displayName = name + slot;

    prefix = slot === 'Root' ? middleline(name) : `${middleline(name)}__${slot.toLowerCase()}`;
  }

  const defaultCreateStyledComponent = innerStyled<Tag, ForwardedProps>(tag, {
    shouldForwardProp: shouldForwardProp as ShouldForwardProp<ForwardedProps>,
    ...(!isProduction && { prefix: prefix || undefined }),
  });

  const overrideCreateStyledComponent = <
    S extends object | undefined = undefined,
    P extends Pick<ExtractProps<Tag>, ForwardedProps> = Pick<ExtractProps<Tag>, ForwardedProps>,
    ST = S extends undefined ? { theme: Theme } : { styleProps: S; theme: Theme },
    SPT = S extends undefined ? { theme?: Theme } : { styleProps: S; theme?: Theme },
  >(
    first: TemplateStringsArray | CSSObject | FunctionInterpolation<P & ST>,
    ...styles: Array<Interpolation<P & ST>>
  ) => {
    const applyOverrideStyle = (props: P & ST & { theme: Theme }) => {
      const { theme } = props;
      if (!name || !slot) {
        return;
      }
      const overrideStyles = theme.overrideStyles as Record<string, Record<string, Style<S, P>>>;

      const overrideStyle = overrideStyles[name];

      if (!overrideStyle) {
        return;
      }
      const overrideSlotStyle = overrideStyle[slot];

      if (!overrideSlotStyle) {
        return;
      }
      if (typeof overrideSlotStyle === 'function') {
        return (overrideSlotStyle as FunctionInterpolation<P & ST>)(props);
      }
      return overrideSlotStyle;
    };

    const newStyles = [...styles, applyOverrideStyle].map(applyTheme);

    let newFirst: any = first;

    const numOfCustomFnsApplied = newStyles.length - styles.length;

    if (Array.isArray(newFirst) && numOfCustomFnsApplied > 0) {
      const newFirstArray = newFirst as unknown as TemplateStringsArray;
      const placeholders = new Array<string>(numOfCustomFnsApplied).fill('');
      const raw = [...newFirstArray.raw, ...placeholders];
      newFirst = [...newFirstArray, ...placeholders];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      newFirst.raw = raw;
    } else if (typeof newFirst === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      newFirst = applyTheme(newFirst);
    }

    let DefaultComponent: ComponentType<P & SPT> = defaultCreateStyledComponent<P & SPT>(
      newFirst as TemplateStringsArray | CSSObject | FunctionInterpolation<P & SPT>,
      ...newStyles,
    );

    if (prefix) {
      const InnerDefaultComponent = DefaultComponent;
      // eslint-disable-next-line react/display-name
      DefaultComponent = forwardRef<unknown, any>((props, ref) => {
        const { clsPrefix } = useConfig();
        console.log(props);
        return (
          <InnerDefaultComponent
            {...props}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            className={clsx(`${clsPrefix}-${prefix}`, props.className)}
            ref={ref}
          />
        );
      });
    }

    if (!isProduction) {
      DefaultComponent.displayName = displayName;
    }

    return DefaultComponent;
  };

  return overrideCreateStyledComponent;
};

export default styled;
