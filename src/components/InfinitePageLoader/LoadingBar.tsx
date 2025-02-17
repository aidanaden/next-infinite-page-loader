import { create } from "zustand";
import { useEffect } from "react";

import { createAnimationLoop } from "./utils";

export const DEFAULT_TRANSITION_DURATION = 500;

type LoadingBarState = {
  defaultDuration: number;
  duration: number;
  width: number;
  active: boolean;
  opacity: number;
};

const useLoadingBarStore = create<LoadingBarState>(() => ({
  duration: DEFAULT_TRANSITION_DURATION,
  defaultDuration: DEFAULT_TRANSITION_DURATION,
  width: 0,
  active: false,
  opacity: 0,
}));

export function randomInt(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function setProgress(progress: number) {
  useLoadingBarStore.setState((prev) => ({
    ...prev,
    width: progress,
  }));
}
//
type Dispose = (() => void) | undefined;
const timers: Dispose[] = [];

const clearTimers = () => {
  while (timers.length > 0) {
    const dispose = timers.pop();
    dispose?.();
  }
};

const MAX_INTERVAL = 80;

export const startLoadingBar = async () => {
  // if (import.meta.env.SSR) {
  //   return;
  // }
  clearTimers();
  useLoadingBarStore.setState((prev) => ({ ...prev, opacity: 1, progress: 7 }));
  const timer = createAnimationLoop(() => {
    console.log("startLoadingBar animation loop");
    const width = useLoadingBarStore.getState().width;
    const limit = 0.8 - width / MAX_INTERVAL;
    let num = limit;
    if (limit < 0) {
      timer?.();
      num = 0;
    }
    const random = randomInt(num * 0.8, num);
    useLoadingBarStore.setState((prev) => ({
      ...prev,
      progress: width + random,
    }));
  });
  timers.push(timer);
};

export const endLoadingBar = () => {
  // if (import.meta.env.SSR) {
  //   return;
  // }

  setProgress(100);

  const start = new Date().getTime();
  const timer = createAnimationLoop(() => {
    console.log("endLoadingBar animation loop");

    const opacity = useLoadingBarStore.getState().opacity;
    const current = new Date().getTime();
    if (current - start <= 200) {
      return;
    }

    if (opacity <= 0) {
      clearTimers();
      return;
    }

    const newOpacity = opacity - 0.01;
    console.log("endLoadingBar: ", { newOpacity });
    useLoadingBarStore.setState((prev) => ({
      ...prev,
      opacity: newOpacity,
    }));
  });

  timers.push(timer);
};

export const LoadingBar: React.FC = () => {
  const width = useLoadingBarStore((state) => state.width);
  const opacity = useLoadingBarStore((state) => state.opacity);
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);
  return (
    <div
      id="loading-bar"
      className="duration-50 fixed left-0 top-0 z-50 h-0.5 bg-v2-primary transition-all ease-out"
      style={{
        opacity: opacity,
        width: `${width}%`,
      }}
    />
  );
};
