/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><defs/><path d="M856 112h-80c-4.4 0-8 3.6-8 8v784c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8V120c0-4.4-3.6-8-8-8m-200 0H192c-17.7 0-32 14.9-32 33.3v733.3c0 18.4 14.3 33.3 32 33.3h464c17.7 0 32-14.9 32-33.3V145.3c0-18.4-14.3-33.3-32-33.3M392 840H232V664h160zm0-240H232V424h160zm0-240H232V184h160zm224 480H456V664h160zm0-240H456V424h160zm0-240H456V184h160z" /></svg>)

export default !isProduction ? createIcon(svg, 'InsertRowRightOutlined') : createIcon(svg);
