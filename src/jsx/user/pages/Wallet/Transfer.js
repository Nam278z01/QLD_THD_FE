import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import Loading from "../../../sharedPage/pages/Loading";
import { Formik } from "formik";
import * as Yup from "yup";
import { useMsal } from "@azure/msal-react";
import { TransferCoin } from "../../../../services/WalletAPI";
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import { scopes } from "../../../../dataConfig";
import Swal from "sweetalert2";
import { getUserRole } from "../../../../services/UsermasterAPI";
import { getOneUserMasterByAccount } from "../../../../services/UsermasterAPI";
import { useHistory } from "react-router-dom";
const WalletTransfer = ({ setShow, setRefresh, data, User, handleBlur1 }) => {
  const { instance, inProgress, accounts } = useMsal();
  const navigate = useHistory();
  const [first, setFirst] = useState(true);
  const { DepartmentID, CoinName } = useSelector(
    (a) => a.DepartmentSettingSlice
  );
  const accountRef = useRef();
  const { account } = useSelector((a) => a.UserSlice);
  const [user, setRefreshUser] = useRefreshToken(
    getOneUserMasterByAccount,
    account
  );
  const [message, setMessage] = useState("");
  const WalletInfoschema = Yup.object().shape({
    Message: Yup.string(),
    UserReceive: Yup.number()
      .required("Please enter account")
      .typeError("Account not found"),

    CoinNumber: Yup.number()
      .integer()
      .required("Please send your friend some " + CoinName)
      .min(1)
      // .max(user.TotalCoin)
      .nullable(false),
  });
  const getToken = (api, TransactionMethod, ...body) => {
    if (inProgress === InteractionStatus.None) {
      const accessTokenRequest = {
        scopes: scopes,
        account: accounts[0],
      };
      instance
        .acquireTokenSilent(accessTokenRequest)
        .then((accessTokenResponse) => {
          // Acquire token silent success
          let accessToken = accessTokenResponse.accessToken;
          let token = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };

          // Call your API with token
          api(token, DepartmentID, ...body)
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: " Success",
              });
              setRefresh(new Date());
              setShow(false);
              TransactionMethod === 2 ? navigate.replace(`/shop`) : "";
            })
            .catch(function (error) {
              Swal.fire({
                icon: "error",
                title: error,
              });
              // Acquire token interactive failure
            });
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance
              .acquireTokenPopup(accessTokenRequest)
              .then(function (accessTokenResponse) {
                // Acquire token interactive success
                let accessToken = accessTokenResponse.accessToken;
                let token = {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                };

                api(token, DepartmentID, ...body).then((res) => {
                  Swal.fire({
                    icon: "success",
                    title: "Success",
                  });
                  setRefresh(new Date());
                  setShow(false);
                  TransactionMethod === 2 ? navigate.replace(`/shop`) : "";
                });
              })
              .catch(function (error) {
                Swal.fire({
                  icon: "error",
                  title: error,
                });
                // Acquire token interactive failure
              });
          } else {
            Swal.fire({
              icon: "error",
              title: error,
            });
          }
        });
    }
  };
  const getTokenReturn = (api, ...body) => {
    if (inProgress === InteractionStatus.None) {
      const accessTokenRequest = {
        scopes: scopes,
        account: accounts[0],
      };

      return instance
        .acquireTokenSilent(accessTokenRequest)
        .then((accessTokenResponse) => {
          // Acquire token silent success
          let accessToken = accessTokenResponse.accessToken;
          let token = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };

          // Call your API with token
          return api(token, ...body)
            .then((res) => {
              return res;
            })
            .catch(function (error) {
              // Acquire token interactive failure
            });
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance
              .acquireTokenPopup(accessTokenRequest)
              .then(function (accessTokenResponse) {
                // Acquire token interactive success
                let accessToken = accessTokenResponse.accessToken;
                let token = {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                };

                return api(token, ...body).then((res) => {
                  return res;
                });
              })
              .catch(function (error) {
                // Acquire token interactive failure
              });
          } else {
            Swal.fire({
              icon: "error",
              title: error,
            });
          }
        });
    }
  };
  useEffect(() => {
    if (data.TransactionMethod === 2)
      setMessage(
        `I spent ${data.Price * data.Quantity} ${CoinName} to buy ${
          data.Quantity
        } ${data.ProductName} of you. Thanks for your products.`
      );
  }, []);
  const transaction = (body) => {
    getToken(TransferCoin, body.TransactionMethod, body);
  };

  const store = {
    UserReceive: data.UserMasterID ? data.UserMasterID : "",
    CoinNumber: data.Quantity ? data.Quantity * data.Price : "",
    Message: "",
    AccountName: "",
    DepartmentID: DepartmentID,
    TransactionMethod: data.TransactionMethod ? data.TransactionMethod : 1,
  };

  if (data.Quantity) {
    store.Quantity = data.Quantity;
    store.ProductID = data.ID;
  }

  return user === null ? (
    <Loading />
  ) : (
    <Formik
      initialValues={store}
      validationSchema={WalletInfoschema}
      validator={() => ({})}
      onSubmit={(values, { setSubmitting }) => {
        transaction(values);
        setSubmitting(true);
      }}
    >
      {({
        values,
        errors,
        handleChange,
        handleBlur,
        isSubmitting,
        handleSubmit,
        touched,
      }) => (
        <form
          className="d-flex justify-content-center w-100"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          <div
            className="p-3 rounded-2 d-flex justify-content-center"
            style={{ width: "65%" }}
          >
            <div className="justify-content-center rounded-2 p-4 m-2 border  w-100">
              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary text-center "
                  onClick={() => setShow(false)}
                >
                  <i className="fas fa-x" />
                </button>
              </div>
              <div className="text-center">
                <span className="fs-3 ">Total: </span>{" "}
                <i
                  className="fas fa-coins"
                  style={{ fontSize: "22px", color: "#FFA400" }}
                >
                  <span className="ms-2 ">
                    {user.TotalCoin} {CoinName}
                  </span>
                </i>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <div className=" fw-bold text-start">Name Account:</div>
                  <input
                    className="form-control   border  p-3"
                    style={{
                      backgroundColor: "#FFFFFF",
                      width: "50%",
                      height: "50px",
                    }}
                    id="UserReceive"
                    name="UserReceive"
                    type="text"
                    placeholder="Your Friend Account"
                    value={data !== null ? data.Account : ""}
                    readOnly={data.TransactionMethod === 2 ? true : false}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={(e) => {
                      if (
                        data.Quantity === null ||
                        data.Quantity === undefined
                      ) {
                        if (
                          accountRef.current.value.trim().length === 0 ||
                          accountRef.current.value.trim().toLowerCase() ===
                            account.toLowerCase()
                        ) {
                          values.UserReceive = null;
                          values.AccountName = "";
                          handleBlur(e);
                          return;
                        }

                        getTokenReturn(
                          getUserRole,
                          DepartmentID,
                          accountRef.current.value.trim(),
                          DepartmentID
                        ).then((res) => {
                          if (res === "NO DATA") {
                            values.UserReceive = null;
                            values.AccountName = "";
                            handleBlur(e);
                          } else {
                            values.UserReceive = res.ID;
                            values.AccountName = `${res.DisplayName} (${res.Department?.Code})`;
                            handleBlur(e);
                          }
                        });
                      } else {
                        handleBlur(e);
                      }
                    }}
                    ref={accountRef}
                  />
                </div>

                <h4>{values.AccountName}</h4>

                <div
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.UserReceive &&
                    touched.UserReceive &&
                    errors.UserReceive}
                </div>
              </div>
              <div>
                <div className="fw-bold text-start ">Amount</div>
                <div className="row">
                  <div className=" ">
                    <input
                      className=" border  col-xs-12 col-sm-12 col-md-12 form-control   p-3"
                      style={{
                        backgroundColor: "#FFFFFF",
                        width: "50%",
                        height: "50px",
                      }}
                      type="number"
                      placeholder={CoinName}
                      name="CoinNumber"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      defaultValue={values.CoinNumber}
                      readOnly={data.TransactionMethod === 2 ? true : false}
                    />
                    <div
                      id="CoinNumber-error"
                      className="invalid-feedback animated fadeInUp ms-3"
                      style={{ display: "block" }}
                    >
                      {errors.CoinNumber &&
                        touched.CoinNumber &&
                        errors.CoinNumber}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="form-label fw-bold ">Message</label>
                <textarea
                  className="form-control "
                  id="Message"
                  rows="3"
                  defaultValue={message}
                  placeholder="Send some Message"
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></textarea>
                <div
                  id="Message-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.Message && touched.Message && errors.Message}
                </div>
              </div>
              <br></br>
              {Object.keys(errors).length === 0 && (
                <div className="row">
                  <div className=" col-xs-12 col-lg-12 text-center">
                    <button
                      className="btn btn-primary rounded-3 text-white border border-white pb-2 fs-5 text-center"
                      type="submit"
                      style={{
                        width: "20%",
                        height: "43px",
                      }}
                      disabled={isSubmitting}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default WalletTransfer;
