import React from "react";

import { useState } from "react";
import { useEffect } from "react";

import {
  getAllTemplateAPI,
  getInforAPI,
  getInforAPIBasic,
} from "../../../../services/TemplateAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import {
  CreateSyncAPI,
  updateSyncAPI,
} from "../../../../services/SyncExcelAPI";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useContext } from "react";
import SyncButton from "./SyncButton";
import moment from "moment";
import Swal from "sweetalert2";
import { updateRuleStatus } from "../../../../services/RuleAPI";
import { useHistory } from "react-router";
import Select from "react-select";

function ObjectSync(props) {
  const { getToken } = useContext(GetTokenContext);
  let [InforApi, setInforApi] = useRefreshToken(getInforAPIBasic, props.apiID);

  const optionDay = [];

  for (let i = 1; i <= 31; i++) {
    optionDay.push({
      label: i.toString(),
      value: i.toString(),
    });
  }
  const optionHours = [];

  for (let i = 0; i < 24; i++) {
    optionHours.push({
      label: i.toString(),
      value: i.toString(),
    });
  }

  const optionMinutes = [];

  for (let i = 0; i < 60; i++) {
    optionMinutes.push({
      label: i.toString(),
      value: i.toString(),
    });
  }

  const [dataDay, setdataDay] = useState(
    props.defaultApi && props.defaultApi.TimeRun
      ? props.defaultApi.TimeRun.split(",")[0]
      : ""
  );
  const [dataHours, setdataHours] = useState(
    props.defaultApi && props.defaultApi.TimeRun
      ? props.defaultApi.TimeRun.split(",")[1]
      : ""
  );
  const [dataMinute, setdataMinute] = useState(
    props.defaultApi && props.defaultApi.TimeRun
      ? props.defaultApi.TimeRun.split(",")[2]
      : ""
  );

  const [header, setHeader] = useState();
  const [datamapping, setdatamapping] = useState();
  const [sample, setsample] = useState();
  const [show, setshow] = useState(false);

  const [tableData, setTableData] = useState([{ key: "", value: "" }]);
  const navigate = useHistory();

  const [action, setAction] = useState(null);
  const numberInputInvalidChars = ["-", "+", "e", "E"];
  useEffect(() => {
    props.setShowModal(false);
  }, [InforApi]);

  const handleInputChange = (index, name, value) => {
    const newData = [...tableData];

    newData[index] = {
      ...newData[index],
      [name]: value,
    };

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
  function addNewSyncAPI() {
    let dataToSend = {
      TimeRun:
        dataDay || dataHours || dataMinute
          ? dataDay + "," + dataHours + "," + dataMinute
          : props.defaultApi
            ? props.defaultApi.TimeRun
            : "",
      SampleData: sample
        ? sample
        : props.defaultApi
          ? props.defaultApi.SampleDataRaw
          : "",
      RuleDefinitionID: parseInt(props.ruleID),
      Header: header
        ? header
        : props.defaultApi
          ? props.defaultApi.HeaderRaw
          : "",
      ApiID: props.apiID
        ? props.apiID
        : props.defaultApi
          ? props.defaultApi.ApiID
          : "",
      DepartmentID: props.DepartmentID,
      AccountPropertyRefer: document.getElementById("account1").value
        ? document.getElementById("account1").value
        : null,
      ProjectIDPropertyRefer: document.getElementById("projectcode1").value
        ? document.getElementById("projectcode1").value
        : null,
      MappingData: datamapping
        ? datamapping
        : props.defaultApi
          ? props.defaultApi.MappingData
          : "",
      NotePropertyRefer: document.getElementById("noterow1").value
        ? document.getElementById("noterow1").value
        : null,
      // TemplateID: "1000",
      Condition: document.getElementById("condition1").value
        ? document.getElementById("condition1").value
        : null,
      FormulaCaculator: document.getElementById("caculationformula1").value
        ? document.getElementById("caculationformula1").value
        : null,
      // TemplateName: document.getElementById("templateName").value
      //   ? document.getElementById("templateName").value
      //   : null,
    };
    function success() {
      props.setRefreshKey((prevKey) => prevKey + 1);
      props.setAllTemplate(new Date());
      setInforApi(new Date());
      props.setshow(false);
      props.setdefaultApi(new Date());
      navigate.push(`/rule/rule-list`);
      // setRefreshKey((prevKey) => prevKey + 1);
      // setTimeout(() => {
      //   window.location.reload(false);
      // }, 2000);
    }
    getToken(
      // updateSyncAPI,
      CreateSyncAPI,
      "New request synchronous has been created",
      success,
      false,
      dataToSend
    );
  }
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
          ApiID: null,
        };
        const success = () => {
          navigate.push(`/rule/rule-list`);
        };

        getToken(
          updateRuleStatus,
          "The asynchronous rule has been updated",
          success,
          false,
          props.ruleID,
          dataToSend
        );
      }
    });
  }

  return (
    <>
      <form
        id="form1"
        className="form-valide"
        onSubmit={(e) => {
          e.preventDefault();
          let caculationPass = false;
          let conditionPass = false;
          let CaculationFormula =
            document.getElementById("caculationformula1").value;
          let Condition = document.getElementById("condition1").value;
          function checkConditionConditionAndFormula(
            conditionString,
            caculationFormulaString,
            SampleData
          ) {
            let regex = /[^-\d+*/\[\]&=!()||]/g;
            let regexCharacter1 = /[[]/g;
            let regexCharacter2 = /]/g;
            let regexCharacter3 = /[(]/g;
            let regexCharacter4 = /[)]/g;
            let CaculationError = "";
            let ConditionError = "";
            let checkCondition = true;
            let Condition = conditionString;
            SampleData = splitRawData(SampleData);
            let caculationRegex = /[^-\d+*/\[\]]/g;
            let checkCaculation = true;
            let CaculationFormula = caculationFormulaString;
            let caculationFormulaElement = CaculationFormula.split("]");
            let count5 =
              CaculationFormula.match(regexCharacter1) !== null
                ? CaculationFormula.match(regexCharacter1).length
                : 0;

            let count6 =
              CaculationFormula.match(regexCharacter2) !== null
                ? CaculationFormula.match(regexCharacter2).length
                : 0;

            if (regex.test(CaculationFormula) == true || count5 != count6) {
              checkCaculation = false;
            }

            caculationFormulaElement.forEach((element) => {
              let initElemet = element.split("[");

              if (initElemet[1] !== undefined) {
                if (
                  SampleData[parseInt(initElemet[1])] == "number" &&
                  caculationRegex.test(CaculationFormula) != true &&
                  checkCaculation
                ) {
                } else {
                  checkCaculation = false;
                }
              }
            });
            let count1 =
              Condition.match(regexCharacter1) !== null
                ? Condition.match(regexCharacter1).length
                : 0;
            let count2 =
              Condition.match(regexCharacter2) !== null
                ? Condition.match(regexCharacter2).length
                : 0;
            let count3 =
              Condition.match(regexCharacter3) !== null
                ? Condition.match(regexCharacter3).length
                : 0;
            let count4 =
              Condition.match(regexCharacter4) !== null
                ? Condition.match(regexCharacter4).length
                : 0;
            if (!(count1 == count2 && count3 == count4)) {
              checkCondition = false;
            }
            function splitRawData(RawData) {
              let splitedArray = RawData.split("[");
              splitedArray = splitedArray.slice(1, splitedArray.length);
              for (let index = 0; index < splitedArray.length; index++) {
                splitedArray[index] = splitedArray[index].replace(/.$/, "");
              }
              return splitedArray;
            }
            function replaceElement(index) {
              if (SampleData[index] == "number") {
                return '"numberType"';
              } else if (SampleData[index] == "string") {
                return '"stringType"';
              } else if (SampleData[index] == "date") {
                return '"dateType"';
              }
            }
            function capitalizeWords(str) {
              return str.replace(/\[(.*?)\]/g, function (match, firstLetter) {
                return `${replaceElement(firstLetter)}`;
              });
            }
            const outputString = capitalizeWords(Condition);
            function isValidCondition(conditionString) {
              try {
                eval(`if (${conditionString}) true;`);

                return true;
              } catch (error) {
                return false;
              }
            }
            if (!isValidCondition(conditionString)) {
              checkCondition = false;
              ConditionError = "Condition is invalid";
            }
            if (!isValidCondition(caculationFormulaString)) {
              checkCaculation = false;
              CaculationError = "Caculation is invalid";
            }
            let pattern = /([=!<>]+|\&\&|\|\|)|"(\w+)"|'(\w+)'|(\w+)/g;
            let elements = Condition ? outputString.match(pattern) : [];

            let filteredElements = elements.filter((elem) => {
              return elem !== undefined && elem !== "(" && elem !== ")";
            });
            filteredElements.forEach(function (element, index) {
              try {
                if (!isNaN(parseFloat(filteredElements[index]))) {
                  filteredElements[index] = parseFloat(filteredElements[index]);
                }
              } catch (error) { }
            });
            const operators = ["+", "-", "*", "/", "%", "^"];
            function isOperator(element) {
              return operators.includes(element);
            } // checkCondition if an element is a comparison operator
            const comparisonOperators = ["<", ">", "<=", ">=", "==", "!="];
            function isComparisonOperator(element) {
              return comparisonOperators.includes(element);
            }
            for (let index = 0; index < filteredElements.length; index++) {
              if (isComparisonOperator(filteredElements[index])) {
                if (
                  filteredElements[index - 1] == '"stringType"' ||
                  filteredElements[index + 1] == '"stringType"'
                ) {
                  if (
                    (filteredElements[index - 1] != '"stringType"' &&
                      typeof filteredElements[index - 1] != "string") ||
                    (filteredElements[index + 1] != '"stringType"' &&
                      typeof filteredElements[index + 1] != "string")
                  ) {
                    ConditionError = "Condition compare string invalid";
                    checkCondition = false;
                  }
                }
                if (
                  filteredElements[index - 1] == '"numberType"' ||
                  filteredElements[index + 1] == '"numberType"'
                ) {
                  if (
                    (filteredElements[index - 1] != '"numberType"' &&
                      typeof filteredElements[index - 1] != "number") ||
                    (filteredElements[index + 1] != '"numberType"' &&
                      typeof filteredElements[index + 1] != "number")
                  ) {
                    ConditionError = "Condition compare number invalid";
                    checkCondition = false;
                  }
                }
                if (
                  filteredElements[index - 1] == '"dateType"' ||
                  filteredElements[index + 1] == '"dateType"'
                ) {
                  if (
                    (filteredElements[index - 1] != '"dateType"' &&
                      typeof filteredElements[index - 1] != "date") ||
                    (filteredElements[index + 1] != '"dateType"' &&
                      typeof filteredElements[index + 1] != "date")
                  ) {
                    if (
                      (filteredElements[index - 1] == '"dateType"' &&
                        filteredElements[index - 2] == '"dateType"') ||
                      (filteredElements[index + 1] == '"dateType"' &&
                        filteredElements[index + 2] == '"dateType"')
                    ) {
                      if (
                        typeof filteredElements[index - 1] != "number" &&
                        typeof filteredElements[index + 1] != "number"
                      ) {
                        ConditionError = "Condition compare date invalid";

                        checkCondition = false;
                      }
                    }
                  }
                }
              }
            }
            if (Condition == "") {
              checkCondition = true;
              ConditionError = "";
            }
            if (CaculationFormula == "") {
              checkCaculation = true;
              CaculationError = "";
            }
            return {
              checkCaculation: checkCaculation,
              checkCondition: checkCondition,
              ConditionError: ConditionError,
              CaculationError: CaculationError,
            };
          }
          const result = checkConditionConditionAndFormula(
            Condition,
            CaculationFormula,
            sample ? sample : props.defaultApi.SampleDataRaw
          );
          if (!result.checkCaculation) {
            document.getElementById("caculationError").innerHTML =
              result.CaculationError;
            document.getElementById("caculationError").style.display = "block";
          } else {
            document.getElementById("caculationError").innerHTML = "";
            document.getElementById("caculationError").style.display = "none";
          }
          if (!result.checkCondition) {
            document.getElementById("conditionError").innerHTML =
              result.ConditionError;
            document.getElementById("conditionError").style.display = "block";
          } else {
            document.getElementById("conditionError").innerHTML = "";
            document.getElementById("conditionError").style.display = "none";
          }
          if (
            result.checkCaculation &&
            result.checkCondition &&
            action == "update"
          ) {
            addNewSyncAPI();
          }
          if (
            result.checkCaculation &&
            result.checkCondition &&
            action == "create"
          )
            addNewSyncAPI();
        }}
      >
        <div>
          {/* <hr className="mt-5"></hr> */}
          <div className="row pe-0" key={props.refreshKey}>
            <div className="col-lg-6 text-center">
              <label className="col-lg-2 col-form-label fs-6 " htmlFor="API">
                {" "}
                Object
              </label>

              {props.show ? (
                <div>
                  <SyncButton
                    defaultApiID={props.defaultApi ? props.defaultApi.ApiID : 0}
                    apiID={props.apiID}
                    setdatamapping={setdatamapping}
                    setHeader={setHeader}
                    setsample={setsample}
                    setshow={setshow}
                  />
                </div>
              ) : (
                <div className="border " style={{ minHeight: "150px" }}>
                  <div style={{ overflowX: "auto" }}>
                    {InforApi ? (
                      <>
                        <table
                          // hidden={!addNew}
                          className="table table-bordered text-center"
                        >
                          <thead>
                            <tr>
                              {InforApi.Header.map((row, i) => (
                                <th key={i} scope="col">
                                  {row}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody style={{ color: "black" }}>
                            <tr className="fw-normal">
                              {InforApi.Header.map((row, i) => (
                                <td key={i} className="align-middle">
                                  {i}{" "}
                                </td>
                              ))}
                            </tr>
                            <tr className="fw-normal">
                              {InforApi.SampleData.map((sample, i) => (
                                <td key={i} className="align-middle">
                                  {sample}{" "}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </>
                    ) : InforApi === false ? (
                      <div></div>
                    ) : (
                      <div className="d-flex justify-content-center align-items-center vh-75">
                        <div className="classic-1"></div>
                      </div>
                    )}
                  </div>
                  {InforApi !== false &&
                    InforApi !== null &&
                    InforApi.Header.length < 1 &&
                    InforApi.SampleData.length < 1 ? (
                    <div>No data</div>
                  ) : (
                    ""
                  )}
                  {props.defaultApi && !props.showInfor && (
                    <>
                      <div style={{ overflowX: "auto" }}>
                        <table
                          // hidden={!addNew}
                          className="table table-bordered text-center"
                        >
                          <thead>
                            <tr>
                              {props.defaultApi.Header.map((row, i) => (
                                <th key={i} scope="col">
                                  {row}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody style={{ color: "black" }}>
                            <tr className="fw-normal">
                              {props.defaultApi.Header.map((row, i) => (
                                <td key={i} className="align-middle">
                                  {i}{" "}
                                </td>
                              ))}
                            </tr>
                            <tr className="fw-normal">
                              {props.defaultApi.SampleData.map((sample, i) => (
                                <td key={i} className="align-middle">
                                  {sample}{" "}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="col-lg-6 text-center pe-0">
              <label
                className="col-lg-4 col-form-label fs-6 "
                htmlFor="template"
              >
                {" "}
                Data Columns
              </label>
              {props.defaultApi && !props.showInfor ? (
                <div className="border ">
                  <div className="row mt-3">
                    <div className="col-3  pe-0">
                      <label className="fst-normal mousePointer">
                        Account <span className="text-danger">*</span>
                      </label>
                    </div>
                    <div
                      className="col-9 text-start ps-0"
                      key={
                        props.defaultApi !== undefined
                          ? props.defaultApi.Account !== undefined
                            ? parseInt(props.defaultApi.Account)
                            : ""
                          : ""
                      }
                    >
                      <input
                        defaultValue={
                          props.defaultApi !== undefined
                            ? props.defaultApi.Account !== undefined
                              ? parseInt(props.defaultApi.Account)
                              : ""
                            : ""
                        }
                        onKeyDown={(e) => {
                          if (numberInputInvalidChars.includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        required
                        min={0}
                        className="form-control"
                        id="account1"
                        name="account1"
                        rows="1"
                        style={{ width: "98%" }}
                        type="number"
                      ></input>
                    </div>
                  </div>
                  <div className="row mt-3 ">
                    <div className="col-3  pe-0">
                      <label className="fst-normal mousePointer">
                        Time Run
                      </label>
                    </div>
                    <div className="col-9 row pe-0">
                      <div className="col-3">
                        <Select
                          id="Day"
                          name="Day"
                          options={optionDay}
                          defaultValue={{
                            label: props.defaultApi.TimeRun
                              ? props.defaultApi.TimeRun.split(",")[0]
                              : "",
                            value: props.defaultApi.TimeRun
                              ? props.defaultApi.TimeRun.split(",")[0]
                              : "",
                          }}
                          onChange={(e) => {
                            // setselectOptionSync(e.value);
                            setdataDay(e.value);
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
                      <div className="col-1 mt-3 p-0">D</div>

                      <div className="col-3">
                        <Select
                          id="Hours"
                          name="Hours"
                          options={optionHours}
                          defaultValue={{
                            label: props.defaultApi.TimeRun
                              ? props.defaultApi.TimeRun.split(",")[1]
                              : "",
                            value: props.defaultApi.TimeRun
                              ? props.defaultApi.TimeRun.split(",")[1]
                              : "",
                          }}
                          onChange={(e) => {
                            setdataHours(e.value);
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
                      <div className="col-1 mt-3  p-0">H</div>
                      <div className="col-3">
                        <Select
                          id="Minutes"
                          name="Minutes"
                          options={optionMinutes}
                          defaultValue={{
                            label: props.defaultApi.TimeRun
                              ? props.defaultApi.TimeRun.split(",")[2]
                              : "",
                            value: props.defaultApi.TimeRun
                              ? props.defaultApi.TimeRun.split(",")[2]
                              : "",
                          }}
                          onChange={(e) => {
                            setdataMinute(e.value);
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
                      <div className="col-1 mt-3  p-0">M</div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-3  pe-0">
                      <label className="fst-normal mousePointer">
                        Project Code
                      </label>
                    </div>
                    <div
                      className="col-9 text-start ps-0"
                      key={
                        props.defaultApi !== undefined
                          ? props.defaultApi.ProjectCode !== undefined
                            ? parseInt(props.defaultApi.ProjectCode)
                            : ""
                          : ""
                      }
                    >
                      <input
                        defaultValue={
                          props.defaultApi !== undefined
                            ? props.defaultApi.ProjectCode !== undefined
                              ? parseInt(props.defaultApi.ProjectCode)
                              : ""
                            : ""
                        }
                        onKeyDown={(e) => {
                          if (numberInputInvalidChars.includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        min={0}
                        type="number"
                        className="form-control"
                        id="projectcode1"
                        name="projcetcode1"
                        rows="1"
                        style={{ width: "98%" }}
                      ></input>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-3  pe-0">
                      <label className="fst-normal mousePointer">
                        Note Row
                      </label>
                    </div>
                    <div
                      className="col-9 text-start ps-0"
                      key={
                        props.defaultApi !== undefined
                          ? props.defaultApi.NoteRow !== undefined
                            ? parseInt(props.defaultApi.NoteRow)
                            : ""
                          : ""
                      }
                    >
                      <input
                        defaultValue={
                          props.defaultApi !== undefined
                            ? props.defaultApi.NoteRow !== undefined
                              ? parseInt(props.defaultApi.NoteRow)
                              : ""
                            : ""
                        }
                        onKeyDown={(e) => {
                          if (numberInputInvalidChars.includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        min={0}
                        type="number"
                        className="form-control"
                        id="noterow1"
                        name="noterow1"
                        rows="1"
                        style={{ width: "98%" }}
                      ></input>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-3  pe-0">
                      <label className="fst-normal mousePointer">
                        Condition &nbsp;
                        <i
                          className="fa fa-circle-info"
                          title="Điều kiện để request point thỏa mãn:&#10;cột: [số cột]&#10;so sánh bằng '=='&#10;so sánh khác '!='&#10;chỉ có thể so sánh các cột có cùng kiểu giá trị&#10;Example: [x]=='Approved'"
                        ></i>
                      </label>
                    </div>
                    <div
                      className="col-9 text-start ps-0"
                      key={
                        props.defaultApi !== undefined
                          ? props.defaultApi.Condition !== undefined
                            ? props.defaultApi.Condition
                            : ""
                          : ""
                      }
                    >
                      <input
                        defaultValue={
                          props.defaultApi !== undefined
                            ? props.defaultApi.Condition !== undefined
                              ? props.defaultApi.Condition
                              : ""
                            : ""
                        }
                        className="form-control"
                        id="condition1"
                        name="condition1"
                        rows="1"
                        style={{ width: "98%" }}
                      ></input>
                    </div>
                    <div
                      id="conditionError"
                      style={{ color: "red", display: "none" }}
                    >
                      Please input the correct given format{" "}
                    </div>
                  </div>
                  <div className="row mt-3 mb-2">
                    <div className="col-3  pe-0">
                      <label className="fst-normal mousePointer">
                        Caculation Formula &nbsp;
                        <i
                          className="fa fa-circle-info"
                          title="Công thức tính điểm cho request point:&#10;chỉ có thể tính toán giữa các số tự nhiên với các cột number và percentage&#10;Example: [x]*5*[y]"
                        ></i>
                      </label>
                    </div>
                    <div
                      className="col-9 text-start ps-0"
                      key={
                        props.defaultApi !== undefined
                          ? props.defaultApi.Caculator !== undefined
                            ? props.defaultApi.Caculator
                            : ""
                          : ""
                      }
                    >
                      <input
                        defaultValue={
                          props.defaultApi !== undefined
                            ? props.defaultApi.Caculator !== undefined
                              ? props.defaultApi.Caculator
                              : ""
                            : ""
                        }
                        className="form-control"
                        id="caculationformula1"
                        name="caculationformula1"
                        rows="1"
                        style={{ width: "98%" }}
                      ></input>
                    </div>
                    <div
                      id="caculationError"
                      style={{ color: "red", display: "none" }}
                    >
                      Please input the correct given format{" "}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border ">
                  <div className="row mt-3">
                    <div className="col-3  pe-0">
                      <label className="fst-normal mousePointer">
                        Account <span className="text-danger">*</span>
                      </label>
                    </div>
                    <div
                      className="col-9 text-start ps-0"
                      key={
                        props.AllTemplate !== undefined
                          ? props.AllTemplate.Account !== undefined
                            ? parseInt(props.AllTemplate.Account)
                            : ""
                          : ""
                      }
                    >
                      <input
                        defaultValue={
                          props.AllTemplate !== undefined
                            ? props.AllTemplate.Account !== undefined
                              ? parseInt(props.AllTemplate.Account)
                              : ""
                            : ""
                        }
                        onKeyDown={(e) => {
                          if (numberInputInvalidChars.includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        required
                        min={0}
                        className="form-control"
                        id="account1"
                        name="account1"
                        rows="1"
                        style={{ width: "98%" }}
                        type="number"
                      ></input>
                    </div>
                  </div>
                  <div className="row mt-3 ">
                    <div className="col-3  pe-0">
                      <label className="fst-normal mousePointer">
                        Time Run
                      </label>
                    </div>
                    <div className="col-9 row pe-0">
                      <div className="col-3">
                        {props.dataDay && (
                          <Select
                            id="Day"
                            name="Day"
                            options={optionDay}
                            defaultValue={{
                              label: props.dataDay,

                              value: props.dataDay,
                            }}
                            onChange={(e) => {
                              // setselectOptionSync(e.value);
                              setdataDay(e.value);
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
                        )}
                        {!props.dataDay && (
                          <Select
                            id="Day"
                            name="Day"
                            defaultValue={{
                              label: "",
                            }}
                            options={optionDay}
                            onChange={(e) => {
                              // setselectOptionSync(e.value);
                              setdataDay(e.value);
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
                        )}
                      </div>
                      <div className="col-1 mt-3 p-0">D</div>

                      <div className="col-3">
                        {props.dataHours && (
                          <Select
                            id="Hours"
                            name="Hours"
                            options={optionHours}
                            defaultValue={{
                              label: props.dataHours,
                              value: props.dataHours,
                            }}
                            onChange={(e) => {
                              setdataHours(e.value);
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
                        )}
                        {!props.dataHours && (
                          <Select
                            id="Hours"
                            name="Hours"
                            options={optionHours}
                            defaultValue={{
                              label: "",
                            }}
                            onChange={(e) => {
                              setdataHours(e.value);
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
                        )}
                      </div>
                      <div className="col-1 mt-3  p-0">H</div>
                      <div className="col-3">
                        {props.dataMinute && (
                          <Select
                            id="Minutes"
                            name="Minutes"
                            options={optionMinutes}
                            defaultValue={{
                              label: props.dataMinute,
                              value: props.dataMinute,
                            }}
                            onChange={(e) => {
                              setdataMinute(e.value);
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
                        )}
                        {!props.dataMinute && (
                          <Select
                            id="Minutes"
                            name="Minutes"
                            options={optionMinutes}
                            defaultValue={{
                              label: "",
                            }}
                            onChange={(e) => {
                              setdataMinute(e.value);
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
                        )}
                      </div>
                      <div className="col-1 mt-3  p-0">M</div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-3  pe-0">
                      <label className="fst-normal mousePointer">
                        Project Code
                      </label>
                    </div>
                    <div
                      className="col-9 text-start ps-0"
                      key={
                        props.AllTemplate !== undefined
                          ? props.AllTemplate.ProjectCode !== undefined
                            ? parseInt(props.AllTemplate.ProjectCode)
                            : ""
                          : ""
                      }
                    >
                      <input
                        defaultValue={
                          props.AllTemplate !== undefined
                            ? props.AllTemplate.ProjectCode !== undefined
                              ? parseInt(props.AllTemplate.ProjectCode)
                              : ""
                            : ""
                        }
                        onKeyDown={(e) => {
                          if (numberInputInvalidChars.includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        min={0}
                        type="number"
                        className="form-control"
                        id="projectcode1"
                        name="projcetcode1"
                        rows="1"
                        style={{ width: "98%" }}
                      ></input>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-3  pe-0">
                      <label className="fst-normal mousePointer">
                        Note Row
                      </label>
                    </div>
                    <div
                      className="col-9 text-start ps-0"
                      key={
                        props.AllTemplate !== undefined
                          ? props.AllTemplate.NoteRow !== undefined
                            ? parseInt(props.AllTemplate.NoteRow)
                            : ""
                          : ""
                      }
                    >
                      <input
                        defaultValue={
                          props.AllTemplate !== undefined
                            ? props.AllTemplate.NoteRow !== undefined
                              ? parseInt(props.AllTemplate.NoteRow)
                              : ""
                            : ""
                        }
                        onKeyDown={(e) => {
                          if (numberInputInvalidChars.includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        min={0}
                        type="number"
                        className="form-control"
                        id="noterow1"
                        name="noterow1"
                        rows="1"
                        style={{ width: "98%" }}
                      ></input>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-3  pe-0">
                      <label className="fst-normal mousePointer">
                        Condition &nbsp;
                        <i
                          className="fa fa-circle-info"
                          title="Điều kiện để request point thỏa mãn:&#10;cột: [số cột]&#10;so sánh bằng '=='&#10;so sánh khác '!='&#10;chỉ có thể so sánh các cột có cùng kiểu giá trị&#10;Example: [x]=='Approved'"
                        ></i>
                      </label>
                    </div>
                    <div
                      className="col-9 text-start ps-0"
                      key={
                        props.AllTemplate !== undefined
                          ? props.AllTemplate.Condition !== undefined
                            ? props.AllTemplate.Condition
                            : ""
                          : ""
                      }
                    >
                      <input
                        defaultValue={
                          props.AllTemplate !== undefined
                            ? props.AllTemplate.Condition !== undefined
                              ? props.AllTemplate.Condition
                              : ""
                            : ""
                        }
                        className="form-control"
                        id="condition1"
                        name="condition1"
                        rows="1"
                        style={{ width: "98%" }}
                      ></input>
                    </div>
                    <div
                      id="conditionError"
                      style={{ color: "red", display: "none" }}
                    >
                      Please input the correct given format{" "}
                    </div>
                  </div>
                  <div className="row mt-3 mb-2">
                    <div className="col-3  pe-0">
                      <label className="fst-normal mousePointer">
                        Caculation Formula &nbsp;
                        <i
                          className="fa fa-circle-info"
                          title="Công thức tính điểm cho request point:&#10;chỉ có thể tính toán giữa các số tự nhiên với các cột number và percentage&#10;Example: [x]*5*[y]"
                        ></i>
                      </label>
                    </div>
                    <div
                      className="col-9 text-start ps-0"
                      key={
                        props.AllTemplate !== undefined
                          ? props.AllTemplate.Caculator !== undefined
                            ? props.AllTemplate.Caculator
                            : ""
                          : ""
                      }
                    >
                      <input
                        defaultValue={
                          props.AllTemplate !== undefined
                            ? props.AllTemplate.Caculator !== undefined
                              ? props.AllTemplate.Caculator
                              : ""
                            : ""
                        }
                        className="form-control"
                        id="caculationformula1"
                        name="caculationformula1"
                        rows="1"
                        style={{ width: "98%" }}
                      ></input>
                    </div>
                    <div
                      id="caculationError"
                      style={{ color: "red", display: "none" }}
                    >
                      Please input the correct given format{" "}
                    </div>
                  </div>
                </div>
              )}
              <div className="text-center">
                {props.AllTemplate.Account ? (
                  <div className="row">
                    <div className="col-9 text-end mt-2">
                      {props.defaultApi &&
                        props.defaultApi.ApiID === props.apiID ? (
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
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-2 text-end">
                      <button
                        type="submit"
                        className="btn btn-primary  mt-2 text-center"
                        onClick={(e) => {
                          setAction("update");
                          // addNewSync();
                        }}
                      // style={{ maxWidth: "75px", maxHeight: "40px" }}
                      // disabled={isButtonDisabled}
                      >
                        update
                      </button>{" "}
                    </div>
                    <div className="col-1"></div>
                  </div>
                ) : (
                  <React.Fragment>
                    {props.defaultApi && !props.showInfor ? (
                      <div className="row">
                        <div className=" text-end col-9 mt-2">
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
                        <div className="col-2 text-end">
                          <button
                            type="submit"
                            className="btn btn-primary  mt-2 text-center"
                            onClick={(e) => {
                              setAction("update");
                              // addNewSync();
                            }}
                          // style={{ maxWidth: "75px", maxHeight: "40px" }}
                          // disabled={isButtonDisabled}
                          >
                            update
                          </button>{" "}
                        </div>
                        <div className="col-1"></div>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-primary  mt-2 text-center"
                        onClick={(e) => {
                          setAction("create");

                          // addNewSync();
                        }}
                        // style={{ maxWidth: "75px", maxHeight: "40px" }}
                        disabled={props.disabled && show ? false : true}
                      >
                        Save
                      </button>
                    )}
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>

          {/* <label
                  className="col-lg-5 col-form-label fs-6"
                  htmlFor="Select"
                >
                  Choose the columns <span className="text-danger">*</span>
                </label> */}
          {/* <div className="col-lg-12 row">
                  <div className="col-3">
                    <Select
                      isMulti
                      options={optionsync.map((item) => ({
                        label: item.label,
                        value: item.value,
                      }))}
                      onChange={handleSelectChange}
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
                  <button
                    type="button"
                    className="btn btn-primary col-1 mt-2 text-center"
                    style={{ maxWidth: "75px", maxHeight: "40px" }}
                    disabled={isSubmitDisabled}
                  >
                    Submit
                  </button>
                </div> */}
        </div>
      </form>
    </>
  );
}

export default ObjectSync;
