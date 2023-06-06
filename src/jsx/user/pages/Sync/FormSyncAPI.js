import React from "react";
import { imgServer } from "../../../../dataConfig";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import Select from "react-select";
import { useState } from "react";
import { useEffect } from "react";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import {
  getAllTemplateAPI,
  getDataSyncAPI,
  getDefaultDataSyncAPI,
  getDefaultTemplateAPI,
  getInforAPI,
  getInforAPIBasic,
} from "../../../../services/TemplateAPI";
import { createNewTemplateAPI } from "../../../../services/SyncExcelAPI";
import { useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import moment from "moment";
import ObjectSync from "./ObjectSync";
import Loading from "../../../sharedPage/pages/Loading";
import LoadingModal from "../../components/modal/LoadingModal";
import * as Yup from "yup";
import SyncButton from "./SyncButton";
function FormSyncAPI(props) {
  const [apiID, setapiID] = useState(0);
  const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);
  let [AllTemplate, setAllTemplate] = useRefreshToken(getAllTemplateAPI);
  let [dataSync, setdataSync] = useRefreshToken(
    getDataSyncAPI,
    props.ruleID,
    apiID
  );
  let [defaultApi, setdefaultApi] = useRefreshToken(
    getDefaultDataSyncAPI,
    props.ruleID
  );
  const [show, setshow] = useState(false);
  const [showdata, setshowdata] = useState(true);

  const [disabled, setdisabled] = useState(false);

  let [defaultData, setdefaultData] = useRefreshToken(
    getDefaultTemplateAPI,
    apiID
  );
  const [showModal, setShowModal] = useState(false);
  const { getTokenFormData, getToken } = useContext(GetTokenContext);
  const [selectAuthor, setselectAuthor] = useState();
  const [method, setmethod] = useState();
  const [addNew, setAddNew] = useState(true);
  const [showInfor, setshowInfor] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshKey1, setRefreshKey1] = useState(0);
  const [refreshKey2, setRefreshKey2] = useState(0);

  const optionauthor = [
    {
      label: "Basic Auth",
      value: "BasicAuth",
    },
    {
      label: "Token",
      value: "Token",
    },
    {
      label: "Header",
      value: "Header",
    },
  ];
  const [tableData, setTableData] = useState([{ key: "", value: "" }]);

  const handleInputChange = (index, name, value) => {
    const newData = [...tableData];

    newData[index] = {
      ...newData[index],
      [name]: value,
    };

    setTableData(newData);
  };
  const addRow = () => {
    const newRow = {
      key: "",
      value: "",
    };

    setTableData([...tableData, newRow]);
  };
  const removeRow = (index) => {
    const newData = [...tableData];
    newData.splice(index, 1);
    setTableData(newData);
  };
  const tableRows = tableData.map((rowData, index) => (
    <tr key={index} className="fw-normal">
      <td>
        <input
          className="form-control"
          type="text"
          id={`Key-${index}`}
          name={`Key-${index}`}
          style={{ width: "100%" }}
          value={rowData.key}
          onChange={(e) => handleInputChange(index, "key", e.target.value)}
        />
      </td>
      <td>
        <input
          className="form-control"
          type="text"
          id={`Value-${index}`}
          name={`Value-${index}`}
          style={{ width: "100%" }}
          value={rowData.value}
          onChange={(e) => handleInputChange(index, "value", e.target.value)}
        />
      </td>
    </tr>
  ));
  const addTableRow = () => {
    const newRow = (
      <tr key={tableRows.length} className="fw-normal">
        <td>
          <input
            className="form-control"
            type="text"
            id={`Key-${tableRows.length}`}
            name={`Key-${tableRows.length}`}
            style={{ width: "100%" }}
            // value={rowData.key}
            onChange={(e) =>
              handleInputChange(tableRows.length, "key", e.target.value)
            }
          />
        </td>
        <td>
          <input
            className="form-control"
            type="text"
            id={`Value-${tableRows.length}`}
            name={`Value-${tableRows.length}`}
            style={{ width: "100%" }}
            // value={rowData.value}
            onChange={(e) =>
              handleInputChange(tableRows.length, "value", e.target.value)
            }
          />
        </td>
      </tr>
    );
    setTableData([...tableData, { key: "", value: "" }]);
  };

  const optionmethod = [
    {
      label: "Get",
      value: "Get",
    },
    {
      label: "Post",
      value: "Post",
    },
    {
      label: "Put",
      value: "Put",
    },
    {
      label: "Delete",
      value: "Delete",
    },
  ];
  const ruleSchema = Yup.object().shape({
    Name: Yup.string()
      .max(250, "Name cannot exceed 250 characters")
      .nullable(false, "Name can not be null")
      .required("Please enter your Name"),
    Url: Yup.string().required("Please enter a link Api"),
    Method: Yup.string()
      .nullable(false, "Method can not be null")
      .required("Please enter your Method"),
    Authorization: Yup.string()
      .nullable(false, "Authorization can not be null")
      .required("Please enter your Authorization"),
  });
  function addSyncAPI(body) {
    const { Url, UserName, Password, Token, DepartmentID, Timerun, Name } =
      body;
    let dataToSend = {
      Params: tableData.reduce((acc, user, index, array) => {
        const values = Object.values(user).join(":");
        const comma = index !== array.length - 1 ? "," : "";
        return acc + values + comma === ":" ? null : acc + values + comma;
      }, ""),

      Method: method,
      Url: Url,
      Authorization: selectAuthor,
      UserName: UserName,
      Password: Password,
      Token: Token,
      TimeRun: moment(Timerun).format("D,HH,mm"),
      Name: Name,
      DepartmentID: DepartmentID,
    };
    // if (dataToSend.Params && myArray.length > 0) {
    //   dataToSend.Params += tableRows.map;
    // }
    function success() {
      setAddNew(true);
      setRefreshKey1((prevKey) => prevKey + 1);
      setAllTemplate(new Date());
    }
    getToken(
      createNewTemplateAPI,
      "New template synchronous has been created",
      success,
      false,
      dataToSend
    );
  }
  return AllTemplate === null ? (
    <></>
  ) : (
    <>
      <LoadingModal
        show={showModal}
        onHide={() => setShowModal(false)}
        timeout={20000}
      />

      <Formik
        initialValues={{
          Key: null,
          Value: null,
          UserName: null,
          Timerun: null,
          Password: null,
          Token: null,
          // Userheader: null,
          // Passwordheader: null,
          Name: null,
          Method: null,
          Url: null,
          DepartmentID: DepartmentID,
          Authorization: null,
          // Authorization: "",
          Day: "",
          Hours: "",
          Minite: "",
        }}
        validationSchema={ruleSchema}
        validator={() => ({})}
        onSubmit={(values, { setSubmitting }) => {
          addSyncAPI(values);
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
            id="form2"
            className="form-valide"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <div key={refreshKey1}>
              {defaultApi !== undefined &&
                defaultApi !== null &&
                defaultApi !== [] && (
                  <div className="mt-4 row">
                    <label
                      className="col-lg-2 col-form-label fs-6 mb-2"
                      htmlFor="Template"
                    >
                      API<span className="text-danger">*</span>
                    </label>
                    <div className="col-lg-10 mb-2">
                      <div className="row">
                        <div className={"col-3"}>
                          <Select
                            id="Template"
                            name="Template"
                            defaultValue={{
                              label:
                                defaultApi !== undefined &&
                                  defaultApi !== null &&
                                  defaultApi !== []
                                  ? defaultApi.Api.Name
                                  : "",
                            }}
                            options={AllTemplate}
                            // defaultValue={defaultRuleAndTemplate.map((item) => ({
                            //   label: item.Template.Name,
                            //   value: item.TemplateID,
                            // }))}
                            onChange={(e) => {
                              if (e.value === "AddNew") {
                                setAddNew(false);
                                setshowInfor(false);
                              } else {
                                setapiID(e.value);
                                setAddNew(true);
                                setshowInfor(true);
                                setshow(false);
                                setdisabled(false);
                              }
                              setdefaultApi(new Date());
                              setdefaultData(new Date());
                              setdataSync(new Date());
                              setRefreshKey2((prevKey) => prevKey + 1);
                            }}
                            styles={{
                              input: (provided, state) => ({
                                ...provided,
                                paddingTop: "12px",
                                paddingBottom: "12px",
                              }),
                              menuList: (styles) => ({
                                ...styles,
                                maxHeight: "120px",
                              }),
                            }}
                          />
                        </div>
                        <div className="col-2">
                          {" "}
                          {addNew && (
                            <button
                              type="button"
                              className="btn btn-primary mt-2 text-center"
                              onClick={() => {
                                setshow(true);
                                setRefreshKey((prevKey) => prevKey + 1);
                                setShowModal(true);
                                setdisabled(true);
                              }}
                            >
                              Sync
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {!defaultApi && (
                <div className="mt-4 row">
                  <label
                    className="col-lg-2 col-form-label fs-6 mb-2"
                    htmlFor="Template"
                  >
                    API<span className="text-danger">*</span>
                  </label>
                  <div className="col-lg-10 mb-2">
                    <div className="row">
                      <div className={"col-3"}>
                        <Select
                          id="Template"
                          name="Template"
                          options={AllTemplate}
                          onChange={(e) => {
                            if (e.value === "AddNew") {
                              setAddNew(false);
                              setshowInfor(false);
                            } else {
                              setapiID(e.value);
                              setAddNew(true);
                              setshowInfor(true);
                              setshow(false);
                              setdisabled(false);
                            }
                            setdefaultApi(new Date());
                            setdefaultData(new Date());
                            setdataSync(new Date());
                            setRefreshKey2((prevKey) => prevKey + 1);
                          }}
                          styles={{
                            input: (provided, state) => ({
                              ...provided,
                              paddingTop: "12px",
                              paddingBottom: "12px",
                            }),
                            menuList: (styles) => ({
                              ...styles,
                              maxHeight: "120px",
                            }),
                          }}
                        />
                      </div>
                      {showInfor ? (
                        <div className="col-2">
                          {" "}
                          <button
                            type="button"
                            className="btn btn-primary mt-2 text-center"
                            onClick={() => {
                              setshow(true);
                              setRefreshKey((prevKey) => prevKey + 1);
                              setShowModal(true);
                              setdisabled(true);
                            }}
                          >
                            Sync
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div hidden={addNew}>
                <div className="row mb-2">
                  <label
                    className="col-lg-2 col-form-label fs-6"
                    htmlFor="Name"
                  >
                    Name<span className="text-danger">*</span>
                  </label>
                  <div className="col-lg-10">
                    <div className="row">
                      <div className={"col-6"}>
                        <textarea
                          // defaultValue={defaultData ? defaultData.Name : ""}
                          className="form-control"
                          id="Name"
                          name="Name"
                          rows="2"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter Name"
                        // onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                    <div
                      id="Name-error"
                      className="invalid-feedback animated fadeInUp"
                      style={{ display: "block" }}
                    >
                      {errors.Name && touched.Name && errors.Name}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <label
                    className="col-lg-2 col-form-label fs-6"
                    htmlFor="Method"
                  >
                    Method API<span className="text-danger">*</span>
                  </label>
                  <div className="col-lg-10">
                    <div className="row">
                      <div className={"col-2"}>
                        <Select
                          // defaultValue={
                          //   defaultData
                          //     ? {
                          //         label: defaultData.Method,
                          //         value: defaultData.Method,
                          //       }
                          //     : { label: "Select..." }
                          // }
                          id="Method"
                          name="Method"
                          options={optionmethod}
                          onChange={(e) => {
                            setmethod(e.value);
                            values.Method = e.value;
                          }}
                          styles={{
                            input: (provided, state) => ({
                              ...provided,
                              paddingTop: "12px",
                              paddingBottom: "12px",
                            }),
                            menuList: (styles) => ({
                              ...styles,
                              maxHeight: "120px",
                            }),
                          }}
                        />
                        <div
                          id="Method-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.Method && touched.Method && errors.Method}
                        </div>
                      </div>
                      <div className={"col-6"}>
                        <textarea
                          className="form-control"
                          // defaultValue={defaultData ? defaultData.Url : ""}
                          id="Url"
                          name="Url"
                          rows="2"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter a link API"
                        // onChange={handleInputChange}
                        ></textarea>
                        <div
                          id="Url-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.Url && touched.Url && errors.Url}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2 row">
                  <label className="col-lg-2 col-form-label fs-6" htmlFor="API">
                    Params
                    {/* <span className="text-danger">*</span> */}
                  </label>
                  <div style={{ overflowX: "auto" }} className="mt-2 col-lg-7">
                    <table className="table table-bordered  text-center">
                      <thead>
                        <tr>
                          <th>Key</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody style={{ color: "black" }}>{tableRows}</tbody>
                    </table>{" "}
                  </div>
                  <div className="col-lg-3"></div>
                </div>
                <div className=" row">
                  <div className="col-2"></div>
                  <div className="col-lg-7 text-center">
                    <i
                      onClick={addTableRow}
                      className="bi bi-plus-circle mousePointer text-primary"
                      style={{ fontSize: "25px" }}
                    ></i>
                  </div>
                </div>
                <div className="mt-2 row">
                  <label className="col-lg-2 col-form-label fs-6" htmlFor="API">
                    Authorization<span className="text-danger">*</span>
                  </label>
                  <div className="col-lg-8">
                    <div className="row">
                      <div className={"col-4"}>
                        <Select
                          id="Authorization"
                          name="Authorization"
                          // defaultValue={
                          //   defaultData
                          //     ? {
                          //         label: defaultData.Authorization,
                          //         value: defaultData.Authorization,
                          //       }
                          //     : { label: "Select..." }
                          // }
                          options={optionauthor}
                          onChange={(e) => {
                            // setselectOptionSync(e.value);
                            setselectAuthor(e.value);
                            values.Authorization = e.value;
                            setRefreshKey((prevKey) => prevKey + 1);
                            (values.Token = null),
                              (values.UserName = null),
                              (values.Password = null);
                          }}
                          styles={{
                            input: (provided, state) => ({
                              ...provided,
                              paddingTop: "12px",
                              paddingBottom: "12px",
                            }),
                            menuList: (styles) => ({
                              ...styles,
                              maxHeight: "120px",
                            }),
                          }}
                        />
                        <div
                          id="Authorization-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.Authorization &&
                            touched.Authorization &&
                            errors.Authorization}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div key={refreshKey}>
                  {selectAuthor === "BasicAuth" || selectAuthor === "Header" ? (
                    <>
                      <div className="mt-2 row">
                        <div className="col-lg-2"></div>

                        <label
                          className="col-lg-1 col-form-label fs-6"
                          htmlFor="UserName"
                        >
                          {" "}
                          UserName
                          {/* <span className="text-danger">*</span> */}
                        </label>
                        <div className="col-lg-8">
                          <div className="row">
                            <div className={"col-5"}>
                              <textarea
                                className="form-control"
                                id="UserName"
                                name="UserName"
                                rows="1"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter user"
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 row">
                        <div className="col-lg-2"></div>

                        <label
                          className="col-lg-1 col-form-label fs-6"
                          htmlFor="Password"
                        >
                          {" "}
                          Password
                          {/* <span className="text-danger">*</span> */}
                        </label>
                        <div className="col-lg-8">
                          <div className="row">
                            <div className={"col-5"}>
                              <textarea
                                type="password"
                                className="form-control"
                                id="Password"
                                name="Password"
                                rows="1"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter Password"
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : selectAuthor === "Token" ? (
                    <div className="mt-2 row">
                      <div className="col-lg-2"></div>

                      <label
                        className="col-lg-1 col-form-label fs-6"
                        htmlFor="Token"
                      >
                        {" "}
                        Token<span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-8">
                        <div className="row">
                          <div className={"col-5"}>
                            <textarea
                              className="form-control"
                              id="Token"
                              name="Token"
                              rows="1"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Enter Token"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div className="mt-2 row mb-2">
                  <label
                    className="col-lg-2 col-form-label fs-6"
                    htmlFor="Timerun"
                  >
                    {" "}
                    {/* Time Run<span className="text-danger">*</span> */}
                  </label>
                  <div className="col-lg-10">
                    <div className="row">
                      {/* <div className="col-9 row">
                        <div className="col-1 mt-3">Day</div>
                        <div className="col-3">
                          <Select
                            id="Day"
                            name="Day"
                            options={optionDay}
                            // defaultValue={defaultRuleAndTemplate.map((item) => ({
                            //   label: item.Template.Name,
                            //   value: item.TemplateID,
                            // }))}
                            onChange={(e) => {
                              // setselectOptionSync(e.value);
                            }}
                            styles={{
                              input: (provided, state) => ({
                                ...provided,
                                paddingTop: "12px",
                                paddingBottom: "12px",
                              }),
                              menuList: (styles) => ({
                                ...styles,
                                maxHeight: "120px",
                              }),
                            }}
                          />
                        </div>

                        <div className="col-1 mt-3">Hours</div>
                        <div className="col-3">
                          <Select
                            id="Hours"
                            name="Hours"
                            options={optionHours}
                            // defaultValue={defaultRuleAndTemplate.map((item) => ({
                            //   label: item.Template.Name,
                            //   value: item.TemplateID,
                            // }))}
                            onChange={(e) => {}}
                            styles={{
                              input: (provided, state) => ({
                                ...provided,
                                paddingTop: "12px",
                                paddingBottom: "12px",
                              }),
                              menuList: (styles) => ({
                                ...styles,
                                maxHeight: "120px",
                              }),
                            }}
                          />
                        </div>
                        <div className="col-1 mt-3">Minutes</div>
                        <div className="col-3">
                          <Select
                            id="Minutes"
                            name="Minutes"
                            options={optionMinutes}
                            // defaultValue={defaultRuleAndTemplate.map((item) => ({
                            //   label: item.Template.Name,
                            //   value: item.TemplateID,
                            // }))}
                            onChange={(e) => {}}
                            styles={{
                              input: (provided, state) => ({
                                ...provided,
                                paddingTop: "12px",
                                paddingBottom: "12px",
                              }),
                              menuList: (styles) => ({
                                ...styles,
                                maxHeight: "120px",
                              }),
                            }}
                          />
                        </div>
                      </div> */}
                      <div className="col-3">
                        {" "}
                        <button
                          type="submit"
                          className="btn btn-primary  mt-2 text-center"
                          // onClick={addSyncAPI()}
                          // style={{ maxWidth: "75px", maxHeight: "40px" }}
                          // disabled={isButtonDisabled}
                          disabled={isSubmitting}
                        >
                          Create
                        </button>
                        {/* <button
                      type="submit"
                      className="btn btn-primary mt-2 text-center"
                      onClick={(e) => {
                        addSyncAPI();
                        // addNewSync();
                      }}
                    >
                      Sync
                    </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </Formik>
      {showInfor ? (
        <div key={refreshKey}>
          <ObjectSync
            showInfor={showInfor}
            apiID={apiID}
            show={show}
            setshow={setshow}
            setShowModal={setShowModal}
            AllTemplate={dataSync ? dataSync : []}
            DepartmentID={DepartmentID}
            disabled={disabled}
            setAllTemplate={setdataSync}
            ruleID={props.ruleID}
            dataDay={
              dataSync && dataSync.TimeRun ? dataSync.TimeRun.split(",")[0] : ""
            }
            dataHours={
              dataSync && dataSync.TimeRun ? dataSync.TimeRun.split(",")[1] : ""
            }
            dataMinute={
              dataSync && dataSync.TimeRun ? dataSync.TimeRun.split(",")[2] : ""
            }
            defaultApi={defaultApi}
            refreshKey={refreshKey2}
            setRefreshKey={setRefreshKey2}
            setdefaultApi={setdefaultApi}
          />
        </div>
      ) : (
        ""
      )}
      {!showInfor && addNew && defaultApi ? (
        <div key={refreshKey}>
          <ObjectSync
            showInfor={showInfor}
            apiID={apiID}
            show={show}
            setshow={setshow}
            setShowModal={setShowModal}
            AllTemplate={dataSync ? dataSync : []}
            DepartmentID={DepartmentID}
            disabled={disabled}
            setAllTemplate={setdataSync}
            ruleID={props.ruleID}
            dataDay={
              dataSync && dataSync.TimeRun ? dataSync.TimeRun.split(",")[0] : ""
            }
            dataHours={
              dataSync && dataSync.TimeRun ? dataSync.TimeRun.split(",")[1] : ""
            }
            dataMinute={
              dataSync && dataSync.TimeRun ? dataSync.TimeRun.split(",")[2] : ""
            }
            defaultApi={defaultApi}
            refreshKey={refreshKey2}
            setRefreshKey={setRefreshKey2}
            setdefaultApi={setdefaultApi}
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default FormSyncAPI;
