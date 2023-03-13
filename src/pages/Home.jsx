import React, { useContext, useEffect } from "react";

import Chat from "../components/Chat";
import Modal from "../components/Modal";
import Warning from "../assets/images/warning.png";
import { ErrorContext } from "../context/ErrorContext";
import { ChatContext } from "../context/ChatContext";
import { WindowsContext } from "../context/WindowsContext";
import TitleBar from "../components/TitleBar";
import Draggable from "react-draggable";

const Home = () => {
  const { error, loading } = useContext(ErrorContext);
  const { data, dispatch } = useContext(ChatContext);
  const { components, setComponents, getMaxZ, maxZ } =
    useContext(WindowsContext);

  useEffect(() => {
    const handleCloseChat = () => {
      dispatch({ type: "REMOVE_USER" });
    };

    setComponents((prevComponents) => {
      // No user
      if (!data.user?.uid) {
        return prevComponents.filter(
          (component) => component.name !== "window-chat"
        );
      }

      // Chatbox already exists
      let exists = false;
      prevComponents.forEach((comp) => {
        if (comp.name === "window-chat") {
          exists = true;
        }
      });

      if (exists) return prevComponents;

      // Chatbox doesnt exist but user does
      if (data.user?.uid) {
        return [
          ...prevComponents,
          {
            name: "window-chat",
            zIndex: 0,
            jsx: (
              <div className="window-chat window">
                <TitleBar onClose={handleCloseChat} />
                <div className="window-body">
                  <Chat />
                </div>
              </div>
            ),
          },
        ];
      }
    });
  }, [data.user.uid, setComponents, dispatch]);

  const memoList = React.useMemo(
    () =>
      components.map((component) => {
        return (
          <div key={component.name} style={{ zIndex: component.zIndex }}>
            <Draggable
              onStart={() => {
                component.zIndex = getMaxZ() + 1;
              }}
              handle=".title-bar"
              positionOffset={{ x: "-50%", y: "-50%" }}
            >
              {component.jsx}
            </Draggable>
          </div>
        );
      }),
    [components, maxZ, getMaxZ]
  );

  return (
    <div className="window-container">
      {error && (
        <Modal title="Error" modalMessage={error} modalImage={Warning} />
      )}
      {loading.type === "input" && (
        <Modal modalControls={false} title="Uploading" />
      )}
      {memoList}
    </div>
  );
};

export default Home;
