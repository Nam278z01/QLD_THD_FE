import useRefreshToken from "../../../../Hook/useRefreshToken";
import Loading from "../../../sharedPage/pages/Loading";
import { Modal } from "react-bootstrap";
import { getDetailShopHistory } from "../../../../services/ShopAPI";
import moment from "moment";
import { useSelector } from "react-redux";
export default function ShopHistoryDetailModal({ show, setShow, ShopID }) {
  const [data] = useRefreshToken(getDetailShopHistory, ShopID);
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
          <>
            {data.UserMasterBuy === userID ? (
              <>
                {" "}
                Buy
                <>
                  {" "}
                  <span className="fw-bold">{data.Product.Name}</span>
                </>
              </>
            ) : (
              <>
                {" "}
                Received from
                <>
                  {" "}
                  <span className="fw-bold">{data.Product.Name}</span>
                </>
              </>
            )}
          </>
        </div>
        <h3 className="text-center">
          <>
            <span
              className={
                data.UserMasterBuy === userID ? "text-danger" : "text-success"
              }
            >
              {" "}
              {data.UserMasterBuy === userID
                ? "-" + data.TotalCoin * 1
                : "+" + data.TotalCoin * 1}{" "}
            </span>
            <span className="text-warning">{CoinName}</span>
          </>
        </h3>

        <div>
          <div className="row">
            <div className="col-3 ps-5 ">
              <p>Status:</p>
              <p>Date:</p>
              <p>Transaction Type:</p>
              <p>Message:</p>
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

              <p>Shop Purchase</p>
              <p>
                {" "}
                <>
                  {data.UserMasterBuy === userID ? (
                    <>
                      {" "}
                      Buy
                      <>
                        {" "}
                        <span className="fw-bold">{data.Product.Name} </span>
                      </>
                      From {data.saler.Account}
                    </>
                  ) : (
                    <>
                      {" "}
                      Received from {data.buyer.Account} by selling
                      <>
                        {" "}
                        <span className="fw-bold">{data.Product.Name}</span>
                      </>
                    </>
                  )}
                </>
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
