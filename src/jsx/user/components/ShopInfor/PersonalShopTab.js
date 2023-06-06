import { useHistory } from "react-router-dom";
import moment from "moment";
import Loading from "../../../sharedPage/pages/Loading";
import { updatePersonalShop } from "../../../../services/ShopAPI";
import { Dropdown } from "react-bootstrap";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useContext, useState } from "react";
import { imgServer } from "../../../../dataConfig";
import "../../../../css/style.css";
import "../../../../css/productCard.css";
import { useSelector } from "react-redux";
const PersonalShopTab = ({ ShopData, setRefresh }) => {
  const { getToken } = useContext(GetTokenContext);
  const navigate = useHistory();
  const { userID } = useSelector((state) => state.UserSlice);
  const { CoinName } = useSelector((a) => a.DepartmentSettingSlice);
  const [defaulthref, setDefaulthref] = useState(
    "https://teams.microsoft.com/l/chat/0/0?users="
  );
  const changeStatusproduct = (number, ID) => {
    const success = () => {
      setRefresh(new Date());
    };
    const formData = new FormData();
    formData.append("Status", number);
    getToken(
      updatePersonalShop,
      "Update success",
      success,
      false,
      ID,
      formData
    );
  };

  return ShopData === null ? (
    <Loading />
  ) : (
    <>
      <div className="d-flex justify-content-around ">
        <div
          style={{
            position: "relative",
            overflow: "hidden",
          }}
          className="row w-100 border pt-5  d-flex d-flex justify-content-evenly "
        >
          {" "}
          {ShopData.ShopData.length > 0 ? (
            ShopData.ShopData.map((data, index) => (
              <div
                className="col-10 col-xl-2 col-lg-3 col-md-5 card shadow  m-2 p-4 mb-5"
                key={index}
                style={{
                  height: "29rem",
                  boxSizing: "border-box",
                  minWidth: "300px",
                }}
              >
                <div className="" style={{ maxHeight: "0%" }}>
                  {" "}
                  <div className="row">
                    <div className="col-2 ">
                      <p className="m-0 p-0">
                        {data.Status === 1 ? (
                          <span
                            style={{ fontSize: "1.2vh" }}
                            className="badge bg-success "
                          >
                            Available
                          </span>
                        ) : (
                          <span
                            style={{ fontSize: "1.2vh" }}
                            className="badge bg-danger "
                          >
                            Unavailable
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="col-9 "></div>
                    <div className="col-1 p-0 m-0 ">
                      <Dropdown
                        className="dropdown btn p-0  "
                        style={{
                          overflow: "visible",
                          minWidth: "5%",
                          paddingLeft: "10%",
                        }}
                      >
                        <Dropdown.Toggle
                          as="div"
                          className="i-false"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
                              stroke="#262626"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z"
                              stroke="#262626"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z"
                              stroke="#262626"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu">
                          <Dropdown.Item
                            className="dropdown-item"
                            onClick={() => {
                              navigate.push(`/update-shop/${data.ID}`);
                            }}
                          >
                            Edit
                          </Dropdown.Item>
                          {data.Status === 1 ? (
                            <Dropdown.Item
                              className="dropdown-item"
                              onClick={() =>
                                swal({
                                  title: "Are you sure?",
                                  icon: "warning",
                                  buttons: true,
                                  dangerMode: true,
                                }).then((willDelete) => {
                                  if (willDelete) {
                                    changeStatusproduct(2, data.ID);
                                    setRefresh(new Date());
                                  }
                                })
                              }
                            >
                              Unavailable
                            </Dropdown.Item>
                          ) : (
                            <Dropdown.Item
                              className="dropdown-item"
                              onClick={() => {
                                swal({
                                  title: "Are you sure?",
                                  icon: "warning",
                                  buttons: true,
                                  dangerMode: true,
                                }).then((willDelete) => {
                                  if (willDelete) {
                                    changeStatusproduct(1, data.ID);
                                    setRefresh(new Date());
                                  }
                                });
                              }}
                            >
                              Available
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>

                <div className="product">
                  <div className="imgbox">
                    {" "}
                    <img
                      style={{ height: "80%" }}
                      src={`${imgServer}${data.Image}`}
                    ></img>
                  </div>
                  <div
                    style={{ height: "100%", fontSize: "1.7vh" }}
                    className="spec row"
                  >
                    <div className="col-8" style={{ fontSize: "1.5vh" }}>
                      <h3 style={{ fontSize: "1.8vh" }} className="mb-3 w-75">
                        {data.Name.length <= 30
                          ? data.Name
                          : data.Name.substring(1, 30) + "..."}
                      </h3>
                      <div>
                        <label style={{ fontSize: "1.3vh" }} className="mb-1">
                          Quantity:{" "}
                        </label>{" "}
                        {data.Quantity ? (
                          <label className="fw-normal"> {data.Quantity} </label>
                        ) : (
                          <span className="badge bg-danger">Out of stock</span>
                        )}
                      </div>
                      <label style={{ fontSize: "1.3vh" }}>Seller:</label>{" "}
                      {data.UserMasterName}
                      <br />
                      {data.UserMasterID != userID ? (
                        <li>
                          <label style={{ fontSize: "1.3vh" }}>Contact: </label>{" "}
                          <a href={defaulthref + data.Contact} target="_blank">
                            <button
                              type="button"
                              style={{ backgroundColor: "blueviolet" }}
                              className="btn btn-primary"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                className="bi bi-microsoft-teams"
                                viewBox="0 0 16 16"
                              >
                                <path d="M9.186 4.797a2.42 2.42 0 1 0-2.86-2.448h1.178c.929 0 1.682.753 1.682 1.682v.766Zm-4.295 7.738h2.613c.929 0 1.682-.753 1.682-1.682V5.58h2.783a.7.7 0 0 1 .682.716v4.294a4.197 4.197 0 0 1-4.093 4.293c-1.618-.04-3-.99-3.667-2.35Zm10.737-9.372a1.674 1.674 0 1 1-3.349 0 1.674 1.674 0 0 1 3.349 0Zm-2.238 9.488c-.04 0-.08 0-.12-.002a5.19 5.19 0 0 0 .381-2.07V6.306a1.692 1.692 0 0 0-.15-.725h1.792c.39 0 .707.317.707.707v3.765a2.598 2.598 0 0 1-2.598 2.598h-.013Z"></path>
                                <path d="M.682 3.349h6.822c.377 0 .682.305.682.682v6.822a.682.682 0 0 1-.682.682H.682A.682.682 0 0 1 0 10.853V4.03c0-.377.305-.682.682-.682Zm5.206 2.596v-.72h-3.59v.72h1.357V9.66h.87V5.945h1.363Z"></path>
                              </svg>
                            </button>
                          </a>
                        </li>
                      ) : (
                        ""
                      )}
                      <label style={{ fontSize: "1.3vh" }}>Publish Date:</label>{" "}
                      <span className="item">
                        {moment(data.CreatedDate).format("MM-DD-YYYY")}{" "}
                        <i className="fa-solid fa-calendar-days"></i>
                      </span>
                      <div style={{ height: "auto" }}>
                        {data.Description === "" ? (
                          ""
                        ) : (
                          <>
                            {" "}
                            <label style={{ fontSize: "1.3vh" }}>
                              Description:
                            </label>{" "}
                            {data.Description === null
                              ? ""
                              : data.Description.length <= 60
                              ? data.Description
                              : `${data.Description.substring(0, 60)}...`}
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigate.push(`/update-shop/${data.ID}`);
                        }}
                        className="btn btn-primary text-center"
                      >
                        Update{" "}
                      </button>
                    </div>

                    <div
                      className="fw-700 text-warning col-4"
                      style={{ fontSize: "1.4vh" }}
                    >
                      {data.Coin} <span>{CoinName}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No data</p>
          )}
        </div>
      </div>
    </>
  );
};
export default PersonalShopTab;
