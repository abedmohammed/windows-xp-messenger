import { useContext, useRef } from "react";
import ReactDOM from "react-dom";

import Draggable from "react-draggable";
import { ErrorContext } from "../context/ErrorContext";
import ErrorModal from "./ErrorModal";
import LoadingModal from "./LoadingModal";

const Modal = ({
  title,
  modalImage,
  modalMessage,
  modalActions,
  modalControls = true,
}) => {
  const { error, setError, loading, success, setSuccess } =
    useContext(ErrorContext);
  const nodeRef = useRef(null);

  const handleCancel = () => {
    setError(false);
    setSuccess(false);
  };

  modalActions ||= [{ label: "Ok", handler: handleCancel }];

  return ReactDOM.createPortal(
    <>
      <div className="overlay"></div>
      <Draggable positionOffset={{ x: "-50%", y: "-50%" }} nodeRef={nodeRef}>
        <div className="modal window" ref={nodeRef}>
          <div className="title-bar">
            <div className="title-bar-text">
              <h1>{title}</h1>
            </div>
            <div className="title-bar-controls">
              {modalControls && (
                <button aria-label="Close" onClick={modalActions[0].handler} />
              )}
            </div>
          </div>
          <div className="window-body modal__content">
            {(error || success) && (
              <ErrorModal
                modalImage={modalImage}
                modalMessage={modalMessage}
                modalActions={modalActions}
              />
            )}
            {loading && (
              <LoadingModal percent={loading.value} message={loading.message} />
            )}
          </div>
        </div>
      </Draggable>
    </>,
    document.getElementById("modal-root")
  );
};

export default Modal;
