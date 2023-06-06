import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getRequestDetail } from "../../../../services/RequestAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import Loading from "../../../sharedPage/pages/Loading";
import CustomModalUtil from "../Shared/CustomModalUtil";
import { Stepper } from "react-form-stepper";
import { useRef } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import swal from "sweetalert";
import { imgServer } from "../../../../dataConfig";

export default function RequestDetailModal({
  show,
  setShow,
  requestID,
  approve,
  noButton,
  reject,
  DeletePoint,
  noFooter,
}) {
  const { role } = useSelector((state) => state.UserSlice);
  const { PointName, Code } = useSelector((a) => a.DepartmentSettingSlice);
  const [data] = useRefreshToken(getRequestDetail, requestID);
  const navigate = useHistory();
  const commentRef = useRef();
  return data === null ? (
    <Loading />
  ) : (
    <CustomModalUtil
      title={data.DisplayName}
      show={show}
      setShow={setShow}
      footer={
        !noFooter &&
        (!noButton && (role === "Head" || role === "PM" || role === "Admin") ? (
          <div className="d-flex flex-row gap-3 justify-content-end">
            <Button
              style={{ backgroundColor: " " }}
              size="md"
              onClick={(e) => {
                approve(data.ID, commentRef.current.value);
              }}
            >
              Approve
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={(e) => {
                reject(data.ID, commentRef.current.value);
              }}
            >
              Reject
            </Button>

            <Button
              variant="success"
              size="md"
              onClick={(e) => {
                // reject(e.target.value);
                navigate.push(`/point/update/${data.ID}`);
              }}
            >
              Edit
            </Button>
          </div>
        ) : (
          data.Status === 1 && (
            <div className="d-flex flex-row gap-3 justify-content-end">
              <>
                {" "}
                <Button
                  variant="success"
                  size="md"
                  onClick={(e) => {
                    navigate.push(`/point/update/${data.ID}`);
                  }}
                >
                  Edit
                </Button>
                <Button
                  style={{ backgroundColor: " " }}
                  size="md"
                  variant="secondary"
                  onClick={() => {
                    swal({
                      title: "Are you sure?",
                      icon: "warning",
                      buttons: true,
                      dangerMode: true,
                    }).then((willDelete) => {
                      if (willDelete) {
                        DeletePoint(data.ID);
                        setShow(false);
                      }
                    });
                  }}
                >
                  Cancel Request
                </Button>
              </>
            </div>
          )
        ))
      }
      size="lg"
    >
      <div className="row">
        <div className="col-6 border-end border-bottom ">
          <div className="row">
            <div className="col-3">
              <p className="mb-2 fw-bold fs-6">Rule: </p>
            </div>
            <div className="col-9">
              <p className="mb-2 fs-6">{data.RuleName}</p>
            </div>
          </div>

          <div className="row">
            <div className="col-3">
              <p className="mb-2 fw-bold fs-6 ">Project: </p>
            </div>
            <div className="col-9">
              <p className="mb-2 fs-6">{data.ProjectCode}</p>
            </div>
          </div>

          <div className="row">
            <div className="col-3">
              <p className="mb-2 fw-bold fs-6 ">Date: </p>
            </div>
            <div className="col-9">
              <p className="mb-2 fs-6 ">
                {data.Month}-{data.Year}
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-3">
              <p className="mb-2 fw-bold fs-6 ">{PointName}: </p>
            </div>
            <div className="col-9">
              <p className="mb-2 fs-6 ">{data.PointOfRule}</p>
            </div>
          </div>

          <div className="row">
            <div className="col-3">
              <p className="mb-2 fw-bold fs-6 ">Times: </p>
            </div>
            <div className="col-9">
              <p className="mb-2 fs-6 ">{data.Times}</p>
            </div>
          </div>

          {data.Effort && (
            <div className="row">
              <div className="col-3">
                <p className="mb-2 fw-bold fs-6 ">Effort: </p>
              </div>
              <div className="col-9">
                <p className="mb-2 fs-6 ">{data.Effort}</p>
              </div>
            </div>
          )}

          {data.KPer && (
            <div className="row">
              <div className="col-3">
                <p className="mb-2 fw-bold fs-6 ">KPER: </p>
              </div>
              <div className="col-9">
                <p className="mb-2 fs-6 ">{data.KPer}</p>
              </div>
            </div>
          )}
        </div>

        <div className="col-6 border-bottom">
          <div className="row">
            <div className="col-5">
              <p className="text-break mb-2 fw-bold fs-6 ">Confirm By: </p>
            </div>
            <div className="col-7">
              <p className="text-break mb-2 fs-6 ">{data.Confirmer}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-5">
              <p className="text-break mb-2 fw-bold fs-6 ">Approver: </p>
            </div>
            <div className="col-7">
              <p className="text-break mb-2 fs-6">{data.Approver || "-"}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-5">
              <p className="text-break mb-2 fw-bold fs-6 ">Department: </p>
            </div>
            <div className="col-7">
              <p className="text-break mb-2 fs-6 ">{data.DepartmentCode}</p>
            </div>
          </div>

          <div className="row">
            <div className="col-5">
              <p className="text-break mb-2 fw-bold fs-6 ">Category: </p>
            </div>
            <div className="col-7">
              <p className="text-break mb-2 fs-6 ">{data.Category || "-"}</p>
            </div>
          </div>

          <div className="row">
            <div className="col-5 fw-bold">
              <p className="text-break mb-2 fs-6" htmlFor="comment">
                Comment:
              </p>
            </div>
            {!noButton ? (
              <div>
                <textarea
                  defaultValue={data.Comment}
                  ref={commentRef}
                  id="comment"
                  className="form-control mb-2"
                  rows={2}
                  placeholder="Comment why you reject and approve"
                />
              </div>
            ) : (
              <div className="col-7">
                <p className="text-break mb-2 fs-6 ">{data.Comment || "-"}</p>
              </div>
            )}
          </div>
        </div>

        {data.Evidence && (
          <div className="col-12 border-bottom py-2">
            {data.Evidence.split("/")[1] === "public" ? (
              <>
                <div>
                  <p className="m-0 fw-bold fs-6 ">Evidence: </p>
                </div>
                <div className="w-100 d-flex justify-content-center">
                  <img
                    src={`${imgServer}${data.Evidence}`}
                    id="checkImage"
                    style={{
                      maxHeight: "70%",
                      maxWidth: "60%",
                      objectFit: "fill",
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="row ">
                <div className="col-2">
                  <p className="m-0 fw-bold fs-6 ">Evidence: </p>
                </div>
                <div className="col-10">
                  <a
                    className="fs-6 justify-content-end m-0"
                    href={
                      data.Evidence.split(":")[0] != "https" &&
                      data.Evidence.split(":")[0] != "https"
                        ? "https://" + data.Evidence
                        : data.Evidence
                    }
                    target="_blank"
                  >
                    {data.Evidence === null
                      ? ""
                      : data.Evidence.length <= 60
                      ? data.Evidence
                      : `${data.Evidence.substring(0, 60)}...`}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="col-12">
          <div className="row">
            <div className="col-12">
              <p className="text-break mb-2 fw-bold fs-6 ">Status: </p>
            </div>
            <div className="col-12">
              <Stepper
                className="fs-4"
                connectorStateColors="#18aed6"
                connectorStyleConfig={{
                  activeColor: "#a86ff2",
                  completedColor: "#a86ff2",
                  size: 4,
                  style: "dotted",
                }}
                styleConfig={{
                  activeBgColor:
                    data.Status === 3
                      ? "#a3e635"
                      : data.Status === 4
                      ? "#dc2626"
                      : "#59b0f7",
                  completedBgColor: data.Status === 5 ? "#6b7280" : "#1c66a3",
                }}
                steps={
                  data.Status === 5
                    ? [
                        {
                          label: "Submited",
                          children: <i className="fas fa-check fs-6"></i>,
                        },
                        {
                          label: "Cancelled",
                          children: <i className="fas fa-trash"></i>,
                        },
                      ]
                    : [
                        {
                          label: "Submited",
                          children: <i className="fas fa-check fs-6"></i>,
                        },
                        {
                          label: "Waiting PM Confirm",
                          children: data.Status >= 2 && (
                            <i className="fas fa-check fs-6"></i>
                          ),
                        },
                        {
                          label: "Waiting Head Approve",
                          children: data.Status >= 3 && (
                            <i className="fas fa-check fs-6"></i>
                          ),
                        },
                        {
                          label: data.Status === 4 ? "Rejected" : "Approved",

                          children:
                            data.Status === 4 ? (
                              <i className="fas fa-xmark fs-6"></i>
                            ) : (
                              <i className="fas fa-check fs-6"></i>
                            ),
                        },
                      ]
                }
                activeStep={
                  data.Status === 1
                    ? 1
                    : data.Status === 2
                    ? 2
                    : data.Status === 3 || data.Status === 4
                    ? 3
                    : data.Status === 5
                    ? 2
                    : 0
                }
              />
            </div>
          </div>
        </div>
      </div>
    </CustomModalUtil>
  );
}
