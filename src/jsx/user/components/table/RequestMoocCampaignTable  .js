import "bootstrap-daterangepicker/daterangepicker.css";
import { useState, useContext } from "react";
import { Badge, Button } from "react-bootstrap";
import TableHeadAndFoot from "./TableHeadAndFoot";

import { useSelector } from "react-redux";
import { SocketContext } from "../../../../context/socketContext";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import RequestDetailMoocCampaignModal from "../modal/RequestDetailMoocCampaignModal ";
import moment from "moment";
import { requestMoocCampaignUpdate } from "../../../../services/RequestAPI";
import { requestUpdateMoocCampaignBulk } from "../../../../services/RequestAPI";
import { useHistory } from "react-router-dom";
const RequestMoocCampaignTable = (props) => {
  const {
    datas,
    thead,
    totalPage,
    totalItems,
    title,
    setRefresh,
    pageChange,
    rowChange,
    sortHandle,
    searchHandle,
    filterHandle,
    currentSearch,
    middleExtra,
  } = props;
  const { role } = useSelector((state) => state.UserSlice);
  const [showToolBar, setShowToolBar] = useState(false);
  const [show, setShow] = useState(false);
  const [id, setID] = useState(null);
  const [hidePagi, setHidePagi] = useState(false);
  const navigate = useHistory();

  const { getToken } = useContext(GetTokenContext);

  const socket = useContext(SocketContext);

  const uncheckALlcheckbox = () => {
    const chackbox = document.querySelectorAll(".sorting_1 input");

    for (let i = 0; i < chackbox.length; i++) {
      const element = chackbox[i];
      element.checked = false;
    }
    setShowToolBar(false);
    setHidePagi(false);
  };
  const handleChange = (event) => {
    if (event.target.checked) {
      // customCheck
      for (let i = 0; i < datas.length; i++) {
        document.getElementById(`customCheck2${i}`).checked = true;
      }
      setShowToolBar(true);
      setHidePagi(true);
    } else {
      for (let i = 0; i < datas.length; i++) {
        document.getElementById(`customCheck2${i}`).checked = false;
      }
      setShowToolBar(false);
      setHidePagi(false);
    }
    // setIsSubscribed((current) => !current);
  };

  const chackboxShowToolbar = () => {
    const chackbox = document.querySelectorAll(".sorting_1 input");

    for (let i = 0; i < chackbox.length; i++) {
      const element = chackbox[i];
      if (element.checked) {
        setShowToolBar(true);
        setHidePagi(true);
        break;
      } else {
        setShowToolBar(false);
        setHidePagi(false);
      }
    }
  };

  const success = () => {
    const motherChackBox = document.querySelector(".sorting1_asc input");
    motherChackBox.checked = false;
    uncheckALlcheckbox();
    setRefresh(new Date());
    setShow(false);
    navigate.push(`/campaign/request`);
  };

  function approve(ID) {
    getToken(
      requestMoocCampaignUpdate,
      "Request has been approved",
      success,
      false,
      ID,
      {
        Status: 5,
      }
    );
  }

  function reject(ID) {
    getToken(
      requestMoocCampaignUpdate,
      "Request has been rejected",
      success,
      false,
      ID,
      {
        Status: 4,
      }
    );
  }

  function approveSelect() {
    const checked = document.querySelectorAll(".sorting_1 input:checked");
    const arrayID = [...checked].map((node) => node.attributes.idvalue.value);
    const datasToSend = {
      UserMoocCampaignID: arrayID,
      Status: 5,
    };

    getToken(
      requestUpdateMoocCampaignBulk,
      "Selected request has been approved",
      success,
      false,
      datasToSend
    );
  }

  function rejectSelect() {
    const checked = document.querySelectorAll(".sorting_1 input:checked");

    const arrayID = [...checked].map((node) => node.attributes.idvalue.value);
    const datasToSend = {
      UserMoocCampaignID: arrayID,
      Status: 4,
    };

    getToken(
      requestUpdateMoocCampaignBulk,
      "Selected request has been rejected",
      success,
      false,
      datasToSend
    );
  }

  function goToDetailRequest(id) {
    setShow(true);
    setID(id);
  }

  const extraHeader = (
    <th className="sorting1_asc bg-none">
      <div className="form-check  style-1">
        <input
          type="checkbox"
          onChange={handleChange}
          className="form-check-input bg-white"
          id="checkAll"
          onClick={() => {
            chackboxShowToolbar();
          }}
        />
      </div>
    </th>
  );

  const toolBar = (
    <th colSpan={thead.length + 1}>
      <div className="d-flex flex-row justify-content-end gap-3">
        <div className="d-flex gap-3">
          <Button onClick={approveSelect} size="md">
            Approve Select
          </Button>
          <Button className="btn-danger" onClick={rejectSelect} size="md">
            Reject Select
          </Button>
        </div>
      </div>
    </th>
  );
  return (
    <>
      {id != undefined && (
        <>
          <RequestDetailMoocCampaignModal
            show={show}
            setShow={setShow}
            requestID={id}
            approve={approve}
            reject={reject}
            noStatus={true}
          />
        </>
      )}
      <TableHeadAndFoot
        overPage={true}
        currentSearch={currentSearch}
        pageChange={pageChange}
        rowChange={rowChange}
        sortHandle={sortHandle}
        searchHandle={searchHandle}
        filterHandle={filterHandle}
        title={title}
        thead={thead}
        totalPage={totalPage}
        totalItems={totalItems}
        showCustomBar={showToolBar}
        customBar={toolBar}
        extraHeader={extraHeader}
        hidePagi={hidePagi}
        // middleExtra={middleExtra}
      >
        {datas.length > 0 ? (
          datas.map((data, index) => (
            <tr
              role="row"
              key={index}
              style={{ height: "120px" }}
              className="mousePointer"
            >
              <td className="sorting_1" style={{ width: "3%" }}>
                <div className="form-check  style-1">
                  <input
                    type="checkbox"
                    onClick={() => {
                      chackboxShowToolbar();
                    }}
                    className="form-check-input bg-white"
                    id={"customCheck2" + index}
                    idvalue={data.ID}
                  />
                </div>
              </td>

              <td
                style={{ width: "20%" }}
                onClick={() => {
                  goToDetailRequest(data.ID);
                }}
              >
                <div>
                  <h6 className="mb-1">{data.UserMaster.Account}</h6>
                </div>
              </td>

              <td
                style={{ width: "20%" }}
                onClick={() => {
                  goToDetailRequest(data.ID);
                }}
              >
                <div>
                  <h6 className="mb-1">{data.Confirmer}</h6>
                </div>
              </td>

              <td
                style={{ width: "20%" }}
                onClick={() => {
                  goToDetailRequest(data.ID);
                }}
              >
                <div>
                  <h6>{data.MoocCampaign.Campaign.Name}</h6>
                </div>
              </td>
              <td
                style={{ width: "20%" }}
                onClick={() => {
                  goToDetailRequest(data.ID);
                }}
              >
                <h6 className="mb-1">
                  {"Mooc " +
                    "(" +
                    data.MoocCampaign.StartDate.substring(0, 10) +
                    " / " +
                    data.MoocCampaign.EndDate.substring(0, 10) +
                    ")"}
                </h6>
              </td>

              <td
                className="text-center"
                onClick={() => {
                  goToDetailRequest(data.ID);
                }}
              >
                <span className="font-w500 text-center">
                  {" "}
                  {moment(data.CreatedDate).format("YYYY-MM")}
                </span>
              </td>

              <td
                className="text-center"
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
                    ? "Waiting Approve"
                    : data.Status === 2
                    ? "Waiting Approve"
                    : data.Status === 3
                    ? "Cancelled"
                    : "Rejected"}
                </Badge>
              </td>
            </tr>
          ))
        ) : (
          <tr className="text-center">
            <td colSpan={thead.length + 1}>
              <h4>No Data</h4>
            </td>
          </tr>
        )}
      </TableHeadAndFoot>
    </>
  );
};
export default RequestMoocCampaignTable;
