import React, { useContext, useReducer } from "react";

import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import Warning from "../assets/images/warning.png";
import { ErrorContext } from "../context/ErrorContext";
import { ChatContext } from "../context/ChatContext";
import { WindowsContext } from "../context/WindowsContext";
import TitleBar from "../components/TitleBar";
import Draggable from "react-draggable";

const initialState = { zFriends: 1, zChat: 0 };

const zReducer = (state, action) => {
  switch (action.type) {
    case "FRIENDS":
      if (state.zFriends >= state.zChat) return state;
      return {
        ...state,
        zFriends: state.zChat + 1,
      };
    case "CHAT":
      if (state.zChat >= state.zFriends) return state;
      return {
        ...state,
        zChat: state.zFriends + 1,
      };
    default:
      return state;
  }
};

const Home = () => {
  const { error, loading } = useContext(ErrorContext);
  const { data, dispatch } = useContext(ChatContext);
  const { setComponents } = useContext(WindowsContext);
  const [zElements, zDispatch] = useReducer(zReducer, initialState);

  const handleCloseChat = () => {
    dispatch({ type: "REMOVE_USER" });
  };

  return (
    <div className="window-container">
      {error && (
        <Modal title="Error" modalMessage={error} modalImage={Warning} />
      )}
      {loading.type === "input" && (
        <Modal modalControls={false} title="Uploading" />
      )}
      <Draggable
        onStart={() => zDispatch({ type: "FRIENDS" })}
        handle=".title-bar"
        positionOffset={{ x: "-50%", y: "-50%" }}
      >
        <div style={{ zIndex: zElements.zFriends }} className="window">
          <TitleBar />
          <div className="window-body">
            <Sidebar />
          </div>
        </div>
      </Draggable>
      {data.user?.uid && (
        <Draggable
          onStart={() => zDispatch({ type: "CHAT" })}
          handle=".title-bar"
          positionOffset={{ x: "-50%", y: "-50%" }}
        >
          <div style={{ zIndex: zElements.zChat }} className="window">
            <TitleBar closeHandler={handleCloseChat} />
            <div className="window-body">
              <Chat />
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default Home;
