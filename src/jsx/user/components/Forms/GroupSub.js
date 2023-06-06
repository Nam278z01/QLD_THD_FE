import { useState, useEffect } from "react";

import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useContext } from "react";
import Loading from "../../../sharedPage/pages/Loading";
import DepartmentSubModal from "../modal/DepartmentSubModal";
import { useHistory } from "react-router-dom";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getUserGroupChild } from "../../../../services/GroupChildAPI";
import { useSelector } from "react-redux";
export default function SynProjectModal({ datafsu }) {
  const { getToken } = useContext(GetTokenContext);
  const [updateMode, setUpdateMode] = useState(false);
  const [show, setShow] = useState(false);
  const [checkedAll, setCheckedAll] = useState(false);
  const [checked, setChecked] = useState(0);
  const [IDDepartment, setIDDepartment] = useState(0);
  const [CodeDepartment, setCodeDepartment] = useState(0);
  const navigate = useHistory();
  const [userMasters, setUserMasters] = useState([]);
  const { DepartmentID} = useSelector((a) => a.DepartmentSettingSlice);
  const [loading, setLoading] = useState(false);

  // const [datagroup, setdatagroup] = useRefreshToken(
  //   getUserGroupChild,
  //   CodeDepartment
  // );

  // console.log("datafsu: ", datafsu);
  // console.log("depaID: ", DepartmentID);
  // useEffect(() => {
  //   setUserMasters(datagroup);
  //   console.log("data group: ", datagroup);
  // });
  // if (IDDepartment !== 0 && first) {
  //   setIDDepartment();
  // }
  return loading || datafsu === null ? (
    // <Loading />
    <></>
  ) : (
    <>
      <DepartmentSubModal
        show={show}
        setShow={setShow}
        IDDepartment={IDDepartment}
        CodeDepartment={CodeDepartment}
        setUpdateMode={setUpdateMode}
        // datagroup={datagroup}
        userMasters={userMasters}
        // setRefresh={setdatagroup}
      />
      <div className="card ">
        <div className="card-header">
          <h5 className="m-0">Sub Department </h5>
        </div>

        <div className="card-body">
          <div className="card-body h-100" id="nothad">
            <div className="ps-2  pe-0 me-0 d-flex justify-content-start row">
              <div className="ps-2 pe-0 me-0 d-flex justify-content-start  row">
                {datafsu.map((data, i) => {
                  return (
                    <>
                      {updateMode ? (
                        <div
                          className="col-lg-3 col-sm-6   fst-normal"
                          role="group"
                          aria-labelledby="checkbox-group"
                          key={i}
                        >
                          <div className="" key={i}>
                            <label>
                              <button
                                className="border-0 border border-white"
                                onClick={(e) => {
                                  setCodeDepartment(data.Code);
                                  setIDDepartment(data.ID);
                                  e.target.blur();
                                  setShow(true);

                                  // <SubDepartment
                                  //   CodeDepartment={CodeDepartment}
                                  // />;
                                  // navigate.push(`/sub-department/${data.ID}`);
                                }}
                              >
                                <span className="badge bg-primary fs-6">
                                  {data.Code}
                                </span>
                              </button>
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="col-lg-3 col-sm-6  fst-normal"
                          role="group"
                          aria-labelledby="checkbox-group"
                          key={i}
                        >
                          <div className="" key={i}>
                            <label>
                              <span className=" badge bg-secondary fs-6">
                                {data.Code}
                              </span>
                            </label>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })}
                <div className=" text-end row col-12 d-flex justify-content-center pe-0 me-0 pt-3">
                  {updateMode ? (
                    <div>
                      <button
                        type="reset"
                        className="btn btn-secondary"
                        onClick={(e) => {
                          e.target.blur();
                          setUpdateMode(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      style={{ maxWidth: "66px" }}
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        e.target.blur();
                        setUpdateMode(true);
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
