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

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { performQuery } = useQuerydb();

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    try {
      await performQuery({
        dbCollection: "users",
        dbField: "displayName",
        dbOperator: "==",
        dbMatch: username,
        handleQuery: (doc) => {
          setUser(doc.data());
        },
      });
    } catch (err) {
      console.error(err);
      setErr(err);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async (u) => {
    // Check if the group chat exists in firestore
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
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
      }
    } catch (err) {
      setErr(err);
      console.error(err);
    }

    dispatch({ type: "CHANGE_USER", payload: u });

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
      {err && <span>Something went wrong!</span>}
      {user && (
        <div
          className="search__result field-row"
          onClick={() => handleSelect(user)}
        >
          <img src={user.photoURL} alt="" />
          <div className="search__user">
            <p>{user.displayName}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
