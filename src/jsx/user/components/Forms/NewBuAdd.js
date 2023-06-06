import useRefreshToken from "../../../../Hook/useRefreshToken";
import {
  getAllUserMasterWithDepartment,
  changeUserRole,
  createUserMaster,
} from "../../../../services/UsermasterAPI";
import Select from "react-select";
import Loading from "../../../sharedPage/pages/Loading";
import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import * as Yup from "yup";
import { Formik } from "formik";
import { useSelector } from "react-redux";

const ruleSchema = Yup.object().shape({
  Account: Yup.string().min(3).required("Please enter a account"),
  Email: Yup.string().test("Valid email fsoft", (x) => {
    if (x != undefined) {
      return x.split("@")[1] === "fsoft.com.vn";
    }

    return false;
  }),
  DisplayName: Yup.string().trim().min(5).required("Please enter a name"),
  EmployeeID: Yup.number()
    .integer()
    .min(1000000000, "Please enter valid employee ID")
    .max(9999999999, "Please enter valid employee ID"),
});

function NewBuAdd({ setShow, setRefresh }) {
  const [data] = useRefreshToken(getAllUserMasterWithDepartment);
  const [chosenUser, setChosenUser] = useState(null);
  const [createMode, setCreateMode] = useState(false);
  const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);

  const { getToken } = useContext(GetTokenContext);

  function success() {
    setRefresh(new Date());
    setShow(false);
  }

  function AddHead(body) {
    getToken(
      changeUserRole,
      "New Head had been added",
      success,
      false,
      body.Account,
      2
    );
  }

  const createBUL = (body) => {
    getToken(createUserMaster, "New Head had been added", success, false, body);
  };

  return data === null ? (
    <Loading />
  ) : (
    <>
      <Formik
        initialValues={{
          Account: "",
          Email: "",
          RoleID: 2,
          JobTitle: "DEV",
          DepartmentID: DepartmentID,
          EmployeeID: 0,
          ContractType: 2,
        }}
        validationSchema={ruleSchema}
        validator={() => ({})}
        onSubmit={(values, { setSubmitting }) => {
          createBUL(values);
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
          resetForm,
          touched,
        }) => (
          <>
            <div className="mb-3">
              <div className={`form-group mb-3 row`}>
                <label className="col-lg-4 form-label">User</label>
                <div className="col-lg-8">
                  <Select
                    options={data}
                    onChange={(user) => {
                      if (user.Account === "Other") {
                        setChosenUser(null);
                        setCreateMode(true);
                        return;
                      }
                      setCreateMode(false);
                      resetForm({
                        Account: "",
                        Email: "",
                        DisplayName: "",
                        RoleID: 2,
                        DepartmentID: DepartmentID,
                        EmployeeID: 0,
                      });
                      setChosenUser(user);
                    }}
                    getOptionLabel={(option) =>
                      `${option.Account} (${
                        option.RoleID
                          ? option.RoleID === 3
                            ? "PM"
                            : "Member"
                          : "NO DATA"
                      })`
                    }
                    getOptionValue={(option) => option.Account}
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
            {createMode && (
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
                        values.DisplayName
                          ? errors.DisplayName
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-4 form-label"
                        htmlFor="DisplayName"
                      >
                        Display Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          className="form-control m-0"
                          id="DisplayName"
                          name="DisplayName"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.DisplayName}
                          placeholder="Enter a Name"
                        />
                        <div
                          id="DisplayName-error"
                          className="invalid-feedback animated fadeInUp ms-3"
                          style={{ display: "block" }}
                        >
                          {errors.DisplayName &&
                            touched.DisplayName &&
                            errors.DisplayName}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`form-group mb-3 row ${
                        values.Account
                          ? errors.Account
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label className="col-lg-4 form-label" htmlFor="Account">
                        Account <span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          className="form-control m-0"
                          id="Account"
                          name="Account"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.Account}
                          placeholder="Enter Account"
                        />
                        <div
                          id="Account-error"
                          className="invalid-feedback animated fadeInUp ms-3"
                          style={{ display: "block" }}
                        >
                          {errors.Account && touched.Account && errors.Account}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`form-group mb-3 row ${
                        values.Email
                          ? errors.Email
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label className="col-lg-4 form-label" htmlFor="Email">
                        Email <span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          className="form-control m-0"
                          id="Email"
                          name="Email"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.Email}
                          placeholder="Enter Email"
                        />
                        <div
                          id="Email-error"
                          className="invalid-feedback animated fadeInUp ms-3"
                          style={{ display: "block" }}
                        >
                          {errors.Email && touched.Email && errors.Email}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`form-group mb-3 row ${
                        values.Email
                          ? errors.Email
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-4 form-label"
                        htmlFor="EmployeeID"
                      >
                        Employee ID <span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-8">
                        <input
                          type="number"
                          className="form-control m-0"
                          id="EmployeeID"
                          name="EmployeeID"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.EmployeeID}
                          placeholder="Enter EmployeeID"
                        />
                        <div
                          id="EmployeeID-error"
                          className="invalid-feedback animated fadeInUp ms-3"
                          style={{ display: "block" }}
                        >
                          {errors.EmployeeID &&
                            touched.EmployeeID &&
                            errors.EmployeeID}
                        </div>
                      </div>
                    </div>

                    <div className="form-group mb-3 row">
                      <div className="col-lg-4"></div>
                      <div className="col-lg-6">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting}
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </>
        )}
      </Formik>

      {!createMode && (
        <div className="d-flex justify-content-center">
          <Button
            onClick={(e) => {
              e.target.blur();
              AddHead(chosenUser);
            }}
            disabled={chosenUser === null}
          >
            Add
          </Button>
        </div>
      )}
    </>
  );
}

export default NewBuAdd;
