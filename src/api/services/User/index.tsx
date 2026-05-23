import React, { createContext, useCallback, useContext, useEffect } from "react";

import { STORAGE_KEYS } from "../../../storage/keys";
import { useTimerStartStorage, useUserStorage } from "../../../storage/preferences";
import UserStore from "./store";

/* 
CONTEXT / PROVIDER INIT
*/

const store = new UserStore();

type TUserContext = {
  store: UserStore;
  login: () => void;
  logout: () => void;
};

const UserStoreContext = createContext<TUserContext | null>(null);

export const StoreProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { value: session, set: setSession, remove: removeSession } = useUserStorage();
  const { value: timerStart, set: setTimerStart } = useTimerStartStorage();

  // Sync store with session storage on mount and when session changes
  useEffect(() => {
    if (session) {
      store.setUserFromSession(session);
    } else {
      store.clearUser();
    }
  }, [session]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.SESSION && event.newValue === null) {
        store.clearUser();
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = useCallback(() => {
    store
      .bootstrapUser()
      .map((user) => {
        setSession(user);
        if (timerStart === null) {
          setTimerStart(Date.now());
        }
      })
      .mapErr((error) => console.error("Login failed:", error));
  }, [setSession, setTimerStart, timerStart]);

  const logout = useCallback(() => {
    removeSession();
  }, [removeSession]);

  return <UserStoreContext.Provider value={{ store, login, logout }}>{children}</UserStoreContext.Provider>;
};

const useUserStore = (): TUserContext => {
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
export const useIsLoggedIn = () => useUserStore().store.user !== null;
export const useLogin = () => useUserStore().login;
export const useLogout = () => useUserStore().logout;
