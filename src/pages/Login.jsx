import React from "react";

import Add from "../assets/images/addAvatar.png";

const Login = () => {
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Windows XP Messenger</span>
        <span className="title">Login</span>
        <form>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />

          <button>Login</button>
        </form>
        <p>You don't have an account? Signup</p>
      </div>
    </div>
  );
};

export default Login;
