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

export default function BadgesEditToShowModal({
  show,
  setShow,
  Badges,
  setRefresh,
}) {
  const [data, setData] = useState({
    UserMasterID: 1,
    BadgeID: [],
  });
  const { account } = useParams();
  const { getToken } = useContext(GetTokenContext);
  const user = useRefreshToken(getOneUserMasterByAccount, account);
  const [displayAlert, setDisplayAlert] = useState("none");
  function success() {
    setRefresh(new Date());
  }
  useEffect(() => {
    if (data.BadgeID.length !== 0) {
      getToken(setBadge, "Updated success", success, false, data);
    }
  }, [data]);

  return (
    <Modal
      show={show}
      centered
      onHide={() => {
        setShow(false);
      }}
      size="lg"
    >
      <Modal.Header closeButton> Your Badges</Modal.Header>
      <Modal.Body>
        <div className="card-body h-100" id="nothad">
          <div className=" d-flex flex-wrap gap-2 justify-content-center">
            <Formik
              initialValues={{
                checked: [],
              }}
              onSubmit={async (values) => {
                if (values.checked.length <= 3) {
                  setDisplayAlert("none");
                  const arrOfNum = await values.checked.map((str) => {
                    return Number(str);
                  });

                  await setData({
                    UserMasterID: user[0].ID,
                    BadgeID: arrOfNum,
                  });
                  setShow(false);
                } else {
                  setDisplayAlert("block");
                }
              }}
            >
              <>
                <Form>
                  <div className="justify-content-center d-flex row">
                    <div
                      className="justify-content-center d-flex col-12"
                      role="group"
                      aria-labelledby="checkbox-group"
                    >
                      {Badges.map((badge, i) => {
                        return (
                          <>
                            <div
                              className="d-inline m-3   "
                              key={i}
                              badgeid={badge.ID}
                              title={badge.description}
                            >
                              <label>
                                <img
                                  src={`${imgServer}${badge.ImageURL}`}
                                  style={{ height: "50px", width: "50px" }}
                                />
                                <Field
                                  type="Checkbox"
                                  name="checked"
                                  value={badge.ID}
                                />
                              </label>
                            </div>
                          </>
                        );
                      })}
                    </div>
                    <div
                      className="alert alert-warning  text-align-center"
                      style={{
                        display: displayAlert,
                        width: "50%",
                      }}
                    >
                      <strong>Warning!</strong> You can only choose up to 3
                      badges.
                    </div>
                    <div className="col-12"></div>

                    <button
                      type="submit"
                      style={{
                        border: "none",

                        width: "5vw",
                        borderRadius: "12px",
                      }}
                      className="button justify-content-center  btn-primary "
                    >
                      Edit
                    </button>
                  </div>
                </Form>
              </>
            </Formik>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
