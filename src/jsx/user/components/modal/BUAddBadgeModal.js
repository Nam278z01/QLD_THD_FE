import { Formik } from "formik";
import Select from "react-select";
import CustomModalUtil from "../Shared/CustomModalUtil";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { createBadge } from "../../../../services/BadgeAPI";
import { useSelector } from "react-redux";
import { getAllActiveRule, getAllActiveRuleNotBadge } from "../../../../services/RuleAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { OPTIONS } from "../Forms/Constants";

const theInputIcon = document.querySelector("#BadgeIcon");

export default function BUAddBadgeModal({ show, setShow, setRefresh }) {

  const { role } = useSelector((state) => state.UserSlice);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [ruleData, setRefreshRuleData] = useRefreshToken(getAllActiveRuleNotBadge, role);
  const { DepartmentID } = useSelector((state) => state.DepartmentSettingSlice);
  const { getTokenFormData } = useContext(GetTokenContext);
  const [isOperator, setIsOperator] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  const validSchema = Yup.object().shape({
    Name: Yup.string().trim().min(5).max(30).required("Please enter a Name"),
    Description: Yup.string()
      .trim()
      .min(5)
      .max(30)
      .required("Please enter a Description"),
    BadgeIcon: Yup.mixed()
      .test("fileSize", "The Icon is too large", () => {
        if (theInputIcon === null || theInputIcon.files[0] === undefined) {
          return true;
        }
        return theInputIcon.files[0].size <= 3145728;
      })
      .required("Please choose a Medals Icon"),
    ConditionValue: isOperator && (Yup.number()
      .integer()
      .min(1, "Please enter value equal or greater than 1000")
      .max(999999, "Please enter equal or less than 100000")
      .required("Please enter value")),
  });


  function checkOperator(e) {
    const operator = e.target.value;
    const operators = ["=", "<", ">", "<=", ">="];
    setIsOperator(operators.includes(operator));
  }

  // handle create badge required form data (Name, Description, DepartmentID, Status, ImageURL, RuleID, Condition, AwardType)
  const createNewBadge = (values) => {
    const theInputIcon = document.querySelector("#BadgeIcon");

    var { Name, Description, AwardType, RuleDefintionID, Condition, ConditionValue } = values;

    const formData = new FormData();

    const success = () => {
      setRefresh(new Date());
      setRefreshRuleData(new Date());
      setShow(false);
    };

    formData.append("Name", Name);
    formData.append("Description", Description);
    formData.append("DepartmentID", DepartmentID);
    formData.append("ImageURL", theInputIcon.files[0]);
    formData.append("AwardType", AwardType);

    if (AwardType === "auto") {
      formData.append("RuleID", RuleDefintionID);
      if (Condition !== "asc" && Condition !== "desc") {
        Condition = Condition + ConditionValue;
      }
      formData.append("Condition", Condition);
    }

    getTokenFormData(createBadge, "Create success", success, false, formData);

    setSelectedFile(null);
  };

  return (
    <CustomModalUtil
      title="Create Medals"
      show={show}
      setShow={setShow}
      size="md"
    >
      <Formik
        initialValues={{ Name: "", Description: "", BadgeIcon: null, AwardType: "manual", RuleDefintionID: null, Condition: 'asc' }}
        validationSchema={validSchema}
        validator={() => ({})}
        onSubmit={(values, { setSubmitting }) => {
          createNewBadge(values);
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
              <div className="col-xl-12">
                <div
                  className={`form-group mb-3 row ${values.Name ? (errors.Name ? "is-invalid" : "is-valid") : ""
                    }`}
                >
                  <label className="col-lg-4 form-label" htmlFor="Name">
                    Name
                    <span className="text-danger">*</span>
                  </label>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      className="form-control m-0"
                      id="Name"
                      name="Name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.Name}
                      placeholder="Enter a name"
                    />
                    <div
                      id="Name-error"
                      className="invalid-feedback animated fadeInUp ms-3"
                      style={{ display: "block" }}
                    >
                      {errors.Name && touched.Name && errors.Name}
                    </div>
                  </div>
                </div>

                <div
                  className={`form-group mb-3 row ${values.Description
                    ? errors.Description
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                    }`}
                >
                  <label className="col-lg-4 form-label" htmlFor="Description">
                    Description
                    <span className="text-danger">*</span>
                  </label>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      className="form-control m-0"
                      id="Description"
                      name="Description"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.Description}
                      placeholder="Enter a Description"
                    />
                    <div
                      id="Description-error"
                      className="invalid-feedback animated fadeInUp ms-3"
                      style={{ display: "block" }}
                    >
                      {errors.Description &&
                        touched.Description &&
                        errors.Description}
                    </div>
                  </div>
                </div>

                <div
                  className={`form-group mb-3 row ${values.BadgeIcon
                    ? errors.BadgeIcon
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                    }`}
                >
                  <label className="col-lg-4 form-label" htmlFor="BadgeIcon">
                  Medals Icon
                    <span className="text-danger">*</span>
                  </label>
                  <div className="col-lg-8">
                    <input
                      className={`form-control m-0 ${selectedFile && "d-none"}`}
                      id="BadgeIcon"
                      name="BadgeIcon"
                      onChange={(e) => {
                        handleChange(e);
                        onSelectFile(e);
                      }}
                      onBlur={handleBlur}
                      type="file"
                      accept="image/jpeg, image/png"
                    />

                    {selectedFile && (
                      <div className="w-100 justify-content-center d-flex">
                        <div className="d-inline-block position-relative">
                          <div
                            className="position-absolute top-0 start-100 translate-middle"
                            style={{ zIndex: 10 }}
                          >
                            <Button
                              size="sm"
                              variant="secondary"
                              className="rounded-circle"
                              onClick={() => {
                                const theInputIcon =
                                  document.querySelector("#BadgeIcon");

                                theInputIcon.value = null;
                                theInputIcon.files = null;
                                values.BadgeIcon = null;
                                setSelectedFile(null);
                              }}
                            >
                              <i className="fas fa-x" />
                            </Button>
                          </div>

                          <img
                            src={preview}
                            className="mt-2"
                            width={50}
                            height={50}
                          />
                        </div>
                      </div>
                    )}

                    <div
                      id="BadgeIcon-error"
                      className="invalid-feedback animated fadeInUp ms-3"
                      style={{ display: "block" }}
                    >
                      {errors.BadgeIcon &&
                        touched.BadgeIcon &&
                        errors.BadgeIcon}
                    </div>
                  </div>
                </div>

                <div
                  className={`form-group mb-3 row ${values.AwardType
                    ? errors.AwardType
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                    }`}
                >
                  <label className="col-lg-4 form-label" htmlFor="AwardType">
                    Award type
                  </label>
                  <div className="col-lg-8">
                    <select
                      type="text"
                      className="form-control m-0"
                      id="AwardType"
                      name="AwardType"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.AwardType}
                    >
                      <option value="manual">Manual</option>
                      <option value="auto">Auto</option>
                    </select>
                    <div
                      id="Status-error"
                      className="invalid-feedback animated fadeInUp ms-3"
                      style={{ display: "block" }}
                    >
                      {errors.AwardType && touched.AwardType && errors.AwardType}
                    </div>
                  </div>
                </div>
                {values.AwardType == "auto" && (
                  <>
                    <div
                      className={`form-group mb-3 row ${values.RuleDefintionID
                        ? errors.RuleDefintionID
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                        }`}
                    >
                      <label className="col-lg-4 form-label" htmlFor="RuleDefintionID">
                        Rule
                      </label>
                      <div className="col-lg-6">
                        <Select
                          id="RuleDefintionID"
                          options={ruleData ?? []}
                          onBlur={handleBlur}
                          onChange={(rule) => {
                            values.RuleDefintionID = rule.RuleID;
                          }}
                          onFocus={() => {
                            touched.RuleDefintionID = true;
                          }}
                          getOptionValue={(option) => option.label}
                          styles={{
                            input: (provided, state) => ({
                              ...provided,
                              paddingTop: "12px",
                              paddingBottom: "12px",
                            }),
                          }}
                        />
                        <div
                          id="ruldedefinitionid-error"
                          className="invalid-feedback animated fadeInUp ms-3"
                          style={{ display: "block" }}
                        >
                          {errors.RuleDefintionID &&
                            touched.RuleDefintionID &&
                            errors.RuleDefintionID}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`form-group mb-3 row ${values.Condition
                        ? errors.Condition
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                        }`}
                    >
                      <label className="col-lg-4 form-label" htmlFor="Condition">
                        Condition
                      </label>
                      <div className="col-lg-8">
                        <div className="row">
                          <div className="col-4">
                            <select
                              type="text"
                              className="form-control m-0"
                              id="Condition"
                              name="Condition"
                              onChange={(e) => { handleChange(e); checkOperator(e) }}
                              onBlur={handleBlur}
                              value={values.Condition}
                            >
                              {OPTIONS.CONDITION.map((item) => (
                                <option key={item.value} value={item.value}>
                                  {item.label}
                                </option>
                              ))}
                            </select>
                            <div
                              id="Status-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Condition && touched.Condition && errors.Condition}
                            </div>
                          </div>
                          {isOperator && (<div className="col-6">
                            <input
                              type="Number"
                              className="form-control m-0"
                              id="ConditionValue"
                              name="ConditionValue"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Enter condition value"
                              value={values.ConditionValue}
                            />
                            <div
                              id="Name-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.ConditionValue && touched.ConditionValue && errors.ConditionValue}
                            </div>
                          </div>)}
                        </div>
                      </div>
                    </div>
                  </>)}
                <div className="form-group row">
                  <div className="col-12 justify-content-end d-flex">
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
    </CustomModalUtil>
  );
}
