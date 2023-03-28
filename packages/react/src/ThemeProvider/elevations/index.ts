export type ElevationVariant = 'low' | 'high';

export type Elevations = Record<ElevationVariant, string>;

const createElevations = (elevations: Elevations) => {
  return elevations;
};

export default createElevations;
