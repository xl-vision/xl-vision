export default (obj: unknown): obj is Window => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return obj !== null && obj !== undefined && obj === (obj as any).window;
};
