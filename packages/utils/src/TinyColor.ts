import { isObject } from './is';

export type RGBColor = {
  b: number;
  g: number;
  r: number;
  a?: number;
};

export type HSLColor = {
  h: number;
  l: number;
  s: number;
  a?: number;
};

export type HSVColor = {
  h: number;
  s: number;
  v: number;
  a?: number;
};

export type Color = RGBColor | HSLColor | HSVColor;

export default class TinyColor {
  private color: Color;

  private rbgColor: RGBColor;

  static mix(
    color1: string | Color | TinyColor,
    color2: string | Color | TinyColor,
    amount: number,
  ) {
    amount = Math.min(1, Math.max(0, amount));
    const rgb1 = new TinyColor(color1).toRgb();
    const rgb2 = new TinyColor(color2).toRgb();

    const alpha1 = rgb1.a ?? 1;
    const alpha2 = rgb2.a ?? 1;

    const rgba: RGBColor = {
      r: (rgb2.r - rgb1.r) * amount + rgb1.r,
      g: (rgb2.g - rgb1.g) * amount + rgb1.g,
      b: (rgb2.b - rgb1.b) * amount + rgb1.b,
      a: (alpha2 - alpha1) * amount + alpha1,
    };

    return new TinyColor(rgba);
  }

  static getContrastRatio(
    foreground: string | Color | TinyColor,
    background: string | Color | TinyColor,
  ) {
    const lumA = new TinyColor(foreground).getLuminance();
    const lumB = new TinyColor(background).getLuminance();
    return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
  }

  constructor(color: string | Color | TinyColor) {
    if (color instanceof TinyColor) {
      this.color = { ...color.color };
      this.rbgColor = { ...color.rbgColor };
      return;
    }

    this.color = toColor(color);
    this.rbgColor = toRgbColor(this.color);
  }

  toRgb() {
    return this.rbgColor;
  }

  toRgbString() {
    const { r, g, b, a = 1 } = this.toRgb();

    const useAlpha = a < 1;

    return `rgb${useAlpha ? 'a' : ''}(${r},${g},${b}${useAlpha ? `,${a}` : ''})`;
  }

  toHexString(allowShort?: boolean) {
    const { r, g, b, a = 1 } = this.toRgb();

    const useAlpha = a < 1;

    const hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b).toString(16)),
      pad2(Math.round(a * 255).toString(16)),
    ];

    if (
      allowShort &&
      hex[0][0] === hex[0][1] &&
      hex[1][0] === hex[1][1] &&
      hex[2][0] === hex[2][1] &&
      hex[3][0] === hex[3][1]
    ) {
      return useAlpha
        ? `#${hex[0][0]}${hex[1][0]}${hex[2][0]}${hex[3][0]}`
        : `#${hex[0][0]}${hex[1][0]}${hex[2][0]}`;
    }

    return useAlpha ? `#${hex[0]}${hex[1]}${hex[2]}${hex[3]}` : `#${hex[0]}${hex[1]}${hex[2]}`;
  }

  toHsv() {
    return rgb2Hsv(this.toRgb());
  }

  toHsl() {
    return rgb2Hsl(this.toRgb());
  }

  lighten(amount = 10) {
    const hsl = this.toHsl();
    hsl.l += amount;
    hsl.l = Math.min(Math.max(hsl.l, 0), 100);

    return new TinyColor(hsl);
  }

  darken(amount = 10) {
    const hsl = this.toHsl();
    hsl.l -= amount;
    hsl.l = Math.min(Math.max(hsl.l, 0), 100);

    return new TinyColor(hsl);
  }

  setAlpha(value: number) {
    return new TinyColor({ ...this.rbgColor, a: value });
  }

  getLuminance() {
    let { r, g, b } = this.toRgb();

    r = rgbNormalize(r);
    g = rgbNormalize(g);
    b = rgbNormalize(b);

    // Truncate at 3 digits
    return Number((0.2126 * r + 0.7152 * g + 0.0722 * b).toFixed(3));
  }

  getBrightness() {
    const { r, g, b } = this.toRgb();
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  getAlpha() {
    return this.color.a ?? 1;
  }

  isDark() {
    return this.getBrightness() < 128;
  }

  isLight() {
    return !this.isDark();
  }
}

const pad2 = (v: string) => {
  return v.length === 1 ? `0${v}` : v;
};

const rgbNormalize = (val: number) => {
  val /= 255;
  return val <= 0.039_28 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4;
};

const toColor: (color: string | Color) => Color = (color) => {
  if (isObject(color)) {
    if ('r' in color) {
      const rgb: RGBColor = {
        r: Math.round(color.r),
        g: Math.round(color.g),
        b: Math.round(color.b),
      };

      if (color.a !== undefined) {
        rgb.a = color.a;
      }
      return rgb;
    }

    if ('l' in color) {
      const hsl: HSLColor = {
        h: Math.round(color.h),
        s: color.s,
        l: color.l,
      };
      if (color.a !== undefined) {
        hsl.a = color.a;
      }
      return hsl;
    }

    const hsv: HSVColor = {
      h: Math.round(color.h),
      s: color.s,
      v: color.v,
    };
    if (color.a !== undefined) {
      hsv.a = color.a;
    }
    return hsv;
  }

  const parsedColor = color.trim();
  if (parsedColor.startsWith('#')) {
    return hexToColor(parsedColor);
  }
  if (parsedColor.startsWith('rgb')) {
    return rgbToColor(parsedColor);
  }
  if (parsedColor.startsWith('hsl')) {
    return hslToColor(parsedColor);
  }

  if (parsedColor.startsWith('hsv')) {
    return hsvToColor(parsedColor);
  }

  throw new Error(`The color '${color}' is not supported.`);
};

const hexToColor: (color: string) => Color = (color) => {
  const parsedColor = color.slice(1);

  const re = new RegExp(`.{1,${parsedColor.length >= 6 ? 2 : 1}}`, 'g');
  let colors: Array<string> | RegExpMatchArray | null = parsedColor.match(re);

  if (!colors || colors.length < 3) {
    throw new Error(`The color '${color}' is illegal hex color`);
  }

  if (colors[0].length === 1) {
    colors = colors.map((n) => n + n);
  }

  const rgbColor: RGBColor = {
    r: Number.parseInt(colors[0], 16),
    g: Number.parseInt(colors[1], 16),
    b: Number.parseInt(colors[2], 16),
  };

  if (colors.length > 3) {
    rgbColor.a = Number.parseInt(colors[3], 16) / 255;
  }
  return rgbColor;
};

const rgbToColor: (color: string) => Color = (color) => {
  const matcher = color.indexOf('(');
  if (matcher === -1) {
    throw new Error(`The color '${color}' is illegal rgb color`);
  }

  const values = color.slice(matcher + 1).split(',');

  if (values.length < 3) {
    throw new Error(`The color '${color}' is illegal rgb color`);
  }

  const rgbColor: RGBColor = {
    r: Number.parseInt(values[0], 10),
    g: Number.parseInt(values[1], 10),
    b: Number.parseInt(values[2], 10),
  };

  if (values.length > 3) {
    rgbColor.a = Number.parseFloat(values[3]);
  }
  return rgbColor;
};

const hslToColor: (color: string) => Color = (color) => {
  const matcher = color.indexOf('(');
  if (matcher === -1) {
    throw new Error(`The color '${color}' is illegal hsl color`);
  }

  const values = color.slice(matcher + 1).split(',');

  if (values.length < 3) {
    throw new Error(`The color '${color}' is illegal hsl color`);
  }

  const hslColor: HSLColor = {
    h: Number.parseInt(values[0], 10),
    s: Number.parseFloat(values[1]),
    l: Number.parseFloat(values[2]),
  };

  if (values.length > 3) {
    hslColor.a = Number.parseFloat(values[3]);
  }
  return hslColor;
};

const hsvToColor: (color: string) => Color = (color) => {
  const matcher = color.indexOf('(');
  if (matcher === -1) {
    throw new Error(`The color '${color}' is illegal hsv color`);
  }

  const values = color.slice(matcher + 1).split(',');

  if (values.length < 3) {
    throw new Error(`The color '${color}' is illegal hsv color`);
  }

  const hsvColor: HSVColor = {
    h: Number.parseInt(values[0], 10),
    s: Number.parseFloat(values[1]),
    v: Number.parseFloat(values[2]),
  };

  if (values.length > 3) {
    hsvColor.a = Number.parseFloat(values[3]);
  }
  return hsvColor;
};

const toRgbColor: (color: string | Color) => RGBColor = (color) => {
  const obj = toColor(color);
  if ('r' in obj) {
    return obj;
  }
  if ('l' in obj) {
    return hsl2Rgb(obj);
  }
  return hsv2Rgb(obj);
};

const hue2Rgb = (p: number, q: number, t: number) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

const hsl2Rgb: (color: HSLColor) => RGBColor = (color) => {
  let { h, s, l } = color;
  h /= 360;
  s /= 100;
  l /= 100;
  let r = 0;
  let g = 0;
  let b = 0;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2Rgb(p, q, h + 1 / 3);
    g = hue2Rgb(p, q, h);
    b = hue2Rgb(p, q, h - 1 / 3);
  }

  const rgbColor: RGBColor = {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };

  if (color.a !== undefined) {
    rgbColor.a = color.a;
  }

  return rgbColor;
};

const hsv2Rgb: (color: HSVColor) => RGBColor = (color) => {
  let { h, s, v } = color;

  h = (h / 360) * 6;
  s /= 100;
  v /= 100;

  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const mod = i % 6;
  const r = [v, q, p, p, t, v][mod];
  const g = [t, v, v, q, p, p][mod];
  const b = [p, p, t, v, v, q][mod];
  const rgbColor: RGBColor = {
    r: r * 255,
    g: g * 255,
    b: b * 255,
  };

  if (color.a !== undefined) {
    rgbColor.a = color.a;
  }

  return rgbColor;
};

const rgb2Hsl: (color: RGBColor) => HSLColor = (color) => {
  let { r, g, b } = color;

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  const l = (max + min) / 2;

  let h: number;
  let s: number;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: {
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      }
      case g: {
        h = (b - r) / d + 2;
        break;
      }
      default: {
        h = (r - g) / d + 4;
        break;
      }
    }
    h /= 6;
  }

  const hslColor: HSLColor = {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };

  if (color.a !== undefined) {
    hslColor.a = color.a;
  }

  return hslColor;
};

const rgb2Hsv: (color: RGBColor) => HSVColor = (color) => {
  let { r, g, b } = color;

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: {
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      }
      case g: {
        h = (b - r) / d + 2;
        break;
      }
      default: {
        h = (r - g) / d + 4;
        break;
      }
    }
    h /= 6;
  }

  const hsvColor: HSVColor = {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };

  if (color.a !== undefined) {
    hsvColor.a = color.a;
  }

  return hsvColor;
};
