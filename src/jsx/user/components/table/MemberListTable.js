import { Button } from "react-bootstrap";
import TableHeadAndFoot from "./TableHeadAndFoot";
import { UserMaster } from "../../../../dataConfig";
import UserDetailModal from "../modal/UserDetailModal";
import { useState } from "react";

const MemberListTable = ({
  datas,
  thead,
  totalPage,
  totalItems,
  className,
  title,
  type,
  showRole,
  theCurrentSort,
  page,
  pageChange,
  sortHandle,
  searchHandle,
  rowChange,
  filterHandle,
  currentSearch,
  middleExtra,
}) => {
  const [show, setShowModal] = useState(false);
  // const [account, setAccount] = useState("");

  return (
    <>
      {/* {account && (
        <UserDetailModal
          show={show}
          setShowModal={setShowModal}
          account={account}
        />
      )} */}
      <TableHeadAndFoot
        currentSearch={currentSearch}
        className={className}
        title={`${title} - List`}
        thead={thead}
        totalPage={totalPage}
        totalItems={totalItems}
        theCurrentSort={theCurrentSort}
        page={page}
        pageChange={pageChange}
        sortHandle={sortHandle}
        searchHandle={searchHandle}
        rowChange={rowChange}
        filterHandle={filterHandle}
        middleExtra={middleExtra}
      >
        {datas.length > 0 ? (
          datas.map((data, index) => {
            return (
              <tr
                key={index}
                onClick={(e) => {
                  if (UserMaster.Role[data.UserMaster.RoleID - 1] !== "Head") {
                    setShowModal(true);
                    setAccount(data.UserMaster.Account);
                  }
                }}
              >
                <td>{data.UserMaster.Avatar}</td>
                <td>{data.UserMaster.DisplayName}</td>
                <td>{data.UserMaster.Email}</td>
                <td>
                  {data.UserMaster.JobTitle
                    ? UserMaster.JobTitle[data.UserMaster.JobTitle - 1]
                    : "No job"}
                </td>
                {showRole && (
                  <td>
                    {data.UserMaster.RoleID
                      ? UserMaster.Role[data.UserMaster.RoleID - 1]
                      : "No role"}
                  </td>
                )}
                <td>
                  {data.UserMaster.PhoneNumber
                    ? data.UserMaster.PhoneNumber
                    : null}
                </td>
                <td>{data.UserMaster.YOB ? data.UserMaster.YOB : null}</td>
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
export default MemberListTable;
