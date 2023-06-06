import { Modal } from "react-bootstrap";
import AddDepartmentValidate from "../form/AddDepartmentValidate";

export default function AddDepartmentModal({ show, setShow, setRefresh }) {
  return (
    <Modal
      show={show}
      centered
      onHide={() => {
        setShow(false);
      }}
      size="md"
      backdrop="static"
    >
      <Modal.Header closeButton> Add Department</Modal.Header>
      <Modal.Body>
        <AddDepartmentValidate setShow={setShow} setRefresh={setRefresh} />
      </Modal.Body>
    </Modal>
  );
}
