import { makeAutoObservable, runInAction } from "mobx";
import { ResultAsync } from "neverthrow";

export interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
}

type TBootstrappedUser = { status: "idle" } | { status: "loading" } | { status: "ready"; user: User } | { status: "error"; error: Error };

const toError = (e: unknown): Error => (e instanceof Error ? e : new Error(String(e)));

export default class UserStore {
  bootstrappedUser: TBootstrappedUser = { status: "idle" };
  private bootstrapTask: ResultAsync<User, Error> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get user(): User | null {
    return this.bootstrappedUser.status === "ready" ? this.bootstrappedUser.user : null;
  }

  get isLoading(): boolean {
    return this.bootstrappedUser.status === "loading" || this.bootstrappedUser.status === "idle";
  }

  get hasError(): boolean {
    return this.bootstrappedUser.status === "error";
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
