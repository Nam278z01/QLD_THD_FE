import { Badge } from "react-bootstrap";
import TableHeadAndFoot from "./TableHeadAndFoot";
import { Status, UserMaster } from "../../../../dataConfig";
import UserDetailModal from "../modal/UserDetailModal";
import { useState } from "react";
import moment from "moment/moment";
import { useSelector } from "react-redux";

const WorkingTable = ({
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
  const { Code } = useSelector((a) => a.DepartmentSettingSlice);

  return (
    <>
      {/* {account && (
        <UserDetailModal
          show={show}
          setShowModal={setShowModal}
          account={account}
          setRefresh={setRefresh}
          setAccount={setAccount}
        />
      )} */}
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
                className="text-center"
              >
                <td style={{ width: "20%" }}>{data.DisplayName}</td>
                <td style={{ width: "20%" }}>{data.Account}</td>
                <td style={{ width: "20%" }}>{data.Month}</td>
                <td style={{ width: "20%" }}>{data.Year}</td>
                <td style={{ width: "20%" }}>{data.WorkDateNumber}</td>
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
export default WorkingTable;
