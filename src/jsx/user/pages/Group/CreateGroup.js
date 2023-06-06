import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useContext } from "react";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { createGroup } from "../../../../services/GroupCampaignAPI";
import { Formik } from "formik";
import Select from "react-select";
import { getAllMem } from "../../../../services/UsermasterAPI";
import { getAllActiveMem } from "../../../../services/UsermasterAPI";
const CreateGroup = () => {
  const { getToken, getTokenFormData } = useContext(GetTokenContext);
  const navigate = useHistory();
  const [MemberDatas] = useRefreshToken(getAllActiveMem);

  const valiSchema = Yup.object().shape({
    Name: Yup.string()
      .trim()
      .typeError("Please enter Name")
      .required("Please enter Name"),
    ShortDescription: Yup.string()
      .trim()
      .typeError("Please enter ShortDescription"),
    DetailDescription: Yup.string()
      .trim()
      .typeError("Please enter DetailDescription"),
  });
  function createGroupFunc(body) {
    const { Name, ShortDescription, DetailDescription, GroupMemberData } = body;
    function success() {
      navigate.push("/group-list");
    }

    getToken(createGroup, "Group created", success, false, {
      GroupData: { Name, ShortDescription, DetailDescription },
      GroupMemberData,
    });
  }
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">New Group</h4>
          </div>
          <div className="card-body">
            <div className="form-validation">
              <Formik
                initialValues={{
                  Name: "",
                  ShortDescription: "",
                  DetailDescription: "",
                  GroupMemberData: [],
                }}
                validationSchema={valiSchema}
                validator={() => ({})}
                onSubmit={(values, { setSubmitting }) => {
                  createGroupFunc(values);
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
                          <label className="col-lg-4 form-label" htmlFor="Name">
                            Name Group<span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control m-0"
                              id="Name"
                              name="Name"
                              onChange={(e) => {
                                handleChange(e);
                              }}
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
                        <div
                          className={`form-group mb-3 row ${
                            values.DetailDescription
                              ? errors.DetailDescription
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="DetailDescription"
                          >
                            Note
                          </label>
                          <div className="col-lg-6">
                            <textarea
                              type="text"
                              rows="5"
                              className="form-control m-0"
                              id="DetailDescription"
                              name="DetailDescription"
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              value={values.DetailDescription}
                            />
                            <div
                              id="DetailDescription-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.DetailDescription &&
                                touched.DetailDescription &&
                                errors.DetailDescription}
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
                            values.ShortDescription
                              ? errors.ShortDescription
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="ShortDescription"
                          >
                            Description
                          </label>
                          <div className="col-lg-6">
                            <textarea
                              type="text"
                              className="form-control m-0"
                              rows="3"
                              id="ShortDescription"
                              name="ShortDescription"
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              value={values.ShortDescription}
                            />
                            <div
                              id="ShortDescription-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.ShortDescription &&
                                touched.ShortDescription &&
                                errors.ShortDescription}
                            </div>

                            <div
                              id="times-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            />
                          </div>
                        </div>
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
                            Add Member
                          </label>
                          <div className="col-lg-6">
                            <Select
                              isMulti
                              options={MemberDatas}
                              onBlur={handleBlur}
                              className="w-100"
                              onChange={(Member) => {
                                values.GroupMemberData = Member.map(
                                  (x) => x.ID
                                );
                              }}
                              onFocus={() => {
                                touched.GroupMemberData = true;
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
  );
};
export default CreateGroup;
