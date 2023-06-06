import { useState } from "react";
import { Badge } from "react-bootstrap";
import RequestDetailModal from "../modal/RequestDetailModal";
import TableHeadAndFoot from "./TableHeadAndFoot";
import { useMsal } from "@azure/msal-react";
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import Swal from "sweetalert2";
import { scopes } from "../../../../dataConfig";
import { deleteRequest } from "../../../../services/RequestAPI";

const MyRequestTable = ({
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
  setRefresh,
}) => {
  const { instance, inProgress, accounts } = useMsal();

  const DeletePoint = (pointID) => {
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

          deleteRequest(token, pointID).then(() => {
            Swal.fire({
              icon: "success",
              title: "Request has been cancelled",
            });
            setRefresh(new Date());
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

                deleteRequest(token, pointID).then(() => {
                  Swal.fire({
                    icon: "success",
                    title: "Request has been cancelled",
                  });
                  setRefresh(new Date());
                });
              });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          }
        });
    }
  };

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
          noButton={true}
          DeletePoint={DeletePoint}
        />
      )}
      <TableHeadAndFoot
        overPage={true}
        currentSearch={currentSearch}
        title="My Request"
        thead={thead}
        page={page}
        totalPage={totalPage}
        totalItems={totalItems}
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
                  style={{ width: "8%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <p className="font-w500 text-center m-0">{data.Times}</p>
                </td>

                <td
                  style={{ width: "4%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <p className="font-w500 text-center">{data.Year}</p>
                </td>

                <td
                  style={{ width: "4%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <p className="font-w500 text-center">{data.Month}</p>
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
export default MyRequestTable;
