import { createContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import TitleBar from "../components/TitleBar";

export const WindowsContext = createContext();

export const WindowsContextProvider = ({ children }) => {
  const [components, setComponents] = useState([
    {
      name: "window-friends",
      zIndex: 0,
      jsx: (
        <div className="window">
          <TitleBar />
          <div className="window-body">
            <Sidebar />
          </div>
        </div>
      ),
    },
  ]);

  console.log(components);

  return (
    <WindowsContext.Provider value={{ components, setComponents }}>
      {children}
    </WindowsContext.Provider>
  );
};
