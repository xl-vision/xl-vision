import BigIntDecimal from '../BigIntDecimal';
import { padEnd, padStart } from '../string';

describe('BigIntDecimal', () => {
  it('Test kinds of numbers', () => {
    expect(new BigIntDecimal(1).toString()).toBe('1');
    expect(new BigIntDecimal(-1).toString()).toBe('-1');
    expect(new BigIntDecimal(0.1).toString()).toBe('0.1');
    expect(new BigIntDecimal(+0.1).toString()).toBe('0.1');
    expect(new BigIntDecimal(0).toString()).toBe('0');
    expect(new BigIntDecimal(+0).toString()).toBe('0');
    expect(new BigIntDecimal(-0).toString()).toBe('0');
    expect(new BigIntDecimal('1').toString()).toBe('1');
    expect(new BigIntDecimal('-1').toString()).toBe('-1');
    expect(new BigIntDecimal('-0.1').toString()).toBe('-0.1');
    expect(new BigIntDecimal('+0.1').toString()).toBe('0.1');
    expect(new BigIntDecimal(Number.NaN).toString()).toBe('NaN');
    expect(new BigIntDecimal('a').toString()).toBe('NaN');
    expect(new BigIntDecimal('1.a').toString()).toBe('NaN');
    expect(new BigIntDecimal('00.1').toString()).toBe('NaN');
    expect(new BigIntDecimal('-00.1').toString()).toBe('NaN');
    expect(new BigIntDecimal('+00.1').toString()).toBe('NaN');
    expect(new BigIntDecimal('1.11e2').toString()).toBe('111');
    expect(new BigIntDecimal('+1.11e2').toString()).toBe('111');
    expect(new BigIntDecimal('-1.11e2').toString()).toBe('-111');
    expect(new BigIntDecimal('-1.11e-2').toString()).toBe('-0.0111');
    expect(new BigIntDecimal('-1.11e2.1').toString()).toBe('NaN');
    expect(new BigIntDecimal(new BigIntDecimal('-1')).toString()).toBe('-1');
    expect(new BigIntDecimal(new BigIntDecimal('-1.11e2.1')).toString()).toBe('NaN');
  });

  it('Test add', () => {
    expect(new BigIntDecimal(1).add(1).toString()).toBe('2');
    expect(new BigIntDecimal(1).add(-1).toString()).toBe('0');
    expect(new BigIntDecimal(1).add(0).toString()).toBe('1');
    expect(new BigIntDecimal(1).add('1').toString()).toBe('2');
    expect(new BigIntDecimal(1).add('-1').toString()).toBe('0');
    expect(new BigIntDecimal(1).add('0').toString()).toBe('1');
    expect(new BigIntDecimal(1).add('+1').toString()).toBe('2');
    expect(new BigIntDecimal(1).add('+0').toString()).toBe('1');
    expect(new BigIntDecimal(1).add('-0').toString()).toBe('1');
    expect(new BigIntDecimal(1).add(Number.NaN).toString()).toBe('NaN');
    expect(new BigIntDecimal(Number.NaN).add(1).toString()).toBe('NaN');
    expect(new BigIntDecimal(1).add('a').toString()).toBe('NaN');
    expect(new BigIntDecimal('1e20').add('1e-20').toString()).toBe(
      padEnd('1', 20, '0') + '.' + padStart('1', 19, '0'),
    );
  });

  it('Test subtract', () => {
    expect(new BigIntDecimal(1).subtract(1).toString()).toBe('0');
    expect(new BigIntDecimal(1).subtract(-1).toString()).toBe('2');
    expect(new BigIntDecimal(1).subtract(0).toString()).toBe('1');
    expect(new BigIntDecimal(1).subtract('1').toString()).toBe('0');
    expect(new BigIntDecimal(1).subtract('-1').toString()).toBe('2');
    expect(new BigIntDecimal(-1).subtract('1').toString()).toBe('-2');
    expect(new BigIntDecimal(1).subtract('0').toString()).toBe('1');
    expect(new BigIntDecimal(1).subtract('+1').toString()).toBe('0');
    expect(new BigIntDecimal(1).subtract('+0').toString()).toBe('1');
    expect(new BigIntDecimal(1).subtract('-0').toString()).toBe('1');
    expect(new BigIntDecimal(1).subtract(Number.NaN).toString()).toBe('NaN');
    expect(new BigIntDecimal(Number.NaN).subtract(1).toString()).toBe('NaN');
    expect(new BigIntDecimal(1).subtract('a').toString()).toBe('NaN');
    expect(new BigIntDecimal('a').subtract(1).toString()).toBe('NaN');
    expect(new BigIntDecimal('1e20').subtract('1e-20').toString()).toBe(
      padEnd('9', 19, '9') + '.' + padStart('9', 19, '9'),
    );
  });

  it('Test divide', () => {
    expect(new BigIntDecimal(1).multiply(2).toString()).toBe('2');
    expect(new BigIntDecimal(1).multiply(-2).toString()).toBe('-2');
    expect(new BigIntDecimal(1).multiply(0).toString()).toBe('0');
    expect(new BigIntDecimal(0).multiply(1).toString()).toBe('0');
    expect(new BigIntDecimal(1).multiply('1').toString()).toBe('1');
    expect(new BigIntDecimal(1).multiply('-1').toString()).toBe('-1');
    expect(new BigIntDecimal(-1).multiply('1').toString()).toBe('-1');
    expect(new BigIntDecimal(1).multiply('0.1').toString()).toBe('0.1');
    expect(new BigIntDecimal(1).multiply('-0.1').toString()).toBe('-0.1');
    expect(new BigIntDecimal(1).multiply('+0').toString()).toBe('0');
    expect(new BigIntDecimal(1).multiply('-0').toString()).toBe('0');
    expect(new BigIntDecimal(1).multiply(Number.NaN).toString()).toBe('NaN');
    expect(new BigIntDecimal(Number.NaN).multiply(1).toString()).toBe('NaN');
    expect(new BigIntDecimal(1).multiply('a').toString()).toBe('NaN');
    expect(new BigIntDecimal('a').multiply(1).toString()).toBe('NaN');
    expect(new BigIntDecimal('1e20').multiply('1e-20').toString()).toBe('1');
  });

  it('Test divide', () => {
    expect(new BigIntDecimal(1).divide(2).toString()).toBe('0.5');
    expect(new BigIntDecimal(1).divide(-2).toString()).toBe('-0.5');
    expect(new BigIntDecimal(1).divide(0).toString()).toBe('NaN');
    expect(new BigIntDecimal(0).divide(1).toString()).toBe('0');
    expect(new BigIntDecimal(0).divide(-1).toString()).toBe('0');
    expect(new BigIntDecimal(1).divide('1').toString()).toBe('1');
    expect(new BigIntDecimal(1).divide('-1').toString()).toBe('-1');
    expect(new BigIntDecimal(-1).divide('1').toString()).toBe('-1');
    expect(new BigIntDecimal(1).divide('0.1').toString()).toBe('10');
    expect(new BigIntDecimal(1).divide('-0.1').toString()).toBe('-10');
    expect(new BigIntDecimal(1).divide('-0.1', 10).toString()).toBe('-10');
    expect(() => new BigIntDecimal(1).divide('-0.1', -1).toString()).toThrow(
      `precision must be >= 0, but actual -1`,
    );
    expect(() => new BigIntDecimal(1).divide('-0.1', 1.1).toString()).toThrow(
      `precision must be integer, but actual 1.1`,
    );
    expect(new BigIntDecimal(1).divide(3, 10).toString()).toBe(padEnd('0.', 10, '3'));
    expect(new BigIntDecimal(1).divide('+0').toString()).toBe('NaN');
    expect(new BigIntDecimal(1).divide('-0').toString()).toBe('NaN');
    expect(new BigIntDecimal(1).divide(Number.NaN).toString()).toBe('NaN');
    expect(new BigIntDecimal(Number.NaN).divide(1).toString()).toBe('NaN');
    expect(new BigIntDecimal(1).divide('a').toString()).toBe('NaN');
    expect(new BigIntDecimal('a').divide(1).toString()).toBe('NaN');
    expect(new BigIntDecimal('1e20').divide('1e-20').toString()).toBe(padEnd('1', 40, '0'));
  });

  it('Test toFixed', () => {
    expect(new BigIntDecimal(1).toFixed(2)).toBe('1.00');
    expect(() => new BigIntDecimal(1).toFixed(-1)).toThrow(`precision must be >= 0, but actual -1`);
    expect(() => new BigIntDecimal(1).toFixed(1.1)).toThrow(
      `precision must be integer, but actual 1.1`,
    );
    expect(new BigIntDecimal(1.11).toFixed(2)).toBe('1.11');
    expect(new BigIntDecimal(1.111).toFixed(2)).toBe('1.11');
    expect(new BigIntDecimal(-1.111).toFixed(2)).toBe('-1.11');
    expect(new BigIntDecimal(-111.111).toFixed(2)).toBe('-111.11');
    expect(new BigIntDecimal('a').toFixed(10)).toBe('NaN');
  });

  it('Test ceil', () => {
    expect(new BigIntDecimal(1).ceil().toString()).toBe('1');
    expect(new BigIntDecimal(1.1).ceil().toString()).toBe('2');
    expect(new BigIntDecimal(1.9).ceil().toString()).toBe('2');
    expect(new BigIntDecimal(0).ceil().toString()).toBe('0');
    expect(new BigIntDecimal(-1).ceil().toString()).toBe('-1');
    expect(new BigIntDecimal(-1.1).ceil().toString()).toBe('-1');
    expect(new BigIntDecimal(-1.9).ceil().toString()).toBe('-1');
    expect(new BigIntDecimal(Number.NaN).ceil().toString()).toBe('NaN');
  });

  it('Test floor', () => {
    expect(new BigIntDecimal(1).floor().toString()).toBe('1');
    expect(new BigIntDecimal(1.1).floor().toString()).toBe('1');
    expect(new BigIntDecimal(1.9).floor().toString()).toBe('1');
    expect(new BigIntDecimal(0).floor().toString()).toBe('0');
    expect(new BigIntDecimal(-1).floor().toString()).toBe('-1');
    expect(new BigIntDecimal(-1.1).floor().toString()).toBe('-2');
    expect(new BigIntDecimal(-1.9).floor().toString()).toBe('-2');
    expect(new BigIntDecimal(Number.NaN).floor().toString()).toBe('NaN');
  });

  it('Test round', () => {
    expect(new BigIntDecimal(1).round().toString()).toBe('1');
    expect(new BigIntDecimal(1.1).round().toString()).toBe('1');
    expect(new BigIntDecimal(1.9).round().toString()).toBe('2');
    expect(new BigIntDecimal(0).round().toString()).toBe('0');
    expect(new BigIntDecimal(-1).round().toString()).toBe('-1');
    expect(new BigIntDecimal(-1.1).round().toString()).toBe('-1');
    expect(new BigIntDecimal(-1.9).round().toString()).toBe('-2');
    expect(new BigIntDecimal(Number.NaN).round().toString()).toBe('NaN');
  });

  it('Test abs', () => {
    expect(new BigIntDecimal(1).abs().toString()).toBe('1');
    expect(new BigIntDecimal(1.1).abs().toString()).toBe('1.1');
    expect(new BigIntDecimal(0).abs().toString()).toBe('0');
    expect(new BigIntDecimal(-1).abs().toString()).toBe('1');
    expect(new BigIntDecimal(-1.1).abs().toString()).toBe('1.1');
    expect(new BigIntDecimal(Number.NaN).abs().toString()).toBe('NaN');
  });

  it('Test greaterThan', () => {
    expect(new BigIntDecimal(2).greaterThan(1)).toBe(true);
    expect(new BigIntDecimal(1).greaterThan(2)).toBe(false);
    expect(new BigIntDecimal(2.1).greaterThan(1.1)).toBe(true);
    expect(new BigIntDecimal(1.1).greaterThan(2.1)).toBe(false);
    expect(new BigIntDecimal(-2).greaterThan(-1)).toBe(false);
    expect(new BigIntDecimal(-1).greaterThan(-2)).toBe(true);
    expect(new BigIntDecimal(-2.1).greaterThan(-1.1)).toBe(false);
    expect(new BigIntDecimal(-1.1).greaterThan(-2.1)).toBe(true);
    expect(new BigIntDecimal(1.1).greaterThan(-1.1)).toBe(true);
    expect(new BigIntDecimal(-1.1).greaterThan(1.1)).toBe(false);
    expect(new BigIntDecimal(1.1).greaterThan(1.1)).toBe(false);
    expect(new BigIntDecimal(-1.1).greaterThan(-1.1)).toBe(false);
    expect(new BigIntDecimal(Number.NaN).greaterThan(1.1)).toBe(false);
    expect(new BigIntDecimal(Number.NaN).greaterThan(-1.1)).toBe(false);
    expect(new BigIntDecimal(1.1).greaterThan(Number.NaN)).toBe(false);
    expect(new BigIntDecimal(-1.1).greaterThan(Number.NaN)).toBe(false);
    expect(new BigIntDecimal(Number.NaN).greaterThan(Number.NaN)).toBe(false);
  });

  it('Test lessThan', () => {
    expect(new BigIntDecimal(2).lessThan(1)).toBe(false);
    expect(new BigIntDecimal(1).lessThan(2)).toBe(true);
    expect(new BigIntDecimal(2.1).lessThan(1.1)).toBe(false);
    expect(new BigIntDecimal(1.1).lessThan(2.1)).toBe(true);
    expect(new BigIntDecimal(-2).lessThan(-1)).toBe(true);
    expect(new BigIntDecimal(-1).lessThan(-2)).toBe(false);
    expect(new BigIntDecimal(-2.1).lessThan(-1.1)).toBe(true);
    expect(new BigIntDecimal(-1.1).lessThan(-2.1)).toBe(false);
    expect(new BigIntDecimal(1.1).lessThan(-1.1)).toBe(false);
    expect(new BigIntDecimal(-1.1).lessThan(1.1)).toBe(true);
    expect(new BigIntDecimal(1.1).lessThan(1.1)).toBe(false);
    expect(new BigIntDecimal(-1.1).lessThan(-1.1)).toBe(false);
    expect(new BigIntDecimal(Number.NaN).lessThan(1.1)).toBe(false);
    expect(new BigIntDecimal(Number.NaN).lessThan(-1.1)).toBe(false);
    expect(new BigIntDecimal(1.1).lessThan(Number.NaN)).toBe(false);
    expect(new BigIntDecimal(-1.1).lessThan(Number.NaN)).toBe(false);
    expect(new BigIntDecimal(Number.NaN).lessThan(Number.NaN)).toBe(false);
  });

  it('Test equal', () => {
    expect(new BigIntDecimal(2).equal(2)).toBe(true);
    expect(new BigIntDecimal(1).equal(1)).toBe(true);
    expect(new BigIntDecimal(2).equal(1)).toBe(false);
    expect(new BigIntDecimal(1).equal(2)).toBe(false);
    expect(new BigIntDecimal(1.1).equal(1.1)).toBe(true);
    expect(new BigIntDecimal(2.1).equal(2.1)).toBe(true);
    expect(new BigIntDecimal(2.1).equal(1.1)).toBe(false);
    expect(new BigIntDecimal(1.1).equal(2.1)).toBe(false);
    expect(new BigIntDecimal(-2).equal(-2)).toBe(true);
    expect(new BigIntDecimal(-2).equal(-1)).toBe(false);
    expect(new BigIntDecimal(-1).equal(-2)).toBe(false);
    expect(new BigIntDecimal(-2.1).equal(-2.1)).toBe(true);
    expect(new BigIntDecimal(-2.1).equal(-1.1)).toBe(false);
    expect(new BigIntDecimal(-1.1).equal(-2.1)).toBe(false);
    expect(new BigIntDecimal(1.1).equal(-1.1)).toBe(false);
    expect(new BigIntDecimal(-1.1).equal(1.1)).toBe(false);
    expect(new BigIntDecimal(Number.NaN).equal(1.1)).toBe(false);
    expect(new BigIntDecimal(Number.NaN).equal(-1.1)).toBe(false);
    expect(new BigIntDecimal(1.1).equal(Number.NaN)).toBe(false);
    expect(new BigIntDecimal(-1.1).equal(Number.NaN)).toBe(false);
    expect(new BigIntDecimal(Number.NaN).equal(Number.NaN)).toBe(false);
  });
});
