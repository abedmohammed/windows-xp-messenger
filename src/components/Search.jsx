import React, { useContext, useState } from "react";
import {
  getDoc,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import useQuerydb from "../hooks/use-querydb";
import { ErrorContext } from "../context/ErrorContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const { setError } = useContext(ErrorContext);

  const { performQuery } = useQuerydb();

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    let foundUser = false;
    try {
      await performQuery({
        dbCollection: "users",
        dbField: "displayNameLower",
        dbOperator: "==",
        dbMatch: username.toLowerCase(),
        handleQuery: (doc) => {
          setUser(doc.data());
          foundUser = true;

          if (doc.data().uid === currentUser.uid) {
            foundUser = "you";
          }
        },
      });
      if (foundUser === "you") {
        setUser(null);
        setUsername("");
        throw new Error(
          "You cannot add yourself! Please enter a valid username."
        );
      }

      if (!foundUser) {
        setUser(null);
        setUsername("");
        throw new Error("No user found! Please enter a valid username.");
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async (u) => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const resChat = await getDoc(doc(db, "chats", combinedId));
      if (resChat.exists()) {
        throw new Error(`You are already friends with ${user.displayName}!`);
      }

      const resYou = await getDoc(doc(db, "friendRequests", currentUser.uid));
      if (resYou.exists() && resYou?.data()[user.uid]?.status === "requested") {
        await updateDoc(doc(db, "friendRequests", currentUser.uid), {
          [user.uid]: {
            status: "accepted",
          },
        });

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
      } else {
        const res = await getDoc(doc(db, "friendRequests", user.uid));

        if (!res.exists()) {
          await setDoc(doc(db, "friendRequests", user.uid), {
            [currentUser.uid]: {
              status: "requested",
            },
          });
        } else {
          if (!res.data()[currentUser.uid]) {
            await updateDoc(doc(db, "friendRequests", user.uid), {
              [currentUser.uid]: {
                status: "requested",
              },
            });
          } else {
            const requestStatus = res.data()[currentUser.uid].status;
            if (requestStatus === "requested" || requestStatus === "rejected") {
              throw new Error(
                `You already have a pending friend request for ${user.displayName}.`
              );
            }
          }
        }
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }

    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="search__form">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className="search__input"
        />
      </div>
      {user && (
        <div className="search__result" onClick={() => handleSelect(user)}>
          <img src={user.photoURL} alt="" />
          <div className="search__user">
            <p className="search__name">{user.displayName}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
