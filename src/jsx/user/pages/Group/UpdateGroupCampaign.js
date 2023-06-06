import { useState } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useContext } from "react";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import Loading from "../../../sharedPage/pages/Loading";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import Select from "react-select";
import { getAllMem } from "../../../../services/UsermasterAPI";
import { updateGroupCampaign } from "../../../../services/GroupCampaignAPI";
import { useParams } from "react-router-dom";
import { getGroupCampaignDetail } from "../../../../services/GroupCampaignAPI";
import { getAllActiveMem } from "../../../../services/UsermasterAPI";
const UpdateGroupCampaign = () => {
  const { getToken, getTokenFormData } = useContext(GetTokenContext);
  const { ID } = useParams();
  const navigate = useHistory();
  const [MemberDatas] = useRefreshToken(getAllActiveMem);
  const [groupcampaign] = useRefreshToken(getGroupCampaignDetail, ID);

  const [first, setFirst] = useState(true);
  const [userMasters, setUserMasters] = useState([]);

  const valiSchema = Yup.object().shape({
    Name: Yup.string().trim().typeError("please enter Name"),
    ShortDescription: Yup.string()
      .trim()
      .typeError("please enter ShortDescription"),
    DetailDescription: Yup.string()
      .trim()
      .typeError("please enter DetailDescription"),
  });
  function updateGroupFunc(body) {
    const {
      Name,
      ShortDescription,
      DetailDescription,
      Status,
      GroupMemberData,
    } = body;

    function success() {
      navigate.push("/group-list");
    }

    getToken(updateGroupCampaign, "Update success", success, false, ID, {
      GroupData: { Name, ShortDescription, DetailDescription, Status },
      GroupMemberData: body.GroupMemberData
        ? body.GroupMemberData.map((x) => (x.label ? x.ID : x))
        : [],
    });
  }

  if (groupcampaign && first) {
    setUserMasters(groupcampaign.UserMasters);
    setFirst(false);
  }

  return groupcampaign === null ? (
    <Loading />
  ) : (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Update Group</h4>
          </div>
          <div className="card-body">
            <div className="form-validation">
              <Formik
                initialValues={{
                  Name: groupcampaign.Name || "",
                  ShortDescription: groupcampaign.ShortDescription || "",
                  DetailDescription: groupcampaign.DetailDescription || "",
                  Status: groupcampaign.Status,
                  GroupMemberData: userMasters.length
                    ? userMasters.map((x) => ({
                        label: x.Account,
                        ID: x.ID,
                      }))
                    : "",
                }}
                validationSchema={valiSchema}
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
                              maxLength={250}
                              onBlur={handleBlur}
                              value={values.Name}
                            />
                            {document.getElementById('Name')!==null&&(document.getElementById('Name').value.length ==250?<div style={{color:"red"}}>Group Name have the max length is 250 characters</div>:"")}

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
                            <input
                              type="text"
                              className="form-control m-0"
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
                      </div>

                      <div className="col-xl-6">
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
                            <input
                              type="text"
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
                        <div
                          className={`form-group mb-3 row ${
                            values.Status
                              ? errors.Status
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="Status"
                          >
                            Status
                          </label>
                          <div className="col-lg-6">
                            <select
                              type="text"
                              className="form-control m-0"
                              id="Status"
                              name="Status"
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              value={values.Status}
                            >
                              <option value="1">Active</option>
                              <option value="2">Inactive</option>
                            </select>
                            <div
                              id="Status-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Status && touched.Status && errors.Status}
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
                            Member
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
  );
};
export default UpdateGroupCampaign;
