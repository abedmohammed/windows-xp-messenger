import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const UserBar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="userbar">
      <div className="user field-row">
        <img src={currentUser.photoURL} alt="" />
        <p>{currentUser.displayName}</p>
        <button onClick={() => signOut(auth)}>logout</button>
      </div>
    </div>
  );
};

export default UserBar;
