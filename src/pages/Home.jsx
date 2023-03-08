import React from "react";

import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import TitleBar from "../components/TitleBar";

const Home = () => {
  return (
    <div className="container window-body">
      <Sidebar />
      <Chat />
    </div>
  );
};

export default Home;
