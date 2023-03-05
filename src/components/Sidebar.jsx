import React from "react";

import UserBar from "./UserBar";
import Search from "./Search";
import Chats from "./Chats";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Search />
      <Chats />
      <UserBar />
    </div>
  );
};

export default Sidebar;
