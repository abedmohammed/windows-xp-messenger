import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const UserBar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="userbar">
      <div className="user">
        <img className="user__profile-pic" src={currentUser.photoURL} alt="" />
        <div className="user__details">
          <p className="user__name">{currentUser.displayName}</p>
          <p className="user__email">{`<${currentUser.email}>`}</p>
          <button className="user__logout" onClick={() => signOut(auth)}>
            logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserBar;
