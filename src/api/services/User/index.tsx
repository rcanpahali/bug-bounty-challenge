import React, { createContext, useContext, useEffect } from "react";

import UserStore from "./store";

/* 
CONTEXT / PROVIDER INIT
*/

const store = new UserStore();

const UserStoreContext = createContext<UserStore | null>(null);

export const StoreProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // bootstrap user on provider mount, this simulates fetching user data or checking for an existing session
  useEffect(() => {
    store.bootstrapUser().mapErr((error) => console.error("Failed to bootstrap user:", error));
  }, []);

  return <UserStoreContext.Provider value={store}>{children}</UserStoreContext.Provider>;
};

/* 
HOOK DEFINITION
*/

const useUserStore = (): UserStore => {
  const ctx = useContext(UserStoreContext);
  if (!ctx) {
    throw new Error("useUserStore must be used within StoreProvider");
  }

  return ctx;
};

/* 
PUBLIC HOOKS
*/

export const useUser = () => useUserStore().user;
export const useUserLoading = () => useUserStore().isLoading;
export const useUserError = () => useUserStore().hasError;
