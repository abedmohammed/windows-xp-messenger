import React from "react";

const TitleBar = ({ title, closeHandler }) => {
  return (
    <div className="title-bar">
      <div className="title-bar-text">
        <h1>{title || "Windows XP Messenger"}</h1>
      </div>
      <div className="title-bar-controls">
        {closeHandler && <button aria-label="Close" onClick={closeHandler} />}
      </div>
    </div>
  );
};

export default TitleBar;
