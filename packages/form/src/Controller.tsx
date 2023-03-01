import { FC, ReactElement, useCallback } from 'react';
import FormStore from './FormStore';
import useWatch from './useWatch';

export type RenderProps = {
  value: any;
  onChange: (value: any) => void;
};

export type ControllerProps = {
  field: string;
  render: (props: RenderProps) => ReactElement;
  formStore: FormStore;
};

const Controller: FC<ControllerProps> = ({ field, render, formStore }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const value = useWatch({ formStore, field });

  const onChange = useCallback(
    (v: any) => {
      formStore.setValue(field, v);
    },
    [formStore, field],
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return render({ value, onChange });
};

export default Controller;
