import { Formik } from "formik";
import * as Yup from "yup";
import { requestUpdate } from "../../../../services/RequestAPI";
import { useHistory, useParams } from "react-router-dom";
import Select from "react-select";
import { useContext, useState, useEffect } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { imgServer } from "../../../../dataConfig";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import {
  getApprover,
  getUserMasterPic,
} from "../../../../services/UsermasterAPI";

const theInputBanner = document.querySelector("#ImageURLText");
const today = new Date();

const ruleSchema = Yup.object().shape({
  RequestType: Yup.string().required("Please choose a Type"),

  RuleDefinitionID: Yup.number()
    .integer()
    .typeError("Please choose a Rule")
    .min(1000, "Please choose a Rule")
    .nullable(false)
    .required("Please choose a Rule"),

  Times: Yup.number()
    .min(1)
    .max(30)
    .required("Please enter times you done the rule")
    .integer(),

  Month: Yup.number()
    .integer()
    .min(1)
    .max(12)
    .nullable(false)
    .required("Please enter a month  "),

  Year: Yup.number()
    .integer()
    .nullable(false)

    .required("Please enter a year "),

  LinkRefer: Yup.string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "Enter correct url!"
    )
    .nullable(true),

  ProjectID: Yup.number()
    .integer()
    .min(1000)
    .nullable(false)
    .typeError("Please choose a project")
    .required("Please choose a project"),

  ImageURLText: Yup.mixed().test("fileSize", "The file is too large", () => {
    if (theInputBanner === null || theInputBanner.files[0] === undefined) {
      return true;
    }
    return theInputBanner.files[0].size <= 200000;
  }),

  Approver: Yup.string()
    .required("Please choose a approver")
    .typeError("Please choose a approver"),
});

const UpdatePointValidation = ({
  ruledefinitiondatas,
  data,
  projectData,
  BULUser,
}) => {
  const { userID } = useSelector((state) => state.UserSlice);
  const navigate = useHistory();
  const { role } = useSelector((a) => a.UserSlice);
  const [pic, setpic] = useState(
    ruledefinitiondatas
      ? ruledefinitiondatas
          .filter((list) => list.RuleID === data.RuleDefinitionID)
          .map((e) => e.Pics)[0]
      : 0
  );
  const [userpic] = useRefreshToken(getUserMasterPic, pic !== "" ? pic : 0);
  const [approver] = useRefreshToken(getApprover, data.Approver);
  const [pointofrule, setpointofrule] = useState(data.PointOfRule);

  let [click, setclick] = useState(false);
  const { PointName, DepartmentID } = useSelector(
    (a) => a.DepartmentSettingSlice
  );
  const { ID } = useParams();
  const { userDepartmentCode } = useSelector((a) => a.UserSlice);
  const [imgChange, setImgChange] = useState(false);
  const [theInputBanner, setTheInputBanner] = useState(
    document.querySelector("#ImageURLText")
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [deadImg, setDead] = useState(false);
  const [preview, setPreview] = useState(null);
  const numberInputInvalidChars = ["-", "+", "e", "E"];

  if (data.DepartmentCode !== userDepartmentCode) {
    navigate.push(`/page-error-403`);
  }

  if (data.Status !== 1 && role === "Member") {
    navigate.push(`/page-error-403`);
  } else if (data.Status !== 1 && role === "PM") {
    navigate.push(`/page-error-403`);
  } else if (data.Status !== 2 && role === "Head") {
    navigate.push(`/page-error-403`);
  }

  const defaultRule = {
    RuleDefinitionID: data.RuleDefinitionID,
    Point: data.Point,
    label: data.RuleName,
    RuleName: data.RuleName,
  };

  const { getToken, getTokenFormData } = useContext(GetTokenContext);
  useEffect(() => {
    if (data !== null)
      if (data.Evidence !== null) {
        if (
          data.Evidence === "" ||
          data.Evidence.slice(
            data.Evidence.length - 6,
            data.Evidence.length
          ) === ".com"
        )
          setImgChange(true);
      } else setImgChange(true);
  }, [data]);
  function createNewPoint(body) {
    const {
      Year,
      Times,
      ProjectID,
      Approver,
      RuleDefinitionID,
      Month,
      LinkRefer,
      ImageURLText,
    } = body;
    const newApprover = !isNaN(Approver) ? Approver : approver;
    const newLinkRefer = LinkRefer ? LinkRefer : null;
    let dataToSend;
    const theInputBanner = document.querySelector("#ImageURLText");
    function success() {
      navigate.goBack();
    }
    if (theInputBanner !== null && theInputBanner.files[0]) {
      const formData = new FormData();
      formData.append("Evidence", theInputBanner.files[0]);
      formData.append("RuleDefinitionID", RuleDefinitionID);
      formData.append("ProjectID", ProjectID);
      formData.append("Times", Times);
      formData.append("Month", Month);
      formData.append("Year", Year);
      formData.append("Approver", newApprover);
      dataToSend = formData;
      getTokenFormData(
        requestUpdate,
        "Request has been updated",
        success,
        false,
        ID,
        dataToSend
      );
    } else if (ImageURLText) {
      const formData = new FormData();
      formData.append("RuleDefinitionID", RuleDefinitionID);
      formData.append("ProjectID", ProjectID);
      formData.append("Times", Times);
      formData.append("Month", Month);
      formData.append("Year", Year);
      formData.append("Approver", newApprover);
      dataToSend = formData;
      getTokenFormData(
        requestUpdate,
        "Request has been updated",
        success,
        false,
        ID,
        dataToSend
      );
    } else {
      dataToSend = {
        RuleDefinitionID,
        ProjectID,
        Approver: newApprover,
        Year,
        Times,
        Month,
        Evidence: newLinkRefer,
      };
      getToken(
        requestUpdate,
        "Request has been updated",
        success,
        false,
        ID,
        dataToSend
      );
    }

    // theInputBanner !== null && theInputBanner.files[0]
    //   ? getTokenFormData(
    //       requestUpdate,
    //       "Request has been updated",
    //       success,
    //       false,
    //       ID,
    //       dataToSend
    //     )
    //   : getToken(
    //       requestUpdate,
    //       "Request has been updated",
    //       success,
    //       false,
    //       ID,
    //       dataToSend
    //     );
  }
  const setselected = () => {
    setselect(document.getElementById("RequestType").value);
  };
  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    const maxAllowedSize = 200000;
    if (e.target.files[0].size > maxAllowedSize) {
      document.getElementById("fileSizeAlert").style.display = "block";
      e.target.value = null;
    }
    // I've kept this example simple by using the first image instead of multiple
    else {
      document.getElementById("fileSizeAlert").style.display = "none";
      setSelectedFile(e.target.files[0]);
    }
  };
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
  const defaultValue = {
    check: ruledefinitiondatas.Pics,
    pic: "",
    RequestType: "Point",
    Confirmer: data.Confirmer,
    UserMasterID: userID,
    Approver: data.Approver,
    ProjectName: data.ProjectCode,
    RuleDefinitionID: data.RuleDefinitionID,
    Times: data.Times,
    Month: data.Month,
    Year: data.Year,
    Point: data.Point,
    DepartmentID: DepartmentID,
    ProjectID: data.ProjectID,

    LinkRefer:
      data.Evidence !== null && data.Evidence.split("/")[1] !== "public"
        ? data.Evidence
        : null,
    ImageURLText:
      data.Evidence !== null && data.Evidence.split("/")[1] === "public"
        ? data.Evidence
        : null,
  };
  if (userpic) {
    defaultValue.pic = userpic;
  }
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Update Request</h4>
          </div>
          <div className="card-body">
            <div className="form-validation">
              <Formik
                initialValues={defaultValue}
                validationSchema={ruleSchema}
                validator={() => ({})}
                onSubmit={(values, { setSubmitting }) => {
                  createNewPoint(values);
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
                        <div className={`form-group mb-3 row`}>
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="RequestType"
                          >
                            Requester
                          </label>

                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control m-0 pe-none"
                              readOnly
                              defaultValue={data.Account}
                              disabled={true}
                            />
                          </div>
                        </div>

                        <div
                          className={`form-group mb-3 row ${
                            values.RequestType
                              ? errors.RequestType
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="RequestType"
                          >
                            Request Type
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              readOnly
                              value={values.RequestType}
                              className="form-control m-0 pe-none text-secondary"
                              disabled={true}
                            />
                          </div>
                        </div>

                        <div
                          className={`form-group mb-3 row ${
                            values.RuleDefinitionID
                              ? errors.RuleDefinitionID
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="RuleDefinitionID"
                          >
                            Rule Definition
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <Select
                              options={ruledefinitiondatas}
                              disabled={true}
                              onBlur={handleBlur}
                              defaultValue={defaultRule}
                              onChange={(rule) => {
                                setpic(rule.Pics);
                                values.check = rule.Pics;
                                values.Approver = rule.Pics;
                                values.RuleDefinitionID = rule.RuleID;
                                values.Point = rule.Point || 1;
                                values.PointOfRule =
                                  +values.Point * +values.Times;
                                setpointofrule(rule.Point);
                                setclick(true);
                              }}
                              onFocus={() => {
                                touched.RuleDefinitionID = true;
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
                              {errors.RuleDefinitionID &&
                                touched.RuleDefinitionID &&
                                errors.RuleDefinitionID}
                            </div>
                          </div>
                        </div>
                        {pointofrule && (
                          <>
                            <div className={`form-group mb-3 row`}>
                              <label
                                className="col-lg-4 form-label d-flex align-items-center"
                                htmlFor="Submitter"
                              >
                                Point of Rule
                              </label>
                              <div className="col-lg-6 ">
                                <input
                                  type="text"
                                  readOnly
                                  value={pointofrule}
                                  className="form-control m-0 pe-none"
                                  disabled={true}
                                />
                              </div>
                            </div>
                          </>
                        )}
                        <div
                          className={`form-group mb-3 row ${
                            values.Approver
                              ? errors.Approver
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          {userpic !== null ? (
                            <>
                              <label
                                className="col-lg-4 form-label"
                                htmlFor="Submitter"
                              >
                                Approver
                                <span className="text-danger">*</span>
                              </label>
                              <div className="col-lg-6">
                                <input
                                  type="text"
                                  readOnly
                                  value={userpic}
                                  className="form-control m-0 pe-none"
                                  disabled={true}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              {data.Approver === values.check ? (
                                <>
                                  <label
                                    className="col-lg-4 form-label"
                                    htmlFor="Submitter"
                                  >
                                    Approver
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div className="col-lg-6">
                                    <input
                                      type="text"
                                      readOnly
                                      value={data.Approver}
                                      className="form-control m-0 pe-none"
                                      disabled={true}
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <label
                                    className="col-lg-4 form-label"
                                    htmlFor="Submitter"
                                  >
                                    Approver{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div className="col-lg-6">
                                    <Select
                                      options={BULUser}
                                      onBlur={handleBlur}
                                      defaultValue={
                                        click
                                          ? "Select..."
                                          : { label: data.Approver }
                                      }
                                      onChange={(BUL) => {
                                        values.Approver = BUL.ID;
                                      }}
                                      onFocus={() => {
                                        touched.Approver = true;
                                      }}
                                      getOptionValue={(option) =>
                                        option.Account
                                      }
                                      styles={{
                                        input: (provided, state) => ({
                                          ...provided,
                                          paddingTop: "12px",
                                          paddingBottom: "12px",
                                        }),
                                      }}
                                    />

                                    <div
                                      id="Approver-error"
                                      className="invalid-feedback animated fadeInUp ms-3"
                                      style={{ display: "block" }}
                                    >
                                      {errors.Approver &&
                                        touched.Approver &&
                                        errors.Approver}
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                          {/* {userpic === null ? (
                            <>
                              <label
                                className="col-lg-4 form-label"
                                htmlFor="Submitter"
                              >
                                Approver
                              </label>
                              <div className="col-lg-6">
                                <Select
                                  options={BULUser}
                                  onBlur={handleBlur}
                                  defaultValue={{ label: data.Approver }}
                                  onChange={(BUL) => {
                                    values.Approver = BUL.Account;
                                  }}
                                  onFocus={() => {
                                    touched.Approver = true;
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
                                  id="Approver-error"
                                  className="invalid-feedback animated fadeInUp ms-3"
                                  style={{ display: "block" }}
                                >
                                  {errors.Approver &&
                                    touched.Approver &&
                                    errors.Approver}
                                </div>
                              </div>
                            </>
                          ) : (
                            ""
                          )} */}
                        </div>

                        <div
                          className={`form-group mb-3 row ${
                            values.Times
                              ? errors.Times
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="Times"
                          >
                            Times<span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              min={1}
                              type="number"
                              onKeyDown={(e) => {
                                if (numberInputInvalidChars.includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              className="form-control m-0"
                              id="Times"
                              name="Times"
                              onChange={(e) => {
                                handleChange(e);
                                values.PointOfRule =
                                  +values.Point * +values.Times;
                              }}
                              onBlur={handleBlur}
                              value={values.Times}
                              placeholder="Enter a number of times.."
                            />
                            <div
                              id="times-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Times && touched.Times && errors.Times}
                            </div>
                          </div>
                        </div>

                        <div className={`form-group mb-3 row`}>
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="PointOfRule"
                          >
                            {PointName} of Rule
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="number"
                              className="form-control m-0"
                              value={+values.Point * +values.Times}
                              placeholder="0"
                              disabled={true}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div
                          className={`form-group mb-3 row ${
                            values.ProjectName
                              ? errors.ProjectName
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="ProjectID"
                          >
                            Project <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <Select
                              options={projectData}
                              onBlur={handleBlur}
                              id="ProjectID"
                              name="ProjectID"
                              defaultValue={{
                                label: data.ProjectCode,
                                manager: data.Confirmer,
                                projectID: data.ProjectID,
                              }}
                              onChange={(project) => {
                                values.ProjectID = project.projectID;
                                values.ProjectName = project.code;
                                values.Confirmer = project.manager;
                              }}
                              onFocus={() => {
                                touched.ProjectID = true;
                              }}
                              getOptionValue={(option) => option.projectID}
                              styles={{
                                input: (provided, state) => ({
                                  ...provided,
                                  paddingTop: "12px",
                                  paddingBottom: "12px",
                                }),
                                menuList: (styles) => ({
                                  ...styles,
                                  maxHeight: "130px",
                                }),
                              }}
                            />
                            <div
                              id="ProjectID-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.ProjectID &&
                                touched.ProjectID &&
                                errors.ProjectID}
                            </div>
                          </div>
                        </div>
                        <div className={`form-group mb-3 row`}>
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="Submitter"
                          >
                            Confirm By
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              readOnly
                              value={
                                values.Confirmer ? values.Confirmer : "No data"
                              }
                              className="form-control m-0 pe-none text-secondary"
                              disabled={true}
                            />
                          </div>
                        </div>

                        <div
                          className={`form-group mb-3 row ${
                            values.Month
                              ? errors.Month
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="Month"
                          >
                            Month<span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              min={1}
                              type="number"
                              onKeyDown={(e) => {
                                if (numberInputInvalidChars.includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              className="form-control m-0"
                              id="Month"
                              name="Month"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.Month}
                              placeholder="Enter a month.."
                            />
                            <div
                              id="month-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Month && touched.Month && errors.Month}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`form-group mb-3 row ${
                            values.Year
                              ? errors.Year
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label className="col-lg-4 form-label" htmlFor="Year">
                            Year<span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="number"
                              onKeyDown={(e) => {
                                if (numberInputInvalidChars.includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              className="form-control m-0"
                              id="Year"
                              name="Year"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.Year}
                              placeholder="Enter a year.."
                            />
                            <div
                              id="year-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Year && touched.Year && errors.Year}
                            </div>
                          </div>
                        </div>

                        {!values.ImageURLText && (
                          <div
                            className={`form-group mb-3 row ${
                              values.LinkRefer
                                ? errors.LinkRefer
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                            }`}
                          >
                            <label
                              className="col-lg-4 form-label"
                              htmlFor="LinkRefer"
                            >
                              Link Refer
                            </label>
                            <div className="col-lg-6">
                              <input
                                className="form-control m-0"
                                id="LinkRefer"
                                name="LinkRefer"
                                onChange={(e) => {
                                  handleChange(e);
                                  if (e.target.value == "") {
                                    setImgChange(true);
                                  } else {
                                    setImgChange(false);
                                  }
                                  document.getElementById(
                                    "updateButton"
                                  ).disabled = false;
                                }}
                                onBlur={handleBlur}
                                value={values.LinkRefer}
                                type="text"
                              />

                              <div
                                id="LinkRefer-error"
                                className="invalid-feedback animated fadeInUp ms-3"
                                style={{ display: "block" }}
                              >
                                {errors.LinkRefer &&
                                  touched.LinkRefer &&
                                  errors.LinkRefer}
                              </div>
                            </div>
                          </div>
                        )}

                        {!values.LinkRefer && (
                          <div
                            className={`form-group mb-3 row ${
                              values.ImageURLText
                                ? errors.ImageURLText
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                            }`}
                          >
                            <label
                              className="col-lg-4 form-label"
                              htmlFor="ImageURLText"
                            >
                              Image
                            </label>

                            <div className="col-lg-6">
                              {imgChange && selectedFile && (
                                <div className="d-inline-block  position-relative">
                                  <div
                                    className="position-absolute top-0 start-100 translate-middle"
                                    style={{ zIndex: 10 }}
                                  >
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="rounded-circle"
                                      onClick={() => {
                                        const theInputBanner =
                                          document.querySelector(
                                            "#ImageURLText"
                                          );

                                        theInputBanner.value = null;
                                        values.Image = null;
                                        theInputBanner.files = null;
                                        values.ImageURLText = null;
                                        setSelectedFile(false);
                                      }}
                                    >
                                      <i className="fas fa-x" />
                                    </Button>
                                  </div>
                                  <img
                                    src={preview}
                                    height={60}
                                    className=" mb-3"
                                  />
                                </div>
                              )}

                              {imgChange && (
                                <input
                                  className={`form-control m-0 ${
                                    selectedFile && "d-none"
                                  }`}
                                  id="ImageURLText"
                                  defaultValue={
                                    data !== null
                                      ? data.Evidence !== null
                                        ? data.Evidence.includes(".com")
                                          ? ""
                                          : ""
                                        : ""
                                      : ""
                                  }
                                  name="ImageURLText"
                                  onChange={(e) => {
                                    if (e.target.files[0].size > 200000) {
                                      values.ImageURLText = null;
                                      document.getElementById(
                                        "updateButton"
                                      ).disabled = true;
                                    } else {
                                      document.getElementById(
                                        "updateButton"
                                      ).disabled = false;
                                      handleChange(e);
                                    }
                                    onSelectFile(e);
                                  }}
                                  onBlur={handleBlur}
                                  type="file"
                                  accept=".png, .jpg, .jpeg"
                                />
                              )}
                              <div
                                id="fileSizeAlert"
                                style={{ color: "red", display: "none" }}
                              >
                                Please choose the file that have size smaller
                                than 200kb
                              </div>
                              {!imgChange && (
                                <div className="d-inline-block  position-relative pt-2">
                                  <div
                                    className="position-absolute top-0 start-100 translate-middle"
                                    style={{ zIndex: 10 }}
                                  >
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="rounded-circle"
                                      onClick={() => {
                                        values.ImageURLText = null;
                                        setImgChange(true);
                                      }}
                                    >
                                      <i className="fas fa-x" />
                                    </Button>
                                  </div>

                                  {deadImg ? (
                                    <span className="">No Image</span>
                                  ) : (
                                    <img
                                      src={`${imgServer}${data.Evidence}`}
                                      height={60}
                                      className=" mt-3"
                                      onError={(e) => {
                                        setDead(true);
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                              <div
                                id="ImageURLText-error"
                                className="invalid-feedback animated fadeInUp ms-3"
                                style={{ display: "block" }}
                              >
                                {errors.ImageURLText &&
                                  touched.ImageURLText &&
                                  errors.ImageURLText}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="form-group mb-3 row">
                          <div className="col-lg-4"></div>
                          <div className="col-lg-6">
                            <button
                              type="submit"
                              id="updateButton"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePointValidation;
