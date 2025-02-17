export const createScheduler = ({
  callback,
}: {
  callback: () => void;
  interval?: number;
}): (() => void) => {
  let tickId: number;
  const work = () => {
    if (true) {
      tick();
    }
    callback();
  };

  const tick = (): void => {
    tickId = requestAnimationFrame(work);
  };

  const dispose = (): void => {
    cancelAnimationFrame(tickId);
  };

  tick();
  return dispose;
};

export const createAnimationLoop = (callback: () => void) => {
  return createScheduler({
    callback,
  });
};
