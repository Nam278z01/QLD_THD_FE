import "bootstrap-daterangepicker/daterangepicker.css";
import { useState, useContext } from "react";

import { GetTokenContext } from "../../../../context/GetTokenContext";
import Select from "react-select";
import { Formik } from "formik";
import * as Yup from "yup";
import { FileUploader } from "react-drag-drop-files";
import {
  createSyncApiHistory,
  createSyncHistory,
  getdefaultRuleSync,
  getRuleSyncLabel,
  getSyncHistory,
} from "../../../../services/RuleAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import Table from "react-bootstrap/Table";
import axios from "axios";
import DownloadExcel from "./DownloadExcel";
import moment from "moment";
import * as XLSX from "xlsx";
import { imgServer } from "../../../../dataConfig";
import { useSelector } from "react-redux";
const SyncTable = (props) => {
  const { datas, setShowLoading } = props;

  const [show, setShow] = useState(false);
  const [selectoption, setselectoption] = useState(false);
  const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);

  let [defaultValue, setdefaultValue] = useState({
    TemplateID: "",
    file: "",
    RuleDefinitionID: "",
    option: "",
    ApiID: "",
  });

  const fileTypes = ["xlsx", "xls"];
  const currentYear = new Date().getFullYear();

  const { getToken, getTokenFormData } = useContext(GetTokenContext);
  const [newyear, setNewyear] = useState("");
  const [newmonth, setNewmonth] = useState("");

  let [ruleid, setruleid] = useState(0);
  const [currentRuleAndTemplate, setCurrentRuleAndTemplate] =
    useRefreshToken(getRuleSyncLabel);

  // const [defaultRuleAndTemplate, setdefaultRuleAndTemplate] = useRefreshToken(
  //   getdefaultRuleSync,
  //   ruleid
  // );
  const [refreshKey, setRefreshKey] = useState(0);
  const [syncHistory, setsyncHistory] = useRefreshToken(
    getSyncHistory,
    ruleid,
    newmonth,
    newyear
  );
  const [file, setFile] = useState(null);
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  const ruleSchema = Yup.object().shape({
    // TemplateID: Yup.string(),
    // // .required("Please choose Apply for Rule")
    // // file: Yup.string().required("Please choose File excel"),
    // RuleDefinitionID: Yup.string().required("Please choose Rule "),
    // option: Yup.string().required("Please choose option Sync "),
  });

  function downloadTemplateFile(i) {
    const url = i; // thay thế bằng URL của file mẫu của bạn
    const filename = "template.xlsx"; // thay thế bằng tên của file mẫu của bạn
    saveAs(url, filename);
  }
  const uploadPoint = (file) => {
    setFile(file);
  };
  function addNewTemplate(value) {
    const formData = new FormData();
    setShowLoading(true);
    formData.append("file", file);
    formData.append("Year", newyear);
    formData.append("Month", newmonth);
    formData.append("RuleDefinitionID", value.RuleDefinitionID);
    formData.append("TemplateID", value.TemplateID);
    const success = () => {
      setCurrentRuleAndTemplate(new Date());
      // setNewmonth();
      // setNewyear();
      setShowLoading(false);
      setsyncHistory(new Date());
    };
    const fail = () => {
      setShowLoading(false);
    };

    getTokenFormData(
      createSyncHistory,
      "Sync request has been created",
      success,
      fail,
      formData
    );
  }
  function syncApi(value) {
    setShowLoading(true);
    const dataToSend = {
      ApiID: value.ApiID,

      RuleDefinitionID: value.RuleDefinitionID,

      DepartmentID: DepartmentID,

      Month: newmonth,

      Year: newyear,
    };
    const success = () => {
      setCurrentRuleAndTemplate(new Date());
      // setNewmonth();
      // setNewyear();
      setShowLoading(false);
      setsyncHistory(new Date());
    };
    const fail = () => {
      setShowLoading(false);
    };

    getToken(
      createSyncApiHistory,
      "Sync request has been created",
      success,
      fail,
      dataToSend
    );
  }
  const option = [
    {
      label: "Sync with excel",
      value: "Excel",
    },
    {
      label: "Sync with api",
      value: "Api",
    },
  ];

  return currentRuleAndTemplate === null || syncHistory === null ? (
    <></>
  ) : (
    <>
      <div className="d-flex justify-content-center mt-4">
        <div className="card w-50 ">
          <div className="card-header">
            <h4 className="card-title">Head Sync Data</h4>
          </div>
          <div className="card-body">
            <Formik
              initialValues={defaultValue}
              validationSchema={ruleSchema}
              validator={() => ({})}
              onSubmit={(values, { setSubmitting }) => {
                if (values.option === "Api") {
                  syncApi(values);
                } else if (values.option === "Excel") {
                  addNewTemplate(values);
                }
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
                  {/* <div className="col-12 col-md-8 p-0">{yearHead}</div>
                  <div className="col-12 col-md-8 p-0">{monthHead}</div> */}
                  <div className="pb-3">
                    {datas.map((x, i) => (
                      <span key={i}>
                        <input
                          key={i}
                          type="radio"
                          className="btn-check"
                          name="year"
                          id={`year${x}`}
                          autoComplete="off"
                          value={x}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            setNewyear(x);
                            values.RuleDefinitionID = "";
                            values.option = "";
                            setShow(false);
                            setRefreshKey((prevKey) => prevKey + 1);
                          }}
                        />
                        <label
                          className={`btn btn-info me-1 `}
                          htmlFor={`year${x}`}
                        >
                          {x}{" "}
                        </label>
                      </span>
                    ))}
                  </div>

                  {newyear &&
                    (newyear === new Date().getFullYear() ? (
                      <div className="pb-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((x, i) =>
                          x <= new Date().getMonth() + 1 ? (
                            <span key={i}>
                              <input
                                key={i}
                                type="radio"
                                className="btn-check"
                                name="month"
                                id={`month${x}`}
                                autoComplete="off"
                                value={x}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  values.RuleDefinitionID = "";
                                  setNewmonth(x);
                                  setShow(false);
                                  setRefreshKey((prevKey) => prevKey + 1);

                                  // btnMonthDOM.forEach((x) => {
                                  //   x.checked = false;
                                  // });
                                }}
                              />
                              <label
                                className={`btn btn-info me-1 `}
                                htmlFor={`month${x}`}
                              >
                                {x}{" "}
                              </label>
                            </span>
                          ) : (
                            ""
                          )
                        )}
                      </div>
                    ) : (
                      <div className="pb-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((x, i) => (
                          <span key={i}>
                            <input
                              key={i}
                              type="radio"
                              className="btn-check"
                              name="month"
                              id={`month${x}`}
                              autoComplete="off"
                              value={x}
                              onBlur={handleBlur}
                              onChange={(e) => {
                                values.RuleDefinitionID = "";
                                values.option = "";

                                setNewmonth(x);
                                setShow(false);
                                setRefreshKey((prevKey) => prevKey + 1);

                                // btnMonthDOM.forEach((x) => {
                                //   x.checked = false;
                                // });
                              }}
                            />
                            <label
                              className={`btn btn-info me-1 `}
                              htmlFor={`month${x}`}
                            >
                              {x}{" "}
                            </label>
                          </span>
                        ))}
                      </div>
                    ))}

                  {newmonth && (
                    <>
                      <div
                        className={`form-group mb-3 row ${values.RuleDefinitionID
                          ? errors.RuleDefinitionID
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                          }`}
                      >
                        <label
                          className="col-lg-4 form-label"
                          htmlFor="RuleDefinitionID"
                        >
                          Rule
                          <span className="text-danger">*</span>
                        </label>
                        <div className="col-lg-6">
                          <Select
                            key={refreshKey}
                            id="RuleDefinitionID"
                            name="RuleDefinitionID"
                            // options={
                            //   currentRuleAndTemplate.filter(
                            //   (item, index) => {
                            //     return (
                            //       index ===
                            //       currentRuleAndTemplate.findIndex(
                            //         (obj) =>
                            //           obj.RuleDefinitionID ===
                            //           item.RuleDefinitionID
                            //       )
                            //     );
                            //   }
                            // )}
                            options={currentRuleAndTemplate.filter(
                              (item, index) => {
                                return (
                                  index ===
                                  currentRuleAndTemplate.findIndex(
                                    (obj) =>
                                      obj.RuleDefinitionID ===
                                      item.RuleDefinitionID
                                  )
                                );
                              }
                            )}
                            onBlur={handleBlur}
                            onChange={(e) => {
                              values.RuleDefinitionID = e.RuleDefinitionID;
                              values.TemplateID = e.Template
                                ? e.Template.ID
                                : null;
                              values.ApiID = e.Api ? e.Api.ID : null;
                              setruleid(e.RuleDefinitionID);
                              setShow(true);
                            }}
                            onFocus={() => {
                              touched.RuleDefinitionID = true;
                            }}
                            getOptionValue={(option) => option.label}
                            styles={{
                              input: (provided, state) => ({
                                ...provided,
                                paddingTop: "12px",
                                paddingBottom: "12px",
                              }),
                              menuList: (styles) => ({
                                ...styles,
                                maxHeight: "190px",
                              }),
                            }}
                          />

                          <div
                            id="RuleDefinitionID-error"
                            className="invalid-feedback animated fadeInUp ms-3"
                            style={{ display: "block" }}
                          >
                            {errors.RuleDefinitionID &&
                              touched.RuleDefinitionID &&
                              errors.RuleDefinitionID}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`form-group mb-3 row ${values.TemplateID
                          ? errors.TemplateID
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                          }`}
                      >
                        <>
                          {values.RuleDefinitionID && (
                            <>
                              <label
                                className="col-lg-4 form-label"
                                htmlFor="option"
                              >
                                Options Sync
                                <span className="text-danger">*</span>
                              </label>
                              <div className="col-lg-6">
                                <Select
                                  key={refreshKey}
                                  id="option"
                                  name="option"
                                  options={option}
                                  onBlur={handleBlur}
                                  onChange={(e) => {
                                    values.option = e.value;
                                    setselectoption(e.value);
                                  }}
                                  onFocus={() => {
                                    touched.option = true;
                                  }}
                                  getOptionValue={(option) => option.label}
                                  styles={{
                                    input: (provided, state) => ({
                                      ...provided,
                                      paddingTop: "12px",
                                      paddingBottom: "12px",
                                    }),
                                    menuList: (styles) => ({
                                      ...styles,
                                      maxHeight: "190px",
                                    }),
                                  }}
                                />

                                <div
                                  id="option-error"
                                  className="invalid-feedback animated fadeInUp ms-3"
                                  style={{ display: "block" }}
                                >
                                  {errors.option &&
                                    touched.option &&
                                    errors.option}
                                </div>
                              </div>

                              {selectoption === "Excel" && (
                                <>
                                  <label
                                    className="col-lg-4 form-label"
                                    htmlFor="Submitter"
                                  >
                                    Apply for Excel
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div className="col-lg-6">
                                    <input
                                      name="excel"
                                      type="text"
                                      readOnly
                                      value={
                                        currentRuleAndTemplate
                                          .filter(
                                            (item) =>
                                              item.RuleDefinitionID ===
                                              values.RuleDefinitionID
                                          )
                                          .map((item) =>
                                            item.Template
                                              ? item.Template.Name
                                              : "No data"
                                          )
                                          .slice(-1)[0]
                                      }
                                      className="form-control m-0 pe-none"
                                      disabled={true}
                                    />
                                  </div>
                                </>
                              )}
                              {selectoption === "Api" && (
                                <>
                                  <label
                                    className="col-lg-4 form-label"
                                    htmlFor="Submitter"
                                  >
                                    Apply for Api
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div className="col-lg-6">
                                    <input
                                      name="api"
                                      type="text"
                                      readOnly
                                      value={
                                        currentRuleAndTemplate
                                          .filter(
                                            (item) =>
                                              item.RuleDefinitionID ===
                                              values.RuleDefinitionID
                                          )
                                          .map((item) =>
                                            item.Api ? item.Api.Name : "No data"
                                          )
                                          .slice(-1)[0]
                                      }
                                      className="form-control m-0 pe-none"
                                      disabled={true}
                                    />
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </>
                      </div>
                      {selectoption === "Excel" && (
                        <>
                          {show ? (
                            <div
                              className={`form-group mb-3 row ${values.file
                                ? errors.file
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                                }`}
                            >
                              <label
                                className="col-lg-4 form-label"
                                htmlFor="file"
                              >
                                File excel
                                <span className="text-danger">*</span>
                              </label>
                              <div className="col-lg-6">
                                {/* <input
                            className={`form-control m-0 `}
                            id="file"
                            name="file"
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                            type="file"
                            accept=".xlsx"
                          /> */}
                                <FileUploader
                                  id="file"
                                  name="file"
                                  types={fileTypes}
                                  handleChange={(e) => {
                                    uploadPoint(e);
                                  }}
                                  multiple={false}
                                  className="drop_area drop_zone w-auto m-0 "
                                />

                                <div
                                  id="file-error"
                                  className="invalid-feedback animated fadeInUp ms-3"
                                  style={{ display: "block" }}
                                >
                                  {errors.file && touched.file && errors.file}
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="text-center">
                            <button
                              type="submit"
                              id="submitButton"
                              className="btn btn-primary"
                              disabled={isSubmitting}
                              onClick={(e) => {
                                e.target.blur();
                              }}
                            >
                              Sync
                            </button>
                            {values.RuleDefinitionID ? (
                              <div
                                style={{
                                  maxHeight: 270,
                                  minHeight: 210,
                                  overflow: "auto",
                                }}
                              >
                                <Table
                                  responsive
                                  className="w-100 text-start border-0 "
                                >
                                  <thead>
                                    <tr className="text-center fs-6 ">
                                      <th style={{ width: "15%" }}>
                                        Total Line
                                      </th>
                                      <th style={{ width: "15%" }}>
                                        Number Line Success
                                      </th>
                                      <th style={{ width: "15%" }}>
                                        Number Line Fail
                                      </th>
                                      <th style={{ width: "20%" }}>
                                        File Fail
                                      </th>
                                      <th style={{ width: "20%" }}>
                                        File Success
                                      </th>

                                      <th style={{ width: "25%" }}>
                                        Created Date
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody
                                    className=""
                                    style={{ maxHeight: 270, minHeight: 210 }}
                                  >
                                    {syncHistory.map((data, i) => (
                                      <tr className="text-center" key={i}>
                                        <td>{data.TotalLine}</td>
                                        <td>{data.NumberLineSuccess}</td>
                                        <td>{data.NumberLineFail}</td>
                                        <td>
                                          <div>
                                            <DownloadExcel
                                              data={data.FileFailURL}
                                            />{" "}
                                          </div>
                                        </td>
                                        <td>
                                          <div>
                                            <DownloadExcel
                                              data={data.FileSuccesURL}
                                            />{" "}
                                          </div>
                                        </td>
                                        <td>
                                          {moment(data.CreatedDate).format(
                                            "DD-MM-YYYY"
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </>
                      )}
                      {selectoption === "Api" && (
                        <>
                          <div className="text-center">
                            <button
                              type="submit"
                              id="submitButtonApi"
                              className="btn btn-primary"
                              disabled={isSubmitting}
                              onClick={(e) => {
                                e.target.blur();
                              }}
                            >
                              Sync
                            </button>
                            {values.RuleDefinitionID ? (
                              <div
                                style={{
                                  maxHeight: 270,
                                  minHeight: 210,
                                  overflow: "auto",
                                }}
                              >
                                <Table
                                  responsive
                                  className="w-100 text-start border-0 "
                                >
                                  <thead>
                                    <tr className="text-center fs-6 ">
                                      <th style={{ width: "15%" }}>
                                        Total Line
                                      </th>
                                      <th style={{ width: "15%" }}>
                                        Number Line Success
                                      </th>
                                      <th style={{ width: "15%" }}>
                                        Number Line Fail
                                      </th>
                                      <th style={{ width: "20%" }}>
                                        File Fail
                                      </th>
                                      <th style={{ width: "20%" }}>
                                        File Success
                                      </th>

                                      <th style={{ width: "25%" }}>
                                        Created Date
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody
                                    className=""
                                    style={{ maxHeight: 270, minHeight: 210 }}
                                  >
                                    {syncHistory.map((data, i) => (
                                      <tr className="text-center" key={i}>
                                        <td>{data.TotalLine}</td>
                                        <td>{data.NumberLineSuccess}</td>
                                        <td>{data.NumberLineFail}</td>
                                        <td>
                                          <div>
                                            <DownloadExcel
                                              data={data.FileFailURL}
                                            />{" "}
                                          </div>
                                        </td>
                                        <td>
                                          <div>
                                            <DownloadExcel
                                              data={data.FileSuccesURL}
                                            />{" "}
                                          </div>
                                        </td>
                                        <td>
                                          {moment(data.CreatedDate).format(
                                            "DD-MM-YYYY"
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};
export default SyncTable;
