import React, { createContext, useContext, useEffect, useState } from "react";
import { useUserStore } from "../User";
import TimerStore, { TOTAL_SECONDS } from "./store";

export { TOTAL_SECONDS };

/*
CONTEXT / PROVIDER INIT
*/

const TimerStoreContext = createContext<TimerStore | null>(null);

export const TimerStoreProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { store: userStore } = useUserStore();
  const [timerStore] = useState(() => new TimerStore(userStore));

  // Cleanup on unmount
  useEffect(() => () => timerStore.dispose(), [timerStore]);

  return <TimerStoreContext.Provider value={timerStore}>{children}</TimerStoreContext.Provider>;
};

const useTimerStore = (): TimerStore => {
  const ctx = useContext(TimerStoreContext);
  if (!ctx) {
    throw new Error("useTimerStore must be used within TimerStoreProvider");
  }

  return ctx;
};

/*
PUBLIC HOOKS
*/

export const useTimerElapsed = () => useTimerStore().elapsedSeconds;
export const useTimerLoginStart = () => useTimerStore().intervalStart;
export const useTimerIsRunning = () => useTimerStore().isRunning;
export const useTimerSkip = () => {
  const store = useTimerStore();

  return () => store.skipTimer();
};
export const useTimerReset = () => {
  const store = useTimerStore();

  return () => store.reset();
};
