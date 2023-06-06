import { useRef } from "react";
import { Modal } from "react-bootstrap";
import useRefreshToken from "../../../../Hook/useRefreshToken";

import Select from "react-select";

import { useSelector } from "react-redux";
import { useContext } from "react";
import { Formik, Form, Field } from "formik";
import { saveWorking, updateSetting } from "../../../../services/SettingAPI";
import * as Yup from "yup";
import { useState } from "react";
import { useEffect } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import {
  getYearListSync,
  getYearListWorkingTime,
} from "../../../../services/LeaderBoardAPI";
export default function WorkingTimeModal({
  show,
  setShow,
  InforWorking,
  option,
  setInforWorking,
}) {
  const ruleSchema = Yup.object().shape({
    Month: Yup.number().min(1).max(12).required("Month is required"),
    Year: Yup.number().required("Year is required"),
    WorkDateNumber: Yup.number()
      .min(1)
      .max(30)
      .required("Work Date Number  is required"),
  });
  const { DepartmentID, Name } = useSelector((a) => a.DepartmentSettingSlice);
  const { getToken } = useContext(GetTokenContext);
  const optionMonth = [];

  for (let i = 1; i <= 12; i++) {
    optionMonth.push({
      label: i.toString(),
      value: i.toString(),
    });
  }
  const [optionYear] = useRefreshToken(getYearListWorkingTime, DepartmentID);

  function minus() {
    if (data.length > 0) {
      setData(data.slice(0, data.length - 1));
    }
  }

  const [data, setData] = useState(InforWorking ? InforWorking : []);

  function Working(body) {
    let dataToSend = {
      data: data,
      DepartmentID: DepartmentID,
    };

    function success() {
      // navigate.push(`/point/request`);
      setShow(false);
      setInforWorking(new Date());
      setData(data);
    }

    getToken(
      saveWorking,
      "Successfully set working time",
      success,
      false,
      dataToSend
    );
  }
  return optionYear === null ? (
    <></>
  ) : (
    <Modal
      show={show}
      centered
      onHide={() => {
        setShow(false);
        setInforWorking(new Date());
      }}
      size="md"
      scrollable={true}
    >
      <Modal.Header closeButton>
        <h6 className="m-0"> Working Time</h6>
      </Modal.Header>

      <Modal.Body>
        <div>
          <Formik
            initialValues={{
              option: "",
              Month: InforWorking
                ? InforWorking.slice(-1).map((e) => e.Month)[0]
                : "",
              Year: InforWorking
                ? InforWorking.slice(-1).map((e) => e.Year)[0]
                : "",
              WorkDateNumber: InforWorking
                ? InforWorking.slice(-1).map((e) => e.WorkDateNumber)[0]
                : "",
            }}
            validationSchema={ruleSchema}
            validator={() => ({})}
            onSubmit={(values, { setSubmitting }) => {
              if (values.option === "Add") {
                const index = data.findIndex(
                  (item) =>
                    parseInt(item.Month) === parseInt(values.Month) &&
                    parseInt(item.Year) === parseInt(values.Year)
                );
                if (index !== -1) {
                  // update the existing object
                  const newData = [...data];
                  newData[index].WorkDateNumber = values.WorkDateNumber;
                  setData(newData);
                } else {
                  // add a new object
                  setData([
                    ...data,
                    {
                      Month: values.Month,
                      Year: values.Year,
                      WorkDateNumber: values.WorkDateNumber,
                    },
                  ]);
                }
              } else if (values.option === "Save") {
                Working(values);
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
              setFieldValue,
            }) => (
              <form
                className="form-valide"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
              >
                <div className="row">
                  <>
                    <div
                      className={`form-group mb-3 row ${
                        values.Month
                          ? errors.Month
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-5 col-form-label"
                        htmlFor="Month"
                      >
                        Month<span className="text-danger">*</span>
                      </label>

                      <div className="col-lg-7">
                        <Select
                          id="Month"
                          name="Month"
                          options={optionMonth}
                          defaultValue={InforWorking.slice(-1).map((e) => ({
                            label: e.Month,
                            value: e.Month,
                          }))}
                          onChange={(e) => {
                            values.Month = e.value;
                            // setselectOptionSync(e.value);
                            // setdataDay(e.value);
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
                          id="name-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.Month && touched.Month && errors.Month}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`form-group mb-3 row ${
                        values.Year
                          ? errors.Year
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label className="col-lg-5 col-form-label" htmlFor="Year">
                        Year
                        <span className="text-danger">*</span>
                      </label>

                      <div className="col-lg-7">
                        <Select
                          id="Year"
                          name="Year"
                          options={optionYear}
                          defaultValue={InforWorking.slice(-1).map((e) => ({
                            label: e.Year,
                            value: e.Year,
                          }))}
                          onChange={(e) => {
                            values.Year = e.value;

                            // setselectOptionSync(e.value);
                            // setdataDay(e.value);
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
                          id="name-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {errors.Year && touched.Year && errors.Year}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`form-group mb-3 row ${
                        values.WorkDateNumber
                          ? errors.WorkDateNumber
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-5 col-form-label"
                        htmlFor="WorkDateNumber"
                      >
                        Work Date Number
                        <span className="text-danger">*</span>
                      </label>

                      <div className="col-lg-7">
                        <div className="input-group">
                          <input
                            className={`form-control m-0 `}
                            id="WorkDateNumber"
                            name="WorkDateNumber"
                            type={"text"}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                            defaultValue={values.WorkDateNumber}
                          />
                          <div
                            id="name-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {errors.WorkDateNumber &&
                              touched.WorkDateNumber &&
                              errors.WorkDateNumber}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex justify-content-end gap-2 pe-4">
                        <>
                          <div>
                            <button
                              type="submit"
                              className="btn btn-primary"
                              onClick={(e) => {
                                values.option = "Add";
                                e.target.blur();
                              }}
                              disabled={isSubmitting}
                            >
                              Add
                            </button>
                          </div>
                        </>
                      </div>
                    </div>
                    {data.length > 0 ? (
                      <div>
                        <div style={{ overflowX: "auto", maxHeight: "250px" }}>
                          <table className="table table-bordered mt-2">
                            <thead className="text-center ">
                              <tr>
                                <th style={{ width: "33%" }}>Month</th>
                                <th style={{ width: "33%" }}>Year</th>
                                <th style={{ width: "33%" }}>
                                  {" "}
                                  WorkDateNumber
                                </th>
                              </tr>
                            </thead>
                            <tbody className="text-center">
                              {data.map((workDate, index) => (
                                <tr key={index}>
                                  <td>{workDate.Month}</td>
                                  <td>{workDate.Year}</td>
                                  <td>{workDate.WorkDateNumber}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-danger text-center">
                          <i
                            onClick={() => {
                              minus();
                            }}
                            className="bi bi-x-circle mousePointer"
                            style={{ fontSize: "25px" }}
                          ></i>
                        </p>

                        <div className="d-flex justify-content-end gap-2 pe-4 mt-3">
                          <>
                            <div>
                              <button
                                type="submit"
                                className="btn btn-primary"
                                onClick={(e) => {
                                  values.option = "Save";

                                  e.target.blur();
                                }}
                                disabled={isSubmitting}
                              >
                                Save
                              </button>
                            </div>
                          </>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </Modal.Body>

      <Modal.Footer className="bg-gray"></Modal.Footer>
    </Modal>
  );
}
