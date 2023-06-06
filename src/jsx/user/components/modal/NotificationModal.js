import { Modal } from "react-bootstrap";

export default function NotificationModal({ show, setShow, setRefresh, message }) {
  return (
    <Modal
      show={show}
      setShow={setShow}
      title={"New Notifications"}
      size="md"
      centered
      onHide={() => {
        setShow(false);
      }}
      // aria-labelledby={"contained-modal-title-vcenter"}
    >
      <Modal.Header closeButton> New Notification </Modal.Header>

      <Modal.Body>
        <span>{message.message}</span>
      </Modal.Body>
    </Modal>
  );
}
