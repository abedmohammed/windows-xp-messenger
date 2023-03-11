import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Draggable from "react-draggable";
import TitleBar from "./TitleBar";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const [openImage, setOpenImage] = useState();
  const { data } = useContext(ChatContext);

  const ref = useRef();
  const nodeRef = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const imageOpenHandler = (image) => {
    setOpenImage(image);
  };

  return (
    <div
      className={`message ${
        message.senderId === currentUser.uid ? "owner" : ""
      }`}
    >
      {openImage && (
        <Draggable
          handle=".title-bar"
          positionOffset={{ x: "-50%", y: "-50%" }}
          nodeRef={nodeRef}
        >
          <div className="expanded-img window">
            <TitleBar />
            <div className="login window-body">
              <img src={openImage} alt="" />
            </div>
          </div>
        </Draggable>
      )}
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
              onClick={() => imageOpenHandler(message.img)}
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
