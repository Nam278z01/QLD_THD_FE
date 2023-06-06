import { useState } from "react";
import { Badge } from "react-bootstrap";
import RequestDetailCampaignModal from "../modal/RequestDetailCampaignModal";
import TableHeadAndFoot from "./TableHeadAndFoot";
import { useMsal } from "@azure/msal-react";
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import Swal from "sweetalert2";
import { scopes } from "../../../../dataConfig";
import moment from "moment";
import { deleteRequestCampaign } from "../../../../services/CampaignAPI";
const MyCampaignRequestTable = ({
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
  const [choosenStatus,setChoosenStatus] = useState(0);
  const { instance, inProgress, accounts } = useMsal();
  const DeletePoint = (campaignID) => {
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

          deleteRequestCampaign(token, campaignID).then(() => {
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

                deleteRequestCampaign(token, campaignID).then(() => {
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
        <RequestDetailCampaignModal
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
        title="My Campaign Request "
        thead={thead}
        page={page}
        totalPage={totalPage}
        totalItems={totalItems}
        pageChange={pageChange}
        sortHandle={sortHandle}
        searchHandle={searchHandle}
        rowChange={rowChange}
        filterHandle={filterHandle}
        setChoosenStatus={setChoosenStatus}
      >
        {datas.length > 0 ? (
          datas.map((data, index) => {
            return <>
            {data.Status == choosenStatus||choosenStatus==0? <>
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
                  style={{ width: "10%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <div>
                    <h6 className="mb-1">{data.Campaign.Name}</h6>
                  </div>
                </td>

                <td
                  style={{ width: "8%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <p className="font-w500 text-center">
                    {moment(data.CreatedDate).format("YYYY-MM")}
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
                      ? "Inprogress"
                      : data.Status === 2
                      ? "Waiting Approve"
                      : data.Status === 3
                      ? "Cancelled"
                      : "Rejected"}
                  </Badge>
                </td>
              </tr>
            </>:<></>

                    }
            </>
            
            
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
export default MyCampaignRequestTable;
