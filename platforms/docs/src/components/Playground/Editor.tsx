import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import { useConstantFn } from '@xl-vision/hooks';
import { FC } from 'react';
import useTheme from '../ThemeProvider/useTheme';

export type EditorProps = {
  onChange: (value: string) => void;
  value: string;
};

const Editor: FC<EditorProps> = (props) => {
  const { value, onChange } = props;
  const { isDark } = useTheme();

  const handleChange = useConstantFn((newValue: string) => {
    onChange(newValue);
  });

  return (
    <CodeMirror
      extensions={[javascript({ jsx: true })]}
      height='100%'
      theme={isDark ? 'dark' : 'light'}
      value={value}
      onChange={handleChange}
    />
  );
};

export default Editor;
