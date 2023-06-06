import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import Loading from "../../../sharedPage/pages/Loading";
import CustomModalUtil from "../Shared/CustomModalUtil";
import { Stepper } from "react-form-stepper";
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import { imgServer } from "../../../../dataConfig";
import moment from "moment";
import { getRequestCampaignDetail } from "../../../../services/CampaignAPI";
import { getRequestMoocCampaignDetail } from "../../../../services/CampaignAPI";
export default function RequestDetailMoocCampaignModal({
  show,
  setShow,
  requestID,
  approve,
  noButton,
  reject,
  DeletePoint,
  noFooter,
  setRefresh,
}) {
  const { role } = useSelector((state) => state.UserSlice);
  const { userDepartmentCode, displayName } = useSelector((a) => a.UserSlice);
  const [data] = useRefreshToken(getRequestMoocCampaignDetail, requestID);
  const navigate = useHistory();
  const commentRef = useRef();
  return data === null ? (
    <Loading />
  ) : (
    <CustomModalUtil
      title={displayName}
      show={show}
      setShow={setShow}
      footer={
        !noFooter &&
        (!noButton ? (
          <div className="d-flex flex-row gap-3 justify-content-end">
            <Button
              style={{ backgroundColor: " " }}
              size="md"
              onClick={(e) => {
                approve(data.ID);
              }}
            >
              Approve
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={(e) => {
                reject(data.ID);
              }}
            >
              Reject
            </Button>

            <Button
              variant="success"
              size="md"
              onClick={(e) => {
                // reject(e.target.value);

                navigate.push(`/point/edit-mooccampaign-request/${data.ID}`);
              }}
            >
              Edit
            </Button>
          </div>
        ) : (
          (data.Status === 2 || data.Status === 1) && (
            <div className="d-flex flex-row gap-3 justify-content-end">
              <Button
                variant="success"
                size="md"
                onClick={(e) => {
                  navigate.push(`/point/edit-mooccampaign-request/${data.ID}`);
                }}
              >
                Edit
              </Button>
              {data.Status === 2 && (
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
              )}
            </div>
          )
        ))
      }
      size="lg"
    >
      <div className="row">
        <div className="col-8 ">
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
              <p className="text-break mb-2 fw-bold fs-6 ">Department: </p>
            </div>
            <div className="col-7">
              <p className="text-break mb-2 fs-6 ">{userDepartmentCode}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-5">
              <p className="text-break mb-2 fw-bold fs-6 ">Campaign: </p>
            </div>
            <div className="col-7">
              <p className="text-break mb-2 fs-6 ">
                {" "}
                {data.MoocCampaign.Campaign.Name}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-5">
              <p className="text-break mb-2 fw-bold fs-6 ">Mooc Campaign: </p>
            </div>
            <div className="col-7">
              <p className="text-break mb-2 fs-6 ">
                {" "}
                {"Mooc " +
                  "(" +
                  data.MoocCampaign.StartDate.substring(0, 10) +
                  " / " +
                  data.MoocCampaign.EndDate.substring(0, 10) +
                  ")"}
              </p>
            </div>
          </div>
          {data.Description ? (
            <div className="row">
              <div className="col-5">
                <p className="text-break mb-2 fw-bold fs-6 ">Description: </p>
              </div>
              {data.Description ? (
                <div className="col-7">
                  <p className="text-break mb-2 fs-6 ">
                    {data.Description.length >= 70
                      ? data.Description.substring(0, 70) + "..."
                      : data.Description}
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          <div className="row">
            <div className="col-5">
              <p className="text-break mb-2 fw-bold fs-6 ">Date: </p>
            </div>
            <div className="col-7">
              <p className="text-break mb-2 fs-6 ">
                {moment(data.CreatedDate).format("YYYY-MM")}
              </p>
            </div>
          </div>
        </div>
        {/* <div className="col-6">
          <div className="row">
            <div className="col-5">
              <p className="text-break mb-2 fw-bold fs-6 ">Date: </p>
            </div>
            <div className="col-7">
              <p className="text-break mb-2 fs-6 ">
                {moment(data.CreatedDate).format("YYYY-MM")}
              </p>
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
        </div> */}

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
                      : `${data.Evidence.substring(0, 60)}...`}{" "}
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
                  size: 3,
                  style: "dotted",
                }}
                styleConfig={{
                  activeBgColor:
                    data.Status === 5
                      ? "#a3e635"
                      : data.Status === 4
                      ? "#dc2626"
                      : "#59b0f7",
                  completedBgColor: data.Status === 3 ? "#6b7280" : "#1c66a3",
                }}
                steps={
                  data.Status === 3
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
                          label: "Waiting Approve",
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
                    ? 0
                    : data.Status === 2
                    ? 1
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
