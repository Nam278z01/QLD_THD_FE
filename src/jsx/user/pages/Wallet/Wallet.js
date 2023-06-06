import { useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getAllWalletHistory } from "../../../../services/WalletAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import Loading from "../../../sharedPage/pages/Loading";
import WalletTransfer from "../Wallet/Transfer";
import defaultImg from "../../../../images/Default.png";
import Transaction from "../../components/WalletInfor/Transaction";
import Personalshophistory from "../../components/WalletInfor/Personalshophistory";
import { getOneUserMasterByAccount } from "../../../../services/UsermasterAPI";
import useQuery from "../../../../Hook/useQuery";
import { getShopHistoryList } from "../../../../services/ShopAPI";
import { imgServer } from "../../../../dataConfig";
const Wallet = () => {
  const query = useQuery();
  const rowQuery = query.get("row") || 9;
  const pageQuery = query.get("page") || 1;

  const [Show, setShow] = useState(false);
  const { account, userID, userDepartmentCode, displayName } = useSelector(
    (state) => state.UserSlice
  );
  const { CoinName } = useSelector((a) => a.DepartmentSettingSlice);
  const [data, setRefreshData] = useRefreshToken(getAllWalletHistory, userID);
  const [User, setRefreshUser] = useRefreshToken(
    getOneUserMasterByAccount,
    account
  );
  const [PersonalShopHistoryData] = useRefreshToken(
    getShopHistoryList,
    pageQuery,
    rowQuery,
    userID
  );
  const setRefresh = () => {
    setRefreshData(new Date());
    setRefreshUser(new Date());
  };
  return User === null || data == null ? (
    <Loading />
  ) : (
    <div className="container d-flex justify-content-center mt-0  ">
      {!Show && (
        <div
          className=" rounded-2 d-flex  justify-content-center "
          style={{ width: "100%" }}
        >
          <div className="rounded-5 p-4 text-center  w-100 h-100 ">
            <div className="row">
              <div className="col-4"></div>
              <div className="col-8 text-center ">
                <h3 className="">Transactions History</h3>
              </div>
            </div>
            <div className="row ">
              <div
                className="col-4 rounded-1 border   "
                style={{ height: "473px" }}
              >
                <div className="  text-center ">
                  <div className=" fw-bold text-center mt-2 pt-2">
                    <i
                      className="fas fa-coins"
                      style={{ fontSize: "28px", color: "#FFA400" }}
                    >
                      <span className="ms-2 ">{User.TotalCoin}</span>
                    </i>
                  </div>
                  <span>Total balance base on </span>
                  <span style={{ color: "#FFA400" }}>{CoinName}</span>
                  <hr className="mb-0"></hr>
                  <div className="d-flex justify-content-center text-center m-auto mt-3">
                    <img
                      src={
                        User.Avatar ? `${imgServer}${User.Avatar}` : defaultImg
                      }
                      className="rounded-circle"
                      style={{ minHeight: "200px", minWeight: "200px" }}
                      height="200px"
                      width="200px"
                    />
                  </div>
                  <h4 className="fw-normal mt-3">
                    {displayName} ({userDepartmentCode})
                  </h4>
                </div>
                <button
                  className="btn btn-primary border border-white rounded-3 text-white text-center m-2 fs-5"
                  style={{
                    width: "35%",
                  }}
                  onClick={() => {
                    setShow(true);
                  }}
                >
                  Send
                </button>
                <br></br>
                <span className="m-0" style={{ color: "#FFA400" }}>
                  " {CoinName} "
                </span>{" "}
                <span>to your friends</span>
              </div>
              <div className="col-8">
                <Tab.Container defaultActiveKey={"Transaction"}>
                  <Nav as="ul" className="nav nav-tabs">
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link to="#transaction" eventKey="Transaction">
                        Transaction
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link to="#personalshop" eventKey="Personalshop">
                        Shop History
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content>
                    <Tab.Pane id="transaction" eventKey="Transaction">
                      <Transaction data={data} />
                    </Tab.Pane>
                    <Tab.Pane id="personalshop" eventKey="Personalshop">
                      <Personalshophistory data={PersonalShopHistoryData} />
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </div>
          </div>
        </div>
      )}

      {Show && (
        <WalletTransfer setShow={setShow} setRefresh={setRefresh} data={data} />
      )}
    </div>
  );
};

export default Wallet;
