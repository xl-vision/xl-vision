import { useState } from 'react';
import { useForm, useWatch } from '@xl-vision/form';

const Demo = () => {
  const defaultValues = {
    firstName: 'Rhys',
    lastName: 'Xia',
  };

  const [values, setValues] = useState(defaultValues);

  const { register, formStore } = useForm({
    values,
  });

  const value = useWatch({ formStore });

  return (
    <div>
      <input placeholder='please input firstname' {...register('firstName')} />
      <input placeholder='please input lastname' {...register('lastName')} />
      <div>{typeof value === 'object' ? JSON.stringify(value) : value}</div>
      <button onClick={() => setValues(defaultValues)}>reset</button>
    </div>
  );
};

export default Demo;
