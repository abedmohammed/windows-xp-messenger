import { createContext, useState } from "react";

export const ErrorContext = createContext();

export const ErrorContextProvider = ({ children }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <ErrorContext.Provider
      value={{ error, setError, loading, setLoading, success, setSuccess }}
    >
      {children}
    </ErrorContext.Provider>
  );
};
