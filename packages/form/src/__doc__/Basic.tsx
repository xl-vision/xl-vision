import { useEffect } from 'react';
import { useForm, useWatch } from '@xl-vision/form';

const Demo = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { register, formStore, validate } = useForm({
    defaultValues: {
      firstName: 'Rhys',
      lastName: 'Xia',
    },
  });

  const value = useWatch({ formStore });

  useEffect(() => {
    validate().then((err) => {
      console.log(err);
    });
  }, [value, validate]);

  return (
    <div>
      <input
        placeholder='please input firstname'
        {...register('firstName', {
          rules: { min: 10 },
        })}
      />
      <input placeholder='please input lastname' {...register('lastName')} />
      <div>{typeof value === 'object' ? JSON.stringify(value) : value}</div>
    </div>
  );
};

export default Demo;
