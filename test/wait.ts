export default (time: number) => {
  return new Promise<void>((resolve) => {
    // console.info(`wait time: ${time}`)
    setTimeout(resolve, time);
  });
};
