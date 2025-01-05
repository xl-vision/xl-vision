import CSS from 'csstype';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ComponentProps, ComponentType, ExoticComponent, JSX, JSXElementConstructor } from 'react';

export type CSSProperties = CSS.PropertiesFallback<string | number>;

export type CSSPseudos = { [K in CSS.Pseudos]?: CSSObject };

export type CSSOthersObject = {
  [K in string]: SimpleInterpolation;
};

export type CSSObject = CSSProperties & CSSPseudos & CSSOthersObject;

export type CSSKeyframes = object & { [key: string]: CSSObject };

export type FalsyInterpolation = false | null | undefined;

export type Keyframes = {};

export type InterpolationPrimitive =
  | number
  | string
  | Keyframes
  | CSSObject
  | FalsyInterpolation
  | StyledComponentInterpolation;

export type ArrayCSSInterpolation = Array<SimpleInterpolation>;

export type SimpleInterpolation = InterpolationPrimitive | ArrayCSSInterpolation;

export type FunctionInterpolation<P extends object> = (props: P) => Interpolation<P>;

export type ArrayInterpolation<P extends object> = Array<Interpolation<P>>;

export type Interpolation<P extends object> =
  | InterpolationPrimitive
  | ArrayInterpolation<P>
  | FunctionInterpolation<P>;

// remove the call signature from StyledComponent so Interpolation can still infer InterpolationFunction
type StyledComponentInterpolation = Pick<
  StyledComponent<any, any>,
  keyof StyledComponent<any, any>
>;

export type Theme = {};

export type PropsOf<C extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  JSX.LibraryManagedAttributes<C, ComponentProps<C>>;

export type ExtractProps<Tag extends keyof JSX.IntrinsicElements | ComponentType<any>> =
  Tag extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[Tag] : PropsOf<Tag>;

export type StyledComponent<InnerProps extends object, StyleProps extends object> = ComponentType<
  InnerProps &
    StyleProps & {
      as?: keyof JSX.IntrinsicElements | ComponentType<InnerProps>;
    }
>;

export type CreateStyledComponent<ComponentProps extends object> = {
  <
    StyleProps extends {
      theme?: Theme;
    } = {
      theme?: Theme;
    },
  >(
    first: TemplateStringsArray | CSSObject | FunctionInterpolation<ComponentProps & StyleProps>,
    ...styles: Array<Interpolation<ComponentProps & StyleProps>>
  ): StyledComponent<ComponentProps, StyleProps>;
};

export type ShouldForwardProp<ForwardedProps extends PropertyKey> = (
  propName: PropertyKey,
) => propName is ForwardedProps;

/** Same as StyledOptions but shouldForwardProp must be a type guard */
export type FilteringStyledOptions<Props, ForwardedProps extends keyof Props = keyof Props> = {
  label?: string;
  shouldForwardProp?: ShouldForwardProp<ForwardedProps>;
  target?: string;
};

export type Styled = {
  <
    Tag extends keyof JSX.IntrinsicElements | ComponentType<any>,
    ForwardedProps extends keyof ExtractProps<Tag> = keyof ExtractProps<Tag>,
  >(
    tag: Tag,
    options?: FilteringStyledOptions<PropsOf<Tag>, ForwardedProps>,
  ): CreateStyledComponent<Pick<ExtractProps<Tag>, ForwardedProps>>;
};

export type GlobalStyleComponent<P> =
  | ComponentType<P & { theme?: Theme }>
  | ExoticComponent<P & { theme?: Theme }>;

export type CreateGlobalStyle = {
  <P extends object = {}>(
    first: TemplateStringsArray | CSSObject | FunctionInterpolation<P>,
    ...styles: Array<Interpolation<P>>
  ): GlobalStyleComponent<P>;
};

export type CreateKeyframes = (
  first: TemplateStringsArray | CSSKeyframes,
  // keyframes not support to pass props
  ...interpolations: Array<SimpleInterpolation>
) => Keyframes;
