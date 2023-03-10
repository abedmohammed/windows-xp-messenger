import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const [imgLoaded, setImgLoaded] = useState(message.img || false);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    if (!imgLoaded) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (imgLoaded === "loaded") {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [message, imgLoaded]);

  return (
    <div
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="message__row">
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
        </div>
        <div className="message__content">
          {message.text && <p className="message__text">{message.text}</p>}
          {message.img && (
            <img
              onLoad={() => setImgLoaded("loaded")}
              className="message__image"
              src={message.img}
              alt=""
            />
          )}
        </div>
      </div>
      <p className="message__time">
        {timeAgo.format(new Date(message.date.seconds * 1000))}
      </p>
      <div className="message__bottom" ref={ref}></div>
    </div>
  );
};

export default Message;
