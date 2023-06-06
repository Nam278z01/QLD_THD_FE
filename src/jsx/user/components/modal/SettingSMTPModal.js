import { Modal } from "react-bootstrap";
import SettingSMTP from "../../pages/SettingSMTP";

const SettingSMTPModal = ({ show, setShow }) => {
  return (
    <Modal
      show={show}
      centered
      onHide={() => {
        setShow(false);
      }}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New BU</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <SettingSMTP />
      </Modal.Body>
    </Modal>
  );
};

export default SettingSMTPModal;
