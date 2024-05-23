import { version } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const isReact19 = +version.split('.')[0] >= 19;
