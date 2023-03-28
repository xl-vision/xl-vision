export type SizeVariant = 'small' | 'middle' | 'large';

export type Size = {
  borderRadius: number;
  border: number;
  padding: { x: number; y: number };
  fontSize: number;
};

export type Sizes = Record<SizeVariant, Size>;

const createSizes = (sizes: Sizes) => {
  return sizes;
};

export default createSizes;
