import { Button, Input, Message, styled } from '@xl-vision/react';
import { FormEvent, useCallback } from 'react';
import { useForm, Controller } from '@xl-vision/useForm';

const Demo = () => {
  const { form, getValue } = useForm({
    defaultValues: {
      firstName: 'Rhys',
      lastName: 'Xia',
    },
  });

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const value = getValue();
      Message.success(`submit value: ${JSON.stringify(value)}`);
    },
    [getValue],
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Controller
        field='firstName'
        form={form}
        render={(props) => <Input placeholder='please input firstname' {...props} />}
      />

      <Controller
        field='lastName'
        form={form}
        render={(props) => <Input placeholder='please input lastname' {...props} />}
      />
      <Button color='primary' long={true}>
        submit
      </Button>
    </Form>
  );
};

export default Demo;

const Form = styled('form')(() => {
  return {
    '> *': {
      margin: '4px 0',
    },
  };
});
