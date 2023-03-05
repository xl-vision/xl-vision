import { Button, Input, Message, styled } from '@xl-vision/react';
import { FormEvent, useCallback, useMemo } from 'react';
import { useForm, Controller, useWatchErrors } from '@xl-vision/form';
import { ValidatorKey } from '../types';

type Value = {
  firstName: string;
  lastName: string;
};

const Demo = () => {
  const { form, getValue, validate } = useForm<Value>({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });

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
        field='firstName'
        form={form}
        render={(props) => <Input {...props} />}
        rules={{ required: 'value is required', trigger: 'blur' }}
      />
      {errorMap.firstName && <div className='error'>{errorMap.firstName}</div>}
      <Controller
        field='lastName'
        form={form}
        render={(props) => <Input type='number' {...props} />}
        rules={[{ required: true, max: 10 }]}
      />
      <Controller
        field='lastName'
        form={form}
        render={(props) => <Input type='number' {...props} />}
        rules={[{ required: true, max: 10, trigger: 'blur' }]}
      />
      {errorMap.lastName && <div className='error'>{errorMap.lastName}</div>}
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
      color: theme.color.themes.error.color,
    },
  };
});
