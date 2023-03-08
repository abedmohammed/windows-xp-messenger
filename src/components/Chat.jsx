import React, { useContext } from "react";

import Messages from "./Messages";
import Input from "./Input";
import PersonImage from "../assets/images/person.png";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      {data.user?.displayName ? (
        <>
          <div className="sender">
            <img className="sender__icon" src={PersonImage} alt="" />
            <p className="sender__name">To: {data.user?.displayName}</p>
          </div>
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
