import { padEnd, repeat } from './string';

export type ValueType = string | number | bigint | BigIntDecimal;

/**
 * +1.0
 * -11e-1
 * -11E+1
 * -100.1e-1
 * -0.1e-1
 */
const NUMBER_REGEX = /^[+-]?(([1-9]\d+)|\d)(\.\d+)?([Ee][+-]?\d+)?$/;

export default class BigIntDecimal {
  private origin: string;

  private nan = false;

  private integer = '';

  private multiple = 0;

  private isNegative = false;

  constructor(value: ValueType) {
    if (value instanceof BigIntDecimal) {
      this.origin = value.origin;
      this.nan = value.nan;
      this.integer = value.integer;
      this.multiple = value.multiple;
      this.isNegative = value.isNegative;
      return;
    }

    let str = String(value).trim();

    this.origin = str;

    if (!NUMBER_REGEX.test(str) || Number.isNaN(Number(str))) {
      this.nan = true;
      return;
    }

    if (str.startsWith('-')) {
      this.isNegative = true;
    }

    // 去除前面的+-号
    str = str.replace(/^[+-]/, '');

    const isE = str.includes('e');

    if (isE) {
      const [numStr, suffix] = str.split('e');
      str = handleScientificNotation(numStr, +suffix);
    }

    const [integer, decimal = ''] = str.split('.');

    // 小数后面的0都去掉
    const formatDecimal = decimal.replace(/0+$/, '');
    // 去掉整数前面的0 比如0.1
    // const formatInteger = integer.replace(/^0+/, '');

    this.multiple = formatDecimal.length;
    this.integer = integer + formatDecimal;
  }

  isNaN() {
    return this.nan;
  }

  toString() {
    if (this.nan) {
      return 'NaN';
    }

    const prefix = this.isNegative ? '-' : '';

    if (this.multiple === 0) {
      return prefix + this.integer;
    }
    const integerPart = this.integer.slice(0, -this.multiple) || '0';
    const decimalPart = this.integer.slice(-this.multiple);
    return `${prefix}${integerPart}.${decimalPart}`;
  }

  add(value: ValueType) {
    if (this.nan) {
      return new BigIntDecimal(NaN);
    }

    const v2 = toBigIntDecimal(value);

    if (v2.nan) {
      return new BigIntDecimal(NaN);
    }

    const maxMultiple = Math.max(this.multiple, v2.multiple);

    const newBigInt =
      createBigInt(this.integer, maxMultiple - this.multiple, this.isNegative) +
      createBigInt(v2.integer, maxMultiple - v2.multiple, v2.isNegative);

    return createFromBigInt(newBigInt, maxMultiple);
  }

  subtract(value: ValueType) {
    if (this.nan) {
      return new BigIntDecimal(NaN);
    }

    const v2 = toBigIntDecimal(value);

    if (v2.nan) {
      return new BigIntDecimal(NaN);
    }

    const maxMultiple = Math.max(this.multiple, v2.multiple);

    const newBigInt =
      createBigInt(this.integer, maxMultiple - this.multiple, this.isNegative) -
      createBigInt(v2.integer, maxMultiple - v2.multiple, v2.isNegative);

    return createFromBigInt(newBigInt, maxMultiple);
  }

  multiply(value: ValueType) {
    if (this.nan) {
      return new BigIntDecimal(NaN);
    }

    const v2 = toBigIntDecimal(value);

    if (v2.nan) {
      return new BigIntDecimal(NaN);
    }

    const newMultiple = this.multiple + v2.multiple;
    const newBigInt =
      createBigInt(this.integer, 0, this.isNegative) * createBigInt(v2.integer, 0, v2.isNegative);

    return createFromBigInt(newBigInt, newMultiple);
  }

  divide(value: ValueType, precision: number = 10) {
    if (precision < 0) {
      throw new Error(`precision must be >= 0, but actual ${precision}`);
    }

    if (Math.round(precision) !== precision) {
      throw new Error(`precision must be integer, but actual ${precision}`);
    }

    if (this.nan) {
      return new BigIntDecimal(NaN);
    }

    const v2 = toBigIntDecimal(value);

    if (v2.nan) {
      return new BigIntDecimal(NaN);
    }

    if (v2.integer === '0') {
      return new BigIntDecimal(NaN);
    }

    const multiplier = BigInt('1' + repeat('0', precision));
    const dividend = createBigInt(this.integer, 0, this.isNegative) * multiplier;
    const divisor = createBigInt(v2.integer, 0, v2.isNegative);

    const resultBigInt = dividend / divisor;
    const newMultiple = precision + this.multiple - v2.multiple;

    return createFromBigInt(resultBigInt, newMultiple);
  }

  ceil() {
    if (!this.multiple) {
      return new BigIntDecimal(this);
    }
    const multiplier = BigInt('1' + repeat('0', this.multiple));

    if (this.isNegative) {
      const integer = BigInt('-' + this.integer) / multiplier;

      return createFromBigInt(integer, 0);
    }

    const integer = (BigInt(this.integer) + multiplier - BigInt(1)) / multiplier;

    return createFromBigInt(integer, 0);
  }

  floor() {
    if (!this.multiple) {
      return new BigIntDecimal(this);
    }
    const multiplier = BigInt('1' + repeat('0', this.multiple));
    if (this.isNegative) {
      const integer = (BigInt('-' + this.integer) - multiplier + BigInt(1)) / multiplier;

      return createFromBigInt(integer, 0);
    }

    const integer = BigInt(this.integer) / multiplier;

    return createFromBigInt(integer, 0);
  }

  round() {
    if (!this.multiple) {
      return new BigIntDecimal(this);
    }

    const prefix = this.isNegative ? '-' : '';

    const multiplier = BigInt('1' + repeat('0', this.multiple));
    const buf = BigInt(prefix + '5' + repeat('0', this.multiple - 1));

    const integer = (BigInt(prefix + this.integer) + buf) / multiplier;

    return createFromBigInt(integer, 0);
  }

  abs() {
    const num = new BigIntDecimal(this);
    num.isNegative = false;
    return num;
  }

  greaterThan(value: ValueType) {
    const ret = this.subtract(value);

    if (ret.nan) {
      return false;
    }

    if (ret.integer === '0') {
      return false;
    }

    return !ret.isNegative;
  }

  lessThan(value: ValueType) {
    const ret = this.subtract(value);

    if (ret.nan) {
      return false;
    }

    if (ret.integer === '0') {
      return false;
    }

    return ret.isNegative;
  }

  equal(value: ValueType) {
    if (this.nan) {
      return false;
    }

    const v2 = toBigIntDecimal(value);

    if (v2.nan) {
      return false;
    }

    return (
      this.isNegative === v2.isNegative &&
      this.integer === v2.integer &&
      this.multiple == v2.multiple
    );
  }

  toFixed(precision: number): string {
    if (precision < 0) {
      throw new Error(`precision must be >= 0, but actual ${precision}`);
    }

    if (Math.round(precision) !== precision) {
      throw new Error(`precision must be integer, but actual ${precision}`);
    }

    if (this.nan) {
      return 'NaN';
    }

    const prefix = this.isNegative ? '-' : '';

    if (!this.multiple) {
      return prefix + padEnd(this.integer + '.', precision, '0');
    }

    const integerPart = this.integer.slice(0, -this.multiple) || '0';
    let decimalPart = this.integer.slice(-this.multiple);

    decimalPart = padEnd(decimalPart, precision, '0');
    decimalPart = decimalPart.slice(0, precision);

    return prefix + (precision === 0 ? integerPart : `${integerPart}.${decimalPart}`);
  }
}

const createFromBigInt = (value: bigint, multiple: number) => {
  const isNegative = value < 0;
  const str = (BigInt(isNegative ? -1 : 1) * value).toString().replace(/n$/, '');
  return new BigIntDecimal((isNegative ? '-' : '') + handleScientificNotation(str, -multiple));
};

const toBigIntDecimal = (value: ValueType) => {
  if (value instanceof BigIntDecimal) {
    return value;
  }
  return new BigIntDecimal(value);
};

const createBigInt = (integer: string, zeroNumber: number, isNegative?: boolean) => {
  return BigInt((isNegative ? '-' : '') + padEnd(integer, zeroNumber, '0'));
};

const handleScientificNotation = (numStr: string, exponent: number) => {
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

  return s;
};
