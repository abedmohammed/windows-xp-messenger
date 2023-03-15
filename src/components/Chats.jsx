import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [sortedChats, setSortedChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = async () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  useEffect(() => {
    setSortedChats((prevState) => {
      let notReady = false;
      Object.entries(chats).forEach((chat) => {
        if (!chat[1].date) notReady = true;
      });

      if (notReady) return prevState;

      return Object.entries(chats)?.sort((a, b) => {
        return b[1].date - a[1].date;
      });
    });
  }, [chats]);

  const handleSelect = async (u) => {
    const combinedId =
      currentUser.uid > u.uid
        ? currentUser.uid + u.uid
        : u.uid + currentUser.uid;

    // Sets current message to true since it was read
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [combinedId + ".read"]: true,
    });

    await updateDoc(doc(db, "userChats", u.uid), {
      [combinedId + ".read"]: true,
    });

    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      {sortedChats.map((chat) => (
        <div
          className="chats__friend"
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <img
            className="chats__profile-pic"
            src={chat[1].userInfo.photoURL}
            alt=""
          />
          <div className="chat-preview">
            <p className="chat-preview__name">{chat[1].userInfo.displayName}</p>
            <p
              className={`chat-preview__latest ${
                chat[1].read === false && chat[1].lastMessage?.sender === "them"
                  ? "unread"
                  : ""
              }`}
            >
              <span>
                {chat[1].lastMessage?.sender === "you" && "you: "}
                {chat[1].lastMessage?.text}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
