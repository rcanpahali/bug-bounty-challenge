import { makeAutoObservable, reaction, runInAction } from "mobx";
import { ResultAsync } from "neverthrow";
import { STORAGE_KEYS } from "../../../storage/keys";
import { safeJsonParse } from "../../../utils/storage";
import { UserSchema } from "./schema";
import type { User } from "./schema";

export type { User };

type TBootstrappedUser = { status: "idle" } | { status: "loading" } | { status: "ready"; user: User } | { status: "error"; error: Error };

const toError = (e: unknown): Error => (e instanceof Error ? e : new Error(String(e)));

export default class UserStore {
  bootstrappedUser: TBootstrappedUser = { status: "idle" };
  private bootstrapTask: ResultAsync<User, Error> | null = null;

  constructor() {
    makeAutoObservable(this);

    const raw = safeJsonParse(localStorage.getItem(STORAGE_KEYS.SESSION));
    const saved = UserSchema.safeParse(raw);
    if (saved.success) {
      this.bootstrappedUser = { status: "ready", user: saved.data };
    }

    // persist user session to localStorage whenever it changes
    reaction(
      () => this.user,
      (user) => (user ? localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user)) : localStorage.removeItem(STORAGE_KEYS.SESSION))
    );

    // listen to storage events to sync auth state across tabs
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEYS.SESSION) {
        runInAction(() => {
          const raw = safeJsonParse(e.newValue);
          const parsed = UserSchema.safeParse(raw);
          this.bootstrappedUser = parsed.success ? { status: "ready", user: parsed.data } : { status: "idle" };
        });
      }
    });
  }

  get user(): User | null {
    return this.bootstrappedUser.status === "ready" ? this.bootstrappedUser.user : null;
  }

  get isLoading(): boolean {
    return this.bootstrappedUser.status === "loading";
  }

  get hasError(): boolean {
    return this.bootstrappedUser.status === "error";
  }

  get isLoggedIn(): boolean {
    return this.bootstrappedUser.status === "ready";
  }

  get isLoggedOut(): boolean {
    return this.bootstrappedUser.status === "idle";
  }

  getOwnUser(): ResultAsync<User, Error> {
    const fetchUser = (): Promise<User> =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              firstName: "Aria",
              lastName: "Test",
              email: "linda.bolt@osapiens.com"
            }),
          500
        )
      );

    return ResultAsync.fromPromise(fetchUser(), toError);
  }

  clearUser() {
    if (this.bootstrappedUser.status === "idle") return;
    runInAction(() => {
      this.bootstrappedUser = { status: "idle" };
      this.bootstrapTask = null;
    });
  }

  bootstrapUser(): ResultAsync<User, Error> {
    if (this.bootstrappedUser.status === "loading" && this.bootstrapTask) {
      return this.bootstrapTask;
    }

    if (this.bootstrappedUser.status === "ready") {
      return ResultAsync.fromPromise(Promise.resolve(this.bootstrappedUser.user), toError);
    }

    runInAction(() => {
      this.bootstrappedUser = { status: "loading" };
    });

    // .map() runs only on success, .mapErr() runs only on failure. they are independent and don't chain into each other.
    const task = this.getOwnUser()
      .map((user) => {
        runInAction(() => {
          this.bootstrappedUser = { status: "ready", user };
          this.bootstrapTask = null;
        });

        return user;
      })
      .mapErr((error) => {
        runInAction(() => {
          this.bootstrappedUser = { status: "error", error };
          this.bootstrapTask = null;
        });

        return error;
      });

    this.bootstrapTask = task;

    return task;
  }
}
