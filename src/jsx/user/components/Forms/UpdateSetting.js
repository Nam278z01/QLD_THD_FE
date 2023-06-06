import { useContext, useEffect, useState } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { imgServer } from "../../../../dataConfig";
import { Button } from "react-bootstrap";
import { Formik, getIn, useFormikContext } from "formik";
import * as Yup from "yup";
import { useRef } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {
  getSettingWorking,
  updateDepartment,
  updateSetting,
  updateSlogan,
} from "../../../../services/SettingAPI";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ChangepasswordModal from "../modal/ChangePasswordModal ";
import { is } from "date-fns/locale";
import WorkingTimeModal from "../modal/WorkingTimeModal";
import useRefreshToken from "../../../../Hook/useRefreshToken";
const CryptoJS = require("crypto-js");
const { PASSWORD_HASH_KEY } = process.env;

function UpdateSettingForm({ depaSetting, setRefresh }) {
  let [InforWorking, setInforWorking] = useRefreshToken(getSettingWorking);
  const [showKper, setShowKper] = useState(true);
  const [isValidKper, setIsValidKper] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imgChange, setImgChange] = useState(false);
  const [passwordShown, setShown] = useState(false);
  const [defaultName, setdefaultName] = useState(depaSetting.Department.Name);
  const [defaultCode, setdefaultCode] = useState(depaSetting.Department.Code);

  const [changepasswordShown, setchangeShown] = useState(false);
  const inputValue = useRef(null);
  const inputCode = useRef(null);

  const theInputLogo = document.querySelector("#Logo");
  const [deadImg, setDead] = useState(false);
  const { DepartmentID, Name } = useSelector((a) => a.DepartmentSettingSlice);
  const navigate = useHistory();
  const ruleSchema = Yup.object().shape({
    SMTPServer: Yup.string()
      .min(1)
      .max(250)
      .trim()
      .required("Server is required"),
    SMTPPort: Yup.string().min(1).max(250).trim().required("Port is required"),
    SMTPUsername: Yup.string().email().max(250).required("Account is required"),
    SMTPPassword: Yup.string().min(6).required("Password is required"),
    Logo: Yup.mixed()
      .test("fileSize", "The file is too large", () => {
        if (!imgChange) return true;

        if (theInputLogo === null || theInputLogo.files[0] === undefined) {
          return true;
        }
        return theInputLogo.files[0].size <= 3145728;
      })
      .required("Logo is required"),
    ConversionRatio: Yup.number().min(0).max(9),
    PointName: Yup.string().trim().min(0).max(250),
    CointName: Yup.string().trim().min(0).max(250),
    ViewMode: Yup.string().required().max(250),
    MaxTopNumber: Yup.number().max(9).min(0).integer(),
    Slogan: Yup.string().trim().min(0).max(30),
    ProjectExten: Yup.number().max(12).min(0).integer(),
    DeadlineCampaign: Yup.number()
      .max(720)
      .min(0)
      .integer()
      .required("Request Expiration Date"),
    Code: Yup.string()
      .min(3, "Code must consist of at least 3 characters ")
      .max(250, "Code must consist of at most 250 characters")
      .nullable(false)
      .matches(/^[^\s].*[^\s]$/, "Code cannot start or end with whitespace")
      .trim()
      .strict(true)
      .test(
        "no-dots",
        "Code cannot contain dots '.'",
        (value) => value === undefined || !value.includes(".")
      )
      .required("Please enter a Code"),

    Name: Yup.string().trim().min(3).max(250),
    // .matches(/^[^.]*$/gm, 'Do not enter the dot "."'),
    RankA_plus: Yup.number()
      .min(0, "A+ must be greater than or equal to 0")
      .max(100, "A+ must be less than or equal to 100")
      .integer()
      .required("A+ is required"),
    RankA: Yup.number()
      .min(0, "A must be greater than or equal to 0")
      .max(100, "A must be less than or equal to 100")
      .integer()
      .required("A is required"),
    RankB: Yup.number()
      .min(0, "B must be greater than or equal to 0")
      .max(100, "B must be less than or equal to 100")
      .integer()
      .required("B is required"),
    RankC: Yup.number()
      .min(0, "C must be greater than or equal to 0")
      .max(100, "C must be less than or equal to 100")
      .integer()
      .required("C is required"),
    RankD: Yup.number()
      .min(0, "D must be greater than or equal to 0")
      .max(100, "D must be less than or equal to 100")
      .integer()
      .required("D is required"),
  });

  const [updateMode, setUpdateMode] = useState(false);
  const { getTokenFormData, getToken } = useContext(GetTokenContext);

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
    // I've kept this example simple by using the first image instead of multiple
  };

  function updateBUSetting(body) {
    const {
      SMTPServer,
      SMTPPort,
      SMTPUsername,
      SMTPPassword,
      ViewMode,
      AllowMinus,
      DeadlineCampaign,
      Slogan,
      Name,
      Code,
      PointName,
      ConversionRatio,
      CoinName,
      MaxTopNumber,
      RankA_plus,
      RankA,
      RankB,
      RankC,
      RankD,
    } = body;
    const sum =
      Number(RankA_plus) +
      Number(RankA) +
      Number(RankB) +
      Number(RankC) +
      Number(RankD);
    if (sum !== 100) {
      setIsValidKper(false);
      return;
    }
    const theInputLogo = document.querySelector("#Logo");

    const formData = new FormData();

    if (theInputLogo && theInputLogo.files[0]) {
      formData.append("Logo", theInputLogo.files[0]);
    }

    formData.append("SMTPServer", SMTPServer);
    formData.append("SMTPPort", SMTPPort);
    formData.append("SMTPUsername", SMTPUsername);
    formData.append("SMTPPassword", SMTPPassword);
    formData.append("ViewMode", ViewMode);
    formData.append("Slogan", Slogan);
    formData.append("PointName", PointName);
    formData.append("ConversionRatio", ConversionRatio);
    formData.append("CoinName", CoinName);
    formData.append("MaxTopNumber", MaxTopNumber);
    formData.append("ValidDistantTime", DeadlineCampaign);
    formData.append("AllowMinus", AllowMinus);
    formData.append("RankA_plus", RankA_plus);
    formData.append("RankA", RankA);
    formData.append("RankB", RankB);
    formData.append("RankC", RankC);
    formData.append("RankD", RankD);

    if (defaultName !== Name) {
      formData.append("Name", Name);
    }
    if (defaultCode !== Code) {
      formData.append("Code", Code);
    }

    const success = () => {
      setRefresh();
      setTimeout(() => {
        window.location.reload(false);
      }, 3000);
      setUpdateMode(false);
    };
    getTokenFormData(
      updateSetting,
      "Setting has been updated",
      success,
      false,
      formData,
      DepartmentID
    );
  }
  // const bytes = cryptoJS.AES.decrypt(
  //   depaSetting.SMTPPassword,
  //   "a8d91db5-96c8-4aaa-9457-7cb77ff061fc"
  // );

  // const originalPassword = bytes.toString(cryptoJS.enc.Utf8);

  const defaultValue = {
    Name: depaSetting.Department.Name ? depaSetting.Department.Name : "",
    Code: depaSetting.Department.Code ? depaSetting.Department.Code : "",
    SMTPServer: depaSetting.SMTPServer ? depaSetting.SMTPServer : "",
    SMTPPort: depaSetting.SMTPPort ? depaSetting.SMTPPort : "",
    SMTPUsername: depaSetting.SMTPUsername ? depaSetting.SMTPUsername : "",
    SMTPPassword: depaSetting.SMTPPassword ? depaSetting.SMTPPassword : "",
    Logo: depaSetting.Logo,
    Slogan: depaSetting.Department.Slogan ? depaSetting.Department.Slogan : "",
    ViewMode: depaSetting.ViewMode ? depaSetting.ViewMode : "Private",
    PointName: depaSetting.PointName ? depaSetting.PointName : "Point",
    CoinName: depaSetting.CoinName ? depaSetting.CoinName : "Coin",
    ConversionRatio: depaSetting.ConversionRatio
      ? depaSetting.ConversionRatio
      : 1,
    MaxTopNumber: depaSetting.MaxTopNumber ? depaSetting.MaxTopNumber : 5,
    ProjectExten: depaSetting.ProjectExten ? depaSetting.ProjectExten : 0,
    DeadlineCampaign: depaSetting.ValidDistantTime
      ? depaSetting.ValidDistantTime
      : "",
    AllowMinus: depaSetting.AllowMinus ? depaSetting.AllowMinus : 1,
    RankA_plus: depaSetting.RankA_plus ? depaSetting.RankA_plus : 0,
    RankA: depaSetting.RankA ? depaSetting.RankA : 0,
    RankB: depaSetting.RankB ? depaSetting.RankB : 0,
    RankC: depaSetting.RankC ? depaSetting.RankC : 0,
    RankD: depaSetting.RankD ? depaSetting.RankD : 0,
  };

  const [aPlush, setAPlush] = useState(defaultValue.RankA_plus);
  const [a, setA] = useState(defaultValue.RankA);
  const [b, setB] = useState(defaultValue.RankB);
  const [c, setC] = useState(defaultValue.RankC);
  const [d, setD] = useState(defaultValue.RankD);
  useEffect(() => {
    // do something when some field in the form changes
    const sum = Number(aPlush) + Number(a) + Number(b) + Number(c) + Number(d);
    if (sum !== 100) {
      setIsValidKper(false);
    } else {
      setIsValidKper(true);
    }
  }, [aPlush, a, b, c, d]);

  const decrypted = (data, key) => {
    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
  };

  return InforWorking === null ? (
    <></>
  ) : (
    <>
      {/* <ChangepasswordModal
        show={changepasswordShown}
        setShow={setchangeShown}
      /> */}
      <WorkingTimeModal
        show={changepasswordShown}
        setShow={setchangeShown}
        InforWorking={InforWorking}
        option={"update"}
        setInforWorking={setInforWorking}
      />

      <div className="card ">
        <div className="card-header">
          <h5 className="m-0">{defaultValue.Name} Setting</h5>
        </div>

        <div className="card-body">
          <Formik
            initialValues={defaultValue}
            validationSchema={ruleSchema}
            validator={() => {}}
            onSubmit={(values, { setSubmitting }) => {
              updateBUSetting(values);
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
              resetForm,
            }) => (
              <form
                className="form-valide"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
              >
                <div className="">
                  <p className="fw-bold ">Department Detail</p>
                  <hr />
                </div>
                <div className="row">
                  <div className="col-xl-6">
                    <div
                      className={`form-group mb-3 row ${
                        values.Name
                          ? errors.Name
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label className="col-lg-3 col-form-label" htmlFor="Name">
                        Department Name
                      </label>

                      <div className="col-lg-6">
                        <input
                          className={`form-control m-0 ${
                            !updateMode && "pe-none"
                          }`}
                          id="Name"
                          name="Name"
                          type="text"
                          onChange={(e) => {
                            handleChange(e);
                            inputValue.current.value;
                          }}
                          ref={inputValue}
                          onBlur={handleBlur}
                          defaultValue={defaultValue.Name}
                        />
                        <div
                          id="ruletype-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        ></div>
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
                        values.Code
                          ? errors.Code
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label className="col-lg-3 col-form-label" htmlFor="Code">
                        Department Code<span className="text-danger">*</span>
                      </label>

                      <div className="col-lg-6">
                        <input
                          id="Code"
                          name="Code"
                          onChange={(e) => {
                            handleChange(e);
                            inputCode.current.value;
                          }}
                          ref={inputCode}
                          onBlur={handleBlur}
                          className={`form-control m-0 ${
                            !updateMode && "pe-none"
                          }`}
                          type="text"
                          defaultValue={defaultValue.Code}
                        />
                        <div
                          id="ruletype-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        ></div>
                        <div
                          id="name-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.Code && touched.Code && errors.Code}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`form-group mb-3 row ${
                        values.ViewMode
                          ? errors.ViewMode
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="ViewMode"
                      >
                        View Mode
                      </label>
                      <div className="col-lg-6">
                        <select
                          id="ViewMode"
                          name="ViewMode"
                          className={`form-control form-select m-0 ${
                            !updateMode && "pe-none"
                          }`}
                          readOnly={!updateMode}
                          type="text"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.ViewMode}
                        >
                          <option value="Public">Public</option>
                          <option value="Private">Private</option>
                        </select>
                        <div
                          id="name-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.ViewMode &&
                            touched.ViewMode &&
                            errors.ViewMode}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div
                      className={`form-group mb-3 row ${
                        values.Logo
                          ? errors.Logo
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label className="col-lg-3 col-form-label" htmlFor="Logo">
                        Logo Department<span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-6 ">
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
                                  const theInputLogo =
                                    document.querySelector("#Logo");

                                  theInputLogo.value = null;
                                  values.Logo = null;
                                  theInputLogo.files = null;
                                  setSelectedFile(false);
                                }}
                              >
                                <i className="fas fa-x" />
                              </Button>
                            </div>
                            <img src={preview} height={60} className=" mb-3" />
                          </div>
                        )}

                        {imgChange && (
                          <input
                            className={`form-control m-0 ${
                              selectedFile && "d-none"
                            }`}
                            id="Logo"
                            name="Logo"
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
                          Please choose the file that have size smaller than
                          200kb
                        </div>

                        {!imgChange && (
                          <div className="d-inline-block  position-relative pt-2">
                            {updateMode && (
                              <div
                                className="position-absolute top-0 start-100 translate-middle"
                                style={{ zIndex: 10 }}
                              >
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="rounded-circle"
                                  onClick={() => {
                                    values.Logo = null;
                                    setImgChange(true);
                                  }}
                                >
                                  <i className="fas fa-x" />
                                </Button>
                              </div>
                            )}
                            {deadImg ? (
                              <span className="">No Image</span>
                            ) : (
                              <img
                                src={`${imgServer}${depaSetting.Logo}`}
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
                          id="name-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.Logo && errors.Logo}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`form-group mb-3 row ${
                        values.Slogan
                          ? errors.Slogan
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="Slogan"
                      >
                        Slogan
                      </label>
                      <div className="col-lg-6">
                        <textarea
                          className={`form-control m-0 ${
                            !updateMode && "pe-none"
                          }`}
                          id="Slogan"
                          name="Slogan"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.Slogan}
                          readOnly={!updateMode}
                          rows={3}
                        />
                        <div
                          id="name-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.Slogan && touched.Slogan && errors.Slogan}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="">
                  <p className=" fw-bold ">SMTP Setting</p>
                  <hr />
                </div>
                <div className="row">
                  <div className="col-xl-6">
                    <div
                      className={`form-group mb-3 row ${
                        values.SMTPServer
                          ? errors.SMTPServer
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="SMTPServer"
                      >
                        SMTPServer<span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-6">
                        <input
                          className={`form-control m-0 ${
                            !updateMode && "pe-none"
                          }`}
                          id="SMTPServer"
                          name="SMTPServer"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.SMTPServer}
                          type="text"
                        />
                        <div
                          id="ruletype-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.SMTPServer &&
                            touched.SMTPServer &&
                            errors.SMTPServer}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`form-group mb-3 row ${
                        values.SMTPPort
                          ? errors.SMTPPort
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="SMTPPort"
                      >
                        Port<span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-6">
                        <input
                          readOnly={!updateMode}
                          className={`form-control m-0 ${
                            !updateMode && "pe-none"
                          }`}
                          id="SMTPPort"
                          name="SMTPPort"
                          rows="2"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.SMTPPort}
                          type="text"
                        />
                        <div
                          id="name-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.SMTPPort &&
                            touched.SMTPPort &&
                            errors.SMTPPort}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div
                      className={`form-group mb-3 row ${
                        values.SMTPUsername
                          ? errors.SMTPUsername
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="SMTPUsername"
                      >
                        Account<span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-6">
                        <input
                          readOnly={!updateMode}
                          className={`form-control m-0 ${
                            !updateMode && "pe-none"
                          }`}
                          id="SMTPUsername"
                          name="SMTPUsername"
                          type="text"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.SMTPUsername}
                          autoComplete="username"
                        />
                        <div
                          id="name-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.SMTPUsername &&
                            touched.SMTPUsername &&
                            errors.SMTPUsername}
                        </div>
                      </div>
                    </div>
                    {/* {!changepasswordShown && ( */}
                    <div
                      className={`form-group mb-3 row ${
                        values.SMTPPassword
                          ? errors.SMTPPassword
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="SMTPPassword"
                      >
                        Password<span className="text-danger">*</span>
                      </label>
                      {!updateMode && (
                        <div className="col-lg-6">
                          <input
                            placeholder={"••••••••••••••"}
                            readOnly={true}
                            className={`form-control m-0 pe-none`}
                            id="SMTPPassword"
                            name="SMTPPassword"
                            type="password"
                            autoComplete="current-password"
                          />
                        </div>
                      )}
                      {updateMode && (
                        <>
                          <div className="col-lg-6">
                            <div className="input-group">
                              <input
                                // placeholder={"••••••••••••••"}
                                readOnly={!updateMode}
                                className={`form-control m-0 ${
                                  !updateMode && "pe-none"
                                }`}
                                id="SMTPPassword"
                                name="SMTPPassword"
                                type={passwordShown ? "text" : "password"}
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                                onBlur={handleBlur}
                                // defaultValue={decrypted(
                                //   values.SMTPPassword,
                                //   String(PASSWORD_HASH_KEY)
                                // )}
                                defaultValue={"••••••••••••••"}
                                autoComplete="current-password"
                              />
                              {/* <span
                                className="input-group-text rounded-end mousePointer"
                                onClick={(e) => {
                                  setShown(!passwordShown);
                                }}
                              >
                                {!passwordShown ? (
                                  <i className="fa fa-eye-slash " />
                                ) : (
                                  <i className="fa fa-eye" />
                                )}
                              </span> */}
                              <div
                                id="name-error"
                                className="invalid-feedback animated fadeInUp"
                                style={{ display: "block" }}
                              >
                                {errors.SMTPPassword &&
                                  touched.SMTPPassword &&
                                  errors.SMTPPassword}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3 text-start mt-2 ms-0 ps-0">
                            {" "}
                            {/* <Button
                              style={{ maxHeight: "auto" }}
                              className="text-center"
                              onClick={() => {
                                setchangeShown(true);
                              }}
                            >
                              Change Password
                            </Button> */}
                          </div>
                        </>
                      )}
                    </div>

                    {/* <>
                      <div
                        className={`form-group mb-3 row ${
                          values.NewPassword
                            ? errors.NewPassword
                              ? "is-invalid"
                              : "is-valid"
                            : ""
                        }`}
                      >
                        <label
                          className="col-lg-3 col-form-label"
                          htmlFor="NewPassword"
                        >
                          New Password
                        </label>
                        {!updateMode && (
                          <div className="col-lg-6">
                            <input
                              readOnly={true}
                              className={`form-control m-0 pe-none`}
                              id="NewPassword"
                              name="NewPassword"
                              type="password"
                              autoComplete="current-password"
                            />
                          </div>
                        )}
                        {updateMode && (
                          <>
                            <div className="col-lg-6">
                              <div className="input-group">
                                <input
                                  readOnly={!updateMode}
                                  className={`form-control m-0 ${
                                    !updateMode && "pe-none"
                                  }`}
                                  id="NewPassword"
                                  name="NewPassword"
                                  type={!passwordShown ? "text" : "password"}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  onBlur={handleBlur}
                                  // defaultValue={decrypted(
                                  //   values.NewPassword,
                                  //   String(PASSWORD_HASH_KEY)
                                  // )}
                                  autoComplete="current-password"
                                />
                                <span
                                  className="input-group-text rounded-end mousePointer"
                                  onClick={(e) => {
                                    setShown(!passwordShown);
                                  }}
                                >
                                  {passwordShown ? (
                                    <i className="fa fa-eye-slash " />
                                  ) : (
                                    <i className="fa fa-eye" />
                                  )}
                                </span>
                                <div
                                  id="name-error"
                                  className="invalid-feedback animated fadeInUp"
                                  style={{ display: "block" }}
                                >
                                  {errors.NewPassword &&
                                    touched.NewPassword &&
                                    errors.NewPassword}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {values.NewPassword && (
                        <div
                          className={`form-group mb-3 row ${
                            values.ConfirmPassword
                              ? errors.ConfirmPassword
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-3 col-form-label"
                            htmlFor="ConfirmPassword"
                          >
                            Confirm Password
                            <span className="text-danger">*</span>
                          </label>
                          {!updateMode && (
                            <div className="col-lg-6">
                              <input
                                readOnly={true}
                                className={`form-control m-0 pe-none`}
                                id="ConfirmPassword"
                                name="ConfirmPassword"
                                type="password"
                                autoComplete="current-password"
                              />
                            </div>
                          )}
                          {updateMode && (
                            <>
                              <div className="col-lg-6">
                                <div className="input-group">
                                  <input
                                    // placeholder={"••••••••••••••"}
                                    readOnly={!updateMode}
                                    className={`form-control m-0 ${
                                      !updateMode && "pe-none"
                                    }`}
                                    id="ConfirmPassword"
                                    name="ConfirmPassword"
                                    type={!passwordShown ? "text" : "password"}
                                    onChange={(e) => {
                                      handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    // defaultValue={decrypted(
                                    //   values.ConfirmPassword,
                                    //   String(PASSWORD_HASH_KEY)
                                    // )}
                                    autoComplete="current-password"
                                  />
                                  <span
                                    className="input-group-text rounded-end mousePointer"
                                    onClick={(e) => {
                                      setShown(!passwordShown);
                                    }}
                                  >
                                    {passwordShown ? (
                                      <i className="fa fa-eye-slash " />
                                    ) : (
                                      <i className="fa fa-eye" />
                                    )}
                                  </span>
                                  <div
                                    id="name-error"
                                    className="invalid-feedback animated fadeInUp"
                                    style={{ display: "block" }}
                                  >
                                    {errors.ConfirmPassword &&
                                      touched.ConfirmPassword &&
                                      errors.ConfirmPassword}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </> */}
                  </div>
                </div>

                <div className="">
                  <p className=" fw-bold ">Ranking Setting</p>
                  <hr />
                </div>
                <div className="row">
                  <div className="col-xl-6">
                    <div
                      className={`form-group mb-3 row ${
                        values.PointName
                          ? errors.PointName
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="PointName"
                      >
                        Point Name
                      </label>
                      <div className="col-lg-6">
                        <input
                          readOnly={!updateMode}
                          className={`form-control m-0 ${
                            !updateMode && "pe-none"
                          }`}
                          id="PointName"
                          name="PointName"
                          type="text"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.PointName}
                        />
                        <div
                          id="name-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.PointName &&
                            touched.PointName &&
                            errors.PointName}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`form-group mb-3 row ${
                        values.ConversionRatio
                          ? errors.ConversionRatio
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="ConversionRatio"
                      >
                        Convert Rate
                      </label>
                      <div className="col-lg-6">
                        <input
                          readOnly={!updateMode}
                          className={`form-control m-0 ${
                            !updateMode && "pe-none"
                          }`}
                          id="ConversionRatio"
                          name="ConversionRatio"
                          type="number"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.ConversionRatio}
                        />
                        <div
                          id="name-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.ConversionRatio &&
                            touched.ConversionRatio &&
                            errors.ConversionRatio}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`form-group mb-3 row ${
                        values.ConversionRatio
                          ? errors.ConversionRatio
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      {/* <label className="col-lg-3 col-form-label" htmlFor="kper">
                        Setting Kper <span className="text-danger">*</span>
                      </label> */}
                      <div className="col-lg-12">
                        <ReactTooltip
                          anchorId="kper"
                          place="top"
                          variant="dark"
                          content="Unit calculated based on %"
                        />
                        <label id="kper">
                          <input
                            type="checkbox"
                            onChange={(e) => setShowKper(e.target.checked)}
                            checked={showKper}
                          />{" "}
                          Setting kper (%)
                        </label>
                        <div className="row" hidden={!showKper}>
                          <div className="col-lg-4 mt-2">
                            <div
                              className={`form-group mb-3 row ${
                                values.RankA_plus
                                  ? errors.RankA_plus
                                    ? "is-invalid"
                                    : "is-valid"
                                  : ""
                              }`}
                            >
                              <label
                                className="col-lg-4 col-form-label"
                                htmlFor="RankA_plus"
                              >
                                A+
                              </label>
                              <div className="col-lg-8">
                                <input
                                  className={` form-control m-0 ${
                                    !updateMode && "pe-none"
                                  }`}
                                  id="RankA_plus"
                                  name="RankA_plus"
                                  type="number"
                                  onChange={(e) => {
                                    handleChange(e);
                                    setAPlush(e.target.value);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.RankA_plus}
                                />
                              </div>
                            </div>
                            <div
                              id="name-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {errors.RankA_plus &&
                                touched.RankA_plus &&
                                errors.RankA_plus}
                            </div>
                          </div>
                          <div className="col-lg-4 mt-2">
                            <div
                              className={`form-group mb-3 row ${
                                values.RankA
                                  ? errors.RankA
                                    ? "is-invalid"
                                    : "is-valid"
                                  : ""
                              }`}
                            >
                              <label
                                className="col-lg-4 col-form-label"
                                htmlFor="RankA"
                              >
                                A
                              </label>
                              <div className="col-lg-8">
                                <input
                                  className={` form-control m-0 ${
                                    !updateMode && "pe-none"
                                  }`}
                                  id="RankA"
                                  name="RankA"
                                  type="number"
                                  onChange={(e) => {
                                    handleChange(e);
                                    setA(e.target.value);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.RankA}
                                />
                              </div>
                            </div>
                            <div
                              id="name-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {errors.RankA && touched.RankA && errors.RankA}
                            </div>
                          </div>
                          <div className="col-lg-4 mt-2">
                            <div
                              className={`form-group mb-3 row ${
                                values.RankB
                                  ? errors.RankB
                                    ? "is-invalid"
                                    : "is-valid"
                                  : ""
                              }`}
                            >
                              <label
                                className="col-lg-4 col-form-label"
                                htmlFor="RankB"
                              >
                                B
                              </label>
                              <div className="col-lg-8">
                                <input
                                  className={` form-control m-0 ${
                                    !updateMode && "pe-none"
                                  }`}
                                  id="RankB"
                                  name="RankB"
                                  type="number"
                                  onChange={(e) => {
                                    handleChange(e);
                                    setB(e.target.value);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.RankB}
                                />
                              </div>
                            </div>
                            <div
                              id="name-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {errors.RankB && touched.RankB && errors.RankB}
                            </div>
                          </div>
                          <div className="col-lg-4 mt-2">
                            <div
                              className={`form-group mb-3 row ${
                                values.RankC
                                  ? errors.RankC
                                    ? "is-invalid"
                                    : "is-valid"
                                  : ""
                              }`}
                            >
                              <label
                                className="col-lg-4 col-form-label"
                                htmlFor="RankC"
                              >
                                C
                              </label>
                              <div className="col-lg-8">
                                <input
                                  className={` form-control m-0 ${
                                    !updateMode && "pe-none"
                                  }`}
                                  id="RankC"
                                  name="RankC"
                                  type="number"
                                  onChange={(e) => {
                                    handleChange(e);
                                    setC(e.target.value);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.RankC}
                                />
                              </div>
                            </div>
                            <div
                              id="name-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {errors.RankC && touched.RankC && errors.RankC}
                            </div>
                          </div>
                          <div className="col-lg-4 mt-2">
                            <div
                              className={`form-group mb-3 row ${
                                values.RankD
                                  ? errors.RankD
                                    ? "is-invalid"
                                    : "is-valid"
                                  : ""
                              }`}
                            >
                              <label
                                className="col-lg-4 col-form-label"
                                htmlFor="RankD"
                              >
                                D
                              </label>
                              <div className="col-lg-8">
                                <input
                                  className={` form-control m-0 ${
                                    !updateMode && "pe-none"
                                  }`}
                                  id="RankD"
                                  name="RankD"
                                  type="number"
                                  onChange={(e) => {
                                    handleChange(e);
                                    setD(e.target.value);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.RankD}
                                />
                              </div>
                            </div>
                            <div
                              id="name-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {errors.RankD && touched.RankD && errors.RankD}
                            </div>
                          </div>
                          <div
                            id="name-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: isValidKper ? "none" : "block" }}
                          >
                            Total must be equal to 100
                          </div>
                          <div className="mt-4 d-flex justify-content-end">
                            {/* <button type="button" className="btn btn-primary" >Update Kper</button> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <div
                      className={`form-group mb-3 row ${
                        values.ProjectExten
                          ? errors.ProjectExten
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="ProjectExten"
                      >
                        Closed Project Exten (days)
                      </label>
                      <div className="col-lg-6">
                        <input
                          className={`form-control m-0 ${
                            !updateMode && "pe-none"
                          }`}
                          readOnly={!updateMode}
                          id="ProjectExten"
                          name="ProjectExten"
                          type="number"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.ProjectExten}
                        />
                        <div
                          id="name-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.ProjectExten &&
                            touched.ProjectExten &&
                            errors.ProjectExten}
                        </div>
                      </div>
                    </div> */}
                  </div>
                  <div className="col-xl-6">
                    <div
                      className={`form-group mb-3 row ${
                        values.CoinName
                          ? errors.CoinName
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="CoinName"
                      >
                        Coin Name
                      </label>
                      <div className="col-lg-6">
                        <input
                          readOnly={!updateMode}
                          className={`form-control m-0 ${
                            !updateMode && "pe-none"
                          }`}
                          id="CoinName"
                          name="CoinName"
                          type="text"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.CoinName}
                        />
                        <div
                          id="name-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.CoinName &&
                            touched.CoinName &&
                            errors.CoinName}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`form-group mb-3 row ${
                        values.MaxTopNumber
                          ? errors.MaxTopNumber
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="MaxTopNumber"
                      >
                        Top Employees
                      </label>
                      <div className="col-lg-6">
                        {/* <input
                          readOnly={!updateMode}
                          className={`form-control m-0 ${
                            !updateMode && "pe-none"
                          }`}
                          id="MaxTopNumber"
                          name="MaxTopNumber"
                          type="number"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.MaxTopNumber}
                        /> */}
                        <select
                          className={`form-control m-0 ${
                            !updateMode && "pe-none"
                          }`}
                          id="MaxTopNumber"
                          name="MaxTopNumber"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          defaultValue={values.MaxTopNumber}
                        >
                          <option value={1}>1</option>
                          <option value={3}>3</option>
                          <option value={5}>5</option>
                        </select>
                        <div
                          id="name-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.MaxTopNumber &&
                            touched.MaxTopNumber &&
                            errors.MaxTopNumber}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`form-group mb-3 row ${
                        values.AllowMinus
                          ? errors.AllowMinus
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="AllowMinus"
                      >
                        Allow Minus
                      </label>
                      <div className="col-lg-6">
                        <select
                          id="AllowMinus"
                          name="AllowMinus"
                          className={`form-control form-select m-0 ${
                            !updateMode && "pe-none"
                          }`}
                          readOnly={!updateMode}
                          type="text"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.AllowMinus}
                        >
                          <option value="1">Yes</option>
                          <option value="2">No</option>
                        </select>
                        <div
                          id="name-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.AllowMinus &&
                            touched.AllowMinus &&
                            errors.AllowMinus}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`form-group mb-3 row ${
                        values.DeadlineCampaign
                          ? errors.DeadlineCampaign
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="DeadlineCampaign"
                      >
                        Request Expiration Date
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-6">
                        <input
                          readOnly={!updateMode}
                          className={`form-control m-0 ${
                            !updateMode && "pe-none"
                          }`}
                          id="DeadlineCampaign"
                          name="DeadlineCampaign"
                          type="number"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.DeadlineCampaign}
                        />
                        <div
                          id="name-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.DeadlineCampaign &&
                            touched.DeadlineCampaign &&
                            errors.DeadlineCampaign}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`form-group mb-3 row ${
                        values.DeadlineCampaign
                          ? errors.DeadlineCampaign
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="DeadlineCampaign"
                      >
                        Working Time
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-6">
                        {updateMode ? (
                          <Button
                            style={{ maxHeight: "auto" }}
                            className="text-center"
                            onClick={() => {
                              setchangeShown(true);
                            }}
                          >
                            Setting
                          </Button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="d-flex justify-content-end gap-2">
                    {updateMode ? (
                      <>
                        <div>
                          <button
                            type="submit"
                            id="submitButton"
                            className="btn btn-primary "
                            onClick={(e) => {
                              e.target.blur();
                            }}
                            disabled={isSubmitting}
                          >
                            Save
                          </button>
                        </div>
                        <div>
                          <button
                            type="reset"
                            className="btn btn-secondary"
                            onClick={(e) => {
                              e.target.blur();
                              setUpdateMode(false);
                              resetForm(defaultValue);
                              setImgChange(false);
                              setSelectedFile(null);
                              setPreview(null);
                              setShown(false);
                              setchangeShown(false);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <div>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            e.target.blur();
                            setUpdateMode(true);
                            setShown(true);
                            setImgChange(deadImg);
                            // setchangeShown(true);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default UpdateSettingForm;
