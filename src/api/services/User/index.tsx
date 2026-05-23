import React, { createContext, useCallback, useContext, useState } from "react";

import UserStore from "./store";

/*
CONTEXT / PROVIDER INIT
*/

type TUserContext = {
  store: UserStore;
  login: () => void;
  logout: () => void;
};

const UserStoreContext = createContext<TUserContext | null>(null);

export const StoreProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [store] = useState(() => new UserStore());

  const login = useCallback(() => {
    store.bootstrapUser().mapErr((error) => console.error("Login failed:", error));
  }, [store]);

  const logout = useCallback(() => {
    store.clearUser();
  }, [store]);

  return <UserStoreContext.Provider value={{ store, login, logout }}>{children}</UserStoreContext.Provider>;
};

export const useUserStore = (): TUserContext => {
  const ctx = useContext(UserStoreContext);
  if (!ctx) {
    throw new Error("useUserStore must be used within StoreProvider");
  }

  return ctx;
};

/*
PUBLIC HOOKS
*/

export const useUser = () => useUserStore().store.user;
export const useUserLoading = () => useUserStore().store.isLoading;
export const useUserError = () => useUserStore().store.hasError;
export const useIsLoggedIn = () => useUserStore().store.isLoggedIn;
export const useLogin = () => useUserStore().login;
export const useLogout = () => useUserStore().logout;
