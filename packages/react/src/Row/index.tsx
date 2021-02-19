import Row from './Row';
import Col from './Col';

export { default as Row } from './Row';
export { default as Col } from './Col';
export * from './Row';
export * from './Col';

const RowWithCol = Row as typeof Row & {
  Col: typeof Col;
};

RowWithCol.Col = Col;

export default RowWithCol;
