import { createContext } from 'react';
import { Form } from '@xl-vision/useForm';

const FormContext = createContext<Form<{}> | null>(null);
