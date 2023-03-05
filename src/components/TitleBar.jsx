import React from "react";

const TitleBar = ({ title }) => {
  return (
    <div className="title-bar">
      <div className="title-bar-text">{title || "Windows XP Messenger"}</div>
      <div className="title-bar-controls">
        <button aria-label="Minimize" />
        <button aria-label="Maximize" />
        <button aria-label="Close" />
      </div>
    </div>
  );
};

export default TitleBar;
