import "bootstrap-daterangepicker/daterangepicker.css";
import { useState, useContext } from "react";
import { Badge, Button } from "react-bootstrap";
import TableHeadAndFoot from "./TableHeadAndFoot";
import {
  requestUpdate,
  requestUpdateBulk,
} from "../../../../services/RequestAPI";
import RequestDetailModal from "../modal/RequestDetailModal";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../../context/socketContext";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import moment from "moment";
import Swal from "sweetalert2";

const RequestTable = (props) => {
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

  const chackboxFun = (type) => {
    const chackbox = document.querySelectorAll(".sorting_1 input");
    const motherChackBox = document.querySelector(".sorting_asc input");

    for (let i = 0; i < chackbox.length; i++) {
      const element = chackbox[i];

      if (type === "all") {
        if (motherChackBox.checked) {
          setShowToolBar(true);
          setHidePagi(true);
          element.checked = true;
        } else {
          setShowToolBar(false);
          setHidePagi(false);

          element.checked = false;
        }
      } else {
        if (!element.checked) {
          setShowToolBar(false);
          setHidePagi(false);

          motherChackBox.checked = false;
          break;
        } else {
          setShowToolBar(true);
          setHidePagi(true);
          motherChackBox.checked = true;
        }
      }
    }
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
    const motherChackBox = document.querySelector(".sorting_asc input");
    motherChackBox.checked = false;
    uncheckALlcheckbox();
    setRefresh(new Date());
    setShow(false);
  };

  function approve(ID, Comment) {
    getToken(requestUpdate, "Request has been approved", success, false, ID, {
      Status: role === "Head" ? 3 : 2,
      Comment,
    });
  }

  function reject(ID, Comment) {
    getToken(requestUpdate, "Request has been rejected", success, false, ID, {
      Status: 4,
      Comment,
    });
  }

  function approveSelect() {
    const checked = document.querySelectorAll(".sorting_1 input:checked");
    const arrayID = [...checked].map((node) => node.attributes.idvalue.value);
    const datasToSend = {
      PointID: arrayID,
      Status: role === "Head" ? 3 : 2,
    };

    getToken(
      requestUpdateBulk,
      "Selected request has been approved",
      success,
      false,
      datasToSend
    );
  }

  function rejectSelect() {
    Swal.fire({
      title: "Do you want to reject?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        const checked = document.querySelectorAll(".sorting_1 input:checked");
        const arrayID = [...checked].map(
          (node) => node.attributes.idvalue.value
        );
        const datasToSend = {
          PointID: arrayID,
          Status: 4,
        };

        getToken(
          requestUpdateBulk,
          "Selected request has been rejected",
          success,
          false,
          datasToSend
        );
      }
    });
  }

  function goToDetailRequest(id) {
    setShow(true);
    setID(id);
  }

  const extraHeader = (
    <th className="sorting_asc bg-none">
      <div className="form-check  style-1">
        <input
          type="checkbox"
          onClick={() => chackboxFun("all")}
          className="form-check-input bg-white"
          id="checkAll"
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
          <Button variant="danger" onClick={rejectSelect} size="md">
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
          <RequestDetailModal
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
        totalItems={totalItems}
        currentSearch={currentSearch}
        pageChange={pageChange}
        rowChange={rowChange}
        sortHandle={sortHandle}
        searchHandle={searchHandle}
        filterHandle={filterHandle}
        title={title}
        thead={thead}
        totalPage={totalPage}
        showCustomBar={showToolBar}
        customBar={toolBar}
        extraHeader={datas.length > 0 ? extraHeader : ""}
        hidePagi={hidePagi}
        middleExtra={middleExtra}
      >
        {datas.length > 0 ? (
          datas.map((data, index) => {
            return (
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
                        chackboxFun();
                        chackboxShowToolbar();
                      }}
                      className="form-check-input bg-white"
                      id="customCheckBox2"
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
                    <h6 className="mb-1">{data.email}</h6>
                    <h6 className="m-0 text-secondary"></h6>
                  </div>
                </td>

                <td
                  style={{ width: "20%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <div>
                    <h6 className="mb-1">
                      {role === "Head" ? data.Confirmer : data.Approver}
                    </h6>
                  </div>
                </td>

                <td
                  style={{ width: "15%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <div className="align-items-center">
                    <div>
                      <h5
                        className="mb-0 text-truncate"
                        title={data.ProjectName}
                      >
                        {data.ProjectName}
                      </h5>
                      <p
                        className="text-primary fs-14 text-truncate m-0"
                        title={data.key}
                      >
                        {data.key}
                      </p>
                    </div>
                  </div>
                </td>

                <td
                  style={{ width: "10%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <p className="font-w500 text-center m-0">
                    {data.PointOfRule}
                  </p>
                </td>

                <td
                  style={{ width: "30%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <div className="font-w500">{data.Name}</div>
                </td>

                <td
                  style={{ width: "5%" }}
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <p className="font-w500 text-center m-0">{data.Times}</p>
                </td>

                <td
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <span className="font-w500">
                    {moment(Date(data.Date)).format("DD-MM-YYYY")}
                  </span>
                </td>

                <td
                  onClick={() => {
                    goToDetailRequest(data.ID);
                  }}
                >
                  <Badge
                    bg={`${
                      data.Status === "Approve"
                        ? "success"
                        : data.Status === "Declined"
                        ? "danger"
                        : "primary"
                    } `}
                  >
                    {data.Status}
                  </Badge>
                </td>
              </tr>
            );
          })
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
export default RequestTable;
