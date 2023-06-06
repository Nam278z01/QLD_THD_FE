import { Modal } from "react-bootstrap";
import { createPortal } from "react-dom";
import { FileUploader } from "react-drag-drop-files";
import { uploadBadgeExcel } from "../../../../services/ImportAPI";
import { useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";

const ConfirmDeleteLocation = document.getElementById("confirmDelete");

const ImportBadgeExcelModal = ({
  show,
  setShowModal,
  setShowModalLoading,
  setdataHistory,
}) => {
  const fileTypes = ["xlsx", "xls"];

  const { getTokenFormData } = useContext(GetTokenContext);

  const uploadMember = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setShowModal(false);
    setShowModalLoading(true);

    const success = () => {
      setShowModalLoading(false);
      setdataHistory(new Date());
    };

    const fail = () => {
      setShowModalLoading(false);
    };

    getTokenFormData(
      uploadBadgeExcel,
      "Import Badge success",
      success,
      fail,
      formData
    );
  };

  const element = (
    <Modal
      show={show}
      centered
      onHide={() => {
        setShowModal(false);
      }}
    >
      <Modal.Header closeButton>Import Badge</Modal.Header>

      <Modal.Body>
        <div>
          <FileUploader
            name="file"
            types={fileTypes}
            handleChange={uploadMember}
            multiple={false}
            className="m-0"
          />
        </div>
      </Modal.Body>
    </Modal>
  );

  return createPortal(element, ConfirmDeleteLocation);
};

export default ImportBadgeExcelModal;
