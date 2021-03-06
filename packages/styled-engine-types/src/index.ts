import CSS from 'csstype';
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';

export type CSSProperties = CSS.Properties<string | number>;

export type CSSPseudos = { [K in CSS.Pseudos]?: CSSObject };

export type CSSObject = CSSProperties &
  CSSPseudos & {
    [key: string]: CSSObject | string | number | undefined;
  };

export type CSSKeyframes = object & { [key: string]: CSSObject };

export type InterpolationPrimitive =
  | null
  | undefined
  | boolean
  | number
  | string
  | Keyframes
  | CSSObject;

export type Keyframes = {};

export type FunctionInterpolation<P> = (props: P) => Interpolation<P>;

export type SimpleInterpolation =
  | InterpolationPrimitive
  | StyledComponentInterpolation
  | Array<SimpleInterpolation>;

export type Interpolation<P> =
  | InterpolationPrimitive
  | Array<Interpolation<P>>
  | FunctionInterpolation<P>
  | StyledComponentInterpolation;

type StyledComponentInterpolation = Pick<
  StyledComponent<any, any>,
  keyof StyledComponent<any, any>
>;

export type PropsOf<
  C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>;

export type ExtractProps<
  Tag extends keyof JSX.IntrinsicElements | React.ComponentType<any>
> = Tag extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[Tag] : PropsOf<Tag>;

export type StyledComponent<InnerProps, StyleProps> = React.ComponentType<
  InnerProps &
    StyleProps & {
      as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
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
    Tag extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
    ForwardedProps extends keyof ExtractProps<Tag> = keyof ExtractProps<Tag>
  >(
    tag: Tag,
    options?: FilteringStyledOptions<PropsOf<Tag>, ForwardedProps>,
  ): CreateStyledComponent<Pick<ExtractProps<Tag>, ForwardedProps>>;
};

export type GlobalStyleComponent<P> = React.ComponentType<P>;

export type CreateGlobalStyle = {
  <P extends object = {}>(
    first: TemplateStringsArray | CSSObject | FunctionInterpolation<P>,
    ...styles: Array<Interpolation<P>>
  ): GlobalStyleComponent<P>;
};

export type CreateKeyframes = (
  strings: TemplateStringsArray | CSSKeyframes,
  ...interpolations: Array<SimpleInterpolation>
) => Keyframes;
