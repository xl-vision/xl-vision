const isFixed = process.env.LINT_FIX === 'true';

export default {
  '*.{js,jsx,ts,tsx,cjs,mjs}': `eslint --report-unused-disable-directives --max-warnings 0 ${isFixed ? '--fix' : ''}`,
};
