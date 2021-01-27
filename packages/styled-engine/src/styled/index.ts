import scStyled from 'styled-components';

export type Tag = keyof JSX.IntrinsicElements | React.ComponentType<any>

export type Options = {

}

export default function styled(tag: Tag, options: Options) {
  if (options) {
    return scStyled(tag).withConfig({
      // displayName: options.label,
      // shouldForwardProp: options.shouldForwardProp,
    });
  }

  return scStyled(tag);
}