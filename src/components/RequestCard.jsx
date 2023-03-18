import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { ErrorContext } from "../context/ErrorContext";
import { db } from "../firebase";

const RequestCard = ({ friendUID }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { setError } = useContext(ErrorContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    getDoc(doc(db, "users", friendUID)).then((res) => setUser(res.data()));
  }, [friendUID]);

  const handleFriendRequest = async (action) => {
    try {
      if (action === "decline") {
        await updateDoc(doc(db, "friendRequests", currentUser.uid), {
          [user.uid]: {
            status: "rejected",
          },
        });
        setUser(null);
      }

      if (action === "accept") {
        await updateDoc(doc(db, "friendRequests", currentUser.uid), {
          [user.uid]: {
            status: "accepted",
          },
        });
        setUser(null);

        const combinedId =
          currentUser.uid > user.uid
            ? currentUser.uid + user.uid
            : user.uid + currentUser.uid;

        // Create a chat in the chats collections between the two users
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        // Create user chat
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        dispatch({ type: "CHANGE_USER", payload: user });
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <>
      {user ? (
        <>
          <div className="request__friend">
            <img className="request__profile-pic" src={user?.photoURL} alt="" />
            <div className="request-preview">
              <p className="request-preview__name">{user?.displayName}</p>
              <div className="request-preview__options">
                <button onClick={() => handleFriendRequest("accept")}>
                  Accept
                </button>
                <button onClick={() => handleFriendRequest("decline")}>
                  Decline
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default RequestCard;
