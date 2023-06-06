import { Formik } from "formik";
import * as Yup from "yup";
import { updateSetting } from "../../../../services/SettingAPI";
import { useContext, useEffect, useState } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { imgServer } from "../../../../dataConfig";
import { Button } from "react-bootstrap";

const theInputLogo = document.querySelector("#Logo");

const SettingSMTPUpdate = ({ depaSetting, setRefresh }) => {
  const { getTokenFormData } = useContext(GetTokenContext);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imgChange, setImgChange] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);

  const validSchema = Yup.object().shape({
    SMTPServer: Yup.string().required("Please enter a valid Server"),
    SMTPPort: Yup.number()
      .required("Please enter a valid Port")
      .typeError("Port must be a number"),
    SMTPUsername: Yup.string().email().required("Please enter valid Email"),
    SMTPPassword: Yup.string().min(6).required("Please enter Password"),
    DepartmentID: Yup.number().min(1000).required("Please choose a Department"),

    Logo: Yup.mixed().test("fileSize", "The file is too large", () => {
      if (!imgChange) return true;

      if (theInputLogo === null || theInputLogo.files[0] === undefined) {
        return true;
      }

      return theInputLogo.files[0].size <= 3145728;
    }),
  });

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

  function updateBUSetting(body) {
    const { SMTPServer, SMTPPort, SMTPUsername, SMTPPassword, DepartmentID } =
      body;

    const theInputLogo = document.querySelector("#Logo");
    const formData = new FormData();

    if (theInputLogo && theInputLogo.files[0]) {
      formData.append("Logo", theInputLogo.files[0]);
    }

    formData.append("SMTPServer", SMTPServer);
    formData.append("SMTPPort", SMTPPort);
    formData.append("SMTPUsername", SMTPUsername);
    formData.append("SMTPPassword", SMTPPassword);
    formData.append("DepartmentID", DepartmentID);

    const success = () => {
      setRefresh(new Date());
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

  const defaultValue = {
    SMTPServer: depaSetting ? depaSetting.SMTPServer : "",
    SMTPPort: depaSetting ? depaSetting.SMTPPort : "",
    SMTPUsername: depaSetting ? depaSetting.SMTPUsername : "",
    SMTPPassword: "",
    DepartmentID: depaSetting ? depaSetting.DepartmentID : "",
  };

  return (
    <Formik
      initialValues={defaultValue}
      validationSchema={validSchema}
      validator={() => ({})}
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
          <div className="row">
            <div className="col-xl-6">
              <div
                className={`form-group mb-3 row ${
                  values.DepartmentID
                    ? errors.DepartmentID
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="col-lg-4 form-label" htmlFor="DepartmentID">
                  Department <span className="text-danger">*</span>
                </label>

                <div className="col-lg-8">
                  <input
                    className="form-control m-0 pe-none"
                    readOnly
                    type="text"
                    value={depaSetting.Department.Code}
                  />
                  <div
                    id="ruletype-error"
                    className="invalid-feedback animated fadeInUp"
                    style={{ display: "block" }}
                  ></div>
                </div>
              </div>

              <div
                className={`form-group mb-3 row ${
                  values.SMTPServer
                    ? errors.SMTPServer
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="col-lg-4 form-label" htmlFor="SMTPServer">
                  Server <span className="text-danger">*</span>
                </label>
                <div className="col-lg-8">
                  <input
                    className={`form-control m-0 ${!updateMode && "pe-none"}`}
                    readOnly={!updateMode}
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
                <label className="col-lg-4 form-label" htmlFor="SMTPPort">
                  Port <span className="text-danger">*</span>
                </label>
                <div className="col-lg-8">
                  <input
                    className={`form-control m-0 ${!updateMode && "pe-none"}`}
                    readOnly={!updateMode}
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
                    {errors.SMTPPort && touched.SMTPPort && errors.SMTPPort}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-6">
              <div
                className={`form-group mb-3 row ${
                  values.Logo ? (errors.Logo ? "is-invalid" : "is-valid") : ""
                }`}
              >
                <label className="col-lg-4 form-label" htmlFor="Logo">
                  Logo Department <span className="text-danger">*</span>
                </label>
                <div className="col-lg-8">
                  {imgChange && selectedFile && (
                    <div className="d-inline-block  position-relative">
                      <div
                        className="position-absolute top-0 start-100 translate-middle"
                        style={{ zIndex: 10 }}
                      >
                        {updateMode && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-circle"
                            onClick={() => {
                              setSelectedFile(false);
                            }}
                          >
                            <i className="fas fa-x" />
                          </Button>
                        )}
                      </div>
                      <img src={preview} height={40} className=" mb-3" />
                    </div>
                  )}

                  {!imgChange && (
                    <div className="d-inline-block  position-relative">
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
                              setImgChange(true);
                            }}
                          >
                            <i className="fas fa-x" />
                          </Button>
                        </div>
                      )}
                      <img
                        src={`${imgServer}${depaSetting.Logo}`}
                        height={40}
                        className=" mb-3"
                      />
                    </div>
                  )}

                  {imgChange && (
                    <input
                      className={`form-control m-0 ${selectedFile && "d-none"}`}
                      id="Logo"
                      name="Logo"
                      onChange={(e) => {
                        handleChange(e);
                        onSelectFile(e);
                      }}
                      onBlur={handleBlur}
                      type="file"
                      accept=".png, .jpg, .jpeg"
                    />
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
                  values.SMTPUsername
                    ? errors.SMTPUsername
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="col-lg-4 form-label" htmlFor="SMTPUsername">
                  UserName <span className="text-danger">*</span>
                </label>
                <div className="col-lg-8">
                  <input
                    className={`form-control m-0 ${!updateMode && "pe-none"}`}
                    readOnly={!updateMode}
                    id="SMTPUsername"
                    name="SMTPUsername"
                    type="text"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    value={values.SMTPUsername}
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

              <div
                className={`form-group mb-3 row ${
                  values.SMTPPassword
                    ? errors.SMTPPassword
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="col-lg-4 form-label" htmlFor="SMTPPassword">
                  Password <span className="text-danger">*</span>
                </label>
                <div className="col-lg-8">
                  <input
                    className={`form-control m-0 ${!updateMode && "pe-none"}`}
                    readOnly={!updateMode}
                    id="SMTPPassword"
                    name="SMTPPassword"
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.SMTPPassword}
                    autoComplete="on"
                  />
                  <div
                    id="name-error"
                    className="invalid-feedback animated fadeInUp"
                    style={{ display: "block" }}
                  >
                    {errors.SMTPPassword && errors.SMTPPassword}
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
                        className="btn btn-primary"
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
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default SettingSMTPUpdate;
