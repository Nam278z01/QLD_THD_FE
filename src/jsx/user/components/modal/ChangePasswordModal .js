import { useRef } from "react";
import { Modal } from "react-bootstrap";
import useRefreshToken from "../../../../Hook/useRefreshToken";

import {
  findAllUserNickname,
  createNickName,
  getWhatIVote,
} from "../../../../services/NicknameAPI";

import { useSelector } from "react-redux";
import { useContext } from "react";
import { Formik } from "formik";
import { updateSetting } from "../../../../services/SettingAPI";
import * as Yup from "yup";
import { useState } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";

export default function ChangepasswordModal({ show, setShow }) {
  const [passwordShown, setShown] = useState(true);
  const { getTokenFormData, getToken } = useContext(GetTokenContext);
  const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);

  const ruleSchema = Yup.object().shape({
    SMTPPassword: Yup.string().min(6).max(250).required("Password is required"),
    NewPassword: Yup.string().min(6).required("Password is required"),
    ConfirmPassword: Yup.string()
      .min(6)
      .oneOf([Yup.ref("NewPassword"), null], "Passwords must match")
      .required("Password confirm is required"),
  });
  const defaultValue = {
    SMTPPassword: "",
    NewPassword: "",
    ConfirmPassword: "",
  };
  function updateBUSetting(body) {
    const { ConfirmPassword } = body;
    let dataToSend = {
      SMTPPassword: ConfirmPassword,
    };

    const success = () => {
      // setRefresh();
      setShow(false);
    };
    getToken(
      updateSetting,
      "Password has been updated",
      success,
      false,
      dataToSend,
      DepartmentID
    );
  }
  return (
    <Modal
      show={show}
      centered
      onHide={() => {
        setShow(false);
      }}
      size="md"
      scrollable={true}
    >
      <Modal.Header closeButton>
        <h6 className="m-0"> Change Password</h6>
      </Modal.Header>

      <Modal.Body>
        <div>
          <Formik
            initialValues={defaultValue}
            validationSchema={ruleSchema}
            validator={() => ({})}
            onSubmit={(values, { setSubmitting }) => {
              // updateBUSetting(values);
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
                  updateBUSetting(values);
                }}
              >
                <div className="row">
                  {/* <div
                  className={`form-group mb-3 row ${
                    values.SMTPPassword
                      ? errors.SMTPPassword
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }`}
                >
                  <label
                    className="col-lg-5 col-form-label"
                    htmlFor="SMTPPassword"
                  >
                    Old Password<span className="text-danger">*</span>
                  </label>

                  <div className="col-lg-7">
                    <div className="input-group">
                      <input
                        className={`form-control m-0 `}
                        id="SMTPPassword"
                        name="SMTPPassword"
                        type={"password"}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        autoComplete="current-password"
                      />

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
                </div> */}

                  <>
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
                        className="col-lg-5 col-form-label"
                        htmlFor="NewPassword"
                      >
                        New Password<span className="text-danger">*</span>
                      </label>

                      <div className="col-lg-7">
                        <div className="input-group">
                          <input
                            // placeholder={"••••••••••••••"}

                            className={`form-control m-0 `}
                            id="NewPassword"
                            name="NewPassword"
                            type={!passwordShown ? "text" : "password"}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
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
                    </div>

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
                        className="col-lg-5 col-form-label"
                        htmlFor="ConfirmPassword"
                      >
                        Confirm Password
                        <span className="text-danger">*</span>
                      </label>

                      <div className="col-lg-7">
                        <div className="input-group">
                          <input
                            // placeholder={"••••••••••••••"}

                            className={`form-control m-0 `}
                            id="ConfirmPassword"
                            name="ConfirmPassword"
                            type={!passwordShown ? "text" : "password"}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
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
                    </div>
                  </>
                </div>

                <div className="col-12">
                  <div className="d-flex justify-content-end gap-2 pe-4">
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
                    </>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </Modal.Body>

      <Modal.Footer className="bg-gray"></Modal.Footer>
    </Modal>
  );
}
