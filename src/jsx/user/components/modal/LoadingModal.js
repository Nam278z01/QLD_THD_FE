import { Modal } from "react-bootstrap";
import Loading from "../../../sharedPage/pages/Loading";
import { useState, useEffect } from "react";

const LoadingModal = ({ show, onHide, timeout }) => {
  const [visible, setVisible] = useState(show);
  const [loadingFailed, setLoadingFailed] = useState(false);

  useEffect(() => {
    setVisible(show);
    setLoadingFailed(false);

    if (timeout) {
      const timer = setTimeout(() => {
        setLoadingFailed(true);
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [show, timeout]);

  useEffect(() => {
    if (loadingFailed) {
      const timer = setTimeout(() => {
        setVisible(false);
        onHide();
      }, 3000);
      // setLoadingFailed(false);
      return () => clearTimeout(timer);
    }
  }, [loadingFailed, onHide]);

  return (
    <Modal show={visible} centered>
      <Modal.Body className="bg-transparent">
        {loadingFailed ? (
          <h5>Loading failed. Please try again later.</h5>
        ) : (
          <Loading />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default LoadingModal;
