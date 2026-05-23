import { makeAutoObservable, reaction, runInAction } from "mobx";
import { STORAGE_KEYS } from "../../../storage/keys";
import { getStorageItem, safeJsonParse } from "../../../utils/storage";
import UserStore from "../User/store";

export const TOTAL_SECONDS = 3600;

export default class TimerStore {
  elapsedSeconds = 0;
  intervalStart: number | null = null;

  // timer store is wired to user store to react to login/logout events and start/pause the timer accordingly
  constructor(private userStore: UserStore) {
    makeAutoObservable(this);

    const saved = getStorageItem<number>(STORAGE_KEYS.ELAPSED_SECONDS);
    if (saved !== null) {
      this.elapsedSeconds = saved;
    }

    const savedIntervalStart = getStorageItem<number>(STORAGE_KEYS.INTERVAL_START);
    if (savedIntervalStart !== null) {
      this.intervalStart = savedIntervalStart;
    }

    // persist elapsed seconds to localStorage whenever it changes
    reaction(
      () => this.elapsedSeconds,
      (v) => localStorage.setItem(STORAGE_KEYS.ELAPSED_SECONDS, JSON.stringify(v))
    );

    // persist intervalStart to localStorage, or remove it when the timer is paused
    reaction(
      () => this.intervalStart,
      (v) =>
        v !== null
          ? localStorage.setItem(STORAGE_KEYS.INTERVAL_START, JSON.stringify(v))
          : localStorage.removeItem(STORAGE_KEYS.INTERVAL_START)
    );

    // start or pause the timer based on the user's login state
    reaction(
      () => this.userStore.isLoggedIn,
      (isLoggedIn) => (isLoggedIn ? this.start() : this.pause()),
      { fireImmediately: true }
    );

    // listen to storage events to sync timer states across tabs
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEYS.ELAPSED_SECONDS && e.newValue) {
        runInAction(() => {
          this.elapsedSeconds = safeJsonParse<number>(e.newValue) ?? this.elapsedSeconds;
        });
      }
      if (e.key === STORAGE_KEYS.INTERVAL_START) {
        runInAction(() => {
          this.intervalStart = safeJsonParse<number>(e.newValue);
        });
      }
    });
  }

  get isRunning(): boolean {
    return this.intervalStart !== null;
  }

  start() {
    if (!this.isRunning) {
      this.intervalStart = Date.now();
    }
  }

  pause() {
    if (this.intervalStart !== null) {
      this.elapsedSeconds += (Date.now() - this.intervalStart) / 1000;
      this.intervalStart = null;
    }
  }

  skipTimer() {
    this.elapsedSeconds = TOTAL_SECONDS - 1;
    if (this.isRunning) {
      this.intervalStart = Date.now();
    }
  }

  reset() {
    this.elapsedSeconds = 0;
    if (this.isRunning) {
      this.intervalStart = Date.now();
    }
  }
}
