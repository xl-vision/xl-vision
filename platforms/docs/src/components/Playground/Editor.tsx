import { useConstantFn } from '@xl-vision/hooks';
import { styled, useTheme } from '@xl-vision/react';
import codemirror from 'codemirror';
import { FC, useMemo } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';

require('codemirror/mode/jsx/jsx');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material-darker.css');

export type EditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const CodeMirrorEditor = styled(CodeMirror)(({ theme }) => {
  const { color } = theme;
  return {
    height: '100%',
    '.CodeMirror': {
      height: '100%',
      background: color.background.default,
    },
  };
});

const Editor: FC<EditorProps> = (props) => {
  const { value, onChange } = props;

  const { color } = useTheme();

  const { mode } = color;

  const handleChange = useConstantFn(
    (_1: codemirror.Editor, _2: codemirror.EditorChange, newValue: string) => {
      onChange(newValue);
    },
  );

  const options = useMemo(() => {
    return {
      smartIndent: true,
      indentUnit: 2,
      tabSize: 2,
      mode: 'jsx',
      theme: mode === 'dark' ? 'material-darker' : 'default',
      lineNumbers: true,
    };
  }, [mode]);

  return <CodeMirrorEditor options={options} value={value} onBeforeChange={handleChange} />;
};

export default Editor;
