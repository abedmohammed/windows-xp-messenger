import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="message__info">
        <img
          className="message__profile-pic"
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span className="message__time">
          {timeAgo.format(new Date(message.date.seconds * 1000))}
        </span>
      </div>
      <div className="message__content">
        {message.text && <p className="message__text">{message.text}</p>}
        {message.img && (
          <img className="message__image" src={message.img} alt="" />
        )}
      </div>
      <div className="message__bottom" ref={ref}></div>
    </div>
  );
};

export default Message;
