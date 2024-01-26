/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="M928 160H96c-17.7 0-32 14.3-32 32v160h896V192c0-17.7-14.3-32-32-32M64 832c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V440H64zm579-184c0-4.4 3.6-8 8-8h165c4.4 0 8 3.6 8 8v72c0 4.4-3.6 8-8 8H651c-4.4 0-8-3.6-8-8z" /></svg>)

export default !isProduction ? createIcon(svg, 'CreditCardFilled') : createIcon(svg);
