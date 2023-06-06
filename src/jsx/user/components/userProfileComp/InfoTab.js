import { Formik } from "formik";
import { useMsal } from "@azure/msal-react";
import { useSelector } from "react-redux";

import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { updateUserInfo } from "../../../../services/UsermasterAPI";
import { UserMaster } from "../../../../dataConfig";

const UserInfoschema = Yup.object().shape({
  ContractType: Yup.number().min(1).max(2),
  Skill: Yup.string().required("Please enter Skill"),
  ForeignLanguage: Yup.string().required("Please enter a Foreign Language"),
  YesterdayRank: Yup.number().min(0).required("Please enter Yesterday Rank"),
  SeatCode: Yup.string().required("Please enter SeatCode"),
  MaritalStatus: Yup.string().required("Please enter Marital Status"),
  Certificate: Yup.string().required("Please enter Certificate"),
});

const InfoTab = ({ data }) => {
  const { instance, inProgress, accounts } = useMsal();

  const { account } = useParams();
  const TextRead = {
    color: "#a1a1aa",
    fontWeight: "600",
  };

  const TextNoRead = {
    fontWeight: "600",
  };

  const userAccount = useSelector((state) => state.UserSlice.account);

  const updateUserDefault = (body) => {
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
              "Content-Type": "multipart/form-data : boundary=a",
              Authorization: `Bearer ${accessToken}`,
            },
          };

          // Call your API with token
          updateUserInfo(token, data.Account, body)
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: "Update success",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              });
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

                updateUserInfo(token, data.Account, body).then((res) => {
                  Swal.fire({
                    icon: "success",
                    title: "Update success",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                  });
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

  return (
    <Formik
      initialValues={{
        Name: data.DisplayName,
        Account: data.Account,
        Skill: data.Skill,
        ForeignLanguage: data.ForeignLanguage,
        SeatCode: data.SeatCode,
        Certificate: data.Certificate,
        ContractType: data.ContractType,
        Email: data.Email,
        Supporter: data.Supporter,
        JobTitle: data.JobTitle,
        YesterdayRank: data.YesterdayRank,
        MaritalStatus: data.MaritalStatus,
      }}
      validationSchema={UserInfoschema}
      validator={() => ({})}
      onSubmit={(values, { setSubmitting }) => {
        updateUserDefault(values);
        setSubmitting(false);
      }}
    >
      {({
        values,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        touched,
      }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          <div className="row pt-2">
            <div className="col-6">
              <div
                className={`form-group mb-2  ${
                  values.DisplayName
                    ? errors.DisplayName
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="form-label fw-600">Name:</label>
                <input
                  type="text"
                  readOnly={userAccount !== account}
                  defaultValue={data.DisplayName ? data.DisplayName : ""}
                  className="form-control m-0 pe-none "
                  style={TextRead}
                  id="DisplayName"
                  name="DisplayName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div
                  id="DisplayName-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.DisplayName && errors.touched}
                </div>
              </div>
              <div
                className={`form-group mb-2  ${
                  values.Account
                    ? errors.Account
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="form-label fw-600">Account:</label>
                <input
                  type="text"
                  readOnly={userAccount !== account}
                  defaultValue={data.Account ? data.Account : ""}
                  className="form-control m-0 pe-none"
                  style={TextRead}
                  id="Account"
                  name="Account"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div
                  id="Account-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.Account && errors.touched}
                </div>
              </div>

              <div
                className={`form-group mb-2  ${
                  values.SeatCode
                    ? errors.SeatCode
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="form-label fw-600">Seat Code:</label>
                <input
                  type="text"
                  readOnly={userAccount !== account}
                  defaultValue={data.SeatCode ? data.SeatCode : ""}
                  className="form-control m-0  pe-none  "
                  style={TextRead}
                  id="SeatCode"
                  name="SeatCode"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div
                  id="SeatCode-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.SeatCode && touched.SeatCode ? errors.SeatCode : null}
                </div>
              </div>
            </div>

            <div className="col-6">
              <div
                className={`form-group mb-2  ${
                  values.ContractType
                    ? errors.ContractType
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="form-label fw-600">Contract Type:</label>
                <input
                  type="text"
                  readOnly={userAccount !== account}
                  defaultValue={
                    data.ContractType
                      ? UserMaster.ContractType[data.ContractType - 1]
                      : ""
                  }
                  className="form-control m-0 pe-none "
                  style={TextRead}
                  id="ContractType"
                  name="ContractType"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div
                  id="ContractType-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.ContractType && touched.ContractType
                    ? errors.ContractType
                    : null}
                </div>
              </div>
              <div
                className={`form-group mb-2  ${
                  values.Email ? (errors.Email ? "is-invalid" : "is-valid") : ""
                }`}
              >
                <label className="form-label fw-600">Email:</label>
                <input
                  type="text"
                  readOnly={userAccount !== account}
                  defaultValue={data.Email ? data.Email : ""}
                  className="form-control m-0 pe-none "
                  style={TextRead}
                  id="Email"
                  name="Email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div
                  id="Email-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.Email && touched.Email ? errors.Email : null}
                </div>
              </div>
              <div
                className={`form-group mb-2  ${
                  values.Supporter
                    ? errors.Supporter
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="form-label fw-600">Supporter:</label>
                <input
                  type="text"
                  readOnly={userAccount !== account}
                  defaultValue={data.Supporter ? data.Supporter : ""}
                  className="form-control m-0  pe-none "
                  style={TextRead}
                  id="Supporter"
                  name="Supporter"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div
                  id="Supporter-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.Supporter && touched.Supporter
                    ? errors.Supporter
                    : null}
                </div>
              </div>
              <div
                className={`form-group mb-2  ${
                  values.JobTitle
                    ? errors.JobTitle
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="form-label fw-600">Job Title:</label>
                <input
                  type="text"
                  readOnly={userAccount !== account}
                  defaultValue={data.JobTitle ? data.JobTitle : ""}
                  className="form-control m-0  pe-none "
                  style={TextRead}
                  id="JobTitle"
                  name="JobTitle"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div
                  id="JobTitle-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.JobTitle && touched.JobTitle ? errors.JobTitle : null}
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default InfoTab;
