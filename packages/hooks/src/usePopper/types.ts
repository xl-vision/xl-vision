export type Mode = 'fixed' | 'absolute';

export type Reference = {
  getBoundingClientRect: () => { x: number; y: number; width: number; height: number };
};

export type Alignment = 'start' | 'end';
export type Side = 'top' | 'right' | 'bottom' | 'left';
export type AlignedPlacement = `${Side}-${Alignment}`;

export type Placement = Side | AlignedPlacement;

export type PopperData = {
  x: number | undefined;
  y: number | undefined;
  mode: Mode;
  placement: Placement;
};

export type PlacementData = {
  offsetX: number | undefined;
  offsetY: number | undefined;
  popper: {
    width: number;
    height: number;
  };
  reference: {
    width: number;
    height: number;
  };
  placement: Placement;
};

export type MiddlewareData = PlacementData & {
  mode: Mode;
  initialPlacement: Placement;
} & Record<string, any>;

export type Middleware = {
  name: string;
  order: number;
  fn: (data: MiddlewareData) => MiddlewareData;
};
