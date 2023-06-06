import { Modal } from "react-bootstrap";
import { createPortal } from "react-dom";
import { FileUploader } from "react-drag-drop-files";
import { uploadRuleExcel } from "../../../../services/RuleAPI";
import { useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";

const ConfirmDeleteLocation = document.getElementById("confirmDelete");

const AddTemplateRuleModal = ({ show, setShow, setRefresh }) => {
  // const fileTypes = ["xlsx", "xls"];
  // const { getTokenFormData } = useContext(GetTokenContext);

  // const uploadRule = (file) => {
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   setShowModal(false);
  //   setShowModalLoading(true);

  //   const sucess = () => {
  //     setRefresh(new Date());
  //     setShowModalLoading(false);
  //   };

  //   const fail = () => {
  //     setShowModalLoading(false);
  //   };

  //   getTokenFormData(uploadRuleExcel, "Import success", sucess, fail, formData);
  // };

  const element = (
    <Modal
      show={show}
      setShow={setShow}
      title="Add Default Head"
      centered
      onHide={() => {
        setShow(false);
      }}
      backdrop="static"
    >
      <Modal.Header closeButton> Add Head </Modal.Header>

      <Modal.Body>
        <table className="table mb-0">
          <thead>
            <tr>
              <th scope="col">Rule</th>
              <th scope="col">Point of Rule</th>
              <th scope="col">Times</th>
            </tr>
          </thead>
          <tbody style={{ color: "black" }}>
            <tr className="align-middle">
              <th>
                <span className="ms-2">
                  <input style={{ width: "100%" }} type="text"></input>
                </span>
              </th>
              <td className="align-middle">
                <input style={{ width: "100%" }} type="number"></input>
              </td>
              <td className="align-middle">
                <input style={{ width: "100%" }} type="number"></input>
              </td>
            </tr>
          </tbody>
        </table>
        <table className="table mb-0">
          <thead>
            <tr>
              <th scope="col">Rule Condition</th>
            </tr>
          </thead>
          <tbody style={{ color: "black" }}>
            <tr className="fw-normal">
              <th>
                <span className="ms-2">
                  <input style={{ width: "50%" }} type="text"></input>
                </span>
              </th>
            </tr>
          </tbody>
        </table>
        <table className="table mb-0">
          <thead>
            <tr>
              <th scope="col">Rule Calculation Formula</th>
            </tr>
          </thead>
          <tbody style={{ color: "black" }}>
            <tr className="fw-normal">
              <th>
                <span className="ms-2">
                  <input style={{ width: "50%" }} type="text"></input>
                </span>
              </th>
            </tr>
          </tbody>
        </table>
      </Modal.Body>
    </Modal>
  );

  return createPortal(element, ConfirmDeleteLocation);
};

export default AddTemplateRuleModal;
