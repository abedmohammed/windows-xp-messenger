import React from "react";
import LoadingGif from "../assets/videos/folder-copy.gif";

const LoadingModal = ({ message, percent }) => {
  return (
    <>
      <div className="loading">
        <img className="loading__image" src={LoadingGif} alt="" />
        <p className="loading__message">{message}...</p>
      </div>
      <progress
        className="loading__loader"
        max="100"
        value={percent}
      ></progress>
    </>
  );
};

export default LoadingModal;
