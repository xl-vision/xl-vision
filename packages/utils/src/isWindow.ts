export default (obj: any): obj is Window => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return obj !== null && obj !== undefined && obj === obj.window;
};
