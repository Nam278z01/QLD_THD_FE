import { Modal } from "react-bootstrap";
import NewBuAdd from "../form/NewBuAdd";

export default function AddBULModal({ show, setShow, setRefresh }) {
  return (
    <Modal
      show={show}
      setShow={setShow}
      title="Add Default Head"
      size="md"
      centered
      onHide={() => {
        setShow(false);
      }}
      backdrop="static"
    >
      <Modal.Header closeButton> Add Head </Modal.Header>

      <Modal.Body>
        <NewBuAdd setShow={setShow} setRefresh={setRefresh} />
      </Modal.Body>
    </Modal>
  );
}
