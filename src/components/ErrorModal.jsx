import React from "react";

const ErrorModal = ({ modalImage, modalMessage, modalActions }) => {
  return (
    <>
      <div className="modal__info">
        <img className="modal__image" src={modalImage} alt="" />
        <span className="modal__message">{modalMessage}</span>
      </div>
      <div className="modal__actions">
        {modalActions.map((action) => (
          <button key={action.label} onClick={action.handler}>
            {action.label}
          </button>
        ))}
      </div>
    </>
  );
};

export default ErrorModal;
