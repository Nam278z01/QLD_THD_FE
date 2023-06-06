import { Badge } from "react-bootstrap";
import TableHeadAndFoot from "./TableHeadAndFoot";
import { Status, UserMaster } from "../../../../dataConfig";
import UserDetailModal from "../modal/UserDetailModal";
import { useState } from "react";
import moment from "moment/moment";
import { useSelector } from "react-redux";

const PMListTable = ({
  datas,
  thead,
  totalPage,
  totalItems,
  className,
  title,
  type,
  extraHead,
  showRole,
  theCurrentSort,
  page,
  pageChange,
  sortHandle,
  searchHandle,
  rowChange,
  filterHandle,
  middleExtra,
  currentSearch,
  setRefresh,
}) => {
  const [show, setShowModal] = useState(false);
  const [account, setAccount] = useState(null);
  const { Code, IsFsu } = useSelector((a) => a.DepartmentSettingSlice);
  return (
    <>
      {account && (
        <UserDetailModal
          show={show}
          setShowModal={setShowModal}
          account={account}
          setRefresh={setRefresh}
          setAccount={setAccount}
        />
      )}
      <TableHeadAndFoot
        currentSearch={currentSearch}
        middleExtra={middleExtra}
        className={className}
        title={`${title}`}
        thead={thead}
        totalPage={totalPage}
        totalItems={totalItems}
        extraHead={extraHead}
        theCurrentSort={theCurrentSort}
        page={page}
        pageChange={pageChange}
        sortHandle={sortHandle}
        searchHandle={searchHandle}
        rowChange={rowChange}
        filterHandle={filterHandle}
      >
        {datas.length > 0 ? (
          datas.map((data, index) => {
            return (
              <tr
                key={index}
                onClick={() => {
                  if (data.RoleID === 2 || data.Status === 2) {
                    return;
                  }

                  setShowModal(true);
                  setAccount(data.Account);
                }}
                className={
                  data.RoleID === 2 || data.Status === 2 ? "" : "mousePointer"
                }
              >
                {IsFsu === 1 ? (
                  <>
                    <td style={{ width: "8%" }}>
                      {data.Department ? data.Department.Code : null}
                    </td>
                    <td style={{ width: "8%" }}>{data.Group}</td>
                    <td style={{ width: "10%" }}>{data.DisplayName}</td>
                  </>
                ) : (
                  <>
                    <td style={{ width: "10%" }}>
                      {data.Department ? data.Department.Code : null}
                    </td>
                    <td style={{ width: "15%" }}>{data.DisplayName}</td>
                  </>
                )}

                <td style={{ width: "10%" }}>{data.Account}</td>
                <td style={{ width: "10%" }}>{data.JobTitle || null}</td>

                {showRole && (
                  <td style={{ width: "10%" }}>
                    {data.RoleID ? UserMaster.Role[data.RoleID - 1] : null}
                  </td>
                )}
                <td style={{ width: "10%" }} className="overflow-hidden">
                  {data.PhoneNumber || null}
                </td>
                <td style={{ width: "10%" }}>
                  {data.DOB ? moment(data.DOB).format("DD/MM/YYYY") : null}
                </td>
                <td style={{ width: "10%" }}>
                  {data.ContractType
                    ? UserMaster.ContractType[data.ContractType - 1]
                    : null}
                </td>

                <td
                  className="text-center user-select-none"
                  style={{ width: "15%" }}
                >
                  <Badge
                    bg={
                      data.Status === 1
                        ? "success"
                        : data.Status === 2
                        ? "secondary"
                        : data.Status === 3
                        ? "warning"
                        : "danger"
                    }
                  >
                    {data.Status ? Status.UserMaster[data.Status - 1] : null}
                  </Badge>
                </td>
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
export default PMListTable;
