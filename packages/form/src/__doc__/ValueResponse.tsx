import { useState } from 'react';
import { useForm, useWatch } from '@xl-vision/form';

const VALUE = {
  firstName: 'Rhys',
  lastName: 'Xia',
};

const Demo = () => {
  const [values, setValues] = useState(VALUE);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { register, formStore } = useForm({
    values,
  });

  const value = useWatch({ formStore });

  return (
    <div>
      <input placeholder='please input firstname' {...register('firstName')} />
      <input placeholder='please input lastname' {...register('lastName')} />
      <div>{typeof value === 'object' ? JSON.stringify(value) : value}</div>
      <button onClick={() => setValues(VALUE)}>reset</button>
    </div>
  );
};

export default Demo;
