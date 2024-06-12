import { padEnd } from '@xl-vision/utils';

export type ValueType = string | number | bigint | BigIntDecimal;

export default class BigIntDecimal {
  private origin: string;

  private _isNaN = false;

  private _interger = '';

  private _multiple = 0;

  constructor(value: ValueType) {
    this.origin = String(value).trim();

    if (!this.origin) {
      this._isNaN = true;
      return;
    }

    if (Number.isNaN(this.origin)) {
      this._isNaN = true;
      return;
    }

    const isE = this.origin.indexOf('e') > -1;

    let str = this.origin;

    if (isE) {
      str = BigInt(this.origin).toString();
    }

    const [interger, decimal = ''] = str.split('.');

    this._multiple = decimal.length;
    this._interger = interger + decimal;
  }

  isNaN() {
    return this._isNaN;
  }

  toString() {
    if (this._isNaN) {
      return 'NaN';
    }
    return this.origin;
  }

  add(value: ValueType) {
    const v2 = toBigIntDecimal(value);

    if (this.isNaN() || v2.isNaN()) {
      return new BigIntDecimal(NaN);
    }

    const maxMultiple = Math.max(this._multiple, v2._multiple);

    const newBigInt =
      BigInt(padEnd(this._interger, maxMultiple - this._multiple, '0')) +
      BigInt(padEnd(v2._interger, maxMultiple - v2._multiple, '0'));

    const newStr = newBigInt.toString();

    const newValue = `${newStr.slice(0, -maxMultiple)}.${newStr.slice(-maxMultiple)}`;

    return new BigIntDecimal(newValue);
  }

  toFixed(number: string) {
    return ''
  }
}

const toBigIntDecimal = (value: ValueType) => {
  if (value instanceof BigIntDecimal) {
    return value;
  }
  return new BigIntDecimal(value);
};
