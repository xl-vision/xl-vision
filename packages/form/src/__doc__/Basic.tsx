import { useForm, useWatch } from '@xl-vision/form';

const Demo = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { register, formStore } = useForm({
    defaultValues: {
      firstName: 'Rhys',
      lastName: 'Xia',
    },
  });

  const value = useWatch({ formStore });

  return (
    <div>
      <input placeholder='please input firstname' {...register('firstName')} />
      <input placeholder='please input lastname' {...register('lastName')} />
      <div>{typeof value === 'object' ? JSON.stringify(value) : value}</div>
    </div>
  );
};

export default Demo;
