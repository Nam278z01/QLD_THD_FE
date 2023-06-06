import { useState } from "react";
import { Badge, Button, Tab, Nav } from "react-bootstrap";
import TableHeadAndFoot from "./TableHeadAndFoot";
import RequestDetailMoocCampaignModal from "../modal/RequestDetailMoocCampaignModal ";

function HistoryRequestMoocCampaignTable({
  setRefresh,
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
        <RequestDetailMoocCampaignModal
          show={show}
          setShow={setShow}
          requestID={id}
          noFooter={true}
          noButton={true}
          setRefresh={setRefresh}
        />
      )}
      <TableHeadAndFoot
        currentSearch={currentSearch}
        title="Request Mooc Campaign History"
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
                    <h6 className="mb-1">{data.UserMaster.Account || null}</h6>
                  </div>
                </td>

                <td
                  style={{ width: "8%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <div>
                    <h6 className="mb-1">{data.Confirmer}</h6>
                  </div>
                </td>

                <td
                  style={{ width: "8%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <div className="font-w500 text-start m-0">
                    <h6>{data.MoocCampaign.Campaign.Name}</h6>
                  </div>
                </td>
                <td
                  style={{ width: "8%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <p className="font-w500 text-start m-0">
                    {"Mooc " +
                      "(" +
                      data.MoocCampaign.StartDate.substring(0, 10) +
                      " / " +
                      data.MoocCampaign.EndDate.substring(0, 10) +
                      ")"}
                  </p>
                </td>

                <td
                  className="text-center"
                  style={{ width: "4%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <Badge
                    bg={
                      data.Status === 5
                        ? "success"
                        : data.Status === 1
                        ? "primary"
                        : data.Status === 2
                        ? "primary"
                        : data.Status === 3
                        ? "secondary"
                        : "danger"
                    }
                  >
                    {data.Status === 5
                      ? "Approved"
                      : data.Status === 1
                      ? "Waiting  Approve"
                      : data.Status === 2
                      ? "Waiting  Approve"
                      : data.Status === 3
                      ? "Cancelled"
                      : "Rejected"}
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

export default HistoryRequestMoocCampaignTable;
