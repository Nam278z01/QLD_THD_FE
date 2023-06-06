import { Modal } from "react-bootstrap";
import { createPortal } from "react-dom";
import { FileUploader } from "react-drag-drop-files";
import { useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { uploadMemberProject } from "../../../../services/ImportAPI";

const ConfirmDeleteLocation = document.getElementById("confirmDelete");

const ImportProjectMember = ({
  show,
  setShowModal,
  setRefresh,
  setShowModalLoading,
}) => {
  const fileTypes = ["xlsx", "xls"];

  const { getTokenFormData } = useContext(GetTokenContext);

  const uploadMember = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    setShowModal(false);
    setShowModalLoading(true);

    const success = () => {
      setRefresh(new Date());
      setShowModalLoading(false);
    };

    const fail = () => {
      setShowModalLoading(false);
    };

    getTokenFormData(
      uploadMemberProject,
      "Import Member success",
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
      {" "}
      <Modal.Header closeButton>Import Project Member</Modal.Header>
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

export default ImportProjectMember;
