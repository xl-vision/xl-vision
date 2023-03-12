import { Form, Input } from '@xl-vision/react';

const Demo = () => {
  const { form } = Form.useForm();

  return (
    <Form
      form={form}
      name='basic'
      labelCol={{ column: 8 }}
      wrapperCol={{ column: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      autoComplete='off'
    >
      <Form.Item
        label='Username'
        name='username'
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label='Password'
        name='password'
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>
    </Form>
  );
};

export default Demo;
