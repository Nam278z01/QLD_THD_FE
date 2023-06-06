import { Badge, Dropdown } from "react-bootstrap";
import TableHeadAndFoot from "./TableHeadAndFoot";
import { useMsal } from "@azure/msal-react";
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import { updateRuleStatus } from "../../../../services/RuleAPI";
import { scopes } from "../../../../dataConfig";
import { useState } from "react";
import RuleDetailModal from "../modal/RuleDetailModal";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import Swal from "sweetalert2";
import swal from "sweetalert";
import { imgServer } from "../../../../dataConfig";

const DropdownBlog = ({ ruleID, status, setRefresh2, setRefresh, setData }) => {
  const { instance, inProgress, accounts } = useMsal();
  const navigate = useHistory();
  const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);

  const changeStatusRule = (status) => {
    if (inProgress === InteractionStatus.None) {
      const accessTokenRequest = {
        scopes: scopes,
        account: accounts[0],
      };
      instance
        .acquireTokenSilent(accessTokenRequest)
        .then((accessTokenResponse) => {
          // Acquire token silent success
          let accessToken = accessTokenResponse.accessToken;
          let token = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
          // Call your API with token

          updateRuleStatus(token, DepartmentID, ruleID, { Status: status })
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "Rule has been update",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });
              setRefresh(new Date());
            })
            .catch(function (error) {
              Swal.fire({
                icon: "error",
                title: error,
              });
            });
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance
              .acquireTokenPopup(accessTokenRequest)
              .then(function (accessTokenResponse) {
                // Acquire token interactive success
                let accessToken = accessTokenResponse.accessToken;
                let token = {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                };

                updateRuleStatus(token, DepartmentID, ruleID, {
                  Status: status,
                })
                  .then(() => {
                    Swal.fire({
                      icon: "success",
                      title: "Rule has been update",
                      showConfirmButton: false,
                      timer: 3000,
                      timerProgressBar: true,
                    });
                    setRefresh(new Date());
                  })
                  .catch(function (error) {
                    Swal.fire({
                      icon: "error",
                      title: error,
                    });
                  });
              });
          } else {
            Swal.fire({
              icon: "error",
              title: error,
            });
          }
        });
    }
  };

  return (
    <>
      <Dropdown className="dropdown btn">
        <Dropdown.Toggle
          as="div"
          className="btn-link i-false"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
              stroke="#262626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z"
              stroke="#262626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z"
              stroke="#262626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu">
          <Dropdown.Item
            className="dropdown-item"
            onClick={() => {
              navigate.push(`/rule/update/${ruleID}`);
            }}
          >
            Edit
          </Dropdown.Item>

          {status === "Active" ? (
            <Dropdown.Item
              className="dropdown-item"
              onClick={() =>
                swal({
                  title: "Are you sure?",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then((willDelete) => {
                  if (willDelete) {
                    changeStatusRule(2);
                    setRefresh(new Date());
                    setRefresh2(new Date());
                  }
                })
              }
            >
              Deactivate
            </Dropdown.Item>
          ) : (
            <Dropdown.Item
              className="dropdown-item"
              onClick={() => {
                swal({
                  title: "Are you sure?",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then((willDelete) => {
                  if (willDelete) {
                    changeStatusRule(1);
                    setRefresh(new Date());
                    setRefresh2(new Date());
                  }
                });
              }}
            >
              Activate
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

const RuleTable = ({
  datas,
  thead,
  totalPage,
  totalItems,
  setRefresh,
  currentSearch,
  filterHandle,
  pageChange,
  rowChange,
  sortHandle,
  middleExtra,
  setRefresh2,
  setData,
  searchHandle,
}) => {
  const [show, setShow] = useState(false);
  const [ruleID, setRuleID] = useState(null);
  const role = useSelector((state) => state.UserSlice.role);

  const goToDetail = (id) => {
    setRuleID(id);
    setShow(true);
  };
  return (
    <>
      {ruleID && (
        <RuleDetailModal show={show} setShow={setShow} ruleID={ruleID} />
      )}
      <TableHeadAndFoot
        middleExtra={middleExtra}
        title="Rule List"
        thead={thead}
        totalPage={totalPage}
        totalItems={totalItems}
        currentSearch={currentSearch}
        filterHandle={filterHandle}
        pageChange={pageChange}
        rowChange={rowChange}
        sortHandle={sortHandle}
        searchHandle={searchHandle}
      >
        {datas.length > 0 ? (
          datas.map((data, index) => {
            return (
              <tr
                role="row "
                className="odd mousePointer"
                key={index}
                style={{ height: "100px" }}
              >
                <td
                  onClick={() => {
                    goToDetail(data.ID);
                  }}
                >
                  <div style={{ width: "100%" }}>{data.RuleName}</div>
                </td>

                <td
                  style={{ width: "10%" }}
                  onClick={() => {
                    goToDetail(data.ID);
                  }}
                  className="text-center"
                >
                  {data.Category}
                </td>
                <td
                  style={{ width: "10%" }}
                  onClick={() => {}}
                  className={`text-center fw-bold ${
                    data.RuleType === "Plus" ? "text-success" : "text-danger"
                  } `}
                >
                  {data.RuleType}
                </td>
                <td
                  style={{ width: "9%" }}
                  onClick={() => {
                    goToDetail(data.ID);
                  }}
                  className="text-center"
                >
                  {data.Point}
                </td>
                <td
                  style={{ width: "7%" }}
                  onClick={() => {
                    goToDetail(data.ID);
                  }}
                  className="text-center"
                >
                  <>
                    {" "}
                    {data.TemplateID || data.ApiID ? (
                      <p className="text-primary">
                        {" "}
                        <i
                          className="bi bi-check-circle"
                          style={{ fontSize: "25px" }}
                        ></i>
                      </p>
                    ) : (
                      <p className="text-danger">
                        <i
                          className="bi bi-x-circle"
                          style={{ fontSize: "25px" }}
                        ></i>
                      </p>
                    )}
                  </>
                </td>
                <td
                  style={{ width: "7%" }}
                  onClick={() => {
                    goToDetail(data.ID);
                  }}
                  className="text-center"
                >
                  <>
                    {" "}
                    {data.Integrate ? (
                      <p className="text-primary">
                        {" "}
                        <i
                          className="bi bi-check-circle"
                          style={{ fontSize: "25px" }}
                        ></i>
                      </p>
                    ) : (
                      <p className="text-danger">
                        {" "}
                        <i
                          className="bi bi-x-circle"
                          style={{ fontSize: "25px" }}
                        ></i>
                      </p>
                    )}
                  </>
                </td>
                {/* <td
                  style={{ width: "5%" }}
                  onClick={() => {
                    goToDetail(data.ID);
                  }}
                  className="text-center"
                >
                  <>
                    {" "}
                    {data.Badge ? (
                      <img
                        src={`${imgServer}${data.Badge.ImageURL}`}
                        height={50}
                        width={50}
                      />
                    ) : (
                      "-"
                    )}
                  </>
                </td> */}
                <td
                  className="text-center"
                  style={{ width: "15%" }}
                  onClick={() => {
                    goToDetail(data.ID);
                  }}
                >
                  <>
                    {" "}
                    {data.Note
                      ? data.Note.length > 100
                        ? data.Note.substring(0, 100) + "..."
                        : data.Note
                      : ""}
                  </>
                </td>

                <td
                  style={{ width: "9%" }}
                  onClick={() => {
                    goToDetail(data.ID);
                  }}
                  className="text-center"
                >
                  <Badge
                    style={{ width: "80px" }}
                    bg={`${
                      data.Status === "Active"
                        ? "success"
                        : data.Status === "Inactive"
                        ? "danger"
                        : ""
                    }`}
                  >
                    {data.Status}
                  </Badge>
                </td>
                {role === "Head" || role === "Admin" ? (
                  <td style={{ width: "5%" }}>
                    <DropdownBlog
                      ruleID={data.ID}
                      status={data.Status}
                      setRefresh={setRefresh}
                      setData={setData}
                      setRefresh2={setRefresh2}
                    />
                  </td>
                ) : (
                  <td style={{ width: "5%" }}></td>
                )}
              </tr>
            );
          })
        ) : (
          <tr className="text-center">
            <td colSpan={thead.length}>
              <h4>No Data</h4>
            </td>
          </tr>
        )}
      </TableHeadAndFoot>
    </>
  );
};

export default RuleTable;
