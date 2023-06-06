import { useState } from "react";
import { Badge, Button, Tab, Nav } from "react-bootstrap";
import TableHeadAndFoot from "./TableHeadAndFoot";
import RequestDetailCampaignModal from "../modal/RequestDetailCampaignModal";

function HistoryRequestCampaignTable({
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
        <RequestDetailCampaignModal
          show={show}
          setShow={setShow}
          requestID={id}
          noFooter={true}
          noButton={true}
        />
      )}
      <TableHeadAndFoot
        currentSearch={currentSearch}
        title="Request Campaign History"
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
                    <h6 className="mb-1">{data.Campaign.Name || null}</h6>
                  </div>
                </td>

                <td
                  style={{ width: "8%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <p className="font-w500 text-start m-0">
                    {data.Campaign.CoinNumber}
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
                      ? "In Progress"
                      : data.Status === 2
                      ? "Waiting Approve"
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

export default HistoryRequestCampaignTable;
