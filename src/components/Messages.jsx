import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState();
  const [messageStatus, setMessageStatus] = useState();
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSubChats = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    const unSubUsers = onSnapshot(
      doc(db, "userChats", currentUser.uid),
      (document) => {
        setMessageStatus(document.data()[data.chatId].read);
        if (document.data()[data.chatId].lastMessage?.sender !== "you") {
          updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".read"]: true,
          });

          updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".read"]: true,
          });
        }
      }
    );

    return () => {
      unSubChats();
      unSubUsers();
    };
  }, [data.chatId, currentUser.uid, data.user.uid]);

  return (
    <>
      <div className="messages">
        {messages?.map((m) => {
          if (m === messages.at(-1)) {
            return (
              <Message
                message={m}
                key={m.id}
                messageStatus={messageStatus}
                lastMessage={true}
              />
            );
          }
          return <Message message={m} key={m.id} />;
        })}
      </div>
    </>
  );
};

export default Messages;
