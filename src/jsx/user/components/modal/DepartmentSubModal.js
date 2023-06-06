import { Modal, Tab, Nav } from "react-bootstrap";
import { Formik } from "formik";
import Select from "react-select";
import { createUserMasterGroupChild } from "../../../../services/GroupChildAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import Loading from "../../../sharedPage/pages/Loading";
import { useState } from "react";
import { useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { getUserGroupChild } from "../../../../services/GroupChildAPI";
import { useEffect } from "react";
import { getAllUserDepartment } from "../../../../services/GroupChildAPI";
import { useSelector } from "react-redux";
const DepartmentSubModal = ({
  show,
  setShow,

  CodeDepartment,
  setUpdateMode,
}) => {
  const [first, setFirst] = useState(true);

  const { getToken } = useContext(GetTokenContext);

  const [data, setdata] = useRefreshToken(getAllUserDepartment);
  const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);

  const [datagroup, setdatagroup] = useRefreshToken(
    getUserGroupChild,
    CodeDepartment
  );

  function updateGroupFunc(body) {
    const { Name, GroupMemberData, AccountMember } = body;
    let dataToSend = {
      Code: Name,
      DepartmentID: DepartmentID,
      UserMasterID: GroupMemberData
        ? GroupMemberData.map((x) => (x.label ? x.ID : x))
        : [],
    };
    function success() {
      setdata(new Date());
      // setdatagroup(new Date());
      setShow(false);
      setUpdateMode(false);
      setdatagroup(new Date());
    }

    getToken(
      createUserMasterGroupChild,
      "Select users success",
      success,
      false,
      dataToSend
    );
  }

  return data === null || datagroup === null ? (
    // <Loading />
    <></>
  ) : (
    <Modal
      show={show}
      centered
      size="xl"
      onHide={(e) => {
        setShow(false);
      }}
    >
      <Modal.Header closeButton> Setting Leader Department </Modal.Header>
      {datagroup.length != 0 && datagroup[0].Code === CodeDepartment && (
        <Modal.Body>
          {" "}
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="form-validation">
                    <Formik
                      initialValues={{
                        Name: CodeDepartment ? CodeDepartment : "",
                        GroupMemberData:
                          datagroup.length !== null
                            ? datagroup.map((x) => ({
                                label: x.Account,
                                ID: x.ID,
                              }))
                            : [],
                        AccountMember: "",
                      }}
                      // validationSchema={valiSchema}
                      validator={() => ({})}
                      onSubmit={(values, { setSubmitting }) => {
                        updateGroupFunc(values);
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
                                  values.Name
                                    ? errors.Name
                                      ? "is-invalid"
                                      : "is-valid"
                                    : ""
                                }`}
                              >
                                <label
                                  className="col-lg-4 form-label"
                                  htmlFor="Name"
                                >
                                  Department Code{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="col-lg-6">
                                  <input
                                    type="text"
                                    readOnly
                                    className="form-control m-0 pe-none"
                                    id="Name"
                                    name="Name"
                                    value={values.Name}
                                    disabled={true}
                                  />

                                  <div
                                    id="Name-error"
                                    className="invalid-feedback animated fadeInUp ms-3"
                                    style={{ display: "block" }}
                                  >
                                    {errors.Name && touched.Name && errors.Name}
                                  </div>

                                  <div
                                    id="times-error"
                                    className="invalid-feedback animated fadeInUp ms-3"
                                    style={{ display: "block" }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-xl-6">
                              <div
                                className={`form-group mb-3 row ${
                                  values.GroupMemberData
                                    ? errors.GroupMemberData
                                      ? "is-invalid"
                                      : "is-valid"
                                    : ""
                                }`}
                              >
                                <label
                                  className="col-lg-4 form-label"
                                  htmlFor="Member"
                                >
                                  Leader
                                </label>

                                <div className="col-lg-6">
                                  <Select
                                    isMulti
                                    options={data}
                                    onBlur={handleBlur}
                                    className="w-100"
                                    onChange={(Member) => {
                                      values.GroupMemberData = Member.map(
                                        (x) => x.ID
                                      );
                                      values.AccountMember = Member.map(
                                        (x) => x.Account
                                      );
                                    }}
                                    onFocus={() => {
                                      touched.GroupMemberData = true;
                                    }}
                                    getOptionValue={(option) => option.label}
                                    styles={{
                                      input: (provided, state) => ({
                                        ...provided,
                                        paddingTop: "12px",
                                        paddingBottom: "12px",
                                      }),
                                    }}
                                    defaultValue={values.GroupMemberData}
                                  />

                                  <div
                                    id="Member-error"
                                    className="invalid-feedback animated fadeInUp ms-3"
                                    style={{ display: "block" }}
                                  >
                                    {errors.GroupMemberData &&
                                      touched.GroupMemberData &&
                                      errors.GroupMemberData}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      )}
      {datagroup.length == 0 && (
        <Modal.Body>
          {" "}
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="form-validation">
                    <Formik
                      initialValues={{
                        Name: CodeDepartment ? CodeDepartment : "",
                        GroupMemberData: [],
                        AccountMember: "",
                      }}
                      // validationSchema={valiSchema}
                      validator={() => ({})}
                      onSubmit={(values, { setSubmitting }) => {
                        updateGroupFunc(values);
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
                                  values.Name
                                    ? errors.Name
                                      ? "is-invalid"
                                      : "is-valid"
                                    : ""
                                }`}
                              >
                                <label
                                  className="col-lg-4 form-label"
                                  htmlFor="Name"
                                >
                                  Department Code{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="col-lg-6">
                                  <input
                                    readOnly={true}
                                    type="text"
                                    className="form-control m-0"
                                    id="Name"
                                    name="Name"
                                    onChange={(e) => {
                                      handleChange(e);
                                    }}
                                    maxLength={250}
                                    onBlur={handleBlur}
                                    value={values.Name}
                                  />

                                  <div
                                    id="Name-error"
                                    className="invalid-feedback animated fadeInUp ms-3"
                                    style={{ display: "block" }}
                                  >
                                    {errors.Name && touched.Name && errors.Name}
                                  </div>

                                  <div
                                    id="times-error"
                                    className="invalid-feedback animated fadeInUp ms-3"
                                    style={{ display: "block" }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-xl-6">
                              <div
                                className={`form-group mb-3 row ${
                                  values.GroupMemberData
                                    ? errors.GroupMemberData
                                      ? "is-invalid"
                                      : "is-valid"
                                    : ""
                                }`}
                              >
                                <label
                                  className="col-lg-4 form-label"
                                  htmlFor="Member"
                                >
                                  Leader
                                </label>

                                <div className="col-lg-6">
                                  <Select
                                    isMulti
                                    options={data}
                                    onBlur={handleBlur}
                                    className="w-100"
                                    onChange={(Member) => {
                                      values.GroupMemberData = Member.map(
                                        (x) => x.ID
                                      );
                                      values.AccountMember = Member.map(
                                        (x) => x.Account
                                      );
                                    }}
                                    onFocus={() => {
                                      touched.GroupMemberData = true;
                                    }}
                                    getOptionValue={(option) => option.label}
                                    styles={{
                                      input: (provided, state) => ({
                                        ...provided,
                                        paddingTop: "12px",
                                        paddingBottom: "12px",
                                      }),
                                    }}
                                    defaultValue={values.GroupMemberData}
                                  />

                                  <div
                                    id="Member-error"
                                    className="invalid-feedback animated fadeInUp ms-3"
                                    style={{ display: "block" }}
                                  >
                                    {errors.GroupMemberData &&
                                      touched.GroupMemberData &&
                                      errors.GroupMemberData}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      )}
    </Modal>
  );
};

export default DepartmentSubModal;
