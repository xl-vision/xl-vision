export type PopperMode = 'fixed' | 'absolute';

export type VirtualElement = {
  getBoundingClientRect: () => ReferenceRect;
  elementContext?: Element;
};

export type Reference = Element | VirtualElement;

export type Alignment = 'start' | 'end';
export type Side = 'top' | 'right' | 'bottom' | 'left';
export type AlignedPlacement = `${Side}-${Alignment}`;

export type Placement = Side | AlignedPlacement;

export type ReferenceRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PopperRect = {
  width: number;
  height: number;
};

export type OverflowRect = {
  left: number;
  top: number;
  bottom: number;
  right: number;
};

export type MiddlewareExtra = {
  [key: string]: any;
  autoPlacement?: {
    sides: Array<Side>;
    index: number;
  };
  hide?: {
    referenceHidden: boolean;
  };
  arrow?: {
    x?: number;
    y?: number;
  };
};

export type PopperData = {
  x: number;
  y: number;
  placement: Placement;
  extra: MiddlewareExtra;
};

export type MiddlewareData = Omit<PopperData, 'placement'> & {
  side: Side;
  alignment?: Alignment;
};

export type MiddlewareContext = MiddlewareData & {
  popper: Element;
  reference: Reference;
  popperRect: PopperRect;
  referenceRect: ReferenceRect;
  mode: PopperMode;
  initialSide: Side;
  initialAlignment?: Alignment;
};

export type MiddlewareReturn = Partial<
  Omit<MiddlewareData, 'extra'> & {
    data: any;
    reset: boolean;
  }
>;

export type Middleware = {
  name: string;
  fn: (ctx: MiddlewareContext) => MiddlewareReturn | void;
};

export type Boundary = 'clippingAncestors' | Element | Array<Element>;
export type RootBoundary = 'viewport' | 'document';
export type Padding =
  | number
  | Partial<{ top: number; right: number; left: number; bottom: number }>;

export type OverflowOptions = Partial<{
  boundary: Boundary;
  rootBoundary: RootBoundary;
  padding: Padding | ((data: { side: Side; alignment?: Alignment }) => Padding);
}>;
