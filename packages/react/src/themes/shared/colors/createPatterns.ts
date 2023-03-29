import TinyColor, { HSVColor } from '@xl-vision/utils/TinyColor';

const hueStep = 2; // 色相阶梯
const saturationStep = 16; // 饱和度阶梯，浅色部分
const saturationStep2 = 5; // 饱和度阶梯，深色部分
const brightnessStep1 = 5; // 亮度阶梯，浅色部分
const brightnessStep2 = 15; // 亮度阶梯，深色部分
const lightColorCount = 5; // 浅色数量，主色上
const darkColorCount = 4; // 深色数量，主色下
// 暗色主题颜色映射关系表
const darkColorMap = [
  { index: 7, opacity: 0.15 },
  { index: 6, opacity: 0.25 },
  { index: 5, opacity: 0.3 },
  { index: 5, opacity: 0.45 },
  { index: 5, opacity: 0.65 },
  { index: 5, opacity: 0.85 },
  { index: 4, opacity: 0.9 },
  { index: 3, opacity: 0.95 },
  { index: 2, opacity: 0.97 },
  { index: 1, opacity: 0.98 },
];

function getHue(hsv: HSVColor, i: number, light?: boolean): number {
  let hue: number;
  // 根据色相不同，色相转向不同
  if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
    hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i;
  } else {
    hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i;
  }
  if (hue < 0) {
    hue += 360;
  } else if (hue >= 360) {
    hue -= 360;
  }
  return hue;
}

function getSaturation(hsv: HSVColor, i: number, light?: boolean): number {
  // grey color don't change saturation
  if (hsv.h === 0 && hsv.s === 0) {
    return hsv.s;
  }
  let saturation: number;
  if (light) {
    saturation = hsv.s - saturationStep * i;
  } else if (i === darkColorCount) {
    saturation = hsv.s + saturationStep;
  } else {
    saturation = hsv.s + saturationStep2 * i;
  }
  // 边界值修正
  if (saturation > 100) {
    saturation = 100;
  }
  // 第一格的 s 限制在 0.06-0.1 之间
  if (light && i === lightColorCount && saturation > 10) {
    saturation = 10;
  }
  if (saturation < 6) {
    saturation = 6;
  }
  return saturation;
}

function getValue(hsv: HSVColor, i: number, light?: boolean): number {
  let value: number;
  if (light) {
    value = hsv.v + brightnessStep1 * i;
  } else {
    value = hsv.v - brightnessStep2 * i;
  }
  if (value > 100) {
    value = 100;
  } else if (value < 0) {
    value = 0;
  }
  return value;
}

export type Opts = {
  theme?: 'dark' | 'default';
  backgroundColor?: string;
};

const createPatterns = (color: string, opts: Opts = {}) => {
  const patterns: Array<string> = [];
  const pColor = new TinyColor(color);
  const hsv = pColor.toHsv();

  for (let i = lightColorCount; i > 0; i -= 1) {
    const colorString = new TinyColor({
      h: getHue(hsv, i, true),
      s: getSaturation(hsv, i, true),
      v: getValue(hsv, i, true),
    }).toHexString(true);

    patterns.push(colorString);
  }
  patterns.push(pColor.toHexString(true));

  for (let i = 1; i <= darkColorCount; i += 1) {
    const colorString: string = new TinyColor({
      h: getHue(hsv, i),
      s: getSaturation(hsv, i),
      v: getValue(hsv, i),
    }).toHexString(true);

    patterns.push(colorString);
  }

  // dark theme patterns
  if (opts.theme === 'dark') {
    return darkColorMap.map(({ index, opacity }) => {
      const darkColorString: string = TinyColor.mix(
        new TinyColor(opts.backgroundColor || '#141414'),
        patterns[index],
        opacity,
      ).toHexString(true);

      return darkColorString;
    });
  }
  return patterns;
};

export default createPatterns;
