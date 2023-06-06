import { Formik } from "formik";
import * as Yup from "yup";
import { getRuleFsu, updateRuleStatus } from "../../../../services/RuleAPI";
import { useSelector } from "react-redux";
import { useContext, useState } from "react";
import { SocketContext } from "../../../../context/socketContext";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import SyncModal from "../modal/SyncModal";
import IntegrateModal from "../modal/IntegrateModal";
import { Modal } from "react-bootstrap";
import AddTemplateRuleModal from "../../components/modal/AddTemplateRuleModal";
import Select from "react-select";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import LoadingModal from "../modal/LoadingModal";
import Loading from "../../../sharedPage/pages/Loading";
import { imgServer } from "../../../../dataConfig";

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

  Category: Yup.string().required("Please choose a Category").nullable(false),

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
    .min(3, "Note must consist of at least 3 characters"),
});

const UpdateRuleValidation = ({ data, ID, RuleFsu }) => {
  const { DepartmentID, Code } = useSelector(
    (state) => state.DepartmentSettingSlice
  );
  const [showModalLoading, setShowModalLoading] = useState(false);
  const [syncshow, setsyncshow] = useState(false);
  const [integrateshow, setintegrateshow] = useState(false);

  const [checkinte, setcheckinte] = useState(false);

  const [show, setShow] = useState(false);
  let [IsSynchronize, setIsSynchronize] = useState(0);

  const socket = useContext(SocketContext);
  const navigate = useHistory();

  const { getToken } = useContext(GetTokenContext);

  function updateRule(body) {
    const {
      RuleType,
      Name,
      Category,
      PointNumber,
      Note,
      DepartmentID,
      Status,
      Badge,
    } = body;

    let dataToSend = {
      RuleType,
      Name,
      Category,
      PointNumber,
      Note,
      DepartmentID,
      Status,
      BadgeID: Badge,
    };
    const success = () => {
      navigate.push(`/rule/rule-list`);
    };

    getToken(
      updateRuleStatus,
      "Rule has been updated",
      success,
      false,
      ID,
      dataToSend
    );
  }
  return (
    <>
      <LoadingModal show={showModalLoading} />

      <SyncModal
        showModalLoading={setShowModalLoading}
        show={syncshow}
        setShow={setsyncshow}
        ID={ID}
        dataDetail={data}
        RedirectUrl="/rule/rule-list"
      />

      <IntegrateModal
        show={integrateshow}
        setShow={setintegrateshow}
        data={data}
        setcheck={setcheckinte}
        RuleFsu={RuleFsu}
        RedirectUrl="/rule/rule-list"
      />
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Edit Rule Definition</h4>
            </div>
            <div className="card-body">
              <div className="form-validation">
                <Formik
                  initialValues={{
                    RuleType: data.RuleType,
                    Name: data.RuleName || "",
                    Category: data.Category || "Member",
                    PointNumber: data.Point || "",
                    Note: data.RuleNote || "",
                    DepartmentID: DepartmentID || "",
                    Status: data.Status
                      ? data.Status === "Inactive"
                        ? 2
                        : 1
                      : "",
                    SettingRule: "",
                    Synchronize: data.Synchronize || "",
                    ApiID: data.ApiID || null,
                    TemplateID: data.TemplateID || null,
                    Integrate: data.Integrate || null,
                    Badge: data.Badge ? data.Badge.ID : null,
                  }}
                  validationSchema={ruleSchema}
                  validator={() => ({})}
                  onSubmit={(values, { setSubmitting }) => {
                    updateRule(values);
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
                                className="form-control"
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
                                className="invalid-feedback animated fadeInUp"
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
                              values.RuleType
                                ? errors.RuleType
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
                                rows="2"
                                maxLength={250}
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
                                className="invalid-feedback animated fadeInUp"
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
                                className="form-control"
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
                                className="invalid-feedback animated fadeInUp"
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
                                className="invalid-feedback animated fadeInUp"
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
                              values.Note
                                ? errors.Note
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                            }`}
                          >
                            <label
                              className="col-lg-4 form-label"
                              htmlFor="note"
                            >
                              Note
                            </label>
                            <div className="col-lg-6">
                              <textarea
                                className="form-control"
                                id="Note"
                                name="Note"
                                rows="2"
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
                                id="Note-error"
                                className="invalid-feedback animated fadeInUp"
                                style={{ display: "block" }}
                              >
                                {errors.Note && touched.Note && errors.Note}
                              </div>
                            </div>
                          </div>

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
                                {errors.Status &&
                                  touched.Status &&
                                  errors.Status}
                              </div>
                            </div>
                          </div>

                          <div
                            className={`form-group mb-3 row ${
                              values.SettingRule
                                ? errors.SettingRule
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                            }`}
                          >
                            <label
                              className="col-lg-4 form-label"
                              htmlFor="SettingRule"
                            >
                              Setting Rule
                            </label>
                            <div className="col-lg-6 row">
                              {values.ApiID === null &&
                              values.TemplateID === null ? (
                                <div className="col-6 " id="Parent">
                                  <div className="radio ">
                                    <label className="fst-normal mousePointer">
                                      <input
                                        id="check1"
                                        // name="check"
                                        type="checkbox"
                                        value="Synchronous"
                                        checked={syncshow}
                                        onChange={handleChange}
                                        onClick={(e) => {
                                          values.SettingRule = "Synchronous";

                                          setsyncshow(true);
                                        }}
                                      />{" "}
                                      Synchronous
                                    </label>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="col-12 row " id="Parent">
                                    <div className="radio row col-6">
                                      <label className="fst-normal mousePointer">
                                        <input
                                          id="check1"
                                          // name="check"
                                          type="checkbox"
                                          value="Synchronous"
                                          checked={true}
                                          // defaultChecked={true}
                                          onChange={handleChange}
                                          onClick={(e) => {
                                            setsyncshow(true);
                                          }}
                                        />{" "}
                                        Synchronous
                                      </label>
                                    </div>
                                  </div>
                                </>
                              )}
                              {RuleFsu ? (
                                <>
                                  {values.Integrate !== null ? (
                                    <>
                                      <div className="radio row col-6">
                                        <label className="fst-normal mousePointer ">
                                          <input
                                            id="check2"
                                            type="checkbox"
                                            // name="check"
                                            value="Integrate"
                                            // defaultChecked={true}
                                            onChange={handleChange}
                                            checked={
                                              values.Integrate === null
                                                ? false
                                                : true
                                            }
                                            onClick={(e) => {
                                              setintegrateshow(true);
                                            }}
                                          />{" "}
                                          Integrate{" "}
                                        </label>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="radio">
                                      <label className="fst-normal mousePointer">
                                        <input
                                          id="check2"
                                          type="checkbox"
                                          // name="check"
                                          value="Integrate"
                                          onChange={handleChange}
                                          checked={checkinte}
                                          onClick={(e) => {
                                            setintegrateshow(true);
                                            setcheckinte(!checkinte);
                                          }}
                                        />{" "}
                                        Integrate{" "}
                                      </label>
                                    </div>
                                  )}
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>

                          <div className="form-group mb-3 row">
                            <div className="col-lg-8 ms-auto">
                              <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
              <>
                <AddTemplateRuleModal
                  show={show}
                  setShow={setShow}
                  setRefresh={false}
                />
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateRuleValidation;
