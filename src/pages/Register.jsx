import React from "react";

import Add from "../assets/images/addAvatar.png";

const Register = () => {
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Windows XP Messengar</span>
        <span className="title">Register</span>
        <form>
          <input type="text" placeholder="display name" />
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add profile picture</span>
          </label>
          <button>Sign Up</button>
        </form>
        <p>You already have an account? Login</p>
      </div>
    </div>
  );
};

export default Register;
