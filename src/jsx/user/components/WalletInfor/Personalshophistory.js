import { useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../../../sharedPage/pages/Loading";
import moment from "moment";
import ShopHistoryDetailModal from "../modal/ShopHistoryDetailModal";
import { Link } from "react-router-dom";

const Personalshophistory = ({ data }) => {
  const { userID, account } = useSelector((state) => state.UserSlice);
  const [Show1, setShow1] = useState(false);
  const [ShopID, setShopID] = useState(null);
  const { CoinName } = useSelector((a) => a.DepartmentSettingSlice);
  const goToDetail = (id) => {
    setShopID(id);
    setShow1(true);
  };
  return data === null ? (
    <Loading />
  ) : (
    <>
      {ShopID && (
        <ShopHistoryDetailModal
          show={Show1}
          setShow={setShow1}
          ShopID={ShopID}
        />
      )}

      <div
        className="overflow-hidden overflow-x rounded-lg border border-gray-200 rounded-1"
        style={{ height: "430px" }}
      >
        <div className="w-100 mx-auto mousePointer">
          <div
            className=" pe-3 row   text-center m-auto"
            style={{
              width: "100%",
              height: "auto",
            }}
          >
            <div
              className=" text-center mt-2 mb-1 ps-0"
              style={{ width: "35%" }}
            >
              Transfer
            </div>
            <div className=" fw-normal mt-2 mb-1 " style={{ width: "20%" }}>
              Date
            </div>
            <div className="mt-2 text-end mb-1 " style={{ width: "12%" }}>
              Number
            </div>
            <div className="mt-2 text-center mb-1 " style={{ width: "18%" }}>
              Type
            </div>
            <div
              className=" mt-2 mb-1 pe-0"
              style={{
                width: "13%",
              }}
            >
              Status
            </div>
          </div>
          <hr className="m-0" style={{ width: "100%" }}></hr>
          {data.ShopData.length > 0 ? (
            data.ShopData.map((d, index) => (
              <div
                className="bg-light py-4 pe-3 row  m-0 mb-3 border-bottom border-top text-center"
                style={{ width: "100%", height: "auto" }}
                key={index}
              >
                <div
                  className=" text-start mt-2 ps-5"
                  style={{ width: "35%" }}
                  onClick={() => {
                    goToDetail(d.ID);
                  }}
                >
                  {d.UserMasterBuy === userID ? (
                    <>
                      {" "}
                      Buy
                      <>
                        {" "}
                        <span className="fw-bold">{d.Product.Name}</span>
                      </>
                    </>
                  ) : (
                    <>
                      {" "}
                      Received from
                      <>
                        {" "}
                        <span className="fw-bold">{d.Product.Name}</span>
                      </>
                    </>
                  )}
                </div>

                <div
                  className=" fw-normal mt-2"
                  style={{ width: "20%" }}
                  onClick={() => {
                    goToDetail(d.ID);
                  }}
                >
                  {moment(d.CreatedDate).format("HH:mm")}{" "}
                  {moment(d.CreatedDate).format("DD/MM/YYYY")}
                </div>

                <div
                  className="mt-2 "
                  style={{ width: "12%" }}
                  onClick={() => {
                    goToDetail(d.ID);
                  }}
                >
                  <span
                    className={
                      d.UserMasterBuy === userID
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    {" "}
                    {d.UserMasterBuy === userID
                      ? "-" + d.TotalCoin * 1
                      : "+" + d.TotalCoin * 1}
                  </span>
                </div>

                <div
                  className="mt-2 "
                  style={{ width: "18%" }}
                  onClick={() => {
                    goToDetail(d.ID);
                  }}
                >
                  <i
                    className="fas fa-coins"
                    style={{ fontSize: "15px", color: "#FFA400" }}
                  >
                    {" "}
                    {CoinName}{" "}
                  </i>
                </div>
                <div
                  className=" m-auto text-success border rounded-3 p-auto"
                  style={{
                    width: "13%",
                    height: "auto",
                    backgroundColor: "#D1FAED",
                  }}
                  onClick={() => {
                    goToDetail(d.ID);
                  }}
                >
                  Success{" "}
                  <i
                    className="bi bi-check-circle"
                    style={{ fontSize: "15px", color: "#007805" }}
                  ></i>
                </div>
              </div>
            ))
          ) : (
            <p>No data</p>
          )}
        </div>
      </div>
      {data.ShopData.length > 4 && (
        <div className="text-center mt-2">
          <Link
            className=" text-success text-center m-2 fs-5 "
            to={`/shop/shop-history/${account}`}
          >
            <span className="text-success">All History</span>
          </Link>
        </div>
      )}
    </>
  );
};

export default Personalshophistory;
