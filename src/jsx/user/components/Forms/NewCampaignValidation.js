import { Formik } from "formik";
import * as Yup from "yup";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Fragment } from "react";
import {
  createCampaign,
  createMoocCampaign,
  uploadCampaignBanner,
} from "../../../../services/CampaignAPI";

import { getProjectMember } from "../../../../services/ProjectAPI";
import { useMsal } from "@azure/msal-react";
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import { useState } from "react";
import CampaignMemberCheckBox from "./CampaignMemberCheckBox";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import CustomPagination from "../Shared/CustomPagination";
import { scopes } from "../../../../dataConfig";
import Swal from "sweetalert2";
import Select from "react-select";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const today = new Date();
today.setHours(0, 0, 0, 0);

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

const campaignSchema = Yup.object().shape({
  Type: Yup.number()
    .integer()
    .min(1)
    .max(2)
    .required("Please choose a rule type")
    .nullable(false),

  Name: Yup.string()
    .min(3, "campaign name must consist of at least 3 characters")
    .required("Please enter a name")
    .nullable(false),
  Description: Yup.string()
    .required("Please describe the campaign")
    .nullable(false),
  ImageURLText: Yup.string()
    .optional()
    .required("Banner is required")
    .nullable(true),
  Budget: Yup.number()
    .integer()
    .min(0)
    .required("Please enter Budget")
    .nullable(false),

  DepartmentID: Yup.number()
    .integer()
    .min(1000)
    .nullable(false)
    .required("Please enter Department ID"),
  ProjectID: Yup.number()
    .integer()
    .min(1000)
    .nullable(false)
    .required("Please enter Project ID"),

  StartDate: Yup.date()
    .min(today, ({ min }) => `Date needs to be after ${formatDate(min)}!!`)
    .max(
      Yup.ref("EndDate"),
      ({ max }) => `Date needs to be before ${formatDate(max)}!!`
    )
    .required("Please choose a start date")
    .nullable(false),
  EndDate: Yup.date()
    .min(
      Yup.ref("StartDate"),
      ({ min }) => `Date needs to be after ${formatDate(min)}!!`
    )
    .required("Please choose a end date")
    .nullable(false),
  MoocTime: Yup.array().of(
    Yup.object().shape({
      CampaignID: Yup.number()
        .integer()
        .min(1000)
        .required("Please enter Campaign ID")
        .nullable(false),
      StartDate: Yup.date()
        .min(today, ({ min }) => `Date needs to be after ${formatDate(min)}!!`)
        .max(
          Yup.ref("EndDate"),
          ({ max }) => `Date needs to be before ${formatDate(max)}!!`
        )
        .required("Please choose a start date")
        .nullable(false),
      EndDate: Yup.date()
        .min(
          Yup.ref("StartDate"),
          ({ min }) => `Date needs to be after ${formatDate(min)}!!`
        )
        .required("Please choose a end date")
        .nullable(false),
      Budget: Yup.number()
        .integer()
        .min(0)
        .required("Please enter Budget")
        .nullable(false),
    })
  ),
});

const NewCampaignValidation = ({ project }) => {
  const { instance, inProgress, accounts } = useMsal();
  const navigate = useHistory();

  const [projectCode, setProjectCode] = useState("");
  const [projectID, setProjectID] = useState(999999);
  const [userApplied, setUserApplied] = useState([]);
  const [page, setPage] = useState(1);
  const [showProjectInput, setShowProjectInput] = useState(false);

  let [dateMember] = useRefreshToken(
    getProjectMember,
    page,
    10,
    "",
    "",
    projectID
  );

  const projectCheckBoxFunc = (e, values) => {
    if (e.target.checked) {
      setShowProjectInput(true);
    } else {
      setShowProjectInput(false);
      values.ProjectID = "";
      setProjectCode("");
      setUserApplied([]);
      setPage(1);
    }
  };

  function createCampaignFunc(body) {
    const theInputBanner = document.querySelector("#ImageURLText");

    const { url } = useRouteMatch();

    if (inProgress === InteractionStatus.None) {
      const accessTokenRequest = {
        scopes: scopes,
        account: accounts[0],
      };
      instance
        .acquireTokenSilent(accessTokenRequest)
        .then((accessTokenResponse) => {
          // Acquire token silent success
          let accessToken = accessTokenResponse.accessToken;
          let token = {
            headers: {
              "Content-Type": "multipart/form-data : boundary=a",
              Authorization: `Bearer ${accessToken}`,
            },
          };
          let token2 = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };

          // Call your API with token

          uploadCampaignBanner(token, theInputBanner.files[0]).then((res) => {
            body.ImageURL = res;

            if (body.Type == 1) {
              const dataSend = {
                DepartmentID: body.DepartmentID,
                Description: body.Description,
                EndDate: body.MoocTime[0].EndDate,
                StartDate: body.MoocTime[0].StartDate,
                ImageURL: res,
                Name: body.Name,
                Type: body.Type,
                Budget: body.MoocTime[0].Budget,
              };

              createCampaign(token2, dataSend).then((res) => {
                Swal.fire({
                  icon: "success",
                  title: "New request has been create",
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                });
                setTimeout(() => {
                  navigate.replace(`/campaign-list`);
                }, 3000);
              });
            } else if (body.Type == 2) {
              const dataSend = {
                DepartmentID: body.DepartmentID,
                Description: body.Description,
                ImageURL: res,
                Name: body.Name,
                EndDate: body.MoocTime[0].EndDate,
                StartDate: body.MoocTime[0].StartDate,
                Type: body.Type,
                Budget: body.MoocTime[0].Budget,
              };

              createCampaign(token2, dataSend).then((res) => {
                for (let i = 1; i < body.MoocTime.length; i++) {
                  const MoocData = {
                    CampaignID: res,
                    Budget: body.MoocTime[i].Budget,
                    StartDate: body.MoocTime[i].StartDate,
                    EndDate: body.MoocTime[i].EndDate,
                  };
                }
                Swal.fire({
                  icon: "success",
                  title: "New request has been create",
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                });
                setTimeout(() => {
                  navigate.replace(`/campaign-list`);
                }, 3000);
              });
            }
          });
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance
              .acquireTokenPopup(accessTokenRequest)
              .then(function (accessTokenResponse) {
                // Acquire token interactive success
                let accessToken = accessTokenResponse.accessToken;
                let token = {
                  headers: {
                    "Content-Type": "multipart/form-data : boundary=a",
                    Authorization: `Bearer ${accessToken}`,
                  },
                };
                let token2 = {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                };

                uploadCampaignBanner(token, theInputBanner.files[0]).then(
                  (res) => {
                    body.ImageURL = res;

                    if (body.Type == 1) {
                      const dataSend = {
                        DepartmentID: body.DepartmentID,
                        Description: body.Description,
                        EndDate: body.MoocTime[0].EndDate,
                        StartDate: body.MoocTime[0].StartDate,
                        ImageURL: res,
                        Name: body.Name,
                        Type: body.Type,
                        Budget: body.MoocTime[0].Budget,
                      };

                      createCampaign(token2, dataSend).then((res) => {
                        Swal.fire({
                          icon: "success",
                          title: "New request has been create",
                          showConfirmButton: false,
                          timer: 3000,
                          timerProgressBar: true,
                        });
                        setTimeout(() => {
                          navigate.replace(`/campaign-list`);
                        }, 3000);
                      });
                    } else if (body.Type == 2) {
                      const dataSend = {
                        DepartmentID: body.DepartmentID,
                        Description: body.Description,
                        ImageURL: res,
                        Name: body.Name,
                        EndDate: body.MoocTime[0].EndDate,
                        StartDate: body.MoocTime[0].StartDate,
                        Type: body.Type,
                        Budget: body.MoocTime[0].Budget,
                      };

                      createCampaign(token2, dataSend).then((res) => {
                        for (let i = 1; i < body.MoocTime.length; i++) {
                          const MoocData = {
                            CampaignID: res,
                            Budget: body.MoocTime[i].Budget,
                            StartDate: body.MoocTime[i].StartDate,
                            EndDate: body.MoocTime[i].EndDate,
                          };
                        }
                        Swal.fire({
                          icon: "success",
                          title: "New request has been create",
                          showConfirmButton: false,
                          timer: 3000,
                          timerProgressBar: true,
                        });
                        setTimeout(() => {
                          navigate.replace(`/campaign-list`);
                        }, 3000);
                      });
                    }
                  }
                );
              })
              .catch(function (error) {
                // Acquire token interactive failure
                Swal.fire({
                  icon: "error",
                  title: error,
                });
              });
          } else {
            Swal.fire({
              icon: "error",
              title: error,
            });
          }
        });
    }
  }

  return (
    <div className="row">
      <div className={`${showProjectInput ? "col-8" : "col-12"}`}>
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Create Campaign</h4>
          </div>
          <div className="card-body">
            <div className="form-validation">
              <Formik
                initialValues={{
                  Type: 1,
                  Name: "",
                  Description: "",
                  DepartmentID: 1175,
                  ImageURLText: "",
                  MoocTime: [
                    {
                      EndDate: "",
                      StartDate: "",
                      Budget: 1,
                    },
                  ],
                }}
                validationSchema={campaignSchema}
                validator={() => ({})}
                onSubmit={(values, { setSubmitting }) => {
                  createCampaignFunc(values);
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
                }) => (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit(e);
                    }}
                  >
                    <div className="row">
                      <div className="col-xl-6">
                        <div
                          className={`form-group mb-3 row ${
                            values.Type
                              ? errors.Type
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label className="col-lg-4 form-label" htmlFor="Type">
                            Campaign Type
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <select
                              className="form-control m-0"
                              id="Type"
                              name="Type"
                              onChange={(e) => {
                                handleChange(e);
                                if (e.target.value == 1) {
                                  values.MoocTime.splice(
                                    1,
                                    values.MoocTime.length - 1
                                  );
                                }
                              }}
                              onBlur={handleBlur}
                              value={values.Type}
                            >
                              <option value={1}>Normal Event</option>
                              <option value={2}>Mooc Event</option>
                            </select>
                            {/* <div className="style-1 bg-white form-check user-select-none p-0 align-items-center mt-1">
                              <input
                                type="checkbox"
                                id="ForProject"
                                className="me-2 form-check-input ms-3 m-0"
                                onClick={(e) => {
                                  projectCheckBoxFunc(e, values);
                                  setUserApplied([]);
                                  setProjectID(999999);
                                }}
                              />
                              <label htmlFor="ForProject" className="m-0">
                                For Project
                              </label>
                            </div> */}
                            <div
                              id="Type-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Type && errors.Type}
                            </div>
                          </div>
                        </div>

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
                            Campaign Name
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <textarea
                              className="form-control m-0"
                              id="Name"
                              name="Name"
                              rows="2"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.Name}
                              placeholder="Enter a name.."
                            ></textarea>
                            <div
                              id="name-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Name && errors.Name}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`form-group mb-3 row ${
                            values.ImageURLText
                              ? errors.ImageURLText
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="ImageURLText"
                          >
                            Banner Img
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              className="form-control m-0"
                              id="ImageURLText"
                              name="ImageURLText"
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              value={values.ImageURLText}
                              type="file"
                            />
                            <div
                              id="category-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.ImageURLText && errors.ImageURLText}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6">
                        {showProjectInput && (
                          <div
                            className={`form-group mb-3 row ${
                              values.ProjectID
                                ? errors.ProjectID
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                            }`}
                          >
                            <label
                              className="col-lg-4 form-label"
                              htmlFor="ProjectID"
                            >
                              Project
                              <span className="text-danger">*</span>
                            </label>

                            <div className="col-lg-6">
                              <Select
                                options={project}
                                onBlur={handleBlur}
                                onChange={(project) => {
                                  setProjectCode(project.ID);
                                }}
                                getOptionValue={(option) => option.ID}
                              />
                              <div
                                id="ProjectID-error"
                                className="invalid-feedback animated fadeInUp ms-3"
                                style={{ display: "block" }}
                              >
                                {errors.ProjectID && errors.ProjectID}
                              </div>
                            </div>
                          </div>
                        )}

                        <div
                          className={`form-group mb-3 row ${
                            values.Description
                              ? errors.Description
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="Description"
                          >
                            Description
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <textarea
                              className="form-control m-0"
                              id="Description"
                              name="Description"
                              rows="5"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.Description}
                              placeholder="..."
                            />
                            <div
                              id="category-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Description && errors.Description}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row m-0 p-0">
                        {values.MoocTime.map((time, i) => (
                          <Fragment key={i}>
                            <hr />
                            <div className="col-xl-4">
                              <div
                                className="form-group mb-3 row"
                                // className={`form-group mb-3 row ${
                                //   errors.MoocTime !== undefined &&
                                //   errors.MoocTime[i] !== undefined &&
                                //   values.MoocTime[i].StartDate
                                //     ? errors.MoocTime[i].StartDate
                                //       ? "is-invalid"
                                //       : "is-valid"
                                //     : ""
                                // }`}
                              >
                                <label
                                  className="col-lg-4 form-label"
                                  htmlFor={`StartDate${i}`}
                                >
                                  Start Date {i + 1}
                                </label>
                                <div className="col-lg-6">
                                  <input
                                    className="form-control m-0"
                                    type="date"
                                    name={`MoocTime[${i}].StartDate`}
                                    id={`StartDate${i}`}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.MoocTime[i].StartDate}
                                  />
                                  {/* <div
                                        id="category-error"
                                        className="invalid-feedback animated fadeInUp ms-3"
                                        style={{ display: "block" }}
                                      >
                                        {errors.MoocTime !== undefined &&
                                          errors.MoocTime[i] !== undefined &&
                                          errors.MoocTime[i].StartDate &&
                                          errors.MoocTime[i].StartDate}
                                      </div> */}
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-4">
                              <div
                                className="form-group mb-3 row"
                                // className={`form-group mb-3 row ${
                                //   errors.MoocTime !== undefined &&
                                //   errors.MoocTime[i] !== undefined &&
                                //   values.MoocTime[i].EndDate
                                //     ? errors.MoocTime[i].EndDate
                                //       ? "is-invalid"
                                //       : "is-valid"
                                //     : ""
                                // }`}
                              >
                                <label
                                  className="col-lg-4 form-label"
                                  htmlFor={`EndDate${i}`}
                                >
                                  End Date {i + 1}
                                </label>
                                <div className="col-lg-6">
                                  <input
                                    className="form-control m-0"
                                    type="date"
                                    id={`EndDate${i}`}
                                    name={`MoocTime[${i}].EndDate`}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.MoocTime[i].EndDate}
                                  />
                                  {/* <div
                                        id="category-error"
                                        className="invalid-feedback animated fadeInUp ms-3"
                                        style={{ display: "block" }}
                                      >
                                        {errors.MoocTime !== undefined &&
                                          errors.MoocTime[i] !== undefined &&
                                          errors.MoocTime[i].EndDate &&
                                          errors.MoocTime[i].EndDate}
                                      </div> */}
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-4">
                              <div
                                className="form-group mb-3 row"
                                // className={`form-group mb-3 row ${
                                //   errors.MoocTime !== undefined &&
                                //   errors.MoocTime[i] !== undefined &&
                                //   values.MoocTime[i].Budget
                                //     ? errors.MoocTime[i].Budget
                                //       ? "is-invalid"
                                //       : "is-valid"
                                //     : ""
                                // }`}
                              >
                                <label
                                  className="col-lg-4 form-label"
                                  htmlFor={`Budget${i}`}
                                >
                                  Budget
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="col-lg-6">
                                  <input
                                    className="form-control m-0"
                                    id={`Budget${i}`}
                                    name={`MoocTime[${i}].Budget`}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.MoocTime[i].Budget}
                                    type="number"
                                  />
                                  {/* <div
                                        id="category-error"
                                        className="invalid-feedback animated fadeInUp ms-3"
                                        style={{ display: "block" }}
                                      >
                                        {errors.MoocTime !== undefined &&
                                          errors.MoocTime[i] !== undefined &&
                                          errors.MoocTime[i].Budget &&
                                          errors.MoocTime[i].Budget}
                                      </div> */}
                                </div>
                              </div>
                            </div>
                          </Fragment>
                        ))}
                        {values.Type == 2 && (
                          <div className="col-xl-12">
                            <div className="form-group mb-3 d-flex justify-content-center">
                              <div>
                                <button
                                  className="btn btn-primary"
                                  onClick={() => {
                                    values.MoocTime.push({
                                      EndDate: "",
                                      StartDate:
                                        values.MoocTime[
                                          values.MoocTime.length - 1
                                        ].EndDate,
                                      Budget: 1,
                                    });
                                  }}
                                >
                                  More Time
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="col-xl-6"></div>
                      <div className="col-xl-6">
                        <div className="form-group mb-3 row">
                          <div className="col-lg-8 ms-auto">
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
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      {showProjectInput && dateMember !== null && (
        <div className="col-4">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Applied for Member</h4>
            </div>

            <div className="card-body">
              {dateMember.member.map((x, i) => (
                <CampaignMemberCheckBox
                  userApplied={userApplied}
                  setUserApplied={setUserApplied}
                  data={x}
                  key={i}
                />
              ))}

              <CustomPagination
                pageOnly={true}
                page={page}
                totalPage={dateMember ? dateMember.totalPage : 1}
                pageChange={(page) => {
                  setPage(page);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewCampaignValidation;
