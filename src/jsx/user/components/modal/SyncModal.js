import { Modal } from "react-bootstrap";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import Loading from "../../../sharedPage/pages/Loading";

import { useSelector } from "react-redux";
import { useContext } from "react";
import { useState, useEffect } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import Select from "react-select";
import { Button } from "react-bootstrap";
import {
  createNewTemplate,
  createSync,
  getdefaultRuleSync,
  getRuleSync,
  getTemplateSync,
  updateRuleStatus,
  updateSync,
} from "../../../../services/RuleAPI";
import { FileUploader } from "react-drag-drop-files";
import {
  getAllTemplate,
  getDefaultTemplateAPI,
} from "../../../../services/TemplateAPI";
import { getRuleDetail } from "../../../../services/RuleAPI";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { Formik } from "formik";
import { useMemo } from "react";
import FormSyncAPI from "../../pages/Sync/FormSyncAPI";

export default function SyncModal({
  show,
  setShow,
  ID,
  showModalLoading,
  dataDetail,
  RedirectUrl,
}) {
  const { getTokenFormData, getToken } = useContext(GetTokenContext);
  const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);
  const [addNew, setAddNew] = useState(true);
  const [select, setselect] = useState(false);
  const [action, setAction] = useState(null);
  const [file, setFile] = useState(null);
  const numberInputInvalidChars = ["-", "+", "e", "E"];

  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshKeyAddnew, setrefreshKeyAddnew] = useState(0);

  // const [, setFile] = useState(null);

  const fileTypes = ["xlsx", "xls"];
  let [AllTemplate, setAllTemplate] = useRefreshToken(getAllTemplate);
  let [showupdate, setshowupdate] = useState(false);
  let [selectOptionSync, setselectOptionSync] = useState();

  const [tableRows, setTableRows] = useState([
    <tr key="0" className="fw-normal">
      <td>
        <input type="text" id="key" style={{ width: "100%" }} />
      </td>
      <td>
        <input type="text" id="value" style={{ width: "100%" }} />
      </td>
    </tr>,
  ]);

  const [rows, setRows] = useState(null);
  const navigate = useHistory();
  const optionsync = [
    {
      label: "Synchronize as usual",
      value: 1,
    },
    {
      label: "Synchronize with API",
      value: 2,
    },
  ];

  const [samples, setSample] = useState(null);
  let [temid, settemid] = useState(0);

  const [data, setRefreshdata] = useRefreshToken(getRuleDetail, ID);
  const [currentRuleAndTemplate, setCurrentRuleAndTemplate] = useRefreshToken(
    getRuleSync,
    ID
  );
  let [defaultTemlapte, setdefaultTemlapte] = useRefreshToken(
    getDefaultTemplateAPI,
    dataDetail.ApiID
  );
  const [defaultRuleAndTemplate, setdefaultRuleAndTemplate] = useRefreshToken(
    getdefaultRuleSync,
    ID
  );
  const [dataTemplate, setdataTemplate] = useRefreshToken(
    getTemplateSync,
    ID,
    temid
  );
  const [formData, setFormData] = useState({
    name: "",
    headerLine: "",
    dataStartLine: "",
    dataSampleLine: "",
  });
  const isFormValid = useMemo(() => {
    return (
      formData.name &&
      formData.headerLine &&
      formData.dataStartLine &&
      formData.dataSampleLine
    );
  }, [formData]);

  useEffect(() => {
    if (
      defaultRuleAndTemplate !== null &&
      defaultRuleAndTemplate[0] !== undefined &&
      defaultRuleAndTemplate.length > 0
    ) {
      setSample(defaultRuleAndTemplate[0].SampleData);
      settemid(defaultRuleAndTemplate[0].TemplateID);
    }
  }, [defaultRuleAndTemplate]);
  const uploadRule = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setFile(file);
  };

  function AsynchronousRule() {
    Swal.fire({
      title: "Do you want to asynchronous rule ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        let dataToSend = {
          // Synchronize: 0,
          TemplateID: null,
        };
        const success = () => {
          navigate.push(RedirectUrl);
        };

        getToken(
          updateRuleStatus,
          "The asynchronous rule has been updated",
          success,
          false,
          ID,
          dataToSend
        );
      }
    });
  }

  function addNewTemplate() {
    showModalLoading(true);
    let dataToSend;
    const formData = new FormData();
    formData.append("Name", document.getElementById("Nametemplate").value);
    formData.append("file", file);
    formData.append("HeaderLine", document.getElementById("HeaderLine").value);
    formData.append("Sheet", document.getElementById("DataSampleLine").value);

    formData.append(
      "DataStartLine",
      document.getElementById("DataStartLine").value
    );

    dataToSend = formData;

    function success() {
      // setShow(false);
      showModalLoading(false);
      // setRefreshdata(new Date());
      setselect(false);
      setAllTemplate(new Date());
      setdataTemplate(new Date());
      setAddNew(true);
    }
    function fail() {
      showModalLoading(false);
    }

    getTokenFormData(
      createNewTemplate,
      "New template has been created",
      success,
      fail,
      formData
    );
  }
  function addNewSync() {
    let dataToSend = {
      RuleDefinitionID: parseInt(ID),
      TemplateID: parseInt(temid),
      Note: document.getElementById("NoteRow").value
        ? document.getElementById("NoteRow").value
        : null,
      Condition: document.getElementById("Condition").value
        ? document.getElementById("Condition").value
        : null,
      CaculationFormula: document.getElementById("CaculationFormula").value
        ? document.getElementById("CaculationFormula").value
        : null,
      ApplyFor: document.getElementById("accountRow").value
        ? document.getElementById("accountRow").value
        : null,
      ProjectID: document.getElementById("ProjectIdRow").value
        ? document.getElementById("ProjectIdRow").value
        : null,
    };

    function success() {
      setShow(false);
      // setRefreshdata(new Date());
      setselect(false);
      setdataTemplate(new Date());
      // setCurrentRuleAndTemplate(new Date());
      // setdefaultRuleAndTemplate(new Date());
      navigate.push(RedirectUrl);
      // setTimeout(() => {
      //   window.location.reload(false);
      // }, 2000);
    }
    getToken(
      createSync,
      "New request synchronous has been created",
      success,
      false,
      dataToSend
    );
  }

  function updateSynchronous() {
    let dataToSend = {
      RuleDefinitionID: parseInt(ID),
      TemplateID: parseInt(temid),
      Note: document.getElementById("NoteRow").value,
      Condition: document.getElementById("Condition").value,
      CaculationFormula: document.getElementById("CaculationFormula").value,
      ApplyFor: document.getElementById("accountRow").value,
      ProjectID: document.getElementById("ProjectIdRow").value
        ? document.getElementById("ProjectIdRow").value
        : null,
    };
    function success() {
      setShow(false);
      // setRefreshdata(new Date());
      setselect(false);
      setdataTemplate(new Date());
      // setdefaultRuleAndTemplate(new Date());
      navigate.push(RedirectUrl);
      // setTimeout(() => {
      //   window.location.reload(false);
      // }, 2000);
    }

    getToken(
      updateSync,
      "Update synchronous has been created",
      success,
      false,
      dataToSend
    );
  }
  function off() {
    setShow(false);
    setselect(false);
    setAddNew(true);
    setselectOptionSync();
    setTableRows([
      <tr key="0" className="fw-normal">
        <td>
          <input type="text" id="key" style={{ width: "100%" }} />
        </td>
        <td>
          <input type="text" id="value" style={{ width: "100%" }} />
        </td>
      </tr>,
    ]);
    setFormData({
      name: "",
      headerLine: "",
      dataStartLine: "",
      dataSampleLine: "",
    });
  }

  return data === null ||
    currentRuleAndTemplate === null ||
    defaultRuleAndTemplate === null ||
    dataTemplate === null ? (
    <></>
  ) : (
    <Modal show={show} centered onHide={() => {}} size={"xl"} scrollable={true}>
      <Modal.Header>
        <h6 className="m-0 fw-bold fs-5 text-primary"> Synchronous</h6>
        <div>
          <button className="btn btn-outline-secondary" onClick={off}>
            <i className="fas fa-x" />
          </button>
        </div>
      </Modal.Header>
      <Modal.Body>
        <form
          id="form1"
          className="form-valide"
          onSubmit={(e) => {
            e.preventDefault();
            let regex = /[^-\d+*/\[\]]/g;
            let regexCharacter1 = /[[]/g;
            let regexCharacter2 = /]/g;
            let pass = true;
            let caculationPass = true;
            let conditionPass = true;
            let CaculationFormula =
              document.getElementById("CaculationFormula").value;
            let caculationFormulaElement = CaculationFormula.split("]");
            let count1 =
              CaculationFormula.match(regexCharacter1) !== null
                ? CaculationFormula.match(regexCharacter1).length
                : 0;
            let count2 =
              CaculationFormula.match(regexCharacter2) !== null
                ? CaculationFormula.match(regexCharacter2).length
                : 0;
            if (regex.test(CaculationFormula) == true || count1 != count2) {
              document.getElementById("caculationError").style.display =
                "block";
              caculationPass = false;
              pass = false;
            } else if (count1 == count2 && caculationPass) {
              document.getElementById("caculationError").style.display = "none";
            }
            caculationFormulaElement.forEach((element) => {
              let initElemet = element.split("[");
              if (initElemet[1] !== undefined) {
                if (
                  (samples[parseInt(initElemet[1])] == "number" ||
                    samples[parseInt(initElemet[1])] == "percentage") &&
                  regex.test(CaculationFormula) != true &&
                  caculationPass
                ) {
                  document.getElementById("caculationError").style.display =
                    "none";
                } else {
                  document.getElementById("caculationError").style.display =
                    "block";
                  caculationPass = false;
                  pass = false;
                }
              }
            });

            let data = document.getElementById("Condition").value;
            // const rowConditionArray = splitRawData('[7]-[5]>3');
            // let finalCondition = '';
            // await rowConditionArray.forEach((element) => {
            //     let initElemet = element.split('[');
            //     finalCondition = finalCondition + initElemet[0];
            //     //if (initElemet[1] !== undefined) finalCondition = finalCondition + row[parseInt(initElemet[1])].getTime() / 86400000;
            // });
            let condition = data;
            let typeOfCondition = 0;
            if (condition.includes("==") || condition.includes("!=")) {
              typeOfCondition = 1;
            }
            if (
              !condition.includes("==") &&
              !condition.includes("!=") &&
              condition !== ""
            ) {
              document.getElementById("conditionError").innerHTML =
                "Condition invalid";
              document.getElementById("conditionError").style.display = "block";
              conditionPass = false;
              return;
            }
            if (typeOfCondition !== 1) {
              // check condition 2 element is same type
              let rowFormulaArray = data.split("]");
              let finalFormula = [];

              rowFormulaArray.forEach((element) => {
                let initElemet = element.split("[");

                if (initElemet[1] !== undefined) {
                  finalFormula.push(parseInt(initElemet[1]));
                }
              });
              if (finalFormula.length > 2) {
                document.getElementById("conditionError").innerHTML =
                  "Accept only 2 row for condition";
                document.getElementById("conditionError").style.display =
                  "block";
                conditionPass = false;
                pass = false;
                return;
              }

              let verifi = [];
              finalFormula.forEach((element) => {
                verifi.push(samples[element]);
              });

              for (let index = 0; index < verifi.length - 1; index++) {
                if (
                  verifi[index] == "string" &&
                  verifi[index + 1] == "string"
                ) {
                  document.getElementById("conditionError").innerHTML =
                    "Cannot caculate string";
                  document.getElementById("conditionError").style.display =
                    "block";
                  conditionPass = false;
                  pass = false;
                  return;
                }

                if (verifi[index] !== verifi[index + 1]) {
                  // return false;
                  document.getElementById("conditionError").innerHTML =
                    "2 row must be date to compare";
                  document.getElementById("conditionError").style.display =
                    "block";
                  conditionPass = false;
                  return;
                }
              }

              document.getElementById("conditionError").style.display = "none";
              conditionPass = true;
            } else {
              conditionPass = true;
              document.getElementById("conditionError").style.display = "none";
              const myString = data;

              const parts = myString.includes("==")
                ? myString.split("==").map((part) => part.trim())
                : myString.split("!=").map((part) => part.trim());
              if (parts[0].length > 4) {
                document.getElementById("conditionError").innerHTML =
                  "Allow compare only 1 string row in the left side";
                document.getElementById("conditionError").style.display =
                  "block";
                conditionPass = false;
                pass = false;
                return;
              }

              if (parts[0].startsWith("[") && parts[0].endsWith("]")) {
              } else {
                document.getElementById("conditionError").innerHTML =
                  "Wrong format in the left side";
                document.getElementById("conditionError").style.display =
                  "block";
                conditionPass = false;
                return;
              }
              if (parts[1].startsWith('"') && parts[1].endsWith('"')) {
              } else {
                document.getElementById("conditionError").innerHTML =
                  'After character "==" must be a string with format "..." ';
                document.getElementById("conditionError").style.display =
                  "block";
                conditionPass = false;
                pass = false;
                return;
              }
              const index = parseInt(
                parts[0].substring(1, parts[0].length - 1)
              );
              const value = parts[1];

              const myArray = [index, value];

              if (samples[myArray[0]] !== "string") {
                document.getElementById("conditionError").innerHTML =
                  "Type of row not is a string";
                document.getElementById("conditionError").style.display =
                  "block";
                conditionPass = false;
                pass = false;
              } else {
                document.getElementById("conditionError").style.display =
                  "none";
                conditionPass = true;
              }
            }

            if (conditionPass && caculationPass && action == "update") {
              updateSynchronous();
            }
            if (conditionPass && caculationPass && action == "create")
              addNewSync();
          }}
        >
          <div className="row" style={{ minHeight: "150px" }}>
            <div className="row">
              <div className="row">
                <label
                  className="col-lg-3 col-form-label fs-5"
                  htmlFor="ExcelTempalte"
                >
                  Select Sync Options<span className="text-danger">*</span>
                </label>

                <div className="col-lg-8">
                  <div className="row">
                    <div className={"col-4"}>
                      <Select
                        options={optionsync}
                        // defaultValue={defaultRuleAndTemplate.map((item) => ({
                        //   label: item.Template.Name,
                        //   value: item.TemplateID,
                        // }))}
                        onChange={(e) => {
                          setselectOptionSync(e.value);
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
                    {/* <div hidden={addNew} className={"row col-9"}>
                    <div
                      className={addNew ? "col-6 row" : "col-12 mt-1 row"}
                      key={refreshKey}
                    >
                      <div className="col-4 p-1">
                        <div>Name:</div>
                        <div>HeaderLine:</div>
                        <div>Data Start Row:</div>
                        <div>Sheet:</div>
                      </div>

                      <div className="col-8">
                        <div>
                          <input id="Nametemplate" type="text" />
                        </div>
                        <div>
                          <input id="HeaderLine" type="number" />
                        </div>
                        <div>
                          <input id="DataStartLine" type="number" />
                        </div>
                        <div>
                          <input id="DataSampleLine" type="number" />
                        </div>
                      </div>
                    </div>
                    <div className={addNew ? "col-4" : "col-12"}>
                      <FileUploader
                        name="file"
                        id="file"
                        types={fileTypes}
                        handleChange={uploadRule}
                        multiple={false}
                        className="m-0"
                      />
                      <div className="col-8 d-flex justify-content-center">
                        <Button
                          data-mdb-toggle="tooltip"
                          title="Submit"
                          disabled={disabled}
                          onClick={() => {
                            addNewTemplate();
                            setRefreshKey((prevKey) => prevKey + 1);
                          }}
                        >
                          Submit
                        </Button>{" "}
                      </div>
                    </div>
                  </div> */}
                  </div>
                </div>
              </div>
              {selectOptionSync === 1 ? (
                <>
                  <div>
                    <label
                      className="col-lg-5 col-form-label fs-6"
                      htmlFor="ExcelTempalte"
                    >
                      Excel Template<span className="text-danger">*</span>
                    </label>

                    <div className="col-lg-12">
                      <div className="row">
                        <div className={"col-3"}>
                          <Select
                            key={refreshKey}
                            options={AllTemplate}
                            defaultValue={
                              defaultRuleAndTemplate
                                ? defaultRuleAndTemplate.map((item) => ({
                                    label: item.Template
                                      ? item.Template.Name
                                      : "",
                                    value: item.TemplateID
                                      ? item.TemplateID
                                      : "",
                                  }))
                                : ""
                            }
                            onChange={(e) => {
                              if (e.value === "AddNew") {
                                setAddNew(false);
                              } else {
                                let newTemplate = AllTemplate.find((obj) => {
                                  return obj.value === e.value;
                                });

                                setshowupdate(
                                  currentRuleAndTemplate
                                    .filter(
                                      (list) => list.TemplateID === e.value
                                    )
                                    .map((e) => e.TemplateID).length >= 1
                                );

                                settemid(e.value);
                                setselect(true);
                                setRows(newTemplate.Header);
                                setSample(newTemplate.SampleData);
                                setAddNew(true);
                              }
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
                        <div hidden={addNew} className={"row col-9"}>
                          <div
                            className={addNew ? "col-6 row" : "col-12 mt-1 row"}
                            key={refreshKey}
                          >
                            <div className="col-4 p-1">
                              <div>Name:</div>
                              <div>HeaderLine:</div>
                              <div>Data Start Row:</div>
                              <div>Sheet:</div>
                            </div>

                            <div className="col-8">
                              <div>
                                <input
                                  id="Nametemplate"
                                  type="text"
                                  value={formData.name}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <input
                                  id="HeaderLine"
                                  type="number"
                                  value={formData.headerLine}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      headerLine: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <input
                                  id="DataStartLine"
                                  type="number"
                                  value={formData.dataStartLine}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      dataStartLine: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <input
                                  id="DataSampleLine"
                                  type="number"
                                  value={formData.dataSampleLine}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      dataSampleLine: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className={addNew ? "col-4" : "col-12"}>
                            <FileUploader
                              name="file"
                              id="file"
                              types={fileTypes}
                              handleChange={uploadRule}
                              multiple={false}
                              className="m-0"
                            />
                            <div className="col-8 d-flex justify-content-center">
                              <Button
                                data-mdb-toggle="tooltip"
                                title="Submit"
                                disabled={!isFormValid}
                                onClick={() => {
                                  addNewTemplate();
                                  setRefreshKey((prevKey) => prevKey + 1);
                                  setFormData({
                                    name: "",
                                    headerLine: "",
                                    dataStartLine: "",
                                    dataSampleLine: "",
                                  });
                                }}
                              >
                                Submit
                              </Button>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {defaultRuleAndTemplate.length > 0 && select === false ? (
                    <>
                      <div>
                        <div style={{ overflowX: "auto" }} className="mt-2">
                          <table
                            hidden={!addNew}
                            className="table table-bordered text-center"
                          >
                            <thead>
                              <tr>
                                {defaultRuleAndTemplate[0] !== undefined
                                  ? defaultRuleAndTemplate[0].Header !==
                                    undefined
                                    ? defaultRuleAndTemplate[0].Header.map(
                                        (row, i) => (
                                          <th key={i} scope="col">
                                            {row}
                                          </th>
                                        )
                                      )
                                    : ""
                                  : ""}
                              </tr>
                            </thead>
                            <tbody style={{ color: "black" }}>
                              <tr className="fw-normal">
                                {defaultRuleAndTemplate[0] !== undefined
                                  ? defaultRuleAndTemplate[0].Header !==
                                    undefined
                                    ? defaultRuleAndTemplate[0].Header.map(
                                        (row, i) => (
                                          <th key={i} scope="col">
                                            {i}{" "}
                                          </th>
                                        )
                                      )
                                    : ""
                                  : ""}
                              </tr>
                              <tr className="fw-normal">
                                {defaultRuleAndTemplate[0] !== undefined
                                  ? defaultRuleAndTemplate[0].Header !==
                                    undefined
                                    ? defaultRuleAndTemplate[0].SampleData.map(
                                        (sampledata, i) => (
                                          <th key={i} scope="col">
                                            {sampledata}
                                          </th>
                                        )
                                      )
                                    : ""
                                  : ""}
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <table className="table " hidden={!addNew}>
                          <thead>
                            <tr>
                              <th scope="col">Account Row</th>
                              <th scope="col">Project Code Row</th>
                              <th scope="col">Note Row</th>
                            </tr>
                          </thead>
                          <tbody style={{ color: "black" }}>
                            <tr className="fw-normal">
                              <td className="align-middle">
                                <div
                                  key={
                                    defaultRuleAndTemplate[0] !== undefined
                                      ? defaultRuleAndTemplate[0].ApplyFor !==
                                        undefined
                                        ? parseInt(
                                            defaultRuleAndTemplate[0].ApplyFor
                                          )
                                        : ""
                                      : ""
                                  }
                                >
                                  <input
                                    onKeyDown={(e) => {
                                      if (
                                        numberInputInvalidChars.includes(e.key)
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    id="accountRow"
                                    defaultValue={
                                      defaultRuleAndTemplate[0] !== undefined
                                        ? defaultRuleAndTemplate[0].ApplyFor !==
                                          undefined
                                          ? parseInt(
                                              defaultRuleAndTemplate[0].ApplyFor
                                            )
                                          : ""
                                        : ""
                                    }
                                    required
                                    style={{ width: "100%" }}
                                    type="number"
                                  ></input>
                                </div>
                              </td>
                              <td className="align-middle">
                                <div
                                  key={
                                    defaultRuleAndTemplate[0] !== undefined
                                      ? defaultRuleAndTemplate[0].ProjectID !==
                                        undefined
                                        ? parseInt(
                                            defaultRuleAndTemplate[0].ProjectID
                                          )
                                        : ""
                                      : ""
                                  }
                                >
                                  <input
                                    onKeyDown={(e) => {
                                      if (
                                        numberInputInvalidChars.includes(e.key)
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    id="ProjectIdRow"
                                    defaultValue={
                                      defaultRuleAndTemplate[0] !== undefined
                                        ? defaultRuleAndTemplate[0]
                                            .ProjectID !== undefined
                                          ? parseInt(
                                              defaultRuleAndTemplate[0]
                                                .ProjectID
                                            )
                                          : ""
                                        : ""
                                    }
                                    style={{ width: "100%" }}
                                    type="number"
                                  ></input>
                                </div>
                              </td>
                              <td className="align-middle">
                                <div
                                  key={
                                    defaultRuleAndTemplate[0] !== undefined
                                      ? defaultRuleAndTemplate[0].Note !==
                                        undefined
                                        ? parseInt(
                                            defaultRuleAndTemplate[0].Note
                                          )
                                        : ""
                                      : ""
                                  }
                                >
                                  <input
                                    onKeyDown={(e) => {
                                      if (
                                        numberInputInvalidChars.includes(e.key)
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    id="NoteRow"
                                    defaultValue={
                                      defaultRuleAndTemplate[0] !== undefined
                                        ? defaultRuleAndTemplate[0].Note !==
                                          undefined
                                          ? parseInt(
                                              defaultRuleAndTemplate[0].Note
                                            )
                                          : ""
                                        : ""
                                    }
                                    style={{ width: "100%" }}
                                    type="number"
                                  ></input>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div hidden={!addNew}>
                          <div>
                            <label
                              className="col-lg-5 col-form-label"
                              htmlFor="Condition"
                            >
                              Condition &nbsp;
                              <i
                                className="fa fa-circle-info"
                                title="Điều kiện để request point thỏa mãn:&#10;cột: [số cột]&#10;so sánh bằng '=='&#10;so sánh khác '!='&#10;chỉ có thể so sánh các cột có cùng kiểu giá trị&#10;Example: [x]=='Approved'"
                              ></i>
                            </label>

                            <div className="col-lg-7">
                              <div
                                className="input-group"
                                key={
                                  defaultRuleAndTemplate[0] !== undefined
                                    ? defaultRuleAndTemplate[0].Condition !==
                                      undefined
                                      ? defaultRuleAndTemplate[0].Condition
                                      : ""
                                    : ""
                                }
                              >
                                <input
                                  id="Condition"
                                  // placeholder={"••••••••••••••"}
                                  defaultValue={
                                    defaultRuleAndTemplate[0] !== undefined
                                      ? defaultRuleAndTemplate[0].Condition !==
                                        undefined
                                        ? defaultRuleAndTemplate[0].Condition
                                        : ""
                                      : ""
                                  }
                                  className={`form-control m-0 `}
                                  type="text"
                                />

                                <div
                                  id="Condition-error"
                                  className="invalid-feedback animated fadeInUp"
                                  style={{ display: "block" }}
                                ></div>
                              </div>
                            </div>
                            <div
                              id="conditionError"
                              style={{ color: "red", display: "none" }}
                            >
                              Please input the correct given format{" "}
                            </div>
                          </div>

                          <div>
                            <label
                              className="col-lg-5 col-form-label"
                              htmlFor="CaculationFormula"
                            >
                              Caculation Formula &nbsp;
                              <i
                                className="fa fa-circle-info"
                                title="Công thức tính điểm cho request point:&#10;chỉ có thể tính toán giữa các số tự nhiên với các cột number và percentage&#10;Example: [x]*5*[y]"
                              ></i>
                            </label>

                            <div className="col-lg-7">
                              <div
                                className="input-group"
                                key={
                                  defaultRuleAndTemplate[0] !== undefined
                                    ? defaultRuleAndTemplate[0]
                                        .CaculationFormula !== undefined
                                      ? defaultRuleAndTemplate[0]
                                          .CaculationFormula
                                      : ""
                                    : ""
                                }
                              >
                                <input
                                  // placeholder={"••••••••••••••"}
                                  id="CaculationFormula"
                                  defaultValue={
                                    defaultRuleAndTemplate[0] !== undefined
                                      ? defaultRuleAndTemplate[0]
                                          .CaculationFormula !== undefined
                                        ? defaultRuleAndTemplate[0]
                                            .CaculationFormula
                                        : ""
                                      : ""
                                  }
                                  className={`form-control m-0 `}
                                />

                                <div
                                  id="CaculationFormula-error"
                                  className="invalid-feedback animated fadeInUp"
                                  style={{ display: "block" }}
                                ></div>
                              </div>
                            </div>
                            <div
                              id="caculationError"
                              style={{ color: "red", display: "none" }}
                            >
                              Please input the correct given format{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {select ? (
                        <div className="mt-2">
                          <div style={{ overflowX: "auto" }}>
                            {rows !== null && samples !== null ? (
                              <table
                                hidden={!addNew}
                                className="table table-bordered text-center"
                              >
                                <thead>
                                  <tr>
                                    {rows.map((row, i) => (
                                      <th key={i} scope="col">
                                        {row}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody style={{ color: "black" }}>
                                  <tr className="fw-normal">
                                    {rows.map((row, i) => (
                                      <td key={i} className="align-middle">
                                        {i}{" "}
                                      </td>
                                    ))}
                                  </tr>
                                  <tr className="fw-normal">
                                    {samples.map((sample, i) => (
                                      <td key={i} className="align-middle">
                                        {sample}{" "}
                                      </td>
                                    ))}
                                  </tr>
                                </tbody>
                              </table>
                            ) : (
                              ""
                            )}
                          </div>

                          <table className="table " hidden={!addNew}>
                            <thead>
                              <tr>
                                <th scope="col">Account Row</th>
                                <th scope="col">Project Code Row</th>
                                <th scope="col">Note Row</th>
                              </tr>
                            </thead>
                            <tbody style={{ color: "black" }}>
                              <tr className="fw-normal">
                                <td className="align-middle">
                                  <div
                                    key={
                                      dataTemplate !== undefined
                                        ? dataTemplate.ApplyFor !== undefined
                                          ? parseInt(dataTemplate.ApplyFor)
                                          : ""
                                        : ""
                                    }
                                  >
                                    <input
                                      id="accountRow"
                                      defaultValue={
                                        dataTemplate !== undefined
                                          ? dataTemplate.ApplyFor !== undefined
                                            ? parseInt(dataTemplate.ApplyFor)
                                            : ""
                                          : ""
                                      }
                                      required
                                      style={{ width: "100%" }}
                                      type="number"
                                    ></input>
                                  </div>
                                </td>
                                <td className="align-middle">
                                  <div
                                    key={
                                      dataTemplate !== undefined
                                        ? dataTemplate.ProjectID !== undefined
                                          ? parseInt(dataTemplate.ProjectID)
                                          : ""
                                        : ""
                                    }
                                  >
                                    <input
                                      id="ProjectIdRow"
                                      defaultValue={
                                        dataTemplate !== undefined
                                          ? dataTemplate.ProjectID !== undefined
                                            ? parseInt(dataTemplate.ProjectID)
                                            : ""
                                          : ""
                                      }
                                      style={{ width: "100%" }}
                                      type="number"
                                    ></input>
                                  </div>
                                </td>
                                <td className="align-middle">
                                  <div
                                    key={
                                      dataTemplate !== undefined
                                        ? dataTemplate.Note !== undefined
                                          ? parseInt(dataTemplate.Note)
                                          : ""
                                        : ""
                                    }
                                  >
                                    <input
                                      id="NoteRow"
                                      defaultValue={
                                        dataTemplate !== undefined
                                          ? dataTemplate.Note !== undefined
                                            ? parseInt(dataTemplate.Note)
                                            : ""
                                          : ""
                                      }
                                      style={{ width: "100%" }}
                                      type="number"
                                    ></input>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div hidden={!addNew}>
                            <div>
                              <label
                                className="col-lg-5 col-form-label"
                                htmlFor="Condition"
                              >
                                Condition &nbsp;
                                <i
                                  className="fa fa-circle-info"
                                  title="Điều kiện để request point thỏa mãn:&#10;cột: [số cột]&#10;so sánh bằng '=='&#10;so sánh khác '!='&#10;chỉ có thể so sánh các cột có cùng kiểu giá trị&#10;Example: [x]=='Approved'"
                                ></i>
                              </label>

                              <div className="col-lg-7">
                                <div
                                  className="input-group"
                                  key={
                                    dataTemplate !== undefined
                                      ? dataTemplate.Condition !== undefined
                                        ? dataTemplate.Condition
                                        : ""
                                      : ""
                                  }
                                >
                                  <input
                                    id="Condition"
                                    // placeholder={"••••••••••••••"}
                                    defaultValue={
                                      dataTemplate !== undefined
                                        ? dataTemplate.Condition !== undefined
                                          ? dataTemplate.Condition
                                          : ""
                                        : ""
                                    }
                                    className={`form-control m-0 `}
                                    type="text"
                                  />

                                  <div
                                    id="Condition-error"
                                    className="invalid-feedback animated fadeInUp"
                                    style={{ display: "block" }}
                                  ></div>
                                </div>
                              </div>
                              <div
                                id="conditionError"
                                style={{ color: "red", display: "none" }}
                              >
                                Please input the correct given format{" "}
                              </div>
                            </div>

                            <div>
                              <label
                                className="col-lg-5 col-form-label"
                                htmlFor="CaculationFormula"
                              >
                                Caculation Formula &nbsp;
                                <i
                                  className="fa fa-circle-info"
                                  title="Công thức tính điểm cho request point:&#10;chỉ có thể tính toán giữa các số tự nhiên với các cột number và percentage&#10;Example: [x]*5*[y]"
                                ></i>
                              </label>

                              <div className="col-lg-7">
                                <div
                                  className="input-group"
                                  key={
                                    dataTemplate !== undefined
                                      ? dataTemplate.CaculationFormula !==
                                        undefined
                                        ? dataTemplate.CaculationFormula
                                        : ""
                                      : ""
                                  }
                                >
                                  <input
                                    // placeholder={"••••••••••••••"}
                                    id="CaculationFormula"
                                    defaultValue={
                                      dataTemplate !== undefined
                                        ? dataTemplate.CaculationFormula !==
                                          undefined
                                          ? dataTemplate.CaculationFormula
                                          : ""
                                        : ""
                                    }
                                    className={`form-control m-0 `}
                                  />

                                  <div
                                    id="CaculationFormula-error"
                                    className="invalid-feedback animated fadeInUp"
                                    style={{ display: "block" }}
                                  ></div>
                                </div>
                              </div>
                              <div
                                id="caculationError"
                                style={{ color: "red", display: "none" }}
                              >
                                Please input the correct given format{" "}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                  {select ? (
                    <div className="col-12" hidden={!addNew}>
                      <div className="d-flex justify-content-end gap-2 pe-4">
                        {dataTemplate.Status === 1 ? (
                          <>
                            <div>
                              <button
                                type="submit"
                                onClick={(e) => {
                                  setAction("update");
                                  // updateSynchronous();
                                }}
                                className="btn btn-primary"
                              >
                                Update
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <button
                                type="submit"
                                className="btn btn-primary"
                                onClick={(e) => {
                                  setAction("create");
                                  // addNewSync();
                                }}
                              >
                                Save
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {defaultRuleAndTemplate.length > 0 && select === false ? (
                    <div className="col-12" hidden={!addNew}>
                      <div className="d-flex justify-content-end gap-2 pe-4">
                        {dataDetail.TemplateID ? (
                          <div>
                            <button
                              type="button"
                              onClick={(e) => {
                                AsynchronousRule();
                                // setAction("update");
                                // updateSynchronous();
                              }}
                              className="btn btn-danger"
                            >
                              Asynchronous
                            </button>
                          </div>
                        ) : (
                          ""
                        )}

                        <div>
                          <button
                            type="submit"
                            onClick={(e) => {
                              setAction("update");
                              // updateSynchronous();
                            }}
                            className="btn btn-primary"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </form>
        {selectOptionSync === 2 ? (
          <>
            <FormSyncAPI
              ApiID={dataDetail.ApiID}
              ruleID={ID}
              defaultTemlapte={defaultTemlapte ? defaultTemlapte : []}
            />
          </>
        ) : (
          ""
        )}
      </Modal.Body>

      <Modal.Footer className="bg-gray"></Modal.Footer>
    </Modal>
  );
}
