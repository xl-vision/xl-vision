/* eslint-disable */
import { isProduction } from '@xl-vision/utils';
import createIcon from './utils/createIcon';

const svg = (<svg viewBox="0 0 1024 1024"><path d="m926.8 397.1-396-288a31.81 31.81 0 0 0-37.6 0l-396 288a31.99 31.99 0 0 0-11.6 35.8l151.3 466a32 32 0 0 0 30.4 22.1h489.5c13.9 0 26.1-8.9 30.4-22.1l151.3-466c4.2-13.2-.5-27.6-11.7-35.8M838.6 417l-98.5 32-200-144.7V199.9zM466 567.2l-89.1 122.3-55.2-169.2zm-116.3-96.8L484 373.3v140.8zM512 599.2l93.9 128.9H418.1zm28.1-225.9 134.2 97.1L540.1 514zM558 567.2l144.3-46.9-55.2 169.2zm-74-367.3v104.4L283.9 449l-98.5-32zM169.3 470.8l86.5 28.1 80.4 246.4-53.8 73.9zM327.1 853l50.3-69h269.3l50.3 69zm414.5-33.8-53.8-73.9 80.4-246.4 86.5-28.1z" /></svg>)

export default !isProduction ? createIcon(svg, 'RadarChartOutlined') : createIcon(svg);
