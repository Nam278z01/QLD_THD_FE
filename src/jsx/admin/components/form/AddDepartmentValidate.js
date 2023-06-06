import useRefreshToken from "../../../../Hook/useRefreshToken";
import {
  getAllDepartmentNoSetting,
  updateDepartment,
  createDepartmentUseAkarank,
} from "../../../../services/DepartmentAPI";
import Select from "react-select";
import Loading from "../../../sharedPage/pages/Loading";
import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { Formik } from "formik";
import * as Yup from "yup";

const validateSchema = Yup.object().shape({
  Code: Yup.string()
    .min(3, "Code length must be equal or more than 3 characters")
    .max(100, "Code length must be equal or less than 100 characters")
    .required("Please enter department code")
    .trim(),
  Name: Yup.string()
    .min(3, "Name length must be equal or more than 3 characters")
    .max(100, "Name length must be equal or less than 100 characters")
    .required("Please enter department name")
    .trim(),
});

function AddDepartmentValidate({ setRefresh, setShow }) {
  const [data] = useRefreshToken(getAllDepartmentNoSetting);
  const [chosenDepartment, setChosenDepartment] = useState(null);
  const [createNewDepaMode, setCreateNewDepaMode] = useState(false);
  const { getToken } = useContext(GetTokenContext);

  function success(params) {
    setRefresh(new Date());
    setShow(false);
  }

  function updateDepartmentStatus(number) {
    getToken(
      updateDepartment,
      "Add new department success",
      success,
      false,
      { Status: number },
      chosenDepartment.ID
    );
  }

  function createDepartmentFunc(body) {
    getToken(
      createDepartmentUseAkarank,
      "New department has been created",
      success,
      false,
      body
    );
  }

  return data === null ? (
    <Loading />
  ) : (
    <>
      <Formik
        initialValues={{
          Code: "",
          Name: "",
        }}
        validationSchema={validateSchema}
        validator={() => ({})}
        onSubmit={(values, { setSubmitting }) => {
          createDepartmentFunc(values);
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
          resetForm,
        }) => (
          <>
            <div className="mb-3">
              <div
                className={`form-group mb-3 row ${
                  values.Code ? (errors.Code ? "is-invalid" : "is-valid") : ""
                }`}
              >
                <label className="col-lg-4 form-label">Department</label>
                <div className="col-lg-8">
                  <Select
                    options={data}
                    onChange={(depa) => {
                      if (depa.Code === "Other") {
                        setChosenDepartment(null);
                        setCreateNewDepaMode(true);
                        return;
                      }
                      setCreateNewDepaMode(false);
                      setChosenDepartment(depa);
                      resetForm({
                        Code: "",
                        Name: "",
                      });
                    }}
                    getOptionLabel={(option) => option.Code}
                    getOptionValue={(option) => option.Code}
                    styles={{
                      input: (provided, state) => ({
                        ...provided,
                        paddingTop: "12px",
                        paddingBottom: "12px",
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
            {createNewDepaMode && (
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
                      className={`form-group mb-3 row ${
                        values.Code
                          ? errors.Code
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label className="col-lg-4 form-label" htmlFor="Code">
                        Code <span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-8">
                        <input
                          className="form-control m-0"
                          id="Code"
                          name="Code"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.Code}
                          type="text"
                        />
                        <div
                          id="Code-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.Code && touched.Code && errors.Code}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`form-group row mb-3 ${
                        values.Name
                          ? errors.Name
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-4 form-label"
                        htmlFor="Description"
                      >
                        Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-8">
                        <input
                          className="form-control m-0"
                          id="Name"
                          name="Name"
                          rows="2"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.Name}
                          type="text"
                        />
                        <div
                          id="Name-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.Name && touched.Name && errors.Name}
                        </div>
                      </div>
                    </div>

                    {values.Code && values.Name ? (
                      <div className="form-group mb-3 row">
                        <div className="col-lg-4"></div>
                        <div className="col-lg-6">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="form-group mb-3 row">
                          <div className="col-lg-4"></div>
                          <div className="col-lg-6">
                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={true}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </form>
            )}
          </>
        )}
      </Formik>

      {!createNewDepaMode && (
        <div className="d-flex justify-content-center">
          <Button
            onClick={(e) => {
              e.target.blur();
              updateDepartmentStatus(2);
            }}
            disabled={chosenDepartment === null}
          >
            Add
          </Button>
        </div>
      )}
    </>
  );
}

export default AddDepartmentValidate;
