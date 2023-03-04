import { useForm, useWatch } from '@xl-vision/form';
import useWatchErrors from '../useWatchErrors';

const Demo = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { register, formStore } = useForm({
    defaultValues: {
      firstName: 'Rhys',
      lastName: 'Xia',
    },
  });

  const values = useWatch({ formStore });
  const errors = useWatchErrors({ formStore });

  return (
    <div>
      <input
        autoComplete='off'
        placeholder='please input firstname'
        {...register('firstName', {
          rules: { min: 10 },
        })}
      />
      <input placeholder='please input lastname' {...register('lastName')} />
      <div>{typeof values === 'object' ? JSON.stringify(values) : values}</div>
      <div>{typeof errors === 'object' ? JSON.stringify(errors) : errors}</div>
    </div>
  );
};

export default Demo;
