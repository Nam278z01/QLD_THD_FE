import { Modal } from "react-bootstrap";
import {
  getAllBadge,
  getUserBadgeAll,
  setBadge,
} from "../../../../services/BadgeAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { imgServer } from "../../../../dataConfig";
import { Checkbox, Hidden } from "@mui/material";
import { useState, useEffect } from "react";
import { Formik, useFormikContext, Field, Form } from "formik";
import { useParams } from "react-router-dom";
import {
  getUserRole,
  getOneUserMasterByAccount,
} from "../../../../services/UsermasterAPI";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useContext } from "react";
import { Badge, Button } from "react-bootstrap";
import { createSelfRequest } from "../../../../services/RequestAPI";
import { set } from "date-fns";
import { syncAllprojectFsu } from "../../../../services/ProjectAPI";
import Loading from "../../../sharedPage/pages/Loading";
export default function SynProjectModal({
  show,
  setShow,
  setRefreshfsu,
  datafsu,
  setRefreshf,
}) {
  const { getToken } = useContext(GetTokenContext);

  const dataArray = ["nr1", "nr2", "nr1", "nr2", "nr1", "nr2", "nr1", "nr2"];
  const [checkedAll, setCheckedAll] = useState(false);
  const [checked, setChecked] = useState(0);

  useEffect(() => {
    let allChecked = true;
    for (const inputName in checked) {
      if (checked[inputName] === false) {
        allChecked = false;
      }
    }
    if (allChecked) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
    }
  }, [checked]);
  const [loading, setLoading] = useState(false);

  function synProjectFsu(body) {
    const { checked } = body;
    let dataToSend;
    dataToSend = {
      DepartmentID: checked.map((data) => data),
    };
    setLoading(true);
    function success() {
      setLoading(false);
      setRefreshfsu(new Date());
      setShow(false);
      setRefreshf(new Date());
    }

    getToken(
      syncAllprojectFsu,
      "Sync success",
      success,
      () => {
        setLoading(false);
      },
      dataToSend
    );
  }
  return loading || datafsu === null ? (
    <Loading />
  ) : (
    <Modal
      show={show}
      centered
      onHide={() => {
        setShow(false);
      }}
      size="xl"
    >
      <Modal.Header closeButton>
        Select project to sync
        <div className="fs-3"></div>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{}}
          onSubmit={(values, { setSubmitting }) => {
            synProjectFsu(values);
          }}
        >
          <>
            <Form>
              <div className="card-body h-100" id="nothad">
                <div className="ps-4  pe-0 me-0 d-flex justify-content-start row">
                  <div className="ps-4 pe-0 me-0 d-flex justify-content-start  row">
                    <div className="col-12 p-0 m-0">{/* {extraHeader} */}</div>
                    {datafsu.map((data, i) => {
                      return (
                        <>
                          <div
                            className="col-2 fst-normal"
                            role="group"
                            aria-labelledby="checkbox-group"
                            key={i}
                          >
                            <div className="" key={i}>
                              <label>
                                <Field
                                  type="Checkbox"
                                  name="checked"
                                  id={data.Code}
                                  value={data.ID}
                                />{" "}
                                <span className="badge bg-primary fs-6">
                                  {data.Code}
                                </span>
                              </label>
                            </div>
                          </div>
                        </>
                      );
                    })}
                    <div className="row col-12 d-flex justify-content-center pe-0 me-0 pt-3">
                      <button
                        type="submit"
                        style={{
                          border: "none",
                          borderRadius: "12px",
                        }}
                        className="col-2 button justify-content-center  btn-primary "
                      >
                        Sync
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        </Formik>
      </Modal.Body>

      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
