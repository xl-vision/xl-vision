const evalCode = <T extends any = any>(code: string, scope: Record<string, any>): T => {
  const scopeKeys = Object.keys(scope);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const scopeValues = scopeKeys.map((key) => scope[key]);
  // eslint-disable-next-line no-new-func
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const res = new Function(...scopeKeys, code);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return res(...scopeValues) as T;
};

export default evalCode;
