import { Formik } from "formik";
import * as Yup from "yup";
import { createNewRule } from "../../../../services/RuleAPI";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { SocketContext } from "../../../../context/socketContext";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useHistory, useRouteMatch } from "react-router-dom";
import { imgServer } from "../../../../dataConfig";
import { getAllBadgeActive } from "../../../../services/BadgeAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { useState } from "react";
import Select from "react-select";

const ruleSchema = Yup.object().shape({
  RuleType: Yup.string().required("Please choose a rule type").nullable(false),

  Name: Yup.string()
    .min(3, "Name must consist of at least 3 characters ")
    .max(300)
    .nullable(false)
    .matches(/^[^\s].*[^\s]$/, "Name cannot start or end with whitespace")
    .trim()
    .strict(true)
    .required("Please enter a name"),

  Category: Yup.string().required("Please choose a category").nullable(false),

  PointNumber: Yup.number()
    .integer("Point must be a integer")
    .min(-999999, "Point must be greater than or equal to -99999")
    .max(999999, "Point must be less than or equal to 99999")
    .required("Please enter a Point")
    .nullable(false, "Please enter a Point")
    .test("Is positive?", "Point must not be 0", (value) => value != 0),

  DepartmentID: Yup.number()
    .integer()
    .min(1000)
    .required("Please choose a Department")
    .nullable(false),

  Note: Yup.string()
    .nullable(true)
    .trim()
    .max(5000)
    .min(3, "Note must consist of at least 3 characters"),
});

const NewRuleValidation = () => {
  const [badgeimage, setbadgeimage] = useState();

  const { DepartmentID, Code } = useSelector((a) => a.DepartmentSettingSlice);
  const socket = useContext(SocketContext);
  const [Allbadge] = useRefreshToken(getAllBadgeActive);

  const navigate = useHistory();

  const { getToken } = useContext(GetTokenContext);

  function createRule(body) {
    function success(params) {
      navigate.push(`/rule/rule-list`);
    }

    getToken(createNewRule, "New rule has been created", success, false, body);
  }
  return Allbadge === null ? (
    <></>
  ) : (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">New Rule Definition</h4>
          </div>
          <div className="card-body">
            <div className="form-validation">
              <Formik
                initialValues={{
                  RuleType: "Plus",
                  Name: "",
                  Category: "Member",
                  PointNumber: 0,
                  DepartmentID: DepartmentID,
                  BadgeID: null,
                }}
                validationSchema={ruleSchema}
                validator={() => ({})}
                onSubmit={(values, { setSubmitting }) => {
                  createRule(values);
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
                            values.RuleType
                              ? errors.RuleType
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="ruletype"
                          >
                            Rule Type
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <select
                              className="form-control form-select"
                              id="RuleType"
                              name="RuleType"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.RuleType}
                            >
                              <option value="Plus">Plus</option>
                              <option value="Minus">Minus</option>
                            </select>
                            <div
                              id="ruletype-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.RuleType &&
                                touched.RuleType &&
                                errors.RuleType}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`form-group mb-3 row ${
                            values.Name
                              ? errors.Name
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="Namename"
                          >
                            Name
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <textarea
                              className="form-control"
                              id="Name"
                              name="Name"
                              maxLength={250}
                              rows="2"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.Name}
                              placeholder="Enter a name.."
                            ></textarea>
                            {document.getElementById("Name") !== null &&
                              (document.getElementById("Name").value.length ==
                              250 ? (
                                <div style={{ color: "red" }}>
                                  Name have the max length is 250 characters
                                </div>
                              ) : (
                                ""
                              ))}

                            <div
                              id="name-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Name && touched.Name && errors.Name}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`form-group mb-3 row ${
                            values.Category
                              ? errors.Category
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="Category"
                          >
                            Apply for
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <select
                              className="form-control  form-select"
                              id="Category"
                              name="Category"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.Category}
                            >
                              <option value="Member">Member</option>
                              <option value="PM">PM</option>
                              <option value="Head">Head</option>
                            </select>
                            <div
                              id="category-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Category &&
                                touched.Category &&
                                errors.Category}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`form-group mb-3 row ${
                            values.PointNumber
                              ? errors.PointNumber
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="PointNumber"
                          >
                            Point <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="number"
                              className="form-control"
                              id="PointNumber"
                              name="PointNumber"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={
                                values.RuleType === "Plus"
                                  ? values.PointNumber > 0
                                    ? values.PointNumber
                                    : -values.PointNumber
                                  : values.PointNumber < 0
                                  ? values.PointNumber
                                  : -values.PointNumber
                              }
                              placeholder="Enter a point.."
                            />
                            <div
                              id="PointNumber-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.PointNumber &&
                                touched.PointNumber &&
                                errors.PointNumber}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-6">
                        <div
                          className={`form-group mb-3 row ${
                            values.Status
                              ? errors.Status
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="Status"
                          >
                            Status
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <select
                              className="form-control"
                              id="Status"
                              name="Status"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.Status}
                            >
                              <option value={1}>Active</option>
                              <option value={2}>Inactive</option>
                            </select>
                            <div
                              id="ruletype-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {errors.Status && touched.Status && errors.Status}
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
                          <label className="col-lg-4 form-label" htmlFor="note">
                            Note
                          </label>
                          <div className="col-lg-6">
                            <textarea
                              className="form-control"
                              id="Note"
                              name="Note"
                              rows="5"
                              maxLength={5000}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.Note}
                              placeholder="..."
                            />
                            {document.getElementById("Note") !== null &&
                              (document.getElementById("Note").value.length ==
                              5000 ? (
                                <div style={{ color: "red" }}>
                                  Note have the max length is 5000 characters
                                </div>
                              ) : (
                                ""
                              ))}

                            <div
                              id="PointNumber-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Note && touched.Note && errors.Note}
                            </div>
                          </div>
                        </div>
                        {/* <div
                          className={`form-group mb-3 row ${
                            values.BadgeID
                              ? errors.BadgeID
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="BadgeID"
                          >
                            Badge
                          </label>
                          <div className="col-lg-6">
                            <Select
                              id="BadgeID"
                              name="BadgeID"
                              options={Allbadge}
                              // defaultValue={defaultRuleAndTemplate.map((item) => ({
                              //   label: item.Template.Name,
                              //   value: item.TemplateID,
                              // }))}
                              onChange={(e) => {
                                // setselectOptionSync(e.value);
                                values.BadgeID = e.value;
                                setbadgeimage(e.ImageURL);
                              }}
                              styles={{
                                input: (provided, state) => ({
                                  ...provided,
                                  paddingTop: "12px",
                                  paddingBottom: "12px",
                                }),
                                menuList: (styles) => ({
                                  ...styles,
                                  maxHeight: "120px",
                                }),
                              }}
                            />

                            <div
                              id="BadgeID-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {errors.BadgeID &&
                                touched.BadgeID &&
                                errors.BadgeID}
                            </div>
                          </div>
                          {badgeimage ? (
                            <div className="col-lg-2 text-center">
                              <img
                                src={`${imgServer}${badgeimage}`}
                                height={50}
                                width={50}
                              />
                            </div>
                          ) : (
                            ""
                          )}
                        </div> */}
                        <div className="form-group mb-3 row">
                          <div className="col-lg-4"></div>
                          <div className="col-lg-6">
                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={isSubmitting}
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

export default NewRuleValidation;
