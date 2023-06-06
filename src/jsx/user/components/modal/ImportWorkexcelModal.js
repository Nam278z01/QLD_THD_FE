import { Modal } from "react-bootstrap";
import { createPortal } from "react-dom";
import { FileUploader } from "react-drag-drop-files";
import {
  uploadMemberExcel,
  uploadWorkingExcel,
} from "../../../../services/ImportAPI";
import { useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useState } from "react";

const ConfirmDeleteLocation = document.getElementById("confirmDelete");

const ImportWorkexcelModal = ({
  show,
  setShowModal,
  setRefresh,
  setShowModalLoading,
  setAllMember,
  DepartmentID,
  setShow,
}) => {
  const fileTypes = ["xlsx", "xls"];
  const [fileselect, setFile] = useState();

  const { getTokenFormData } = useContext(GetTokenContext);
  const uploadPoint = (file) => {
    setFile(file);
  };
  const uploadMember = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("DepartmentID", DepartmentID);
    setShowModal(false);
    setShowModalLoading(true);

    const success = () => {
      setAllMember(new Date());
      setRefresh(new Date());
      setShowModalLoading(false);
    };

    const fail = () => {
      setShowModalLoading(false);
    };

    getTokenFormData(
      uploadWorkingExcel,
      "Import working time success",
      success,
      fail,
      formData
    );
  };
  function off() {
    setShowModal(false);
    setShow(true);
  }
  const element = (
    <Modal
      show={show}
      centered
      onHide={() => {
        // setShowModal(false);
      }}
    >
      <Modal.Header>
        <h6 className="m-0 fw-bold fs-5 text-primary"> Import Working Time</h6>
        <div>
          <button className="btn btn-outline-secondary" onClick={off}>
            <i className="fas fa-x" />
          </button>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div>
          <FileUploader
            name="file"
            types={fileTypes}
            handleChange={uploadPoint}
            multiple={false}
            className="m-0"
          />
          <div className="text-center mt-3">
            <button
              type="submit"
              id="submitButton"
              className="btn btn-primary"
              onClick={(e) => {
                uploadMember(fileselect);
              }}
              disabled={fileselect ? false : true}
            >
              Award
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );

  return createPortal(element, ConfirmDeleteLocation);
};

export default ImportWorkexcelModal;
