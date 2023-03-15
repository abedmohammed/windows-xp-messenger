import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import TitleBar from "./TitleBar";
import { WindowsContext } from "../context/WindowsContext";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const { setComponents, getMaxZ } = useContext(WindowsContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const handleCloseChat = (imageName, num) => {
    setComponents((prevComponents) => {
      return prevComponents.filter(
        (component) => component.name !== `window-image-${imageName}-${num}`
      );
    });
  };

  const imageOpenHandler = (image) => {
    setComponents((prevComponents) => {
      return [
        ...prevComponents,
        {
          name: `window-image-${image}-${prevComponents.length}`,
          zIndex: getMaxZ() + 1,
          jsx: (
            <div className="window-full-image window">
              <TitleBar
                onClose={() => handleCloseChat(image, prevComponents.length)}
              />
              <div className="window-body">
                <img src={image} alt="" />
              </div>
            </div>
          ),
        },
      ];
    });
  };

  return (
    <div
      className={`message ${
        message.senderId === currentUser.uid
          ? "message--owner"
          : "message--sender"
      }`}
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
