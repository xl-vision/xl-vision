import { Button, Message, styled } from '@xl-vision/react';
import { FormEvent, useCallback } from 'react';
import { useForm } from '@xl-vision/form';

const Demo = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { register, getValue } = useForm({
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
      <input
        autoComplete='off'
        placeholder='please input firstname'
        {...register('firstName', {
          rules: { min: 10 },
        })}
      />
      <input placeholder='please input lastname' {...register('lastName')} />
      <Button color='primary'>submit</Button>
    </Form>
  );
};

export default Demo;

const Form = styled('form')(({ theme }) => {
  return {
    '> *': {
      width: '100%',
      margin: '4px 0',
    },
    input: {
      border: `1px solid ${theme.color.divider}`,
      borderRadius: 4,
      padding: '6px 12px',
      lineHeight: 1.5,
      outline: 0,
    },
  };
});
