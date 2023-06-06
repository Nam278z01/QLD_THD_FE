import { useRef } from "react";
import { Modal } from "react-bootstrap";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import Select from "react-select";
import {
  findAllUserNickname,
  createNickName,
  getWhatIVote,
} from "../../../../services/NicknameAPI";
import Loading from "../../../sharedPage/pages/Loading";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { Formik } from "formik";
import { updateSetting } from "../../../../services/SettingAPI";
import * as Yup from "yup";
import { useState } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import {
  getAllRule,
  getRuleFsu,
  updateRuleIntegrate,
  updateRuleStatus,
} from "../../../../services/RuleAPI";
import { getAllDepartmentFsu } from "../../../../services/DepartmentAPI";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
export default function IntegrateModal({
  show,
  setShow,
  data,
  setcheck,
  RuleFsu,
  RedirectUrl,
}) {
  const [defaultIntegrate, setdefaultIntegrate] = useState(
    RuleFsu.ruleData
      ? RuleFsu.ruleData
          .filter((list) => list.ID === data.Integrate)
          .map((e) => ({ label: e.label, value: e.Point, ID: e.ID }))[0]
      : ""
  );
  const [point, setPoint] = useState();
  const navigate = useHistory();

  const { getTokenFormData, getToken } = useContext(GetTokenContext);
  const { DepartmentID, PointName } = useSelector(
    (a) => a.DepartmentSettingSlice
  );
  const ruleSchema = Yup.object().shape({
    Integrate: Yup.string().required("Rule is required"),
  });
  const defaultValue = {
    Integrate:
      (RuleFsu.ruleData &&
        data &&
        RuleFsu.ruleData
          .filter((list) => list.ID === data.Integrate)
          .map((e) => ({ label: e.label, value: e.Point, ID: e.ID }))[0]?.ID) ||
      "",
  };
  function updateRule(body) {
    const { Integrate } = body;
    let dataToSend = {
      DepartmentID: DepartmentID,
      Integrate: Integrate,
    };

    const success = () => {
      setShow(false);

      // setcheck(false);
      setPoint();
      navigate.push(RedirectUrl);
    };
    getToken(
      updateRuleIntegrate,
      "The integrate rule has been updated",
      success,
      false,
      data.ID,
      dataToSend
    );
  }
  function Disintegrate() {
    Swal.fire({
      title: "Do you want to disintegrate rule ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        let dataToSend = {
          Integrate: null,
        };
        const success = () => {
          setShow(false);

          setcheck(false);

          navigate.push(RedirectUrl);
        };

        getToken(
          updateRuleStatus,
          " The disintegrate rule has been updated",
          success,
          false,
          data.ID,
          dataToSend
        );
      }
    });
  }
  return data === null || RuleFsu === null ? (
    <></>
  ) : (
    <Modal
      show={show}
      centered
      onHide={() => {
        setShow(false);
        setcheck(false);
        setPoint();
      }}
      size="md"
      scrollable={true}
    >
      <Modal.Header closeButton>
        <h6 className="m-0"> Integrate</h6>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Formik
            initialValues={defaultValue}
            validationSchema={ruleSchema}
            validator={() => ({})}
            onSubmit={(values, { setSubmitting }) => {
              updateRule(values);
              setSubmitting(true);
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
                style={{ minHeight: "250px" }}
                className="form-valide"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
              >
                <div className="row">
                  <div className="col-10">
                    <div
                      className={`form-group mb-3 row ${
                        values.RuleDepartment
                          ? errors.RuleDepartment
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="RuleDepartment"
                      >
                        Rule
                      </label>

                      <div className="col-lg-9">
                        <div>
                          <div>
                            <input
                              type="text"
                              readOnly
                              value={data.RuleName}
                              className="form-control m-0 pe-none"
                              disabled={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`form-group mb-3 row ${
                        values.RuleDepartment
                          ? errors.RuleDepartment
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="RuleDepartment"
                      >
                        Point
                      </label>

                      <div className="col-lg-9">
                        <div>
                          <div>
                            <input
                              type="text"
                              readOnly
                              value={PointName + " of rule: " + data.Point}
                              className="form-control m-0 pe-none"
                              disabled={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`form-group mb-3 row ${
                        values.Integrate
                          ? errors.Integrate
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="Integrate"
                      >
                        Rule Fsu
                        <span className="text-danger">*</span>
                      </label>

                      <div className="col-lg-9">
                        <div>
                          <Select
                            id="Integrate"
                            name="Integrate"
                            defaultValue={
                              defaultIntegrate ? defaultIntegrate : ""
                            }
                            options={RuleFsu.ruleData}
                            onBlur={handleBlur}
                            onChange={(e) => {
                              values.Integrate = e.ID;
                              setPoint(e.Point);
                            }}
                            onFocus={() => {
                              touched.RuleFsu = true;
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
                                maxHeight: "110px",
                              }),
                            }}
                          />

                          <div
                            id="name-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {errors.Integrate &&
                              touched.Integrate &&
                              errors.Integrate}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`form-group mb-3 row ${
                        values.RuleDepartment
                          ? errors.RuleDepartment
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-3 col-form-label"
                        htmlFor="RuleDepartment"
                      >
                        Point
                      </label>

                      <div className="col-lg-9">
                        <div>
                          <div>
                            <input
                              type="text"
                              readOnly
                              // defaultValue={
                              //   defaultIntegrate
                              //     ? PointName +
                              //       " of rule: " +
                              //       defaultIntegrate.value
                              //     : ""
                              // }
                              value={
                                point
                                  ? PointName + " of rule: " + point
                                  : defaultIntegrate
                                  ? PointName +
                                    " of rule: " +
                                    defaultIntegrate.value
                                  : ""
                              }
                              className="form-control m-0 pe-none"
                              disabled={true}
                            />
                          </div>
                        </div>
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
                            e.target.blur();
                          }}
                          disabled={isSubmitting}
                        >
                          Save
                        </button>
                      </div>
                      <div>
                        {data.Integrate ? (
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={(e) => {
                              Disintegrate();
                              e.target.blur();
                            }}
                            disabled={isSubmitting}
                          >
                            Disintegrate
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    </>
                  </div>
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
