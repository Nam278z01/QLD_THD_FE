import { Formik } from "formik";
import * as Yup from "yup";
import { saveSetting } from "../../../../services/SettingAPI";
import { useContext, useEffect, useState } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { Button } from "react-bootstrap";

const theInputLogo = document.querySelector("#Logo");

const ruleSchema = Yup.object().shape({
  SMTPServer: Yup.string().required("Please enter a valid Server"),
  SMTPPort: Yup.number()
    .required("Please enter a valid Port")
    .typeError("Port must be a number"),
  SMTPUsername: Yup.string().email().required("Please enter valid Email"),
  SMTPPassword: Yup.string().min(6).required("Please enter Password"),
  DepartmentID: Yup.number().min(1000).required("Please choose a Department"),
  Logo: Yup.string(),

  Logo: Yup.mixed()
    .test("fileSize", "The file is too large", () => {
      if (theInputLogo === null || theInputLogo.files[0] === undefined) {
        return true;
      }
      return theInputLogo.files[0].size <= 3145728;
    })
    .required("Please choose a Logo"),
});

const SettingSMTPCreate = ({ depaDetail, setRefresh, setShow }) => {
  const { getTokenFormData } = useContext(GetTokenContext);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

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

  function createSetting(body) {
    const { SMTPServer, SMTPPort, SMTPUsername, SMTPPassword, DepartmentID } =
      body;

    const theInputLogo = document.querySelector("#Logo");
    const formData = new FormData();

    formData.append("Logo", theInputLogo.files[0]);
    formData.append("SMTPServer", SMTPServer);
    formData.append("SMTPPort", SMTPPort);
    formData.append("SMTPUsername", SMTPUsername);
    formData.append("SMTPPassword", SMTPPassword);
    formData.append("DepartmentID", DepartmentID);

    const success = () => {
      setRefresh(new Date());
      setShow(false);
    };

    getTokenFormData(
      saveSetting,
      "Setting has been created",
      success,
      false,
      formData
    );
  }

  return (
    <Formik
      initialValues={{
        SMTPServer: "",
        SMTPPort: "",
        SMTPUsername: "",
        SMTPPassword: "",
        DepartmentID: depaDetail.ID,
      }}
      validationSchema={ruleSchema}
      validator={() => ({})}
      onSubmit={(values, { setSubmitting }) => {
        createSetting(values);
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
                    defaultValue={depaDetail.Code}
                    type="text"
                  />
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
                    className="form-control m-0"
                    id="SMTPServer"
                    name="SMTPServer"
                    onChange={handleChange}
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

                  <div />
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
                    className="form-control m-0"
                    id="SMTPPort"
                    name="SMTPPort"
                    rows="2"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.SMTPPort}
                    type="text"
                  ></input>
                  <div
                    id="name-error"
                    className="invalid-feedback animated fadeInUp"
                    style={{ display: "block" }}
                  >
                    {errors.SMTPPort && touched.SMTPPort && errors.SMTPPort}
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
                    className="form-control m-0"
                    id="SMTPUsername"
                    name="SMTPUsername"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.SMTPUsername}
                  ></input>{" "}
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
                    className="form-control m-0"
                    id="SMTPPassword"
                    name="SMTPPassword"
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.SMTPPassword}
                    autoComplete="on"
                  ></input>
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
            </div>

            <div className="col-xl-6">
              <div
                className={`form-group mb-3 row ${
                  values.Logo ? (errors.Logo ? "is-invalid" : "is-valid") : ""
                }`}
              >
                <label className="col-lg-4 form-label" htmlFor="Logo">
                  Logo <span className="text-danger">*</span>
                </label>
                {selectedFile && (
                  <div className="col-xl-8 mx-auto mb-3">
                    <div className="w-100 justify-content-center d-flex">
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
                              setSelectedFile(null);
                            }}
                          >
                            <i className="fas fa-x" />
                          </Button>
                        </div>
                        <img src={preview} height={45} />
                      </div>
                    </div>
                  </div>
                )}
                <div className="col-lg-8">
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
                  <div
                    id="name-error"
                    className="invalid-feedback animated fadeInUp"
                    style={{ display: "block" }}
                  >
                    {errors.Logo && touched.Logo && errors.Logo}
                  </div>
                </div>
              </div>

              <div className="mb-3 row form-group">
                <div className="col-lg-4"></div>
                <div className="col-lg-8">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default SettingSMTPCreate;
