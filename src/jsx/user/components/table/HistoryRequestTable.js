import { useState } from "react";
import { Badge, Button, Tab, Nav } from "react-bootstrap";
import RequestDetailModal from "../modal/RequestDetailModal";
import TableHeadAndFoot from "./TableHeadAndFoot";

function HistoryRequestTable({
  datas,
  thead,
  page,
  totalPage,
  totalItems,
  pageChange,
  rowChange,
  sortHandle,
  searchHandle,
  filterHandle,
  currentSearch,
}) {
  const [show, setShow] = useState(false);
  const [id, setID] = useState(false);

  function goToDetailRequest(id) {
    setShow(true);
    setID(id);
  }

  return (
    <>
      {id && (
        <RequestDetailModal
          show={show}
          setShow={setShow}
          requestID={id}
          noFooter={true}
          noButton={true}
        />
      )}
      <TableHeadAndFoot
        currentSearch={currentSearch}
        title="Request Point History"
        thead={thead}
        page={page}
        totalPage={totalPage}
        totalItems={totalItems}
        pageChange={pageChange}
        sortHandle={sortHandle}
        searchHandle={searchHandle}
        rowChange={rowChange}
        filterHandle={filterHandle}
        overPage={true}
      >
        {datas.length > 0 ? (
          datas.map((data, index) => {
            return (
              <tr
                role="row"
                className="odd mousePointer"
                key={index}
                style={{ height: "120px" }}
              >
                <td
                  style={{ width: "8%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <div>
                    <h6 className="mb-1">{data.Account || null}</h6>
                  </div>
                </td>

                <td
                  style={{ width: "8%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <div>
                    <h6 className="mb-1">{data.CreatedBy || null}</h6>
                  </div>
                </td>

                <td
                  style={{ width: "8%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <div>
                    <h6 className="mb-1">{data.Confirmer || null}</h6>
                  </div>
                </td>

                <td
                  style={{ width: "8%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <div>
                    <h6 className="mb-1">{data.Approver}</h6>
                  </div>
                </td>

                <td
                  style={{ width: "8%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <h6 className="mb-0 text-truncate" title={data.ProjectName}>
                    {data.ProjectName}
                  </h6>
                </td>
                <td
                  style={{ width: "8%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <p className="font-w500 text-center m-0">
                    {data.PointOfRule}
                  </p>
                </td>
                <td
                  style={{ width: "8%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <div className="font-w500">{data.Name}</div>
                </td>

                <td
                  className="text-center"
                  style={{ width: "8%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <Badge
                    bg={
                      data.Status === "Approved"
                        ? "success"
                        : data.Status === "Waiting PM Confirm"
                        ? "primary"
                        : data.Status === "Waiting Head Approve"
                        ? "primary"
                        : data.Status === "Cancelled"
                        ? "secondary"
                        : "danger"
                    }
                  >
                    {data.Status ? data.Status : null}
                  </Badge>
                </td>
                <td
                  style={{ width: "4%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <p className="font-w500 text-center">{data.CreatedDate}</p>
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
}

export default HistoryRequestTable;
