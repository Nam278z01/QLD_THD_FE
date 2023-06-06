import { useRef } from "react";
import AvatarEditor from "react-avatar-editor";
import { Modal } from "react-bootstrap";
import { createPortal } from "react-dom";
import { FileUploader } from "react-drag-drop-files";
import { uploadUserAvatar } from "../../../../services/ImportAPI";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";

const ConfirmDeleteLocation = document.getElementById("confirmDelete");

const AvatarEditModal = ({ show, setShow, setRefresh }) => {
  const fileTypes = ["png", "jpg"];
  const userAccount = useSelector((state) => state.UserSlice.account);
  const avatarRef = useRef();
  const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);
  const { getTokenFormData } = useContext(GetTokenContext);

  const uploadAvatar = (file) => {
    if (file == null || file == undefined) {
      document.getElementById("imageSizeAlert").style.display = "block";
    } else {
      const formData = new FormData();
      formData.append("image", file);
      document.getElementById("imageSizeAlert").style.display = "none";
      const success = () => {
        setShow(true);
      };

      getTokenFormData(
        uploadUserAvatar,
        "Avatar had been updated",
        success,
        false,
        formData,
        userAccount
      );
      window.location.reload();
    }
  };

  const element = (
    <Modal
      show={show}
      centered
      onHide={() => {
        setShow(false);
      }}
    >
      <Modal.Header closeButton></Modal.Header>

      <Modal.Body>
        <div>
          {/* <AvatarEditor
          ref={avatarRef}
          image="https://media.istockphoto.com/photos/view-over-hanoi-vietnam-picture-id525833203"
          border={50}
          scale={1}
          rotate={0}
          color={[255, 255, 255, 0.6]} // RGBA
          borderRadius={100}
        /> */}
          <FileUploader
            maxSize={0.2}
            onSizeError={() => {
              uploadAvatar();
            }}
            name="file"
            types={fileTypes}
            handleChange={uploadAvatar}
          />
          <div
            style={{ color: "red", display: "none" }}
            id="imageSizeAlert"
            className="text-center"
          >
            Image must have size smaller than 200kb
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );

  return createPortal(element, ConfirmDeleteLocation);
};

export default AvatarEditModal;
