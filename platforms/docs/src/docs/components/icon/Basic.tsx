import { Row } from '@xl-vision/react';
import { DeleteFilled, DeleteOutlined } from '@xl-vision/icons';

const Basic = () => {
  return (
    <div>
      <Row>
        <Row.Col column={8}>Filled</Row.Col>
        <Row.Col column={16}>
          <DeleteFilled />
        </Row.Col>
      </Row>
      <Row>
        <Row.Col column={8}>Outlined</Row.Col>
        <Row.Col column={16}>
          <DeleteOutlined />
        </Row.Col>
      </Row>
    </div>
  );
};

export default Basic;
