import { useContext } from "react";
import ReactDOM from "react-dom";

import Draggable from "react-draggable";
import { ErrorContext } from "../context/ErrorContext";

const Modal = ({ title, modalImage, modalMessage, modalActions }) => {
  const { setError } = useContext(ErrorContext);

  const handleErrorCancel = () => {
    setError(false);
  };

  modalActions ||= [{ label: "Ok", handler: handleErrorCancel }];

  return ReactDOM.createPortal(
    <>
      <div className="overlay"></div>
      <Draggable handle=".title-bar" positionOffset={{ x: "-50%", y: "-50%" }}>
        <div className="modal window">
          <div className="title-bar">
            <div className="title-bar-text">
              <h1>{title}</h1>
            </div>
            <div className="title-bar-controls">
              <button aria-label="Close" onClick={modalActions[0].handler} />
            </div>
          </div>
          <div className="window-body modal__content">
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
          </div>
        </div>
      </Draggable>
    </>,
    document.getElementById("modal-root")
  );
};

export default Modal;