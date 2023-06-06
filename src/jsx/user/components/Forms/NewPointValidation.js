import { useContext, useState, useEffect } from "react";
import { Formik } from "formik";
import { Button } from "@mui/material";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { createSelfRequest } from "../../../../services/RequestAPI";
import Select from "react-select";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useHistory } from "react-router-dom";
import { getAllCampaignNopage } from "../../../../services/CampaignAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { useRef } from "react";
import { UpdateEvidence } from "../../../../services/CampaignAPI";
import { getAllCampaignMoocNopage } from "../../../../services/CampaignAPI";
import { UpdateEvidenceMoocCampaign } from "../../../../services/CampaignAPI";
import { getAllUserCampaignMoocNopage } from "../../../../services/CampaignAPI";
import { getUserMasterPic } from "../../../../services/UsermasterAPI";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { set } from "date-fns";
const today = new Date();

const imageWarningTooltip = {
  width: "175px",
  fontSize: "10px",
  fontWeight: "normal",
  opacity: 1,
  padding: "8px",
};

const NewPointValidation = ({
  BULUser,
  ruledefinitiondatas,
  projectdatas,
  DefaultHeadData,
}) => {
  const [campaignID, setcampaignID] = useState();
  const [MoocCampaign, setMoocCampaign] = useState();
  const RequestRef = useRef();
  const { DepartmentID } = useSelector((state) => state.DepartmentSettingSlice);
  const { PointName } = useSelector((a) => a.DepartmentSettingSlice);
  const { account, userID } = useSelector((a) => a.UserSlice);
  const { getToken, getTokenFormData } = useContext(GetTokenContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [deadImg, setDead] = useState(true);
  const [pointofrule, setpointofrule] = useState();

  const [preview, setPreview] = useState(null);
  const [imgChange, setImgChange] = useState(true);
  const [showbutton, setshowbutton] = useState(true);

  const navigate = useHistory();
  const [campaignlist] = useRefreshToken(getAllCampaignNopage, userID);
  const numberInputInvalidChars = ["-", "+", "e", "E"];
  const options = [
    { ID: "Point", label: "Point" },
    // { ID: "Campaign", label: "Campaign" },
  ];
  const [campaignMooclist, setRefreshMoocCampaign] = useRefreshToken(
    getAllCampaignMoocNopage,
    campaignID
  );
  const [usermooccampaign] = useRefreshToken(
    getAllUserCampaignMoocNopage,
    MoocCampaign,
    userID
  );
  const [select, setselect] = useState("Point");
  let [check, setcheck] = useState(0);
  const [pic, setpic] = useState(0);
  const [userpic] = useRefreshToken(getUserMasterPic, pic !== "" ? pic : 0);
  const theInputBanner = document.querySelector("#ImageURLText");
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
      .integer("Please enter times you done the rule"),

    Month: Yup.number()
      .integer()
      .min(1, "Please enter Month greater than 0")
      .max(12, "Please enter Month less than 13")
      .nullable(false)
      .required("Please enter a month"),

    Year: Yup.number()
      .integer()
      .nullable(false)
      .min(1, "Please enter Year greater than 1")
      .max(
        today.getFullYear(),
        `Please enter Year equal or less than ${today.getFullYear()}`
      )
      .required("Please enter a year "),

    LinkRefer: Yup.string()
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        "Enter correct url!"
      )
      .nullable(true),

    ProjectID: Yup.number()
      .integer()
      .min(1000, "Please choose a project")
      .nullable(false)
      .typeError("Please choose a project")
      .required("Please choose a project"),

    ImageURLText: Yup.mixed().test("fileSize", "The file is too large", () => {
      if (theInputBanner === null || theInputBanner.files[0] === undefined) {
        return true;
      }
      return theInputBanner.files[0].size <= 3145728;
    }),

    Approver: Yup.string()
      .required("Please choose a approver")
      .typeError("Please choose a approver"),
  });
  const campaignSchema = Yup.object().shape({
    RequestType: Yup.string(),
    LinkRefer: Yup.string()
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        "Enter correct url!"
      )
      .nullable(true),
    Description: Yup.string(),
    IDCampaign: Yup.number()
      .integer()
      .typeError("Please choose a Campaign")
      .nullable(false)
      .required("Please choose a Campaign"),
    ImageURLText: Yup.mixed().test("fileSize", "The file is too large", () => {
      if (theInputBanner === null || theInputBanner.files[0] === undefined) {
        return true;
      }
      return theInputBanner.files[0].size <= 200000;
    }),
  });

  function createNewPoint(body) {
    const {
      Year,
      Times,
      RuleDefinitionID,
      ProjectID,
      Month,
      LinkRefer,
      Approver,
    } = body;
    let dataToSend;

    const theInputBanner = document.querySelector("#ImageURLText");

    if (theInputBanner !== null && theInputBanner.files[0]) {
      const formData = new FormData();
      formData.append("UserMasterID", userID);
      formData.append("Evidence", theInputBanner.files[0]);
      formData.append("RuleDefinitionID", RuleDefinitionID);
      formData.append("ProjectID", ProjectID);
      formData.append("Times", Times);
      formData.append("Month", Month);
      formData.append("Year", Year);
      formData.append("Approver", Approver);
      formData.append("DepartmentID", DepartmentID);
      dataToSend = formData;
    } else {
      dataToSend = {
        UserMasterID: userID,
        RuleDefinitionID,
        ProjectID,
        Approver,
        Year,
        Times,
        Month,
        Evidence: LinkRefer,
        DepartmentID: DepartmentID,
      };
    }

    function success() {
      // navigate.push(`/point/request`);
    }

    theInputBanner !== null && theInputBanner.files[0]
      ? getTokenFormData(
          createSelfRequest,
          "New request has been created",
          success,
          false,
          dataToSend
        )
      : getToken(
          createSelfRequest,
          "New request has been created",
          success,
          false,
          dataToSend
        );
  }

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    const maxAllowedSize = 200000;
    if (e.target.files[0].size > maxAllowedSize) {
      e.target.value = null;
      document.getElementById("fileSizeAlert").style.display = "block";
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
  function updatevidence(body) {
    const Status = 2;
    const { LinkRefer, Description, IDCampaign, MoocCampaign } = body;

    let dataToSend;
    const theInputBanner = document.querySelector("#ImageURLText");
    if (MoocCampaign !== "") {
      if (theInputBanner !== null && theInputBanner.files[0]) {
        const formData = new FormData();
        formData.append("Evidence", theInputBanner.files[0]);
        formData.append("Description", Description);
        formData.append("Status", Status);
        dataToSend = formData;
      } else {
        dataToSend = {
          Description,
          Evidence: LinkRefer,
          Status: 2,
        };
      }
      function success() {
        navigate.push(`/campaign/request`);
      }
      theInputBanner !== null && theInputBanner.files[0]
        ? getTokenFormData(
            UpdateEvidenceMoocCampaign,
            "New request has been created",
            success,
            false,
            usermooccampaign,
            dataToSend
          )
        : getToken(
            UpdateEvidenceMoocCampaign,
            "New request has been created",
            success,
            false,
            usermooccampaign,
            dataToSend
          );
    } else {
      if (theInputBanner !== null && theInputBanner.files[0]) {
        const formData = new FormData();
        formData.append("Evidence", theInputBanner.files[0]);
        formData.append("Description", Description);
        formData.append("Status", Status);
        dataToSend = formData;
      } else {
        dataToSend = {
          Description,
          Evidence: LinkRefer,
          Status: 2,
        };
      }
      function success() {
        navigate.push(`/campaign/request`);
      }
      theInputBanner !== null && theInputBanner.files[0]
        ? getTokenFormData(
            UpdateEvidence,
            "New request has been created",
            success,
            false,
            IDCampaign,
            dataToSend
          )
        : getToken(
            UpdateEvidence,
            "New request has been created",
            success,
            false,
            IDCampaign,
            dataToSend
          );
    }
  }
  // const setselected = () => {
  //   setselect(document.getElementById("RequestType").value);
  //   console.log("here setselected");
  // };
  const defaultValue = {
    pic: "",
    RequestType: "Point",
    RuleDefinitionID: 0,
    Times: 1,
    Month: today.getMonth() + 1,
    Year: today.getFullYear(),
    Point: 1,
    PointOfRule: 0,
    LinkRefer: null,
    ImageURLText: null,
    ProjectID: 0,
    Approver: "",
    Description: "",
    IDCampaign: "",
  };

  const formIsEmtry = (values) => {
    return (
      values.ProjectID == "" ||
      values.RequestType == "" ||
      values.RuleDefinitionID == "" ||
      values.Approver == "" ||
      values.Times <= 0 ||
      values.Month == "" ||
      values.Year == ""
    );
  };
  if (userpic) {
    defaultValue.pic = userpic;
  }
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">New Request</h4>
          </div>
          <div className="card-body">
            <div className="form-validation">
              {select === "Point" && (
                <Formik
                  initialValues={defaultValue}
                  validationSchema={ruleSchema}
                  validator={() => ({})}
                  onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(true);
                    createNewPoint(values);
                    setcheck(1);
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
                    resetForm,
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
                              className="col-lg-4 form-label d-flex align-items-center"
                              htmlFor="RequestType"
                            >
                              Requester
                            </label>

                            <div className="col-lg-6">
                              <input
                                disabled={true}
                                type="text"
                                className="form-control m-0 pe-none"
                                readOnly
                                defaultValue={account}
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
                              className="col-lg-4 form-label d-flex align-items-center "
                              htmlFor="RequestType"
                            >
                              Request Type
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-lg-6">
                              {/* <Select
                                disabled={true}
                                id="RequestType"
                                name="RequestType"
                                options={options}
                                onBlur={handleBlur}
                                defaultValue={options[0]}
                                onChange={(e) => {
                                  values.RequestType = e.ID;
                                  setselect(e.ID);
                                }}
                                onFocus={() => {
                                  touched.RequestType = true;
                                }}
                                getOptionValue={(option) => option.label}
                                styles={{
                                  input: (provided, state) => ({
                                    ...provided,
                                    paddingTop: "12px",
                                    paddingBottom: "12px",
                                  }),
                                }}
                              /> */}
                              <input
                                disabled={true}
                                type="text"
                                className="form-control m-0 pe-none"
                                readOnly
                                defaultValue={"Point"}
                              />

                              {/* <select
                                className="form-control m-0"
                                id="RequestType"
                                name="RequestType"
                                onChange={setselected}
                                onBlur={handleBlur}
                                // defaultValue={values.RequestType}
                                ref={RequestRef}
                              >
                                <option value="Point">Point</option>
                                <option value="Campaign">Campaign</option>
                              </select> */}
                              <div
                                id="RequestType-error"
                                className="invalid-feedback animated fadeInUp ms-3"
                                style={{ display: "block" }}
                              >
                                {errors.RequestType &&
                                  touched.RequestType &&
                                  errors.RequestType}
                              </div>
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
                              className="col-lg-4 form-label d-flex align-items-center"
                              htmlFor="RuleDefinitionID"
                            >
                              Rule Definition
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-lg-6">
                              <Select
                                id="RuleSelect"
                                options={ruledefinitiondatas}
                                onBlur={handleBlur}
                                onChange={(rule) => {
                                  setpic(rule.Pics);
                                  values.Approver = rule.Pics;
                                  values.RuleDefinitionID = rule.RuleID;
                                  values.Point = rule.Point || 1;
                                  values.Effort = 1;
                                  values.KPer = 1;
                                  values.PointOfRule =
                                    +values.Point * +values.Times;
                                  setpointofrule(rule.Point);
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
                          <div className={`form-group mb-3 row`}>
                            <label
                              className="col-lg-4 form-label d-flex align-items-center"
                              htmlFor="PointOfRule"
                            >
                              {PointName} of Rule
                            </label>
                            <div className="col-lg-6">
                              <input
                                type="number"
                                className="form-control m-0"
                                value={+values.Point}
                                placeholder="0"
                                disabled={true}
                              />
                            </div>
                          </div>
                          {userpic !== null ? (
                            <>
                              <div className={`form-group mb-3 row`}>
                                <label
                                  className="col-lg-4 form-label d-flex align-items-center"
                                  htmlFor="Submitter"
                                >
                                  Approver
                                </label>
                                <div className="col-lg-6 mt-3">
                                  <input
                                    type="text"
                                    readOnly
                                    value={userpic}
                                    className="form-control m-0 pe-none"
                                    disabled={true}
                                  />
                                </div>
                              </div>
                            </>
                          ) : (
                            ""
                          )}

                          {userpic === null ? (
                            <>
                              <div
                                className={`form-group mb-3 row ${
                                  values.Approver
                                    ? errors.Approver
                                      ? "is-invalid"
                                      : "is-valid"
                                    : ""
                                }`}
                              >
                                <label
                                  className="col-lg-4 form-label d-flex align-items-center"
                                  htmlFor="Submitter"
                                >
                                  Approver
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="col-lg-6">
                                  <Select
                                    options={BULUser}
                                    onBlur={handleBlur}
                                    defaultValue={DefaultHeadData}
                                    onChange={(BUL, e) => {
                                      values.Approver = BUL.ID;
                                      // handleChange(BUL);
                                      // handleChange(e);
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
                              </div>
                            </>
                          ) : (
                            ""
                          )}

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
                              className="col-lg-4 form-label d-flex align-items-center"
                              htmlFor="Times"
                            >
                              Times<span className="text-danger">*</span>
                            </label>
                            <div className="col-lg-6">
                              <input
                                type="number"
                                onKeyDown={(e) => {
                                  if (numberInputInvalidChars.includes(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                                min={1}
                                // max={30}
                                className="form-control m-0"
                                id="Times"
                                name="Times"
                                // defaultValue={1}
                                onChange={(e) => {
                                  values.PointOfRule =
                                    +values.Point * +values.Times;
                                  handleChange(e);
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

                              <div
                                id="times-error"
                                className="invalid-feedback animated fadeInUp ms-3"
                                style={{ display: "block" }}
                              />
                            </div>
                          </div>

                          <div className={`form-group mb-3 row`}>
                            <label
                              className="col-lg-4 form-label d-flex align-items-center"
                              htmlFor="TotalPoint"
                            >
                              Total {PointName} of Rule
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
                              values.ProjectID
                                ? errors.ProjectID
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                            }`}
                          >
                            <label
                              className="col-lg-4 form-label d-flex align-items-center"
                              htmlFor="ProjectID"
                            >
                              Project Code
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-lg-6">
                              <Select
                                options={projectdatas}
                                onBlur={handleBlur}
                                className="w-100"
                                onClick={() => {
                                  setshowbutton(false);
                                }}
                                onChange={(project) => {
                                  values.ProjectID = project.projectid;
                                  values.Confirmer = project.manager;
                                }}
                                onFocus={() => {
                                  touched.ProjectID = true;
                                }}
                                getOptionValue={(option) => option.label}
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
                                id="projectid-error"
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
                              className="col-lg-4 form-label d-flex align-items-center"
                              htmlFor="Submitter"
                            >
                              Confirm By
                            </label>
                            <div className="col-lg-6">
                              <input
                                type="text"
                                readOnly
                                value={values.Confirmer}
                                className="form-control m-0 pe-none"
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
                              className="col-lg-4 form-label d-flex align-items-center"
                              htmlFor="Month"
                            >
                              Month<span className="text-danger">*</span>
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
                                id="Month"
                                name="Month"
                                max={12}
                                min={1}
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
                            <label
                              className="col-lg-4 form-label d-flex align-items-center"
                              htmlFor="Year"
                            >
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
                                max={today.getFullYear()}
                                min={1999}
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
                                className="col-lg-4 form-label d-flex align-items-center"
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
                                      "submitButton"
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
                                className="col-lg-4 form-label d-flex align-items-center"
                                // htmlFor="ImageURLText"
                              >
                                Image &nbsp;
                                <i
                                  id="image-warning"
                                  style={{ fontSize: "13px" }}
                                  class="bi bi-exclamation-circle text-danger"
                                ></i>
                                <ReactTooltip
                                  anchorId="image-warning"
                                  style={imageWarningTooltip}
                                  place="top"
                                  variant="dark"
                                  content="This application exclusively accepts image files in the .png, .jpg, or .jpeg format with a maximum file size of 200kb."
                                />
                              </label>

                              <div className="col-lg-6">
                                {imgChange && selectedFile && (
                                  <div className="d-inline-block  position-relative">
                                    {showbutton ? (
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
                                    ) : (
                                      ""
                                    )}

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
                                    name="ImageURLText"
                                    onChange={(e) => {
                                      if (e.target.files[0].size > 200000) {
                                        values.ImageURLText = null;
                                        document.getElementById(
                                          "submitButton"
                                        ).disabled = true;
                                      } else {
                                        document.getElementById(
                                          "submitButton"
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
                                          values.Image = null;
                                          setImgChange(true);
                                        }}
                                      >
                                        <i className="fas fa-x" />
                                      </Button>
                                    </div>

                                    <>
                                      <div
                                        id="ImageURLText-error"
                                        className="invalid-feedback animated fadeInUp ms-3"
                                        style={{ display: "block" }}
                                        onError={(e) => {
                                          setDead(true);
                                        }}
                                      >
                                        {errors.ImageURLText &&
                                          touched.ImageURLText &&
                                          errors.ImageURLText}
                                      </div>
                                    </>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="form-group mb-3 row">
                            <div className="col-lg-4"></div>
                            <div className="col-lg-6">
                              {check === 0 ? (
                                <button
                                  type="submit"
                                  id="submitButton"
                                  className="btn btn-primary"
                                  disabled={formIsEmtry(values)}
                                  onClick={(e) => {
                                    e.target.blur();
                                  }}
                                >
                                  Submit
                                </button>
                              ) : (
                                <button
                                  type="submit"
                                  id="submitButton"
                                  className="btn btn-primary"
                                  disabled={true}
                                  onClick={(e) => {
                                    e.target.blur();
                                  }}
                                >
                                  Submit
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                </Formik>
              )}
            </div>
            <div className="form-validate">
              {select === "Campaign" && (
                <Formik
                  initialValues={{
                    RequestType: "Campaign",
                    LinkRefer: "",
                    ImageURLText: "",
                    Description: " ",
                    IDCampaign: "",
                    MoocCampaign: "",
                  }}
                  validationSchema={campaignSchema}
                  validator={() => ({})}
                  onSubmit={(values, { setSubmitting }) => {
                    updatevidence(values);
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
                                defaultValue={account}
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
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-lg-6">
                              <Select
                                id="RequestType"
                                name="RequestType"
                                options={options}
                                defaultValue={options[1]}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  values.RequestType = e.ID;
                                  setselect(e.ID);
                                }}
                                onFocus={() => {
                                  touched.RequestType = true;
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
                                id="RequestType-error"
                                className="invalid-feedback animated fadeInUp ms-3"
                                style={{ display: "block" }}
                              >
                                {errors.RequestType &&
                                  touched.RequestType &&
                                  errors.RequestType}
                              </div>
                            </div>
                          </div>

                          {campaignlist === null ? (
                            <div> List Campaigns : No data</div>
                          ) : (
                            <div
                              className={`form-group mb-3 row ${
                                values.IDCampaign
                                  ? errors.IDCampaign
                                    ? "is-invalid"
                                    : "is-valid"
                                  : ""
                              }`}
                            >
                              <label
                                className="col-lg-4 form-label"
                                htmlFor="IDCampaign"
                              >
                                List Campaigns
                                <span className="text-danger">*</span>
                              </label>
                              <div className="col-lg-6">
                                <Select
                                  options={campaignlist}
                                  onBlur={handleBlur}
                                  onChange={(campaignlist) => {
                                    setRefreshMoocCampaign(new Date());
                                    values.IDCampaign = campaignlist.ID;
                                    values.Confirmer = campaignlist.Confirmer;
                                    setcampaignID(campaignlist.CampaignID);
                                  }}
                                  onFocus={() => {
                                    touched.IDCampaign = true;
                                  }}
                                  getOptionValue={(option) => option.label}
                                  styles={{
                                    input: (provided, state) => ({
                                      ...provided,
                                      paddingTop: "12px",
                                      paddingBottom: "12px",
                                    }),
                                  }}
                                ></Select>
                                <div
                                  id="IDCampaign-error"
                                  className="invalid-feedback animated fadeInUp ms-3"
                                  style={{ display: "block" }}
                                >
                                  {errors.IDCampaign &&
                                    touched.IDCampaign &&
                                    errors.IDCampaign}
                                </div>
                              </div>

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
                                  value={values.Confirmer}
                                  className="form-control m-0 pe-none"
                                  disabled={true}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="col-xl-6">
                          {campaignMooclist.length > 0 ? (
                            <div
                              className={`form-group mb-3 row ${
                                values.MoocCampaign
                                  ? errors.MoocCampaign
                                    ? "is-invalid"
                                    : "is-valid"
                                  : ""
                              }`}
                            >
                              <label
                                className="col-lg-4 form-label"
                                htmlFor="MoocCampaign"
                              >
                                Mooc Campaign
                              </label>
                              <div className="col-lg-6">
                                <Select
                                  options={campaignMooclist}
                                  onBlur={handleBlur}
                                  onChange={(campaignMococlist) => {
                                    values.MoocCampaign = campaignMococlist.ID;
                                    setMoocCampaign(campaignMococlist.ID);
                                  }}
                                  onFocus={() => {
                                    touched.IDCampaign = true;
                                  }}
                                  getOptionValue={(option) => option.label}
                                  styles={{
                                    input: (provided, state) => ({
                                      ...provided,
                                      paddingTop: "12px",
                                      paddingBottom: "12px",
                                    }),
                                  }}
                                ></Select>

                                <div
                                  id="MoocCampaign-error"
                                  className="invalid-feedback animated fadeInUp ms-3"
                                  style={{ display: "block" }}
                                >
                                  {errors.MoocCampaign &&
                                    touched.MoocCampaign &&
                                    errors.MoocCampaign}
                                </div>
                              </div>
                            </div>
                          ) : (
                            (values.MoocCampaign = "")
                          )}

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
                                  onChange={() => {
                                    handleChange();
                                    document.getElementById(
                                      "submitButton"
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
                                    name="ImageURLText"
                                    onChange={(e) => {
                                      if (e.target.files[0].size > 200000) {
                                        values.ImageURLText = null;
                                        document.getElementById(
                                          "submitButton"
                                        ).disabled = true;
                                      } else {
                                        document.getElementById(
                                          "submitButton"
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
                                          values.Image = null;
                                          setImgChange(true);
                                        }}
                                      >
                                        <i className="fas fa-x" />
                                      </Button>
                                    </div>

                                    <>
                                      <div
                                        id="ImageURLText-error"
                                        className="invalid-feedback animated fadeInUp ms-3"
                                        style={{ display: "block" }}
                                        onError={(e) => {
                                          setDead(true);
                                        }}
                                      >
                                        {errors.ImageURLText &&
                                          touched.ImageURLText &&
                                          errors.ImageURLText}
                                      </div>
                                    </>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div
                            className={`form-group mb-3 row ${
                              values.Description
                                ? errors.Description
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                            }`}
                          >
                            <label
                              className="col-lg-4 form-label"
                              htmlFor="Description"
                            >
                              Description
                            </label>
                            <div className="col-lg-6">
                              <input
                                className="form-control m-0"
                                id="Description"
                                name="Description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.Description}
                                type="text"
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

                          <div className="form-group mb-3 row">
                            <div className="col-lg-4"></div>
                            <div className="col-lg-6">
                              <button
                                type="submit"
                                id="submitButton"
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPointValidation;
