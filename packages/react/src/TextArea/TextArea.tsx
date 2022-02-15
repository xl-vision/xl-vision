import { env } from '@xl-vision/utils';
import React from 'react';

export type TextAreaProps = {};

const displayName = 'TextArea';

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  return <textarea {...props} ref={ref} />;
});

if (env.isDevelopment) {
  TextArea.displayName = displayName;
  TextArea.propTypes = {};
}

export default TextArea;
