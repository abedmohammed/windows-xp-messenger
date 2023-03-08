import React, { useContext, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TitleBar from "../components/TitleBar";

import Draggable from "react-draggable";
import { ErrorContext } from "../context/ErrorContext";

const RootLayout = () => {
  let location = useLocation();
  const { error } = useContext(ErrorContext);
  const draggerRef = useRef(null);

  useEffect(() => {
    draggerRef.current?.setState({ x: 0, y: 0 });
  }, [location]);

  return (
    <Draggable handle=".title-bar" ref={draggerRef} disabled={error}>
      <div className="window">
        <TitleBar />
        <Outlet />
      </div>
    </Draggable>
  );
};

export default RootLayout;
