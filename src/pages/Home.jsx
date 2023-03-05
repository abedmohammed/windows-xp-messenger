import React from "react";

import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import TitleBar from "../components/TitleBar";

const Home = () => {
  return (
    <div className="home window">
      <TitleBar />
      <div className="container window-body">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default Home;
