import { useState, useContext } from "react";
import { Button } from "react-bootstrap";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import Avt1 from "../../../../images/Default.png";
import { getOneUserMaster } from "../../../../services/UsermasterAPI";
import { syncProjectMember } from "../../../../services/ProjectAPI";

import { imgServer } from "../../../../dataConfig";
import { useRef } from "react";
import moment from "moment";
import Loading from "../../../sharedPage/pages/Loading";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
const MemberDisplay = ({ ID }) => {
  const [user] = useRefreshToken(getOneUserMaster, ID);

  return user === null ? (
    <div className="col-3">
      <div className="card shadow m-0 p-0">
        <div className="card-body row align-items-center">
          <div className="col-3">
            <img className="mw-100 rounded-circle" src={Avt1} />
          </div>
          <div className="col-9">
            <h5 className="m-0">No Info</h5>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="col-lg-3 col-sm-6 col-xs-12">
      <div className="card shadow m-0 p-0">
        <div className="card-body row align-items-center">
          <div className="col-3">
            <img
              className="mw-100 rounded-circle"
              src={user.Avatar ? imgServer + user.Avatar : Avt1}
            />
          </div>
          <div className="col-9">
            <h5 className="m-0">
              {user.Account} {user.JobTitle ? `(${user.JobTitle})` : ""}
            </h5>

            <h5 className="m-0"></h5>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusDisplay = ({ stt }) => {
  return (
    <Button className="text-success bg-white  pe-none">
      <span className="h6 text-success">{stt}</span>
    </Button>
  );
};

export default function ProjectDetail({ project, members, PM, setRefresh }) {
  const [loading, setLoading] = useState(false);
  const { account } = useSelector((a) => a.UserSlice);

  const startDateRef = useRef();
  const endDateRef = useRef();
  const navigate = useHistory();

  const { getTokenLoading, getToken } = useContext(GetTokenContext);

  function syncWithJira(key) {
    // setLoading(true);

    // getTokenLoading(
    //   syncProjectMember,
    //   "Sync success",
    //   setLoading,
    //   key,
    //   startDateRef.current.value,
    //   endDateRef.current.value
    // );

    setLoading(true);
    function success() {
      setLoading(false);
      setRefresh(new Date());
    }

    getToken(
      syncProjectMember,
      "Sync success",
      () => {
        setLoading(false);
        setRefresh(new Date());
      },
      () => {
        setLoading(true);
      },
      key,
      startDateRef.current.value,
      endDateRef.current.value
    );
  }

  return (
    <>
      <div>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-3 col-sm-3 col-xs-3   flex-column d-md-flex  d-lg-flex d-flex justify-content-center border-end">
                <h5 className="text-center font-weight-bold">
                  Project Manager
                </h5>
                <img
                  className="avatar rounded-circle mx-auto img-fluid col-6 col-md-9 col-lg-6 col-sm-9"
                  src={PM ? (PM.Avatar ? imgServer + PM.Avatar : Avt1) : Avt1}
                />
                <h6 className="text-center mt-2">
                  {PM ? PM.Account : "No Data"}
                </h6>
              </div>
              <div className="col-lg-9 col-md-9 col-sm-9 col-sm-6  ">
                <div className="row">
                  <div className=" d-flex justify-content-between col-6 border-end  m-auto">
                    <div className="col-auto" style={{ maxWidth: "80%" }}>
                      <h5>Project Name: {project.Code} </h5>

                      {/* <p className="text-primary fs-14 text-truncate">
                            {project.Code}
                          </p> */}

                      <div className="row">
                        <h5 className="col-5">Rank: {project.Rank} </h5>
                      </div>
                      <div className="d-sm-block d-md-block  d-lg-none d-xs-block">
                        <p>
                          <StatusDisplay stt={project.Status} />
                        </p>
                        <p></p>
                      </div>
                    </div>

                    <div className="d-sm-none d-md-none  d-lg-block d-none">
                      <p>
                        <StatusDisplay stt={project.Status} />
                      </p>
                    </div>
                  </div>
                  <div className="row col-6 m-auto ">
                    <h5 className="col-6">
                      Bugget: {project.Budget ? project.Budget : 0}{" "}
                      <i className="fa-solid fa-coins text-warning"></i>
                    </h5>
                    {project.UpdatedBy === account ? (
                      <div className="col-6 text-end">
                        {/* <Button
                          className="btn btn-primary  mb-1"
                          onClick={(e) => {
                            navigate.push(`/Head/update-project/${project.ID}`);
                          }}
                        >
                          Update
                        </Button> */}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="row border-top">
                  <div className="col-6 border-end m-auto">
                    <p>Type: {project.Type}</p>
                    <p>
                      Start Date:{" "}
                      {moment(project.StartDate).format("DD-MM-YYYY")}
                    </p>
                    <p>
                      End Date: {moment(project.EndDate).format("DD-MM-YYYY")}
                    </p>
                  </div>
                  <div className="col-6">
                    <p>Note: {project.Note}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card row ">
          <div className="card-header ">
            <h4 className="col-3 ">Members</h4>
            {/* <div className="row align-items-center">
              <div className="col-lg-4   col-sm-12 col-xs-12">
                <input
                  type="month"
                  className="form-control form-control-sm m-0"
                  ref={startDateRef}
                  defaultValue={moment(new Date()).format("YYYY-MM")}
                />
              </div>
              <div className="col-lg-1 col-sm-12 col-xs-12 text-center m-0">
                TO
              </div>
              <div className="col-lg-4 col-sm-12 col-xs-12">
                <input
                  type="month"
                  className="form-control form-control-sm m-0"
                  ref={endDateRef}
                  defaultValue={moment(new Date()).format("YYYY-MM")}
                />
              </div>
              <div className="col-lg-3 col-sm-12 col-xs-12 mt-2">
                <Button
                  onClick={() => {
                    syncWithJira(project.Key);
                  }}
                >
                  Sync From Jira
                </Button>
              </div>
            </div> */}
          </div>
          <div className="card-body">
            <div className="row g-2">
              {loading ? (
                <Loading />
              ) : (
                members.map((m, i) => <MemberDisplay key={i} ID={m.MemberID} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
