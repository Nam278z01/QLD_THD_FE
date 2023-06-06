import { Modal } from "react-bootstrap";

export default function CustomModalUtil({
  show,
  setShow,
  middleExtra,
  title,
  footer,
  children,
  size,
  setNull,
  backdrop,
  className,
}) {
  return (
    <Modal
      show={show}
      centered
      size={size || "xl"}
      onHide={() => {
        setShow(false);

        if (setNull != undefined && setNull != false) {
          setNull(null);
        }
      }}
      backdrop={backdrop}
    >
      <Modal.Header closeButton>
        <div className="d-flex row align-items-center gap-2 w-100 m-0 user-select-none">
          <div className="col-10">
            <h5
              className="m-0 "
              style={{ width: "30vw", wordWrap: "break-word" }}
            >
              {title}
            </h5>
          </div>
          <div className="col-1"> {middleExtra && middleExtra}</div>
        </div>
      </Modal.Header>

      <Modal.Body className={className}>{children}</Modal.Body>
      {footer && <Modal.Footer>{footer}</Modal.Footer>}
    </Modal>
  );
}
