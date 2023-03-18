import React from "react";

const Requests = ({ friends, onClick }) => {
  return (
    <div onClick={onClick} className="requests">
      <p>
        You have <span>{friends}</span> new friend request
        {friends > 1 ? "s" : ""}!
      </p>
    </div>
  );
};

export default Requests;
