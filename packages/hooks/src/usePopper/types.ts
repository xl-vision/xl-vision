export type Mode = 'fixed' | 'absolute';

export type Reference = {
  getBoundingClientRect: () => Rect;
};

export type Alignment = 'start' | 'end';
export type Side = 'top' | 'right' | 'bottom' | 'left';
export type AlignedPlacement = `${Side}-${Alignment}`;

export type Placement = Side | AlignedPlacement;

export type PopperData = {
  x: number;
  y: number;
  placement: Placement;
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MiddlewareData = {
  x: number;
  y: number;
  placement: Placement;
  extra: Record<string, Record<string, any>>;
};

export type MiddlewareParameter = MiddlewareData & {
  popper: Element;
  reference: Reference;
  popperRect: Rect;
  referenceRect: Rect;
  mode: Mode;
  initialPlacement: Placement;
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
