import { createContext, useState } from "react";

export const ErrorContext = createContext();

export const ErrorContextProvider = ({ children }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <ErrorContext.Provider value={{ error, setError, loading, setLoading }}>
      {children}
    </ErrorContext.Provider>
  );
};
