import { padEnd, repeat } from './string';

export type ValueType = string | number | bigint | BigIntDecimal;

/**
 * +1.0
 * -11e-1
 * -11E+1
 * -100.1e-1
 * -0.1e-1
 */
const NUMBER_REGEX = /^[+-]?([1-9]\d+)|\d(\.\d+)?([Ee][+-]?\d+)?$/;

export default class BigIntDecimal {
  private origin: string;

  private nan = false;

  private integer = '';

  private multiple = 0;

  constructor(value: ValueType) {
    if (value instanceof BigIntDecimal) {
      this.origin = value.origin;
      this.nan = value.nan;
      this.integer = value.integer;
      this.multiple = value.multiple;
      return;
    }

    let str = String(value).trim();

    this.origin = str;

    if (!NUMBER_REGEX.test(str) || Number.isNaN(Number(str))) {
      this.nan = true;
      return;
    }

    // 去除前面的+号
    str = str.replace(/^\+/, '');

    const isE = str.includes('e');

    if (isE) {
      const [numStr, suffix] = str.split('e');
      str = this.handleScientificNotation(numStr, +suffix);
    }

    const [integer, decimal = ''] = str.split('.');

    // 小数后面的0都去掉
    const formatDecimal = decimal.replace(/0+$/, '');

    this.multiple = formatDecimal.length;
    this.integer = integer + formatDecimal;
  }

  private handleScientificNotation(numStr: string, exponent: number): string {
    const isNegative = numStr.startsWith('-');
    if (isNegative) {
      numStr = numStr.slice(1);
    }
    const [integer, decimal = ''] = numStr.split('.');
    const fullNumber = integer + decimal;

    let len = exponent - decimal.length;

    let s = '';
    if (len >= 0) {
      s = fullNumber + repeat('0', len);
    } else {
      len = len + fullNumber.length;

      s =
        len > 0
          ? fullNumber.slice(0, len) + '.' + fullNumber.slice(len)
          : '0.' + repeat('0', -len) + fullNumber;
    }

    return isNegative ? '-' + s : s;
  }

  isNaN() {
    return this.nan;
  }

  toString() {
    if (this.nan) {
      return 'NaN';
    }
    if (this.multiple === 0) {
      return this.integer;
    }
    const integerPart = this.integer.slice(0, -this.multiple) || '0';
    const decimalPart = this.integer.slice(-this.multiple);
    return `${integerPart}.${decimalPart}`;
  }

  add(value: ValueType) {
    const v2 = toBigIntDecimal(value);

    if (this.nan || v2.nan) {
      return new BigIntDecimal(NaN);
    }

    const maxMultiple = Math.max(this.multiple, v2.multiple);

    const newBigInt =
      BigInt(padEnd(this.integer, maxMultiple - this.multiple, '0')) +
      BigInt(padEnd(v2.integer, maxMultiple - v2.multiple, '0'));

    return this.createFromBigInt(newBigInt, maxMultiple);
  }

  subtract(value: ValueType) {
    const v2 = toBigIntDecimal(value);

    if (this.nan || v2.nan) {
      return new BigIntDecimal(NaN);
    }

    const maxMultiple = Math.max(this.multiple, v2.multiple);

    const newBigInt =
      BigInt(padEnd(this.integer, maxMultiple - this.multiple, '0')) -
      BigInt(padEnd(v2.integer, maxMultiple - v2.multiple, '0'));

    return this.createFromBigInt(newBigInt, maxMultiple);
  }

  multiply(value: ValueType) {
    const v2 = toBigIntDecimal(value);

    if (this.nan || v2.nan) {
      return new BigIntDecimal(NaN);
    }

    const newMultiple = this.multiple + v2.multiple;
    const newBigInt = BigInt(this.integer) * BigInt(v2.integer);

    return this.createFromBigInt(newBigInt, newMultiple);
  }

  divide(value: ValueType, precision: number = 10) {
    const v2 = toBigIntDecimal(value);

    if (this.nan || v2.nan || v2.integer === '0') {
      return new BigIntDecimal(NaN);
    }

    const multiplier = BigInt('1' + repeat('0', precision));
    const dividend = BigInt(this.integer) * multiplier;
    const divisor = BigInt(v2.integer);

    const resultBigInt = dividend / divisor;
    const newMultiple = precision + this.multiple - v2.multiple;

    return this.createFromBigInt(resultBigInt, newMultiple);
  }

  toFixed(precision: number): string {
    if (this.nan) {
      return 'NaN';
    }

    const integerPart = this.integer.slice(0, -this.multiple) || '0';
    let decimalPart = this.integer.slice(-this.multiple);

    decimalPart = padEnd(decimalPart, precision, '0');
    decimalPart = decimalPart.slice(0, precision);

    return precision === 0 ? integerPart : `${integerPart}.${decimalPart}`;
  }

  private createFromBigInt(value: bigint, multiple: number): BigIntDecimal {
    const str = value.toString();
    return new BigIntDecimal(this.handleScientificNotation(str, -multiple));
  }
}

const toBigIntDecimal = (value: ValueType) => {
  if (value instanceof BigIntDecimal) {
    return value;
  }
  return new BigIntDecimal(value);
};
