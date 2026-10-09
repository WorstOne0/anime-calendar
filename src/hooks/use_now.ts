"use client";

// Next
import { useSyncExternalStore } from "react";

const TICK = 30_000;

const subscribe = (onTick: () => void) => {
  const timer = setInterval(onTick, TICK);
  return () => clearInterval(timer);
};

// Floored to the tick so repeated reads agree. Null on the server and while hydrating:
// nothing time-based renders before the client's clock and timezone are known.
export const useNow = () => useSyncExternalStore(subscribe, () => Math.floor(Date.now() / TICK) * TICK, () => null);
