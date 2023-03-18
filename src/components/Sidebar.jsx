import React, { useCallback, useContext, useEffect, useState } from "react";

import UserBar from "./UserBar";
import Search from "./Search";
import Chats from "./Chats";
import Requests from "./Requests";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import TitleBar from "./TitleBar";
import { WindowsContext } from "../context/WindowsContext";
import RequestCard from "./RequestCard";

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const [friends, setFriends] = useState({});
  const [friendsLength, setFriendsLength] = useState();
  const { setComponents, getMaxZ } = useContext(WindowsContext);

  useEffect(() => {
    const getFriendRequests = async () => {
      const unsub = onSnapshot(
        doc(db, "friendRequests", currentUser.uid),
        (doc) => {
          setFriends(doc.data());
        }
      );

      return () => {
        unsub();
      };
    };

    currentUser.uid && getFriendRequests();
  }, [currentUser.uid]);

  const handleClose = useCallback(() => {
    setComponents((prevComponents) => {
      return prevComponents.filter(
        (component) => component.name !== `window-friend-requests`
      );
    });
  }, [setComponents]);

  useEffect(() => {
    if (friends) {
      const numOfRequests = Object.entries(friends).filter(
        (friend) => friend[1].status === "requested"
      ).length;

      setFriendsLength(numOfRequests);

      if (numOfRequests <= 0) {
        handleClose();
      }
    }
  }, [friends, handleClose]);

  const handleRequestClicked = () => {
    setComponents((prevComponents) => {
      return [
        ...prevComponents,
        {
          name: `window-friend-requests`,
          zIndex: getMaxZ() + 1,
          jsx: (
            <div className="window-requests window">
              <TitleBar onClose={() => handleClose()} />
              <div className="window-body request">
                {Object.entries(friends).map((friend) => {
                  if (friend[1].status === "requested") {
                    return (
                      <RequestCard key={friend[0]} friendUID={friend[0]} />
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          ),
        },
      ];
    });
  };

  return (
    <div className="sidebar">
      <Search />
      {friends && friendsLength > 0 && (
        <Requests onClick={handleRequestClicked} friends={friendsLength} />
      )}

      <Chats />
      <UserBar />
    </div>
  );
};

export default Sidebar;
