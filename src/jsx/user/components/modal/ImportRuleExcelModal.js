import { Modal } from "react-bootstrap";
import { createPortal } from "react-dom";
import { FileUploader } from "react-drag-drop-files";
import { uploadRuleExcel } from "../../../../services/RuleAPI";
import { useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";

const ConfirmDeleteLocation = document.getElementById("confirmDelete");

const ImportRuleExcelModal = ({
  show,
  setShowModal,
  setRefresh,
  setShowModalLoading,
  setRefresh2,
}) => {
  const fileTypes = ["xlsx", "xls"];
  const { getTokenFormData } = useContext(GetTokenContext);

  const uploadRule = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    setShowModal(false);
    setShowModalLoading(true);

    const sucess = () => {
      setRefresh2(new Date());
      setRefresh(new Date());
      setShowModalLoading(false);
    };

    const fail = () => {
      setShowModalLoading(false);
    };

    getTokenFormData(uploadRuleExcel, "Import success", sucess, fail, formData);
  };

  const element = (
    <Modal
      show={show}
      centered
      onHide={() => {
        setShowModal(false);
      }}
    >
      <Modal.Header closeButton>Import Rule</Modal.Header>

      <Modal.Body>
        <div>
          <FileUploader
            name="file"
            types={fileTypes}
            handleChange={uploadRule}
            multiple={false}
            className="m-0"
          />
        </div>
      </Modal.Body>
    </Modal>
  );

  return createPortal(element, ConfirmDeleteLocation);
};

export default ImportRuleExcelModal;
