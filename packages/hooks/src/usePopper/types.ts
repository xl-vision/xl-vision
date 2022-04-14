export type Mode = 'fixed' | 'absolute';

export type VirtualElement = {
  getBoundingClientRect: () => Rect;
  elementContext?: Element;
};

export type Alignment = 'start' | 'end';
export type Side = 'top' | 'right' | 'bottom' | 'left';
export type AlignedPlacement = `${Side}-${Alignment}`;

export type Placement = Side | AlignedPlacement;

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MiddlewareExtra = {
  [key: string]: any;
  autoPlacement?: {
    sides: Array<Side>;
    index: number;
  };
};

export type MiddlewareData = {
  x: number;
  y: number;
  side: Side;
  alignment?: Alignment;
  extra: MiddlewareExtra;
};

export type PopperData = {
  x: number;
  y: number;
  placement: Placement;
  extra: MiddlewareExtra;
};

export type MiddlewareParameter = MiddlewareData & {
  popper: Element;
  reference: Element | VirtualElement;
  popperRect: Rect;
  referenceRect: Rect;
  mode: Mode;
  initialSide: Side;
  initialAlignment?: Alignment;
};

export type MiddlewareReturn = Partial<
  MiddlewareData & {
    reset: boolean;
    data: Record<string, any>;
  }
>;

export type Middleware = {
  name: string;
  fn: (data: MiddlewareParameter) => MiddlewareReturn | void;
};

export type Boundary = 'clippingAncestors' | Element | Array<Element>;
export type RootBoundary = 'viewport' | 'document';
export type Padding =
  | number
  | Partial<{ top: number; right: number; left: number; bottom: number }>;

export type OverflowOptions = Partial<{
  boundary: Boundary;
  rootBoundary: RootBoundary;
  padding: Padding;
}>;
