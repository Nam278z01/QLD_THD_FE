import { useContext, useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import Select from "react-select";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { createProject } from "../../../../services/ProjectAPI";
import { parse, isDate } from "date-fns";
import { getAllProjectNoPage } from "../../../../services/ProjectAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
const UpdateProjectValidation = ({ PMDatas, HeadDatas, data }) => {
  function parseDateString(value, originalValue) {
    const parsedDate = isDate(originalValue)
      ? originalValue
      : parse(originalValue, "yyyy-MM-dd", new Date());

    return parsedDate;
  }
  const [projectExport, setRefreshProjectExport] =
    useRefreshToken(getAllProjectNoPage);
  const combinedArray = PMDatas.concat(HeadDatas);

  const { DepartmentID } = useSelector((state) => state.DepartmentSettingSlice);
  const { getToken } = useContext(GetTokenContext);
  const navigate = useHistory();

  const startDateRef = useRef();

  const date = new Date();

  date.setDate(date.getDate() - 1);

  const valiSchema = Yup.object().shape({
    Key: Yup.string()
      .trim()
      .min(3)
      .typeError("Please enter Project Name")
      .required("Please enter Project Name"),
    CodeAvaiable: Yup.boolean(),
    Code: Yup.string()
      .trim()
      .min(3, " Code length must be equal or more than 3 characters")
      .max(100, "Code length must be equal or less than 100 characters long")
      .required("Please enter Project Code"),
    // .typeError("please enter Code Name")
    // .required("please enter Code Name")
    // .when("CodeAvaiable", (CodeAvaiable, schema) => {
    //   if (CodeAvaiable) return schema.required("Must enter email address");
    //   return schema;
    // }),
    ManagerID: Yup.number()
      .min(1000)
      .required("Please choose a PM")
      .typeError("Please choose a PM"),
    Type: Yup.string()
      .trim()
      .required("Please choose a type")
      .typeError("Please choose a type"),
    Rank: Yup.string().trim().typeError("Please enter a rank"),
    Budget: Yup.number()
      .integer()
      .min(0)
      .max(1000000000)
      .nullable(true)
      .typeError("Please enter a integer budget"),
    StartDate: Yup.date()
      .required("Start Date is required")
      .default(new Date())
      .typeError("Please enter Start Date"),
    EndDate: Yup.date()
      .min(
        startDateRef.current ? startDateRef.current.value : new Date(),
        " End Date must be later than Start Date"
      )
      .required("End Date is required")
      .typeError("please enter End Date"),
  });

  function createProjectFunc(body) {
    function success() {
      navigate.push("/Head/project-list");
    }
    getToken(createProject, "Project created", success, false, body);
  }
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">New Project</h4>
          </div>
          <div className="card-body">
            <div className="form-validation">
              <Formik
                initialValues={{
                  Key: "",
                  Code: "",
                  DepartmentID: DepartmentID,
                  ManagerID: "",
                  Type: "Internal",
                  Rank: "",
                  Budget: 0,
                  StartDate: new Date(),
                  EndDate: null,
                  Note: "",
                  Status: "On-going",
                  CodeAvaiable: false,
                }}
                validationSchema={valiSchema}
                validator={() => ({})}
                onSubmit={(values, { setSubmitting }) => {
                  createProjectFunc(values);
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
                    className="form-valide"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit(e);
                    }}
                  >
                    <div className="row">
                      <div className="col-xl-6">
                        <div
                          className={`form-group mb-3 row ${
                            values.Key
                              ? errors.Key
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label className="col-lg-4 form-label" htmlFor="Key">
                            Project Name<span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control m-0"
                              id="Key"
                              name="Key"
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              value={values.Key}
                            />
                            <div
                              id="Key-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Key && touched.Key && errors.Key}
                            </div>

                            <div
                              id="times-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            />
                          </div>
                        </div>

                        <div
                          className={`form-group mb-3 row ${
                            values.Code
                              ? errors.Code
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label className="col-lg-4 form-label" htmlFor="Code">
                            Project Code<span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control m-0"
                              id="Code"
                              name="Code"
                              onChange={(e) => {
                                handleChange(e);
                                values.CodeAvaiable = true;
                              }}
                              onBlur={handleBlur}
                              value={values.Code}
                            />
                            <div
                              id="Code-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Code && touched.Code && errors.Code}
                            </div>

                            <div
                              id="times-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            />
                          </div>
                        </div>

                        <div
                          className={`form-group mb-3 row ${
                            values.ManagerID
                              ? errors.ManagerID
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="ManagerID"
                          >
                            Project Manager
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <Select
                              options={combinedArray}
                              onBlur={handleBlur}
                              className="w-100"
                              onChange={(project) => {
                                values.ManagerID = project.ID;
                              }}
                              onFocus={() => {
                                touched.ManagerID = true;
                              }}
                              getOptionValue={(option) => option.Account}
                              styles={{
                                input: (provided, state) => ({
                                  ...provided,
                                  paddingTop: "12px",
                                  paddingBottom: "12px",
                                }),
                              }}
                            />

                            <div
                              id="ManagerID-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.ManagerID &&
                                touched.ManagerID &&
                                errors.ManagerID}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`form-group mb-3 row ${
                            values.Type
                              ? errors.Type
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label className="col-lg-4 form-label" htmlFor="Type">
                            Type
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <select
                              className="form-control form-select m-0"
                              id="Type"
                              name="Type"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.Type}
                            >
                              <option value="Internal">Internal</option>
                              <option value="External">External</option>
                            </select>
                            <div
                              id="Type-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Type && touched.Type && errors.Type}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-6">
                        <div
                          className={`form-group mb-3 row ${
                            values.Rank
                              ? errors.Rank
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label className="col-lg-4 form-label" htmlFor="Type">
                            Rank
                          </label>
                          <div className="col-lg-6">
                            <select
                              className="form-control form-select m-0"
                              id="Rank"
                              name="Rank"
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <option value=""></option>
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="D">D</option>
                            </select>
                            <div
                              id="Type-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Rank && touched.Rank && errors.Rank}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`form-group mb-3 row ${
                            values.Budget
                              ? errors.Budget
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="Budget"
                          >
                            Budget
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="number"
                              className="form-control m-0"
                              id="Budget"
                              name="Budget"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.Budget}
                            />
                            <div
                              id="Budget-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Budget && touched.Budget && errors.Budget}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`form-group mb-3 row ${
                            values.StartDate
                              ? errors.StartDate
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="StartDate"
                          >
                            Start Date<span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="date"
                              className="form-control m-0"
                              id="StartDate"
                              name="StartDate"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={moment(values.StartDate).format(
                                "YYYY-MM-DD"
                              )}
                              ref={startDateRef}
                            />
                            <div
                              id="StartDate-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.StartDate &&
                                touched.StartDate &&
                                errors.StartDate}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`form-group mb-3 row ${
                            values.EndDate
                              ? errors.EndDate
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="EndDate"
                          >
                            End Date<span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="date"
                              className="form-control m-0"
                              id="EndDate"
                              name="EndDate"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={moment(values.EndDate).format(
                                "YYYY-MM-DD"
                              )}
                            />
                            <div
                              id="EndDate-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.EndDate &&
                                touched.EndDate &&
                                errors.EndDate}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`form-group mb-3 row ${
                            values.Note
                              ? errors.Note
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label className="col-lg-4 form-label" htmlFor="Note">
                            Note<span className="text-danger"></span>
                          </label>
                          <div className="col-lg-6">
                            <textarea
                              className={`form-control m-0`}
                              id="Note"
                              name="Note"
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              value={values.Note}
                              rows={3}
                            />
                            <div
                              id="Rank-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Note && touched.Note && errors.Note}
                            </div>
                          </div>
                        </div>

                        <div className="form-group mb-3 row">
                          <div className="col-lg-4"></div>
                          <div className="col-lg-6">
                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={isSubmitting}
                              onClick={(e) => {
                                e.target.blur();
                              }}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProjectValidation;
