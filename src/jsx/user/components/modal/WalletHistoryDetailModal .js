import useRefreshToken from "../../../../Hook/useRefreshToken";
import Loading from "../../../sharedPage/pages/Loading";
import { Modal } from "react-bootstrap";
import { getDetailWalletHistory } from "../../../../services/WalletAPI";
import moment from "moment";
import { useSelector } from "react-redux";
export default function WalletDetailModal({ show, setShow, walletID }) {
  const [data] = useRefreshToken(getDetailWalletHistory, walletID);
  const { userID } = useSelector((a) => a.UserSlice);
  const { CoinName } = useSelector((a) => a.DepartmentSettingSlice);
  return data === null ? (
    <Loading />
  ) : (
    <Modal
      show={show}
      centered
      size="lg"
      onHide={() => {
        setShow(false);
      }}
    >
      <Modal.Header closeButton>
        <p className="text-center fst-normal m-0" style={{ fontSize: "25px" }}>
          About your transfer
        </p>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center " style={{ fontSize: "20px" }}>
          {data.TransactionMethod === 3 || data.TransactionMethod === null ? (
            <>
              <span> Received from </span>
              <span className="fw-bold">System</span>
            </>
          ) : (
            <>
              {data.Sender.ID !== userID ? "Received from " : "Send to "}
              <span className="fw-bold">
                {data.Receiver.ID !== userID
                  ? data.Receiver.Account
                  : data.Sender.Account}
              </span>
            </>
          )}
        </div>
        <h3 className="text-center">
          {data.TransactionMethod === 3 || data.TransactionMethod === null ? (
            <span className="fw-bold">{data.CoinNumber * 1}</span>
          ) : (
            <>
              <span
                className={
                  data.Sender.ID !== userID ? "text-success" : "text-danger"
                }
              >
                {data.Sender.ID !== userID
                  ? "+" + data.CoinNumber * 1
                  : "-" + data.CoinNumber * 1}
              </span>{" "}
              <span className="text-warning">{CoinName}</span>
            </>
          )}
        </h3>

        <div>
          <div className="row">
            <div className="col-3 ps-5 ">
              <p>Status:</p>
              <p>Date:</p>
              <p>Transaction Type:</p>
              <p>Message:</p>
            </div>
            <div className="col-9 text-start pe-5">
              <p
                className="  ps-2 text-success border rounded-3 "
                style={{
                  width: "18%",
                  height: "auto",
                  backgroundColor: "#D1FAED",
                }}
              >
                Success{" "}
                <i
                  className="bi bi-check-circle"
                  style={{ fontSize: "15px", color: "#007805" }}
                ></i>
              </p>
              <p>{moment(data.CreatedDate).format("DD/MM/YYYY-HH:mm")}</p>

              <p>
                {data.TransactionMethod === 1
                  ? "Transfer Money"
                  : data.TransactionMethod === 2
                  ? "Shop Purchase"
                  : "Receive From System"}
              </p>
              <p className={data.Message ? "" : "fw-light"}>
                {data.Message ? data.Message : "No Message"}
              </p>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
