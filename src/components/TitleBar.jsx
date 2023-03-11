import React from "react";

const TitleBar = ({ title, onClose }) => {
  return (
    <div className="title-bar">
      <div className="title-bar-text">
        <h1>{title || "Windows XP Messenger"}</h1>
      </div>
      <div className="title-bar-controls">
        {onClose && <button aria-label="Close" onClick={onClose} />}
      </div>
    </div>
  );
};

export default TitleBar;
