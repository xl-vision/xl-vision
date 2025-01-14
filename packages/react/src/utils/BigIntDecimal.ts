import { padEnd, repeat } from '@xl-vision/utils';

export type ValueType = string | number | bigint | BigIntDecimal;

export default class BigIntDecimal {
  private origin: string;

  private _isNaN = false;

  private _integer = '';

  private _multiple = 0;

  constructor(value: ValueType) {
    if (value instanceof BigIntDecimal) {
      this.origin = value.origin;
      this._isNaN = value._isNaN;
      this._integer = value._integer;
      this._multiple = value._multiple;
      return;
    }

    let str = String(value).trim();

    this.origin = str;

    if (!str || Number.isNaN(+str)) {
      this._isNaN = true;
      return;
    }

    const isE = str.includes('e');

    if (isE) {
      const [numStr, suffix] = str.split('e');
      str = this.handleScientificNotation(numStr, +suffix);
    }

    const [integer, decimal = ''] = this.origin.split('.');

    this._multiple = decimal.length;
    this._integer = integer + decimal;
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
    return this._isNaN;
  }

  toString() {
    if (this._isNaN) {
      return 'NaN';
    }
    if (this._multiple === 0) {
      return this._integer;
    }
    const integerPart = this._integer.slice(0, -this._multiple) || '0';
    const decimalPart = this._integer.slice(-this._multiple);
    return `${integerPart}.${decimalPart}`;
  }

  add(value: ValueType) {
    const v2 = toBigIntDecimal(value);

    if (this.isNaN() || v2.isNaN()) {
      return new BigIntDecimal(NaN);
    }

    const maxMultiple = Math.max(this._multiple, v2._multiple);

    const newBigInt =
      BigInt(padEnd(this._integer, maxMultiple - this._multiple, '0')) +
      BigInt(padEnd(v2._integer, maxMultiple - v2._multiple, '0'));

    return this.createFromBigInt(newBigInt, maxMultiple);
  }

  subtract(value: ValueType) {
    const v2 = toBigIntDecimal(value);

    if (this.isNaN() || v2.isNaN()) {
      return new BigIntDecimal(NaN);
    }

    const maxMultiple = Math.max(this._multiple, v2._multiple);

    const newBigInt =
      BigInt(padEnd(this._integer, maxMultiple - this._multiple, '0')) -
      BigInt(padEnd(v2._integer, maxMultiple - v2._multiple, '0'));

    return this.createFromBigInt(newBigInt, maxMultiple);
  }

  multiply(value: ValueType) {
    const v2 = toBigIntDecimal(value);

    if (this.isNaN() || v2.isNaN()) {
      return new BigIntDecimal(NaN);
    }

    const newMultiple = this._multiple + v2._multiple;
    const newBigInt = BigInt(this._integer) * BigInt(v2._integer);

    return this.createFromBigInt(newBigInt, newMultiple);
  }

  divide(value: ValueType, precision: number = 10) {
    const v2 = toBigIntDecimal(value);

    if (this.isNaN() || v2.isNaN() || v2._integer === '0') {
      return new BigIntDecimal(NaN);
    }

    const multiplier = BigInt('1' + repeat('0', precision));
    const dividend = BigInt(this._integer) * multiplier;
    const divisor = BigInt(v2._integer);

    const resultBigInt = dividend / divisor;
    const newMultiple = precision + this._multiple - v2._multiple;

    return this.createFromBigInt(resultBigInt, newMultiple);
  }

  toFixed(precision: number): string {
    if (this.isNaN()) {
      return 'NaN';
    }

    const integerPart = this._integer.slice(0, -this._multiple) || '0';
    let decimalPart = this._integer.slice(-this._multiple);

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
