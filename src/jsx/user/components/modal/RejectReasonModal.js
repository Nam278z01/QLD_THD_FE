import { useRef } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { createPortal } from "react-dom";
const ConfirmDeleteLocation = document.getElementById("confirmDelete");

const RejectReasonModal = ({ show, setShow, requestID, reject }) => {
  const reasonRef = useRef();
  const element = (
    <Modal
      show={show}
      centered
      onHide={() => {
        setShow(false);
      }}
    >
      <ModalHeader closeButton></ModalHeader>

      <Card className="m-0">
        <Card.Header>
          <h5 className="m-0">Reason For Reject</h5>
        </Card.Header>
        <Card.Body>
          <textarea
            className="form-control m-0"
            rows="4"
            placeholder="Reason"
            ref={reasonRef}
          />
        </Card.Body>
        <Card.Footer className="d-flex gap-2 justify-content-end">
          <Button
            onClick={() => {
              reject(requestID, reasonRef.current.value);
              setShow(false);
            }}
          >
            Reject
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShow(false);
            }}
          >
            Cancel
          </Button>
        </Card.Footer>
      </Card>
    </Modal>
  );

  return createPortal(element, ConfirmDeleteLocation);
};

export default RejectReasonModal;
