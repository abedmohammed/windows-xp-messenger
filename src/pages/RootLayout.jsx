import React from "react";
import { Outlet } from "react-router-dom";
import TitleBar from "../components/TitleBar";

const RootLayout = () => {
  return (
    <div className="window">
      <TitleBar />
      <Outlet />
    </div>
  );
};

export default RootLayout;
