import { useSelector } from "react-redux";
import useQuery from "../../../../Hook/useQuery";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import useReplaceURL from "../../../../Hook/useReplaceURL";
import { getExcelHead, getExcelPM } from "../../../../services/ExportAPI";

import {
  getMyRequest,
  getRequest,
  getRequestHistory,
} from "../../../../services/RequestAPI";

import Loading from "../../../sharedPage/pages/Loading";
import HistoryRequestTable from "../../components/table/HistoryRequestTable";
import MyRequestTable from "../../components/table/MyRequestTable";
import RequestTable from "../../components/table/RequestTable";
import LoadingModal from "../../components/modal/LoadingModal";
import { Tab, Nav, Button } from "react-bootstrap";
import { useState, useContext } from "react";
import ImportPointexcelModal from "../../components/modal/ImportPointExcelModal";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import moment from "moment/moment";

function HistoryList() {
  const { PointName } = useSelector((a) => a.DepartmentSettingSlice);
  const { userID, role, account } = useSelector((a) => a.UserSlice);
  const [show, setShow] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const { getTokenDownload } = useContext(GetTokenContext);

  const query = useQuery();
  const searchQuery = query.get("search");
  const sortQuery = query.get("sort") || "CreatedDate:DESC";
  const pageQuery = query.get("page") || 1;
  const rowQuery = query.get("row") || 10;
  const statusQuery = query.get("status");

  const [dataHistory, setRefreshdata] = useRefreshToken(
    getRequestHistory,
    pageQuery,
    rowQuery,
    sortQuery,
    searchQuery,
    statusQuery,
    userID,
    account,
    role
  );

  const [dataMyRequest, setRefreshMy] = useRefreshToken(
    getMyRequest,
    pageQuery,
    rowQuery,
    sortQuery,
    searchQuery,
    statusQuery,
    userID
  );

  const [dataRequestFrom, setRefreshFrom] = useRefreshToken(
    getRequest,
    pageQuery,
    rowQuery,
    sortQuery,
    searchQuery,
    role,
    userID,
    account
  );

  const { URLchange } = useReplaceURL(`/point/request`);
  function pageChange(page) {
    URLchange(
      page,
      rowQuery,
      sortQuery,
      searchQuery,
      null,
      null,
      statusQuery ? `&status=${statusQuery}` : ""
    );
  }

  function rowChange(row) {
    URLchange(
      1,
      row,
      sortQuery,
      searchQuery,
      null,
      null,
      statusQuery ? `&status=${statusQuery}` : ""
    );
  }

  function sortHandle(toSort) {
    URLchange(
      1,
      rowQuery,
      toSort,
      searchQuery,
      null,
      null,
      statusQuery ? `&status=${statusQuery}` : ""
    );
  }

  function searchHandle(search) {
    URLchange(
      1,
      rowQuery,
      sortQuery,
      search,
      null,
      null,
      statusQuery ? `&status=${statusQuery}` : ""
    );
  }

  function filterHandle(filter, type) {
    URLchange(1, rowQuery, sortQuery, searchQuery, null, null, filter);
  }

  function removeAllquery() {
    URLchange(1, 10, null, null, null, null, null);
  }

  const extraHead = (
    <div className="d-flex justify-content-end gap-2">
      {role === "PM" ? (
        <Button
          onClick={(e) => {
            e.target.blur();
            getTokenDownload(
              getExcelPM,
              `PM-POINT-TEMPLATE(${moment(new Date()).format("DD-MM-YYYY")})`
            );
          }}
          title="Download template to import"
        >
          Download <i className="fas fa-file-arrow-down" />
        </Button>
      ) : (
        <>
          <Button
            onClick={(e) => {
              e.target.blur();
              getTokenDownload(
                getExcelHead,
                `HEAD-POINT-TEMPLATE(${moment(new Date()).format(
                  "DD-MM-YYYY"
                )})`
              );
            }}
            title="Download template to import"
          >
            Template <i className="fas fa-file-arrow-down" />
          </Button>
        </>
      )}
      <Button
        onClick={(e) => {
          setShow(true);
          e.target.blur();
        }}
      >
        Import <i className="fas fa-file-import" />
      </Button>
    </div>
  );

  return (
    <>
      <ImportPointexcelModal
        show={show}
        setShowModal={setShow}
        setShowLoading={setShowLoading}
        setRefresh={() => {
          setRefreshMy(new Date());
          setRefreshFrom(new Date());
        }}
      />

      <LoadingModal show={showLoading} />
      <Tab.Container defaultActiveKey={role !== "Head" ? "ToMe" : "ConFirmMe"}>
        <Nav as="ul" className="nav nav-tabs mx-2 border-0">
          {role !== "Head" && (
            <>
              <Nav.Item as="li" className="nav-item" onClick={removeAllquery}>
                <Nav.Link to="#ToMe" eventKey="ToMe">
                  My Point Requests
                </Nav.Link>
              </Nav.Item>
            </>
          )}

          {role !== "Member" && (
            <Nav.Item as="li" className="nav-item" onClick={removeAllquery}>
              <Nav.Link to="#ConFirmMe" eventKey="ConFirmMe">
                {role === "Head"
                  ? "Approve Point Requests "
                  : "Confirm Point Requests "}
              </Nav.Link>
            </Nav.Item>
          )}
          {role !== "Member" && (
            <Nav.Item
              as="li"
              className="nav-item"
              onClick={() => {
                removeAllquery;

                setRefreshdata(new Date());
              }}
            >
              <Nav.Link to="#CreatedMe" eventKey="CreatedMe">
                Request Point History
              </Nav.Link>
            </Nav.Item>
          )}
        </Nav>

        <Tab.Content>
          {role !== "Head" && (
            <>
              <Tab.Pane id="ToMe" eventKey="ToMe">
                {dataMyRequest === null ? (
                  <Loading />
                ) : (
                  <MyRequestTable
                    currentSearch={searchQuery}
                    pageChange={pageChange}
                    rowChange={rowChange}
                    sortHandle={sortHandle}
                    searchHandle={searchHandle}
                    filterHandle={filterHandle}
                    datas={dataMyRequest.requestData}
                    status={false}
                    setRefresh={() => {
                      setRefreshMy(new Date());
                      setRefreshFrom(new Date());
                    }}
                    thead={[
                      { Title: "Confirm By", Atribute: "", sort: false },

                      { Title: "Approver", Atribute: "", sort: false },

                      { Title: "Project", Atribute: "", sort: false },
                      {
                        Title: "Total " + PointName,
                        Atribute: "PointOfRule",
                        sort: true,
                        className: "justify-content-center",
                      },
                      { Title: "Rule", Atribute: "", sort: false },

                      {
                        Title: "Times",
                        Atribute: "Times",
                        sort: true,
                        className: "justify-content-center",
                      },
                      {
                        Title: "Year",
                        Atribute: "Year",
                        sort: true,
                        className: "justify-content-center",
                      },
                      {
                        Title: "Month",
                        Atribute: "Month",
                        sort: true,
                        className: "justify-content-center",
                      },

                      {
                        Title: "Status",
                        filter: [
                          { title: "Waiting PM Confirm", value: 1 },
                          { title: "Waiting Head Approve", value: 2 },
                          { title: "Approved", value: 3 },
                          { title: "Rejected", value: 4 },
                          { title: "Cancelled", value: 5 },
                        ],
                        filterType: "status",
                      },
                    ]}
                    totalItems={dataMyRequest.totalItems}
                    totalPage={dataMyRequest.totalPage}
                  />
                )}
              </Tab.Pane>
            </>
          )}

          {role !== "Member" && (
            <Tab.Pane id="ConFirmMe" eventKey="ConFirmMe">
              {dataRequestFrom === null ? (
                <Loading />
              ) : (
                <RequestTable
                  middleExtra={extraHead}
                  currentSearch={searchQuery}
                  datas={dataRequestFrom.requestData}
                  status={false}
                  thead={[
                    { Title: "Account", Atribute: "", sort: false },
                    {
                      Title: `${role === "Head" ? "Confirm By" : "Approver"}`,
                      Atribute: "",
                      sort: false,
                    },
                    { Title: "Project", Atribute: "", sort: false },
                    {
                      Title: "Total " + PointName,
                      Atribute: "PointOfRule",
                      sort: true,
                      className: "justify-content-center",
                    },
                    { Title: "Rule", Atribute: "", sort: false },
                    {
                      Title: "Times",
                      Atribute: "Times",
                      sort: true,
                      className: "justify-content-center",
                    },
                    {
                      Title: "Date",
                      Atribute: "CreatedDate",
                      sort: true,
                      className: "justify-content-center",
                    },
                    {
                      Title: "Status",
                      Atribute: "",
                      sort: false,
                      className: "text-center",
                    },
                    // { Title: " ", Atribute: "", sort: false },
                  ]}
                  totalPage={dataRequestFrom.totalPage}
                  totalItems={dataRequestFrom.totalItems}
                  title={`${role} Request Point List`}
                  setRefresh={() => {
                    setRefreshMy(new Date());
                    setRefreshFrom(new Date());
                  }}
                />
              )}
            </Tab.Pane>
          )}

          <></>

          {role === "Head" && (
            <Tab.Pane id="CreatedMe" eventKey="CreatedMe">
              {dataHistory === null ? (
                <Loading />
              ) : (
                <HistoryRequestTable
                  currentSearch={searchQuery}
                  pageChange={pageChange}
                  rowChange={rowChange}
                  sortHandle={sortHandle}
                  searchHandle={searchHandle}
                  filterHandle={filterHandle}
                  datas={dataHistory.history}
                  setRefresh={() => {
                    setRefreshdata(new Date());
                    setRefreshFrom(new Date());
                  }}
                  status={false}
                  thead={[
                    { Title: "Account", Atribute: "", sort: false },

                    { Title: "Created By", Atribute: "", sort: false },

                    { Title: "Confirm By", Atribute: "", sort: false },

                    { Title: "Approver", Atribute: "", sort: false },

                    { Title: "Project", Atribute: "", sort: false },

                    {
                      Title: "Total " + PointName,
                      Atribute: "PointOfRule",
                      sort: true,
                      className: "justify-content-center",
                    },
                    { Title: "Rule", Atribute: "", sort: false },

                    {
                      Title: "Status",
                      filter: [
                        // { title: "Waiting PM Confirm", value: 1 },
                        // { title: "Waiting Head Approve", value: 2 },
                        { title: "Approved", value: 3 },
                        { title: "Rejected", value: 4 },
                        // { title: "Cancelled", value: 5 },
                      ],
                      filterType: "status",
                    },

                    {
                      Title: "Created Date",
                      Atribute: "CreatedDate",
                      sort: true,
                      className: "justify-content-center",
                    },
                  ]}
                  totalPage={dataHistory.totalPage}
                  totalItems={dataHistory.totalItems}
                />
              )}
            </Tab.Pane>
          )}

          {role === "PM" && (
            <Tab.Pane id="CreatedMe" eventKey="CreatedMe">
              {dataHistory === null ? (
                <Loading />
              ) : (
                <HistoryRequestTable
                  currentSearch={searchQuery}
                  pageChange={pageChange}
                  rowChange={rowChange}
                  sortHandle={sortHandle}
                  searchHandle={searchHandle}
                  filterHandle={filterHandle}
                  datas={dataHistory.history}
                  setRefresh={() => {
                    setRefreshdata(new Date());
                    setRefreshFrom(new Date());
                  }}
                  status={false}
                  thead={[
                    { Title: "Account", Atribute: "", sort: false },

                    { Title: "Created By", Atribute: "", sort: false },

                    { Title: "Confirm By", Atribute: "", sort: false },

                    { Title: "Approver", Atribute: "", sort: false },

                    { Title: "Project", Atribute: "", sort: false },

                    {
                      Title: "Total " + PointName,
                      Atribute: "PointOfRule",
                      sort: true,
                      className: "justify-content-center",
                    },
                    { Title: "Rule", Atribute: "", sort: false },

                    {
                      Title: "Status",
                      filter: [
                        { title: "Waiting PM Confirm", value: 1 },
                        { title: "Waiting Head Approve", value: 2 },
                        { title: "Approved", value: 3 },
                        { title: "Rejected", value: 4 },
                        // { title: "Cancelled", value: 5 },
                      ],
                      filterType: "status",
                    },

                    {
                      Title: "Created Date",
                      Atribute: "CreatedDate",
                      sort: true,
                      className: "justify-content-center",
                    },
                  ]}
                  totalPage={dataHistory.totalPage}
                  totalItems={dataHistory.totalItems}
                />
              )}
            </Tab.Pane>
          )}

          <></>
        </Tab.Content>
      </Tab.Container>
    </>
  );
}

export default HistoryList;
