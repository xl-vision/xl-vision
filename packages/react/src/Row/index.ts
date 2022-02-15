import Row from './Row';
import Col from './Col';
import useBreakPoints from './useBreakPoints';

export { default as Row } from './Row';
export { default as Col } from './Col';
export { default as useBreakPoints } from './useBreakPoints';
export * from './Row';
export * from './Col';

const obj = Row as typeof Row & {
  Col: typeof Col;
  useBreakPoints: typeof useBreakPoints;
};

obj.Col = Col;
obj.useBreakPoints = useBreakPoints;

export default obj;
