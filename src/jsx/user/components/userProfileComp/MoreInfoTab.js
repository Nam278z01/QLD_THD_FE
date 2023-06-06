import moment from "moment";
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
import { scopes } from "../../../../dataConfig";
import Swal from "sweetalert2";

const TextNoRead = {
  fontWeight: "600",
};

const TextRead = {
  color: "#a1a1aa",
  fontWeight: "600",
};

const UserInfoschema = Yup.object().shape({
  PhoneNumber: Yup.string()
    .trim()
    .min(10, "Must a valid phone number")
    .max(10, "Must a valid phone number")
    .matches(/(0[3|5|7|8|9])+([0-9]{8})\b/g, "Must a valid phone number"),

  LinkFacebook: Yup.string()
    .trim()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "Enter correct url!"
    ),

  Linkedin: Yup.string()
    .trim()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "Enter correct url!"
    ),

  Gender: Yup.string().trim().required("Please choose a Gender"),
  DOB: Yup.string().test(
    "DOB",
    "Date of Birth must be greater or equal to 18 years old",
    (date) => moment().diff(moment(date), "years") >= 18
  ),
  Location: Yup.string().trim().required("Please enter your Location"),
  Favorite: Yup.string().trim(),
  CareerPath: Yup.string().trim(),
});

export default function MoreInfoTab({ data }) {
  const userAccount = useSelector((state) => state.UserSlice.account);
  const { instance, inProgress, accounts } = useMsal();
  const { account } = useParams();

  const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);

  const updateUser = (body) => {
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
          updateUserInfo(token, DepartmentID, data.Account, body)
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: "Update success",
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

                updateUserInfo(token, DepartmentID, data.Account, body).then(
                  (res) => {
                    Swal.fire({
                      icon: "success",
                      title: "Update success",
                    });
                  }
                );
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
        Gender: data.Gender || "Male",
        DOB: data.DOB || null,
        LinkFacebook: data.LinkFacebook || "",
        ForeignLanguage: data.ForeignLanguage || "",
        PhoneNumber: data.PhoneNumber || "",
        Linkedin: data.Linkedin || "",
        Favorite: data.Favorite || "",
        CareerPath: data.CareerPath || "",
        MaritalStatus: data.MaritalStatus || "",
        Location: data.Location || "",
      }}
      validationSchema={UserInfoschema}
      validator={() => ({})}
      onSubmit={(values, { setTouched }) => {
        updateUser(values);
        setTouched({});
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
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          <div className="row pt-2">
            <div className="col-6">
              <div
                className={`form-group mb-2  ${
                  values.Gender
                    ? errors.Gender
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="form-label fw-600">Gender:</label>
                {userAccount !== account ? (
                  <input
                    type="text"
                    defaultValue={data.Gender ? data.Gender : ""}
                    className={`form-control m-0 ${
                      userAccount !== account && "pe-none"
                    }`}
                  />
                ) : (
                  <select
                    defaultValue={data.Gender ? data.Gender : ""}
                    className={`form-select form-control m-0 ${
                      userAccount !== account && "pe-none"
                    }`}
                    style={userAccount !== account ? TextRead : TextNoRead}
                    id="Gender"
                    name="Gender"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value={"Male"}>Male</option>
                    <option value={"Female"}>Female</option>
                    <option value={"Others"}>Others</option>
                  </select>
                )}
                <div
                  id="Gender-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.Gender && touched.errors && errors.Gender}
                </div>
              </div>

              <div
                className={`form-group mb-2  ${
                  values.PhoneNumber
                    ? errors.PhoneNumber
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="form-label fw-600">Phone:</label>
                <input
                  type="text"
                  readOnly={userAccount !== account}
                  defaultValue={data.PhoneNumber ? data.PhoneNumber : ""}
                  className={`form-control m-0 ${
                    userAccount !== account && "pe-none"
                  }`}
                  style={userAccount !== account ? TextRead : TextNoRead}
                  id="PhoneNumber"
                  name="PhoneNumber"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div
                  id="PhoneNumber-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.PhoneNumber &&
                    touched.PhoneNumber &&
                    errors.PhoneNumber}
                </div>
              </div>

              <div
                className={`form-group mb-2  ${
                  values.DOB ? (errors.DOB ? "is-invalid" : "is-valid") : ""
                }`}
              >
                <label className="form-label fw-600">Date Of Birth:</label>

                <input
                  type={userAccount !== account ? "text" : "date"}
                  defaultValue={
                    data.DOB ? moment(data.DOB).format("YYYY-MM-DD") : ""
                  }
                  className={`form-control m-0 ${
                    userAccount !== account && "pe-none"
                  }`}
                  style={userAccount !== account ? TextRead : TextNoRead}
                  id="DOB"
                  name="DOB"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <div
                  id="DOB-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.DOB && touched.DOB && errors.DOB}
                </div>
              </div>

              <div
                className={`form-group mb-2  ${
                  values.ForeignLanguage
                    ? errors.ForeignLanguage
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <div>
                  <label className="form-label fw-600">Foreign Language:</label>
                  <input
                    type="text"
                    defaultValue={
                      data.ForeignLanguage ? data.ForeignLanguage : ""
                    }
                    className={`form-control m-0 ${
                      userAccount !== account && "pe-none"
                    }`}
                    style={userAccount !== account ? TextRead : TextNoRead}
                    id="ForeignLanguage"
                    name="ForeignLanguage"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div
                    id="ForeignLanguage-error"
                    className="invalid-feedback animated fadeInUp ms-3"
                    style={{ display: "block" }}
                  >
                    {errors.ForeignLanguage &&
                      touched.ForeignLanguage &&
                      errors.ForeignLanguage}
                  </div>
                </div>
              </div>
              <div
                className={`form-group mb-2  ${
                  values.LinkFacebook
                    ? errors.LinkFacebook
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <div>
                  <label className="form-label fw-600">Facebook:</label>
                  <input
                    type="text"
                    defaultValue={data.LinkFacebook ? data.LinkFacebook : ""}
                    className={`form-control m-0 ${
                      userAccount !== account && "pe-none"
                    }`}
                    style={userAccount !== account ? TextRead : TextNoRead}
                    id="LinkFacebook"
                    name="LinkFacebook"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div
                    id="LinkFacebook-error"
                    className="invalid-feedback animated fadeInUp ms-3"
                    style={{ display: "block" }}
                  >
                    {errors.LinkFacebook &&
                      touched.LinkFacebook &&
                      errors.LinkFacebook}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6">
              <div
                className={`form-group mb-2  ${
                  values.CareerPath
                    ? errors.CareerPath
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <div>
                  <label className="form-label fw-600">Career Path:</label>
                  <input
                    type="text"
                    defaultValue={data.CareerPath ? data.CareerPath : ""}
                    className={`form-control m-0 ${
                      userAccount !== account && "pe-none"
                    }`}
                    style={userAccount !== account ? TextRead : TextNoRead}
                    id="CareerPath"
                    name="CareerPath"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div
                    id="CareerPath-error"
                    className="invalid-feedback animated fadeInUp ms-3"
                    style={{ display: "block" }}
                  >
                    {errors.CareerPath &&
                      touched.CareerPath &&
                      errors.CareerPath}
                  </div>
                </div>
              </div>
              <div
                className={`form-group mb-2  ${
                  values.Favorite
                    ? errors.Favorite
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <div>
                  <label className="form-label fw-600">Favorite:</label>
                  <input
                    type="text"
                    defaultValue={data.Favorite ? data.Favorite : ""}
                    className={`form-control m-0 ${
                      userAccount !== account && "pe-none"
                    }`}
                    style={userAccount !== account ? TextRead : TextNoRead}
                    id="Favorite"
                    name="Favorite"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div
                    id="Favorite-error"
                    className="invalid-feedback animated fadeInUp ms-3"
                    style={{ display: "block" }}
                  >
                    {errors.Favorite && touched.Favorite && errors.Favorite}
                  </div>
                </div>
              </div>

              <div
                className={`form-group mb-2  ${
                  values.MaritalStatus
                    ? errors.Linkedin
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <div>
                  <label className="form-label fw-600">Marital Status:</label>
                  <input
                    type="text"
                    defaultValue={data.MaritalStatus ? data.MaritalStatus : ""}
                    className={`form-control m-0 ${
                      userAccount !== account && "pe-none"
                    }`}
                    style={userAccount !== account ? TextRead : TextNoRead}
                    id="MaritalStatus"
                    name="MaritalStatus"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div
                    id="MaritalStatus-error"
                    className="invalid-feedback animated fadeInUp ms-3"
                    style={{ display: "block" }}
                  >
                    {errors.MaritalStatus &&
                      touched.MaritalStatus &&
                      errors.MaritalStatus}
                  </div>
                </div>
              </div>

              <div
                className={`form-group mb-2  ${
                  values.Linkedin
                    ? errors.Linkedin
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <div>
                  <label className="form-label fw-600">Linkedin:</label>
                  <input
                    type="text"
                    defaultValue={data.Linkedin ? data.Linkedin : ""}
                    className={`form-control m-0 ${
                      userAccount !== account && "pe-none"
                    }`}
                    style={userAccount !== account ? TextRead : TextNoRead}
                    id="Linkedin"
                    name="Linkedin"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div
                    id="Linkedin-error"
                    className="invalid-feedback animated fadeInUp ms-3"
                    style={{ display: "block" }}
                  >
                    {errors.Linkedin && touched.Linkedin && errors.Linkedin}
                  </div>
                </div>
              </div>

              <div
                className={`form-group mb-2  ${
                  values.Location
                    ? errors.Location
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <div>
                  <label className="form-label fw-600">Location:</label>
                  <input
                    type="text"
                    defaultValue={data.Location ? data.Location : ""}
                    className={`form-control m-0 ${
                      userAccount !== account && "pe-none"
                    }`}
                    style={userAccount !== account ? TextRead : TextNoRead}
                    id="Location"
                    name="Location"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div
                    id="Location-error"
                    className="invalid-feedback animated fadeInUp ms-3"
                    style={{ display: "block" }}
                  >
                    {errors.Location && touched.Location && errors.Location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {Object.keys(touched).length > 0 && (
            <div className="col-12">
              {userAccount === account && (
                <button
                  type="submit"
                  className="btn btn-primary mt-2"
                  // disabled={isSubmitting}
                  onClick={(e) => {
                    e.target.blur();
                  }}
                >
                  Update
                </button>
              )}
            </div>
          )}
        </form>
      )}
    </Formik>
  );
}
