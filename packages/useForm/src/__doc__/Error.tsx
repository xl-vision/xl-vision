import { Button, Input, Message, styled } from '@xl-vision/react';
import { FormEvent, useCallback, useMemo } from 'react';
import { useForm, Controller, useWatchErrors } from '@xl-vision/useForm';
import { ValidatorKey } from '../types';

type Value = {
  field1: string;
  field2: string;
  field3: string;
};

const Demo = () => {
  const { form, getValue, validate } = useForm<Value>();

  const errors = useWatchErrors({ form });

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        await validate();
        const value = getValue();
        Message.success(`submit value: ${JSON.stringify(value)}`);
      } catch (err) {
        console.error(err);
      }
    },
    [getValue, validate],
  );

  const errorMap = useMemo(() => {
    const map: Partial<Record<keyof Value, string>> = {};

    Object.keys(errors).forEach((key) => {
      const v = key as keyof Value;
      const o = errors[v] as Record<ValidatorKey, string>;
      const k = Object.keys(o) as Array<ValidatorKey>;
      map[v] = k.length ? o[k[0]] : '';
    });
    return map;
  }, [errors]);

  return (
    <Form onSubmit={handleSubmit}>
      <Controller
        field='field1'
        form={form}
        render={(props) => <Input {...props} />}
        rules={{ required: 'value is required' }}
      />
      {errorMap.field1 && <div className='error'>{errorMap.field1}</div>}
      <Controller
        field='field2'
        form={form}
        render={(props) => <Input type='number' {...props} />}
        rules={[{ required: true, max: 10 }]}
      />
      {errorMap.field2 && <div className='error'>{errorMap.field2}</div>}
      <Controller
        field='field3'
        form={form}
        render={(props) => <Input type='number' {...props} />}
        rules={[{ required: true, max: 10, trigger: 'blur' }]}
      />
      {errorMap.field3 && <div className='error'>{errorMap.field3}</div>}
      <Button color='primary' long={true}>
        submit
      </Button>
    </Form>
  );
};

export default Demo;

const Form = styled('form')(({ theme }) => {
  return {
    '> *': {
      margin: '4px 0',
    },

    '.error': {
      color: theme.colors.themes.error.foreground.enabled,
    },
  };
});
