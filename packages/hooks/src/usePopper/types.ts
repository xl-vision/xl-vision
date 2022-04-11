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
  mode: Mode;
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
  extra: Record<string, any>;
};

export type MiddlewareParameter = MiddlewareData & {
  popperRect: Rect;
  referenceRect: Rect;
  popper: Element;
  reference: Reference;
  mode: Mode;
  initialPlacement: Placement;
};

export type Middleware<T> = {
  name: string;
  order: number;
  options: T;
  fn: (data: MiddlewareParameter, options: T) => Partial<MiddlewareData> | void;
};
