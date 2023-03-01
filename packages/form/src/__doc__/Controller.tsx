import { Input } from '@xl-vision/react';
import { useForm, Controller, useWatch } from '@xl-vision/form';

const Demo = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { formStore } = useForm({
    defaultValues: {
      firstName: 'Rhys',
      lastName: 'Xia',
    },
  });

  const value = useWatch({ formStore });

  return (
    <div>
      <Controller
        field='firstName'
        formStore={formStore}
        render={(props) => <Input placeholder='please input firstname' {...props} />}
      />

      <Controller
        field='lastName'
        formStore={formStore}
        render={(props) => <Input placeholder='please input lastname' {...props} />}
      />
      <div>{typeof value === 'object' ? JSON.stringify(value) : value}</div>
    </div>
  );
};

export default Demo;
