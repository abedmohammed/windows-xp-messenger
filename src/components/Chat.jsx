import React, { useContext } from "react";

import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      {data.user?.displayName ? (
        <>
          <p className="chat__sender">To: {data.user?.displayName}</p>
          <Messages />
          <Input />
        </>
      ) : (
        <p className="chat__no-sender">No user selected</p>
      )}
    </div>
  );
};

export default Chat;
