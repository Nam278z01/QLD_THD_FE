import { Formik } from "formik";
import * as Yup from "yup";
import { updateUserInfo } from "../../../../services/UsermasterAPI";
import moment from "moment";
import { useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import differenceInYears from "date-fns/differenceInYears";

const UserInfoschema = Yup.object().shape({
  JobTitle: Yup.string().nullable(false),

  Skill: Yup.string().optional().nullable(true),

  Foreignlanguage: Yup.string().nullable(true),

  DOB: Yup.date().nullable("invalid Date"),

  ContractType: Yup.number()
    .min(1)
    .nullable(false)
    .required("Please enter ContractType"),
  Skill: Yup.string().optional().nullable(true),

  DOB: Yup.string().test(
    "DOB",
    "Date of Birth must be greater or equal to 18 years old",
    (date) => moment().diff(moment(date), "years") >= 18
  ),

  SeatCode: Yup.string().trim(),
  Location: Yup.string().trim(),
  Supporter: Yup.string().trim(),
  PhoneNumber: Yup.string(),
});

const ThePromoteCard = ({ data, setRefresh, setShowModal, setRefreshdata }) => {
  const { getToken } = useContext(GetTokenContext);
  const promoteHandle = (body) => {
    function success() {
      setRefresh(new Date());
      setRefreshdata(new Date());
      setShowModal(false);
    }

    getToken(
      updateUserInfo,
      "Update success",
      success,
      false,
      data.Account,
      body
    );
  };
  // console.log(data.ContractType);
  return (
    <Formik
      initialValues={{
        RoleID: data.RoleID,
        Status: data.Status,
        ContractType: data.ContractType,
        DOB: data.DOB || "",
        PhoneNumber: data.PhoneNumber ? data.PhoneNumber : "",
        SeatCode: data.SeatCode || "",
        Location: data.Location || "",
        Supporter: data.Supporter || "",
        JobTitle: data.JobTitle,
      }}
      validationSchema={UserInfoschema}
      validator={() => ({})}
      onSubmit={(values, { setSubmitting }) => {
        promoteHandle(values);
        setSubmitting(false);
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
                  values.RoleID
                    ? errors.RoleID
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="form-label fw-bold">Role</label>
                <select
                  defaultValue={values.RoleID}
                  className="form-control form-select p-2 m-0"
                  id="RoleID"
                  name="RoleID"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value={2}>Head</option>
                  <option value={3}>PM</option>
                  <option value={4}>Member</option>
                </select>
                <div
                  id="RoleID-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.RoleID && errors.RoleID}
                </div>
              </div>

              <div
                className={`form-group mb-2  ${
                  values.Status
                    ? errors.Status
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="form-label fw-bold">Status</label>
                <select
                  defaultValue={values.Status}
                  className="form-control form-select p-2 m-0"
                  id="Status"
                  name="Status"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value={1}>Active</option>
                  <option value={2}>Inactive</option>
                  <option value={3}>Away</option>
                  <option value={4}>Not Ranking</option>
                </select>
                <div
                  id="Status-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.Status && errors.Status}
                </div>
              </div>

              <div
                className={`form-group mb-2  ${
                  values.ContractType
                    ? errors.ContractType
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="form-label fw-bold">Contract Type</label>
                <select
                  defaultValue={values.ContractType}
                  className="form-control form-select p-2 m-0"
                  id="ContractType"
                  name="ContractType"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value={1}>SVTT</option>
                  <option value={2}>NVCT</option>
                </select>
                <div
                  id="ContractType-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.ContractType && errors.ContractType}
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
                <label className="form-label fw-bold">Seat Code</label>
                <input
                  defaultValue={values.SeatCode}
                  className="form-control  p-2 m-0"
                  id="SeatCode"
                  name="SeatCode"
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></input>
                <div
                  id="SeatCode-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.SeatCode && errors.SeatCode}
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
                <label className="form-label fw-bold">Location</label>
                <input
                  defaultValue={values.Location}
                  className="form-control  p-2 m-0"
                  id="Location"
                  name="Location"
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></input>
                <div
                  id="Location-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.Location && errors.Location}
                </div>
              </div>
            </div>

            <div className="col-6">
              <div
                className={`form-group mb-2  ${
                  values.JobTitle
                    ? errors.JobTitle
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="form-label fw-bold">Job Title</label>
                <input
                  defaultValue={values.JobTitle}
                  className="form-control  p-2 m-0"
                  id="JobTitle"
                  name="JobTitle"
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></input>
                <div
                  id="JobTitle-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.JobTitle && touched.JobTitle && errors.JobTitle}
                </div>
              </div>

              <div
                className={`form-group mb-2  ${
                  values.DOB ? (errors.DOB ? "is-invalid" : "is-valid") : ""
                }`}
              >
                <label className="form-label fw-bold">Date Of Birth</label>
                <input
                  type="date"
                  defaultValue={
                    data.DOB ? moment(data.DOB).format("YYYY-MM-DD") : ""
                  }
                  className="form-control m-0"
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
                  values.PhoneNumber
                    ? errors.PhoneNumber
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="form-label fw-bold" htmlFor="PhoneNumber">
                  Phone
                </label>
                <input
                  type="tel"
                  defaultValue={values.PhoneNumber}
                  className="form-control m-0"
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
                  values.Supporter
                    ? errors.Supporter
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="form-label fw-bold">Supporter</label>
                <input
                  defaultValue={values.Supporter}
                  className="form-control  p-2 m-0"
                  id="Supporter"
                  name="Supporter"
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></input>
                <div
                  id="Supporter-error"
                  className="invalid-feedback animated fadeInUp ms-3"
                  style={{ display: "block" }}
                >
                  {errors.Supporter && touched.Supporter && errors.Supporter}
                </div>
              </div>
            </div>

            <div className="col-12">
              <button
                className="btn btn-primary mt-2"
                type="submit"
                disabled={isSubmitting}
              >
                Update
              </button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default ThePromoteCard;
