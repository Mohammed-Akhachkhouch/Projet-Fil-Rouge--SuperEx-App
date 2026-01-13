import { createContext, useContext, useRef } from 'react';

const AuthSheetContext = createContext();

export function AuthSheetProvider({ children }) {
  const bottomSheetRef = useRef(null);

  const openAuthSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const closeAuthSheet = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <AuthSheetContext.Provider
      value={{ bottomSheetRef, openAuthSheet, closeAuthSheet }}
    >
      {children}
    </AuthSheetContext.Provider>
  );
}

export function useAuthSheet() {
  return useContext(AuthSheetContext);
}
