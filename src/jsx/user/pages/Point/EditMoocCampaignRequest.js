import { useSelector } from "react-redux";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getAllActiveRule } from "../../../../services/RuleAPI";
import { getAllUserMasterNoPage } from "../../../../services/UsermasterAPI";
import { getAllUserProject } from "../../../../services/ProjectAPI";
import { imgServer } from "../../../../dataConfig";
import NewPointValidation from "../../components/Forms/NewPointValidation";
import Loading from "../../../sharedPage/pages/Loading";
import { useContext, useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { createSelfRequest } from "../../../../services/RequestAPI";
import Select from "react-select";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useHistory } from "react-router-dom";
import { getAllCampaignNopage } from "../../../../services/CampaignAPI";
import { useRef } from "react";
import { UpdateEvidence } from "../../../../services/CampaignAPI";
import { getRequestCampaignDetail } from "../../../../services/CampaignAPI";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import {
  getRequestMoocCampaignDetail,
  UpdateEvidenceMoocCampaign,
} from "../../../../services/CampaignAPI";

const today = new Date();

const EditMoocCampaignRequest = () => {
  const { role, departmentName } = useSelector((state) => state.UserSlice);
  const requestID = useParams().requestID;
  const [data2] = useRefreshToken(getRequestMoocCampaignDetail, requestID);
  const { DefaultHead } = useSelector((a) => a.DepartmentSettingSlice);
  const [BULUser] = useRefreshToken(getAllUserMasterNoPage, 2);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ruleData, setRefresh] = useRefreshToken(getAllActiveRule, role);
  const [projectData] = useRefreshToken(getAllUserProject, departmentName);
  const [deadImg, setDead] = useState(false);
  const RequestRef = useRef();
  const [preview, setPreview] = useState(null);
  const { DepartmentID } = useSelector((state) => state.DepartmentSettingSlice);
  const { PointName } = useSelector((a) => a.DepartmentSettingSlice);
  const { account, userID } = useSelector((a) => a.UserSlice);
  const [imgChange, setImgChange] = useState(false);
  const { getToken, getTokenFormData } = useContext(GetTokenContext);
  const navigate = useHistory();
  const [campaignlist] = useRefreshToken(getAllCampaignNopage, userID);
  const [select, setselect] = useState("Campaign");
  const [theInputBanner, setTheInputBanner] = useState(
    document.querySelector("#ImageURLText")
  );

  const ruleSchema = Yup.object().shape({
    RequestType: Yup.string().required("Please choose a Type"),

    RuleDefinitionID: Yup.number()
      .integer()
      .typeError("Please choose a Rule")
      .min(1000, "Please choose a Rule")
      .nullable(false)
      .required("Please choose a Rule"),

    Times: Yup.number()
      .min(1)
      .max(30)
      .required("Please enter times you done the rule")
      .integer(),

    Month: Yup.number()
      .integer()
      .min(today.getMonth() - 1)
      .max(today.getMonth() + 1)
      .nullable(false)
      .required(
        "Please enter a month between " +
          today.getMonth() -
          1 +
          " and " +
          (today.getMonth() + 1)
      ),

    Year: Yup.number()
      .integer()
      .nullable(false)
      .min(
        today.getMonth() != 0 ? today.getFullYear() : today.getFullYear() - 1
      )
      .max(today.getFullYear())
      .required("Please enter a year "),

    LinkRefer: Yup.string()
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        "Enter correct url!"
      )
      .nullable(true),

    ProjectID: Yup.number()
      .integer()
      .min(1000)
      .nullable(false)
      .typeError("Please choose a project")
      .required("Please choose a project"),

    ImageURLText: Yup.mixed().test("fileSize", "The file is too large", () => {
      if (!imgChange) return true;
      if (theInputBanner === null || theInputBanner.files[0] === undefined) {
        return true;
      }
      return theInputBanner.files[0].size <= 3145728;
    }),

    Approver: Yup.string()
      .required("Please choose a approver")
      .typeError("Please choose a approver"),
  });
  const campaignSchema = Yup.object().shape({
    RequestType: Yup.string(),
    LinkRefer: Yup.string()
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        "Enter correct url!"
      )
      .nullable(true),
    Description: Yup.string(),

    ImageURLText: Yup.mixed().test("fileSize", "The file is too large", () => {
      if (theInputBanner === null || theInputBanner.files[0] === undefined) {
        return true;
      }
      return theInputBanner.files[0].size <= 3145728;
    }),
  });
  useEffect(() => {
    if (data2 !== null)
      if (data2.Evidence !== null) {
        if (
          data2.Evidence === "" ||
          data2.Evidence.slice(
            data2.Evidence.length - 6,
            data2.Evidence.length
          ) === ".com"
        )
          setImgChange(true);
      } else setImgChange(true);
  }, [data2]);

  function updatevidence(body) {
    const Status = 2;
    const { LinkRefer, Description, IDCampaign } = body;
    let dataToSend;
    const theInputBanner = document.querySelector("#ImageURLText");
    if (theInputBanner !== null && theInputBanner.files[0]) {
      const formData = new FormData();
      formData.append("Evidence", theInputBanner.files[0]);
      formData.append("Description", Description + "");
      formData.append("Status", Status);
      dataToSend = formData;
    } else {
      dataToSend = {
        Description:
          Description === "" || Description === null ? null : Description,
        Evidence: LinkRefer === "" || LinkRefer === null ? null : LinkRefer,
        Status: 2,
      };
    }
    function success() {
      navigate.push(`/campaign/request`);
    }

    if (data2 !== null) {
      if ((LinkRefer == null || LinkRefer == "") && imgChange == false) {
        dataToSend.Evidence = data2.Evidence;
      }
      theInputBanner !== null && theInputBanner.files[0]
        ? getTokenFormData(
            UpdateEvidenceMoocCampaign,
            "Request has been updated",
            success,
            false,
            data2.ID,
            dataToSend
          )
        : getToken(
            UpdateEvidenceMoocCampaign,
            "Request has been updated",
            success,
            false,
            data2.ID,
            dataToSend
          );
    }
  }
  const setselected = () => {
    setselect(document.getElementById("RequestType").value);
  };
  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    const maxAllowedSize = 200000;
    if (e.target.files[0].size > maxAllowedSize) {
      e.target.value = null;
      document.getElementById("fileSizeAlert").style.display = "block";
    }
    // I've kept this example simple by using the first image instead of multiple
    else {
      document.getElementById("fileSizeAlert").style.display = "none";
      setSelectedFile(e.target.files[0]);
    }
  };
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
  const DefaultHeadData = BULUser?.filter((data) => {
    return data.ID === DefaultHead;
  });
  return ruleData === null ||
    projectData === null ||
    DefaultHeadData === undefined ||
    data2 === null ? (
    <Loading />
  ) : (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Edit Request</h4>
          </div>
          <div className="card-body">
            <div className="form-validate">
              <Formik
                initialValues={{
                  RequestType: "Campaign",
                  LinkRefer:
                    data2.Evidence !== null
                      ? data2.Evidence.includes(".com")
                        ? data2.Evidence
                        : ""
                      : "",
                  ImageURLText:
                    data2.Evidence !== null
                      ? data2.Evidence.includes(".com")
                        ? ""
                        : ""
                      : "",
                  Description:
                    data2.Description !== null ? data2.Description : "",
                  IDCampaign: "",
                }}
                validationSchema={campaignSchema}
                validator={() => ({})}
                onSubmit={(values, { setSubmitting }) => {
                  updatevidence(values);
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
                        <div className={`form-group mb-3 row`}>
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="RequestType"
                          >
                            Requester
                          </label>

                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control m-0 pe-none"
                              readOnly
                              defaultValue={data2.UserMaster.Account}
                            />
                          </div>
                        </div>

                        <div
                          className={`form-group mb-3 row ${
                            values.RequestType
                              ? errors.RequestType
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="RequestType"
                          >
                            Request Type
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control m-0 pe-none"
                              readOnly
                              defaultValue={select}
                            />
                            <div
                              id="RequestType-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.RequestType &&
                                touched.RequestType &&
                                errors.RequestType}
                            </div>
                          </div>
                        </div>

                        <div className={`form-group mb-3 row`}>
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="IDCampaign"
                          >
                            Campaign Name
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control m-0 pe-none"
                              readOnly
                              defaultValue={data2.MoocCampaign.Campaign.Name}
                            />
                            <div
                              id="ListCampaign-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.ListCampaign &&
                                touched.ListCampaign &&
                                errors.ListCampaign}
                            </div>
                          </div>

                          <label
                            className="col-lg-4 form-label"
                            htmlFor="Submitter"
                          >
                            Confirm By
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              readOnly
                              value={data2.Confirmer}
                              className="form-control m-0 pe-none"
                              disabled={true}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div className="row">
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="IDCampaign"
                          >
                            Mooc Time
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control m-0 pe-none"
                              readOnly
                              defaultValue={
                                data2.MoocCampaign.StartDate.substring(0, 10) +
                                " --> " +
                                data2.MoocCampaign.EndDate.substring(0, 10)
                              }
                            />
                            <div
                              id="ListCampaign-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.ListCampaign &&
                                touched.ListCampaign &&
                                errors.ListCampaign}
                            </div>
                          </div>
                        </div>
                        <br />

                        {!values.ImageURLText && (
                          <div
                            className={`form-group mb-3 row ${
                              values.LinkRefer
                                ? errors.LinkRefer
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                            }`}
                          >
                            <label
                              className="col-lg-4 form-label"
                              htmlFor="LinkRefer"
                            >
                              Link Refer
                            </label>
                            <div className="col-lg-6">
                              <input
                                className="form-control m-0"
                                id="LinkRefer"
                                name="LinkRefer"
                                onChange={(e) => {
                                  handleChange(e);
                                  if (e.target.value == "") {
                                    setImgChange(true);
                                  } else {
                                    setImgChange(false);
                                  }
                                  document.getElementById(
                                    "updateButton"
                                  ).disabled = false;
                                }}
                                onBlur={handleBlur}
                                value={values.LinkRefer}
                                type="text"
                              />

                              <div
                                id="LinkRefer-error"
                                className="invalid-feedback animated fadeInUp ms-3"
                                style={{ display: "block" }}
                              >
                                {errors.LinkRefer &&
                                  touched.LinkRefer &&
                                  errors.LinkRefer}
                              </div>
                            </div>
                          </div>
                        )}
                        {!values.LinkRefer && (
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
                              Image
                            </label>

                            <div className="col-lg-6">
                              {imgChange && selectedFile && (
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
                                        const theInputBanner =
                                          document.querySelector(
                                            "#ImageURLText"
                                          );

                                        theInputBanner.value = null;
                                        values.Image = null;
                                        theInputBanner.files = null;
                                        values.ImageURLText = null;
                                        setSelectedFile(false);
                                      }}
                                    >
                                      <i className="fas fa-x" />
                                    </Button>
                                  </div>
                                  <img
                                    src={preview}
                                    height={60}
                                    className=" mb-3"
                                  />
                                </div>
                              )}

                              {imgChange && (
                                <input
                                  className={`form-control m-0 ${
                                    selectedFile && "d-none"
                                  }`}
                                  id="ImageURLText"
                                  defaultValue={
                                    data2 !== null
                                      ? data2.Evidence !== null
                                        ? data2.Evidence.includes(".com")
                                          ? ""
                                          : ""
                                        : ""
                                      : ""
                                  }
                                  name="ImageURLText"
                                  onChange={(e) => {
                                    if (e.target.files[0].size > 200000) {
                                      values.ImageURLText = null;
                                      document.getElementById(
                                        "updateButton"
                                      ).disabled = true;
                                    } else {
                                      document.getElementById(
                                        "updateButton"
                                      ).disabled = false;
                                      handleChange(e);
                                    }
                                    onSelectFile(e);
                                  }}
                                  onBlur={handleBlur}
                                  type="file"
                                  accept=".png, .jpg, .jpeg"
                                />
                              )}
                              <div
                                id="fileSizeAlert"
                                style={{ color: "red", display: "none" }}
                              >
                                Please choose the file that have size smaller
                                than 200kb
                              </div>
                              {!imgChange && (
                                <div className="d-inline-block  position-relative pt-2">
                                  <div
                                    className="position-absolute top-0 start-100 translate-middle"
                                    style={{ zIndex: 10 }}
                                  >
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="rounded-circle"
                                      onClick={() => {
                                        values.Image = null;
                                        setImgChange(true);
                                      }}
                                    >
                                      <i className="fas fa-x" />
                                    </Button>
                                  </div>

                                  {deadImg ? (
                                    <span className="">No Image</span>
                                  ) : (
                                    <img
                                      src={`${imgServer}${data2.Evidence}`}
                                      height={60}
                                      className=" mt-3"
                                      onError={(e) => {
                                        setDead(true);
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                              <div
                                id="ImageURLText-error"
                                className="invalid-feedback animated fadeInUp ms-3"
                                style={{ display: "block" }}
                              >
                                {errors.ImageURLText &&
                                  touched.ImageURLText &&
                                  errors.ImageURLText}
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
                          </label>
                          <div className="col-lg-6">
                            <input
                              className="form-control m-0"
                              id="Description"
                              name="Description"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.Description}
                              type="text"
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

                        <div className="form-group mb-3 row">
                          <div className="col-lg-4"></div>
                          <div className="col-lg-6">
                            <button
                              type="submit"
                              className="btn btn-primary"
                              id="updateButton"
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

export default EditMoocCampaignRequest;
