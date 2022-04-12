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

export type MiddlewareData = PopperData & {
  extra: Record<string, Record<string, any>>;
  popperRect: Rect;
  referenceRect: Rect;
};

export type MiddlewareParameter = MiddlewareData & {
  popper: Element;
  reference: Reference;
  mode: Mode;
  initial: {
    popperRect: Rect;
    referenceRect: Rect;
    placement: Placement;
  };
};

export type MiddlewareReturn = Partial<
  PopperData & {
    data: Record<string, any>;
  }
>;

export type Middleware<T = any> = {
  name: string;
  order: number;
  options?: T;
  fn: (data: MiddlewareParameter, options?: T) => MiddlewareReturn | void;
};
