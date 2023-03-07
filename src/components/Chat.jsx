import React, { useContext } from "react";

import Cam from "../assets/images/cam.png";
import Add from "../assets/images/add.png";
import More from "../assets/images/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      {data.user?.displayName ? (
        <>
          <div className="chatInfo">
            <p>To: {data.user?.displayName}</p>
          </div>
          <Messages />
          <Input />
        </>
      ) : (
        "Please select a user"
      )}
    </div>
  );
};

export default Chat;
