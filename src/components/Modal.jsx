import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

const Modal = ({ title, modalImage, modalMessage, modalActions }) => {
  return ReactDOM.createPortal(
    <>
      <div className="overlay"></div>
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
    </>,
    document.getElementById("modal-root")
  );
};

export default Modal;
