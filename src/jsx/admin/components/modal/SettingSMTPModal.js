import { Modal } from "react-bootstrap";
import SettingSMTPCreate from "../form/SettingSMTPCreate";

const SettingSMTPModal = ({ show, setShow, depaDetail, setRefresh }) => {
  return (
    <Modal
      show={show}
      centered
      onHide={() => {
        setShow(false);
      }}
      size="lg"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New BU</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <SettingSMTPCreate
          depaDetail={depaDetail}
          setRefresh={setRefresh}
          setShow={setShow}
        />
      </Modal.Body>
    </Modal>
  );
};

export default SettingSMTPModal;
