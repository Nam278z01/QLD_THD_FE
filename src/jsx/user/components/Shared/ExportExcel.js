import moment from "moment";

import React from "react";
import { Button } from "react-bootstrap";
import ReactExport from "react-export-excel-xlsx-fix";
import { useSelector } from "react-redux";

const ExcelFile = ReactExport.ExcelFile;

const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ExportExcel = ({ datas, exportName, element, projectdatas }) => {
  const { userDepartmentCode } = useSelector((state) => state.UserSlice);
  var newdata = [];
  if (projectdatas !== undefined && projectdatas.length > 0) {
    newdata = projectdatas.map((x) => ({
      ProjectKey: x.key ? x.key : null,
      ProjectCode: x.code ? x.code : null,
      Manager: x.manager ? x.manager : null,
      Type: x.type ? x.type : null,
      Rank: x.rank ? x.rank : null,
      Budget: x.budget ? x.budget : null,
      Startdate: x.startdate ? x.startdate : null,
      Enddate: x.enddate ? x.enddate : null,
      Note: x.note ? x.note : null,
      UpdatedBy: x.UpdatedBy ? x.UpdatedBy : null,
      CreatedBy: x.createdBy ? x.createdBy : null,
      Status: x.status ? x.status : null,
    }));
  } else if (exportName === "Member List" && datas.length > 0) {
    newdata = datas;
  } else if (exportName === "RuleList" && datas.length > 0) {
    newdata = datas;
  } else if (exportName === "Working Time List" && datas.length > 0) {
    newdata = datas;
  } else if (exportName === "Project List") {
    newdata = [
      {
        ProjectKey: null,
        ProjectCode: null,
        Manager: null,
        Type: null,
        Rank: null,
        Budget: null,
        Startdate: null,
        Enddate: null,
        Note: null,
        UpdatedBy: null,
        CreatedBy: null,
        Status: null,
      },
    ];
  } else if (exportName === "Working Time List") {
    newdata = [
      {
        Account: null,
        Month: null,
        Year: null,
        WorkDateNumber: null,
      },
    ];
  } else if (exportName === "Member List") {
    newdata = [
      {
        Name: null,
        Department: null,
        Group: null,
        Account: null,
        Email: null,
        EmployeeID: null,
        Skill: null,
        ForeignLanguage: null,
        DOB: null,
        PhoneNumber: null,
        Contract_Type: null,
        Note: null,
        DateJoinUnit: null,
        JobTitle: null,
        Role: null,
        Status: null,
      },
    ];
  } else if (exportName === "RuleListTemlate") {
    newdata = datas;
  } else {
    newdata = [
      {
        RuleType: "",
        Name: "",
        Category: "",
        PointNumber: "",
        Note: "",
        Status: "",
      },
    ];
  }
  const key = newdata.length > 0 ? Object.keys(newdata[0]) : [];
  const dateFormat = `${moment(new Date()).format("DD-MM-YYYY")}`;

  const fileName =
    userDepartmentCode +
    "-" +
    exportName +
    "-" +
    "(Akarank)" +
    "-" +
    dateFormat;

  const elementItem = typeof (element) === 'string' ?
    (<Button onClick={(e) => { e.target.blur() }}>{element} <i className="fas fa-file-export" /></Button>)
    : element;

  return (
    <ExcelFile
      element={elementItem}
      filename={fileName}
      fileExtension="xlsx"
    >
      <ExcelSheet data={newdata} name={exportName}>
        {key.map((x, i) => (
          <ExcelColumn label={x} value={x || null} key={i} />
        ))}
      </ExcelSheet>
    </ExcelFile>
  );
};

export default ExportExcel;
