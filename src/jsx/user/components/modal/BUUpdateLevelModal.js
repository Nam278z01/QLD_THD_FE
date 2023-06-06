import { Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { imgServer } from "../../../../dataConfig";
import { createLevel, updateLevel } from "../../../../services/LevelAPI";

const theInputIcon = document.querySelector("#LevelIcon");

export default function BUUpdateLevelModal({
  handleFinished,
  level,
  isCreate,
}) {
  const [selectedFile, setSelectedFile] = useState();
  const [imgChange, setImgChange] = useState(false);
  const [preview, setPreview] = useState();
  const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);
  const { getTokenFormData } = useContext(GetTokenContext);

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

  useEffect(() => {
    if (isCreate) {
      setImgChange(true);
    }
  }, [isCreate]);

  const validSchema = Yup.object().shape({
    Name: Yup.string().trim().min(5).max(30).required("Please enter a Name"),
    Description: Yup.string()
      .trim()
      .min(5)
      .max(30)
      .required("Please enter a Description"),
    LevelIcon: Yup.mixed()
      .test("fileSize", "The Icon is too large", () => {
        if (theInputIcon === null || theInputIcon.files[0] === undefined) {
          return true;
        }
        return theInputIcon.files[0].size <= 3145728;
      })
      .required("Please choose a Level Icon"),
    ConversionRate: Yup.number()
      .min(
        level.PreLevelConversionRate,
        `Must be more than ${level.PreLevelConversionRate}`
      )
      .required("Please enter a conversionrate"),
  });

  // handle select files
  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  // handle update level
  const updateLevelHandle = (values) => {
    const theInputIcon = document.querySelector("#LevelIcon");

    const { Name, Description, Status, ConversionRate, LevelNumber } = values;
    const formData = new FormData();

    formData.append("BadgeID", level.BadgeID);
    formData.append("DepartmentID", DepartmentID);
    formData.append("RuleDefintionID", level.RuleDefintionID);
    formData.append("LevelNumber", LevelNumber);
    formData.append("Name", Name);
    formData.append("Description", Description);
    formData.append("Status", Status);
    formData.append("ConversionRate", ConversionRate);

    if (theInputIcon && theInputIcon.files[0]) {
      formData.append("ImageURL", theInputIcon.files[0]);
    }

    if (isCreate) {
      getTokenFormData(
        createLevel,
        "Create success",
        handleFinished,
        false,
        formData
      );
    } else {
      getTokenFormData(
        updateLevel,
        "Update success",
        handleFinished,
        false,
        formData,
        level.ID
      );
    }

    setSelectedFile(null);
  };

  const initialValues = {
    Name: level?.Name || "",
    Description: level?.Description || "",
    Status: level?.Status || 1,
    LevelIcon: level?.ImageURL || "",
    ConversionRate: level?.ConversionRate || 1,
    LevelNumber: level?.LevelNumber || 2,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validSchema}
      validator={() => ({})}
      onSubmit={(values, { setSubmitting }) => {
        updateLevelHandle(values);
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
          <div className="text-center">
            <span className="badge text-bg-danger p-2 mb-2 rounded-pill">
              Level: {values.LevelNumber}
            </span>
          </div>
          <div className="row g-5 p-3">
            <div className="col-xl-8">
              <div
                className={`form-group mb-3 row ${
                  values.Name ? (errors.Name ? "is-invalid" : "is-valid") : ""
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
                className={`form-group mb-3 row ${
                  values.Description
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
                className={`form-group mb-3 row ${
                  values.Status
                    ? errors.Status
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="col-lg-4 form-label" htmlFor="Status">
                  Status
                </label>
                <div className="col-lg-8">
                  <select
                    type="text"
                    className="form-control m-0"
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
                    id="Status-error"
                    className="invalid-feedback animated fadeInUp ms-3"
                    style={{ display: "block" }}
                  >
                    {errors.Status && touched.Status && errors.Status}
                  </div>
                </div>
              </div>
              <div
                className={`form-group mb-3 row ${
                  values.ConversionRate
                    ? errors.ConversionRate
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="col-lg-4 form-label" htmlFor="ConversionRate">
                  Conversionrate
                </label>
                <div className="col-lg-8">
                  <input
                    type="number"
                    className="form-control m-0"
                    id="ConversionRate"
                    name="ConversionRate"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.ConversionRate}
                    placeholder="Enter a conversionrate"
                  />
                  <div
                    id="Status-error"
                    className="invalid-feedback animated fadeInUp ms-3"
                    style={{ display: "block" }}
                  >
                    {errors.ConversionRate &&
                      touched.ConversionRate &&
                      errors.ConversionRate}
                  </div>
                </div>
              </div>
              <div
                className={`form-group mb-3 row ${
                  values.LevelIcon
                    ? errors.LevelIcon
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className="col-lg-4 form-label" htmlFor="LevelIcon">
                  Level Icon
                </label>
                <div className="col-lg-8">
                  {imgChange && (
                    <input
                      className={`form-control m-0 ${selectedFile && "d-none"}`}
                      id="LevelIcon"
                      name="LevelIcon"
                      onChange={(e) => {
                        handleChange(e);
                        onSelectFile(e);
                      }}
                      onBlur={handleBlur}
                      type="file"
                      accept="image/jpeg, image/png"
                    />
                  )}

                  {imgChange ? (
                    selectedFile && (
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
                                document.querySelector("#LevelIcon");

                              theInputIcon.value = "";
                              theInputIcon.files = null;
                              values.LevelIcon = null;
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
                    )
                  ) : (
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
                            values.LevelIcon = null;

                            setImgChange(true);
                          }}
                        >
                          <i className="fas fa-x" />
                        </Button>
                      </div>

                      <img
                        src={`${imgServer}${level?.ImageURL}`}
                        id="imgFileimg"
                        className="mt-2"
                        width={50}
                        height={50}
                      />
                    </div>
                  )}

                  <div
                    id="LevelIcon-error"
                    className="invalid-feedback animated fadeInUp ms-3"
                    style={{ display: "block" }}
                  >
                    {errors.LevelIcon && touched.LevelIcon && errors.LevelIcon}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group row mt-2">
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
        </form>
      )}
    </Formik>
  );
}
