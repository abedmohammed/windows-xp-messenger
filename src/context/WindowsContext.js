import { createContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import TitleBar from "../components/TitleBar";

export const WindowsContext = createContext();

export const WindowsContextProvider = ({ children }) => {
  const [maxZ, setMaxZ] = useState(0);
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

  const getMaxZ = () => {
    let z = 0;
    components.forEach((component) => {
      if (component.zIndex > z) {
        z = component.zIndex;
      }
    });

    setMaxZ(z);
    return z;
  };

  return (
    <WindowsContext.Provider
      value={{ components, setComponents, getMaxZ, maxZ }}
    >
      {children}
    </WindowsContext.Provider>
  );
};
