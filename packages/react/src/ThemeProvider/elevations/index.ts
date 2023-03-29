export type ElevationVariant = 0 | 1 | 2 | 3;

export type Elevations = Record<ElevationVariant, string>;

const createElevations = (elevations: Elevations) => {
  return elevations;
};

export default createElevations;
