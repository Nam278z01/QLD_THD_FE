import { Modal } from "react-bootstrap";
import { createPortal } from "react-dom";
import { FileUploader } from "react-drag-drop-files";
import {
  uploadPointExcelBUL,
  uploadPointExcelPM,
} from "../../../../services/ImportAPI";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";

const ConfirmDeleteLocation = document.getElementById("confirmDelete");

const ImportPointexcelModal = ({
  show,
  setShowModal,
  setRefresh,
  setShowLoading,
}) => {
  const fileTypes = ["xlsx"];
  const { roleID } = useSelector((a) => a.UserSlice);
  const { getTokenFormData } = useContext(GetTokenContext);

  const uploadPoint = (file) => {
    setShowModal(false);
    setShowLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const success = () => {
      setRefresh(new Date());
      setShowLoading(false);
    };

    const fail = () => {
      setShowLoading(false);
    };

    if (roleID === 3) {
      getTokenFormData(
        uploadPointExcelPM,
        "Import success",
        success,
        fail,
        formData
      );
    } else if (roleID === 2) {
      getTokenFormData(
        uploadPointExcelBUL,
        "Import success",
        success,
        fail,
        formData
      );
    }
  };

  const element = (
    <Modal
      show={show}
      centered
      onHide={() => {
        setShowModal(false);
      }}
    >
      <Modal.Header closeButton>Import Request Point</Modal.Header>

      <Modal.Body className="m-0">
        <div>
          <FileUploader
            name="file"
            types={fileTypes}
            handleChange={uploadPoint}
            multiple={false}
            className="drop_area drop_zone w-100 m-0"
          />
        </div>
      </Modal.Body>
    </Modal>
  );

  return createPortal(element, ConfirmDeleteLocation);
};

export default ImportPointexcelModal;
