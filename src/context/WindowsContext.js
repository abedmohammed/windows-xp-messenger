import { createContext, useState } from "react";

export const WindowsContext = createContext();

export const WindowsContextProvider = ({ children }) => {
  const [components, setComponents] = useState([]);

  return (
    <WindowsContext.Provider value={{ components, setComponents }}>
      {children}
    </WindowsContext.Provider>
  );
};
