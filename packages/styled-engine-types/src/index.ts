// eslint-disable-next-line import/no-unresolved
import CSS from 'csstype';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ComponentProps, ComponentType, JSXElementConstructor } from 'react';

export type CSSProperties = CSS.PropertiesFallback<string | number>;

export type CSSPseudos = { [K in CSS.Pseudos]?: CSSObject };

export type CSSOthersObject = {
  [K: Exclude<string, keyof CSSProperties | keyof CSSPseudos>]: CSSObject;
};

export type CSSObject = CSSProperties & CSSPseudos & CSSOthersObject;

export type CSSKeyframes = object & { [key: string]: CSSObject };

export type FalsyInterpolation = false | null | undefined;

export type Keyframes = {};

export type InterpolationPrimitive = number | string | Keyframes | CSSObject | FalsyInterpolation;

export type FunctionInterpolation<P extends object> = (props: P) => Interpolation<P>;

export type SimpleInterpolation =
  | InterpolationPrimitive
  | StyledComponentInterpolation
  | Array<SimpleInterpolation>;

export type Interpolation<P extends object> =
  | InterpolationPrimitive
  | Array<Interpolation<P>>
  | FunctionInterpolation<P>
  | StyledComponentInterpolation;

// remove the call signature from StyledComponent so Interpolation can still infer InterpolationFunction
type StyledComponentInterpolation = Pick<
  StyledComponent<any, any>,
  keyof StyledComponent<any, any>
>;

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
  <StyleProps extends object = {}>(
    first: TemplateStringsArray | CSSObject | FunctionInterpolation<ComponentProps & StyleProps>,
    ...styles: Array<Interpolation<ComponentProps & StyleProps>>
  ): StyledComponent<ComponentProps, StyleProps>;
};

export type ShouldForwardProp<ForwardedProps extends PropertyKey> = (
  propName: PropertyKey,
) => propName is ForwardedProps;

/** Same as StyledOptions but shouldForwardProp must be a type guard */
export type FilteringStyledOptions<Props, ForwardedProps extends keyof Props = keyof Props> = {
  prefix?: string;
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

export type GlobalStyleComponent<P> = ComponentType<P>;

export type CreateGlobalStyle = {
  <P extends object = {}>(
    first: TemplateStringsArray | CSSObject | FunctionInterpolation<P>,
    ...styles: Array<Interpolation<P>>
  ): GlobalStyleComponent<P>;
};

export type CreateKeyframes = (
  first: TemplateStringsArray | CSSKeyframes,
  ...interpolations: Array<SimpleInterpolation>
) => Keyframes;
