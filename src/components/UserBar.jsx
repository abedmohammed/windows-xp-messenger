import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const UserBar = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const logoutUser = () => {
    signOut(auth);
    dispatch({ type: "LOGOUT_USER" });
  };

  return (
    <div className="userbar">
      <div className="user">
        <img className="user__profile-pic" src={currentUser.photoURL} alt="" />
        <div className="user__details">
          <p className="user__name">{currentUser.displayName}</p>
          <p className="user__email">{`<${currentUser.email}>`}</p>
          <button className="user__logout" onClick={logoutUser}>
            logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserBar;
