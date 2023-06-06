import { Formik } from "formik";
import CustomModalUtil from "../Shared/CustomModalUtil";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getOneBadge, getOneBadgeV2, updateBadge } from "../../../../services/BadgeAPI";
import Loading from "../../../sharedPage/pages/Loading";
import { imgServer } from "../../../../dataConfig";
import { Badge, Button, ButtonGroup, Card, Modal } from "react-bootstrap";
import { useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import BUUpdateLevelModal from "./BUUpdateLevelModal";
import Select from "react-select";
import { getAllActiveRule, getAllActiveRuleNotBadge } from "../../../../services/RuleAPI";
import { useSelector } from "react-redux";
import { OPTIONS } from "../Forms/Constants";

const theInputIcon = document.querySelector("#BadgeIcon");

export default function BUUpdateBadgeModal({
  show,
  setShow,
  badgeID,
  setBadgeID,
  setRefresh,
}) {
  const { account, role, userDepartmentCode } = useSelector(
    (state) => state.UserSlice
  );
  const dateChoice = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
  const [level, setLevel] = useState(null);
  const [selectedFile, setSelectedFile] = useState();
  const [imgChange, setImgChange] = useState(false);
  const { getTokenFormData } = useContext(GetTokenContext);
  const [data, setRefreshdata] = useRefreshToken(getOneBadgeV2, badgeID);
  const [ruleData, setRefreshRuleData] = useRefreshToken(getAllActiveRuleNotBadge, role);
  const [preview, setPreview] = useState();
  const [isOperator, setIsOperator] = useState(data?.isOperator);
  const [showUpdateLevel, setShowUpdateLevel] = useState(false);

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

  const validSchema = Yup.object().shape({
    Name: Yup.string().trim().min(5).max(30).required("Please enter a Name"),
    Description: Yup.string()
      .trim()
      .min(5)
      .max(30)
      .required("Please enter a Description"),
    BadgeIcon: Yup.mixed()
      .test("fileSize", "The Icon is too large", () => {
        if (theInputIcon === null || theInputIcon.files[0] === undefined) {
          return true;
        }
        return theInputIcon.files[0].size <= 3145728;
      })
      .required("Please choose a Medals Icon"),
    ConditionValue: isOperator && (Yup.number()
      .integer()
      .min(1, "Please enter value equal or greater than 1000")
      .max(999999, "Please enter equal or less than 100000")
      .required("Please enter value")),
  });

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  // handle update badge required form data (Name, Description, DepartmentID, Status, ImageURL, RuleID, Condition, AwardType)
  function updateBadgeHandle(values) {
    const theInputIcon = document.querySelector("#BadgeIcon");

    var { Name, Description, Status, Condition, ConditionValue, RuleDefintionID } = values;
    const formData = new FormData();

    formData.append("Name", Name);
    formData.append("Description", Description);
    formData.append("Status", Status);
    formData.append("RuleID", RuleDefintionID);

    // if (RuleDefintionID) {
    //   formData.append("AwardType", "auto");
    // }
    // formData.append("AwardType", "manual");

    if (theInputIcon && theInputIcon.files[0]) {
      formData.append("ImageURL", theInputIcon.files[0]);
    }

    if (Condition !== "asc" && Condition !== "desc") {
      Condition = Condition + ConditionValue;
    }
    formData.append("Condition", Condition);
    const success = () => {
      setRefresh(new Date());
      setRefreshdata(new Date());
      setRefreshRuleData(new Date());
      setShow(false);
      setImgChange(false);
    };

    getTokenFormData(
      updateBadge,
      "Update success",
      success,
      false,
      formData,
      badgeID
    );

    setSelectedFile(null);
  }

  function checkOperator(e) {
    const operator = e.target.value;
    const operators = ["=", "<", ">", "<=", ">="];
    setIsOperator(operators.includes(operator));
  }

  // handle after close modal Level
  const handleCloseModalLevel = () => {
    setShowUpdateLevel(false);
    setRefreshdata(new Date());
  }
  // handle open update level modal
  const openUpdateOrCreateLevel = (e, value) => {
    const levels = data?.BadgeLevels ?? [];
    if (value === null || value === undefined) {
      value = {};
      value.LevelNumber = data?.BadgeLevels.length + 2;
      value.BadgeID = data?.ID;
      value.RuleDefintionID = data?.RuleDefintionID
      value.PreLevelConversionRate = levels === [] ? 1 : levels?.[levels?.length - 1]?.ConversionRate ?? 1;
    } else {
      const index = levels.findIndex(item => item.ID === value.ID);
      value.PreLevelConversionRate = levels === [] ? 1 : levels[index - 1]?.ConversionRate;
    }
    value.PreLevelConversionRate = value.PreLevelConversionRate + 1;
    setLevel(value);
    setShowUpdateLevel(true);
  };

  //get condition and condition value
  const getConditionAndValue = (value) => {
    const condition = {
      condition: "asc",
      value: 1
    };

    if (value) {
      const operators = [">", "<", ">=", "<=", "="];
      const descendingKeyword = "desc";

      for (const operator of operators) {
        if (value.includes(operator)) {
          const arr = value.split(operator);
          condition.condition = operator;
          condition.value = Number(arr[1]);
          return condition;
        }
      }

      if (value.includes(descendingKeyword)) {
        condition.condition = descendingKeyword;
      }
    }

    return condition;
  };

  // Khai báo biến trung gian 
  const initialValues = {
    Name: data?.Name || "",
    Description: data?.Description || "",
    Status: data?.Status || 1,
    BadgeIcon: data?.ImageURL || "",
    RuleDefintionID: data?.RuleDefintionID || 0,
    Condition: getConditionAndValue(data?.Condition)?.condition,
    ConditionValue: getConditionAndValue(data?.Condition)?.value,
    AwardType: data?.AwardType || "manual"
  };

  useEffect(() => {
    setIsOperator(data?.isOperator)
  }, [data]);

  return (
    data !== null && (
      <CustomModalUtil
        title="Update Medals"
        show={show}
        setShow={setShow}
        dialogClassName="modal-90w"
        setNull={setBadgeID}
      >
        {data === null ? (
          <Loading />
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validSchema}
            validator={() => ({})}
            onSubmit={(values, { setSubmitting }) => {
              updateBadgeHandle(values);
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
                <div className="row align-center">
                  <div className={"col-xl-8"}>
                    <div
                      className={`form-group mb-3 row ${values.Name
                        ? errors.Name
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                        }`}
                    >
                      <label className="col-lg-4 form-label" htmlFor="Name">
                        Name
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          className="form-control m-0"
                          id="Name"
                          name="Name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.Name}
                          placeholder="Enter a name"
                        />
                        <div
                          id="Name-error"
                          className="invalid-feedback animated fadeInUp ms-3"
                          style={{ display: "block" }}
                        >
                          {errors.Name && touched.Name && errors.Name}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`form-group mb-3 row ${values.Description
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
                      <div className="col-lg-8">
                        <input
                          type="text"
                          className="form-control m-0"
                          id="Description"
                          name="Description"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.Description}
                          placeholder="Enter a Description"
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
                    <div
                      className={`form-group mb-3 row ${values.Status
                        ? errors.Status
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                        }`}
                    >
                      <label className="col-lg-4 form-label" htmlFor="Status">
                        Status
                      </label>
                      <div className="col-lg-8">
                        <select
                          type="text"
                          className="form-control m-0"
                          id="Status"
                          name="Status"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.Status}
                        >
                          <option value={1}>Active</option>
                          <option value={2}>Inactive</option>
                        </select>
                        <div
                          id="Status-error"
                          className="invalid-feedback animated fadeInUp ms-3"
                          style={{ display: "block" }}
                        >
                          {errors.Status && touched.Status && errors.Status}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`form-group mb-3 row ${values.BadgeIcon
                        ? errors.BadgeIcon
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                        }`}
                    >
                      <label
                        className="col-lg-4 form-label"
                        htmlFor="BadgeIcon"
                      >
                        Medals Icon
                      </label>
                      <div className="col-lg-8">
                        {imgChange && (
                          <input
                            className={`form-control m-0 ${selectedFile && "d-none"
                              }`}
                            id="BadgeIcon"
                            name="BadgeIcon"
                            onChange={(e) => {
                              handleChange(e);
                              onSelectFile(e);
                            }}
                            onBlur={handleBlur}
                            type="file"
                            accept="image/jpeg, image/png"
                          />
                        )}

                        {imgChange ? (
                          selectedFile && (
                            <div className="d-inline-block position-relative">
                              <div
                                className="position-absolute top-0 start-100 translate-middle"
                                style={{ zIndex: 10 }}
                              >
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="rounded-circle"
                                  onClick={() => {
                                    const theInputIcon =
                                      document.querySelector("#BadgeIcon");

                                    theInputIcon.value = "";
                                    theInputIcon.files = null;
                                    values.BadgeIcon = null;
                                    setSelectedFile(null);
                                  }}
                                >
                                  <i className="fas fa-x" />
                                </Button>
                              </div>

                              <img
                                src={preview}
                                className="mt-2"
                                width={50}
                                height={50}
                              />
                            </div>
                          )
                        ) : (
                          <div className="d-inline-block position-relative">
                            <div
                              className="position-absolute top-0 start-100 translate-middle"
                              style={{ zIndex: 10 }}
                            >
                              <Button
                                size="sm"
                                variant="secondary"
                                className="rounded-circle"
                                onClick={() => {
                                  values.BadgeIcon = null;

                                  setImgChange(true);
                                }}
                              >
                                <i className="fas fa-x" />
                              </Button>
                            </div>

                            <img
                              src={`${imgServer}${data.ImageURL}`}
                              id="imgFileimg"
                              className="mt-2"
                              width={50}
                              height={50}
                            />
                          </div>
                        )}

                        <div
                          id="BadgeIcon-error"
                          className="invalid-feedback animated fadeInUp ms-3"
                          style={{ display: "block" }}
                        >
                          {errors.BadgeIcon &&
                            touched.BadgeIcon &&
                            errors.BadgeIcon}
                        </div>
                      </div>
                    </div>
                    {values.AwardType == "auto" && <>
                      <div
                        className={`form-group mb-3 row ${values.RuleDefintionID
                          ? errors.RuleDefintionID
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                          }`}
                      >
                        <label className="col-lg-4 form-label" htmlFor="RuleDefintionID">
                          Rule
                        </label>
                        <div className="col-lg-6">
                          <Select
                            id="RuleDefintionID"
                            options={ruleData ?? []}
                            defaultValue={{ label: data?.RuleDefinition?.Name }}
                            onBlur={handleBlur}
                            onChange={(rule) => {
                              values.RuleDefintionID = rule.RuleID;
                            }}
                            onFocus={() => {
                              touched.RuleDefintionID = true;
                            }}
                            getOptionValue={(option) => option.label}
                            styles={{
                              input: (provided, state) => ({
                                ...provided,
                                paddingTop: "12px",
                                paddingBottom: "12px",
                              }),
                            }}
                          />
                          <div
                            id="ruldedefinitionid-error"
                            className="invalid-feedback animated fadeInUp ms-3"
                            style={{ display: "block" }}
                          >
                            {errors.RuleDefintionID &&
                              touched.RuleDefintionID &&
                              errors.RuleDefintionID}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`form-group mb-3 row ${values.Condition
                          ? errors.Condition
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                          }`}
                      >
                        <label className="col-lg-4 form-label" htmlFor="Condition">
                          Condition
                        </label>
                        <div className="col-lg-8">
                          <div className="row">
                            <div className="col-4">
                              <select
                                type="text"
                                className="form-control m-0"
                                id="Condition"
                                name="Condition"
                                onChange={(e) => { handleChange(e); checkOperator(e) }}
                                onBlur={handleBlur}
                                value={values.Condition}
                              >
                                {OPTIONS.CONDITION.map((item) => (
                                  <option key={item.value} value={item.value}>
                                    {item.label}
                                  </option>
                                ))}
                              </select>
                              <div
                                id="Status-error"
                                className="invalid-feedback animated fadeInUp ms-3"
                                style={{ display: "block" }}
                              >
                                {errors.Condition && touched.Condition && errors.Condition}
                              </div>
                            </div>
                            {isOperator && (<div className="col-6">
                              <input
                                type="Number"
                                className="form-control m-0"
                                id="ConditionValue"
                                name="ConditionValue"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter condition value"
                                value={values.ConditionValue}
                              />
                              <div
                                id="Name-error"
                                className="invalid-feedback animated fadeInUp ms-3"
                                style={{ display: "block" }}
                              >
                                {errors.ConditionValue && touched.ConditionValue && errors.ConditionValue}
                              </div>
                            </div>)}
                          </div>
                        </div>
                      </div>
                    </>}
                    {/* <div
                      className={`form-group mb-3 row ${values.Status
                        ? errors.Status
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                        }`}
                    >
                      <label className="col-lg-4 form-label" htmlFor="Status">
                        Date
                      </label>
                      <div className="col-lg-8">
                        <div className="row">
                          <div className="col-4">
                            <select
                              type="text"
                              className="form-control m-0"
                              id="Status"
                              name="Status"
                              onChange={(e) => { handleChange(e); checkOperator(e) }}
                              onBlur={handleBlur}
                              value={values.Status}
                            >
                              {dateChoice.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                            <div
                              id="Status-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Status && touched.Status && errors.Status}
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="row">
                              <label className="col-10 form-label" htmlFor="Auto">
                                Auto adward Medals
                              </label>
                              <input
                                type="checkbox"
                                className="col-2"
                                id="Auto"
                                name="Auto"
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                  {<div className="col-xl-4">
                    <div className="row border border-secondary p-2" style={{ maxHeight: '440px', overflow: 'auto', borderRadius: '5px', background: 'aliceblue' }}>
                      {data?.BadgeLevels?.map((level, i) => (
                        <div key={i}>
                          <div className="col-lg-12 col-md-12 col-12">
                            <Card className="mb-3 p-2" onClick={(e) => openUpdateOrCreateLevel(e, level)} style={{ cursor: 'pointer' }}>
                              <div className="row align-items-center justify-content-between">
                                <div className="col-9">
                                  <div className="d-flex align-items-center">
                                    <div className="border border-3 bg-light rounded-3 p-1">
                                      <img
                                        src={`${imgServer}${level.ImageURL}`}
                                        height={50}
                                        width={50}
                                      />
                                    </div>
                                    <div className="ms-2">
                                      <h6
                                        onClick={(e) => openUpdateOrCreateLevel(e, level)}
                                        className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                        style={{ cursor: 'pointer' }}
                                      >
                                        {level.Name}
                                      </h6>
                                      <p className="m-0"> Level: {level.LevelNumber} </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-3">
                                  <div className="d-flex justify-content-end">
                                    {level.Status === 1 ? (
                                      <Badge>Active</Badge>
                                    ) : (
                                      <Badge bg="danger">Inactive</Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </div>
                      ))}

                      {data?.BadgeLevels?.length === 0 && (
                        <div>
                          <h5 className="text-center text-secondary m-0">No level</h5>
                        </div>
                      )}
                      <div className="row justify-content-md-center">
                        <div className="col-2">
                          <Button onClick={(e) => openUpdateOrCreateLevel(null, null)} variant="outline-success"><i className="bi bi-plus-circle"></i></Button>
                        </div>
                      </div>
                    </div>
                  </div>}
                  <div className="form-group row mt-2">
                    <div className="col-12 justify-content-end d-flex">
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

                <Modal
                  show={showUpdateLevel}
                  onHide={() => setShowUpdateLevel(false)}
                  backdrop="static"
                  keyboard={false}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>{(level?.ID ? 'Update' : 'Create')} Level</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <BUUpdateLevelModal isCreate={level?.ID ? false : true} level={level} handleFinished={handleCloseModalLevel} />
                  </Modal.Body>
                </Modal>
              </form>
            )}
          </Formik>
        )}
      </CustomModalUtil>
    )
  );
}
