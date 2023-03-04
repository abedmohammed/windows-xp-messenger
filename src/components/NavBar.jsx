import React from "react";

const NavBar = () => {
  return (
    <div className="navbar">
      <span className="logo">Windows XP Messenger</span>
      <div className="user">
        <img
          src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt=""
        />
        <span>John Doe</span>
        <button>logout</button>
      </div>
    </div>
  );
};

export default NavBar;
