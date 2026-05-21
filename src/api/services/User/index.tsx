import React, { createContext, useContext } from "react";

import Store from "./store";

/* 
CONTEXT / PROVIDER INIT
*/

const store = new Store();

const UserStoreContext = createContext<Store | null>(null);

export const StoreProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <UserStoreContext.Provider value={store}>
      {children}
    </UserStoreContext.Provider>
  );
};

/* 
HOOK DEFINITION
*/

export const useUserStore = () => useContext(UserStoreContext);
