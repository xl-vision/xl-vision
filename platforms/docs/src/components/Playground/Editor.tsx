import { useConstantFn } from '@xl-vision/hooks';
import { styled } from '@xl-vision/react';
import codemirror from 'codemirror';
import { FC, useContext, useMemo } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { ThemeContext } from '../ThemeProvider';

require('codemirror/mode/jsx/jsx');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material-darker.css');

export type EditorProps = {
  onChange: (value: string) => void;
  value: string;
};

const CodeMirrorEditor = styled(CodeMirror)(({ theme }) => {
  const { colors } = theme;
  return {
    height: '100%',
    '.CodeMirror': {
      height: '100%',
      background: colors.background.default,
    },
  };
});

const Editor: FC<EditorProps> = (props) => {
  const { value, onChange } = props;
  const { isDark } = useContext(ThemeContext);

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
      theme: isDark ? 'material-darker' : 'default',
      lineNumbers: true,
    };
  }, [isDark]);

  return <CodeMirrorEditor options={options} value={value} onBeforeChange={handleChange} />;
};

export default Editor;
