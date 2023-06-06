import { useState } from "react";
import { useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import WalletDetailModal from "../../components/modal/WalletHistoryDetailModal ";
import moment from "moment";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getAllWalletHistory } from "../../../../services/WalletAPI";
import Loading from "../../../sharedPage/pages/Loading";
import CustomPagination from "../../components/Shared/CustomPagination";
import useReplaceURL from "../../../../Hook/useReplaceURL";
import { getWallet } from "../../../../services/WalletAPI";
import useQuery from "../../../../Hook/useQuery";
const WalletHistory = () => {
  const query = useQuery();

  const pageQuery = query.get("page") || 1;
  const rowQuery = query.get("row") || 10;
  function pageChange(page) {
    URLchange(page, rowQuery);
  }
  function rowChange(row) {
    URLchange(1, row);
  }
  const [Show, setShow] = useState(false);
  const { userID, account } = useSelector((a) => a.UserSlice);
  const [walletID, setwalletID] = useState(null);

  const { CoinName } = useSelector((a) => a.DepartmentSettingSlice);

  const { URLchange } = useReplaceURL(`/wallet/wallet-history/${account}`);
  const goToDetail = (id) => {
    setwalletID(id);
    setShow(true);
  };

  let [datapage] = useRefreshToken(getWallet, userID, pageQuery, rowQuery);
  return datapage === null ? (
    <Loading />
  ) : (
    <>
      <h2 className="text-center">Your All History Transactions</h2>
      <div
        style={{ width: "60%" }}
        className="container  justify-content-center"
      >
        {walletID && (
          <WalletDetailModal
            show={Show}
            setShow={setShow}
            walletID={walletID}
          />
        )}
        <div className="row">
          <div className="col-12  rounded-lg border border-gray-200 rounded-1 w-100 p-0 ">
            <div className="w-100 mx-auto mousePointer">
              <div
                className=" pe-3 row   text-center m-auto "
                style={{
                  width: "100%",
                  height: "auto",
                }}
              >
                <div className=" mt-2 ps-0" style={{ width: "10%" }}></div>
                <div className=" text-start mt-2 mb-1" style={{ width: "25%" }}>
                  Transaction
                </div>
                <div className=" fw-normal mt-2 mb-1" style={{ width: "20%" }}>
                  Date
                </div>
                <div className="mt-2 text-center mb-1" style={{ width: "11%" }}>
                  Number
                </div>
                <div className="mt-2 text-center mb-1" style={{ width: "19%" }}>
                  Type
                </div>
                <div
                  className=" mt-2  pe-0 mb-1"
                  style={{
                    width: "10%",
                  }}
                >
                  Status
                </div>
              </div>
              <hr className="m-0" style={{ width: "100%" }}></hr>
              {datapage.walletData.length > 0 ? (
                datapage.walletData.map((d, index) => (
                  <div
                    className="bg-light py-4 pe-3 row  m-0 mb-3 border-bottom border-top text-center"
                    style={{ width: "100%", height: "auto" }}
                    key={index}
                  >
                    <div
                      className=" mt-2 ps-0"
                      style={{ width: "10%" }}
                      onClick={() => {
                        goToDetail(d.ID);
                      }}
                    >
                      #{index + 1}
                    </div>
                    {d.TransactionMethod === 3 ||
                    d.TransactionMethod === null ? (
                      <div
                        className=" text-start mt-2 ps-0"
                        style={{ width: "25%" }}
                        onClick={() => {
                          goToDetail(d.ID);
                        }}
                      >
                        <span> Received from </span>{" "}
                        <span className="fw-bold">Mission</span>
                      </div>
                    ) : (
                      <div
                        className=" text-start mt-2 ps-0"
                        style={{ width: "25%" }}
                        onClick={() => {
                          goToDetail(d.ID);
                        }}
                      >
                        {d.Sender.ID !== userID ? "Received from " : "Send to "}
                        <span className="fw-bold">
                          {d.Receiver.ID !== userID
                            ? d.Receiver.Account
                            : d.Sender.Account}
                        </span>
                      </div>
                    )}
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
                    {d.TransactionMethod === 3 ||
                    d.TransactionMethod === null ? (
                      <div
                        className="mt-2 "
                        style={{ width: "12%" }}
                        onClick={() => {
                          goToDetail(d.ID);
                        }}
                      >
                        <span className="fw-bold">{d.CoinNumber * 1}</span>{" "}
                      </div>
                    ) : (
                      <div
                        className="mt-2 "
                        style={{ width: "12%" }}
                        onClick={() => {
                          goToDetail(d.ID);
                        }}
                      >
                        <span
                          className={
                            d.Sender.ID !== userID
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          {d.Sender.ID !== userID
                            ? "+" + d.CoinNumber * 1
                            : "-" + d.CoinNumber * 1}
                        </span>{" "}
                      </div>
                    )}
                    <div
                      className="mt-2 "
                      style={{ width: "19%" }}
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
                      className="  text-success border rounded-3 "
                      style={{
                        width: "12%",
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
          <div className="col-12 mt-2">
            <div className="card-footer  bg-transparent border-0 border">
              <CustomPagination
                pageChange={pageChange}
                totalPage={datapage.totalPage}
                rowChange={rowChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletHistory;
