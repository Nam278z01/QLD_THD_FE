import { useSelector } from "react-redux";
import useQuery from "../../../../Hook/useQuery";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import useReplaceURL from "../../../../Hook/useReplaceURL";
import { getExcelHead, getExcelPM } from "../../../../services/ExportAPI";

import Loading from "../../../sharedPage/pages/Loading";

import LoadingModal from "../../components/modal/LoadingModal";
import { Tab, Nav, Button } from "react-bootstrap";
import { useState, useContext } from "react";
import ImportPointexcelModal from "../../components/modal/ImportPointExcelModal";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import moment from "moment/moment";
import MyCampaignRequestTable from "../../components/table/MyCampaignRequestTable ";
import { getMyCampaignRequest } from "../../../../services/CampaignAPI";
import { getRequestCampaign } from "../../../../services/CampaignAPI";
import RequestCampaignTable from "../../components/table/RequestCampaignTable ";
import HistoryRequestCampaignTable from "../../components/table/HistoryRequestCampaignTable ";
import { getRequestCampaignHistory } from "../../../../services/RequestAPI";
import { getMyMoocCampaignRequest } from "../../../../services/CampaignAPI";
import MyMoocCampaignRequestTable from "../../components/table/MyMoocCampaignRequestTable  ";
import { getRequestMoocCampaign } from "../../../../services/CampaignAPI";
import RequestMoocCampaignTable from "../../components/table/RequestMoocCampaignTable  ";
import { getRequestMoocCampaignHistory } from "../../../../services/RequestAPI";
import HistoryRequestMoocCampaignTable from "../../components/table/HistoryRequestMoocCampaignTable  ";
import { Key } from "@mui/icons-material";
function HistoryCampaignList() {
  const { PointName } = useSelector((a) => a.DepartmentSettingSlice);
  const { userID, role, account } = useSelector((a) => a.UserSlice);

  const [show, setShow] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const { getTokenDownload } = useContext(GetTokenContext);

  const query = useQuery();
  const searchQuery = query.get("search");
  const sortQuery = query.get("sort");
  const pageQuery = query.get("page") || 1;
  const rowQuery = query.get("row") || 10;
  const statusQuery = query.get("status");

  const [dataCampaignHistory, setRefreshCampaigndata] = useRefreshToken(
    getRequestCampaignHistory,
    pageQuery,
    rowQuery,
    sortQuery,
    searchQuery,
    statusQuery,
    account
  );
  const [dataMoocCampaignHistory, setRefreshMoocCampaigndata] = useRefreshToken(
    getRequestMoocCampaignHistory,
    pageQuery,
    rowQuery,
    sortQuery,
    searchQuery,
    statusQuery,
    account
  );

  const [dataMyCampaignRequest, setRefreshMyCampaign] = useRefreshToken(
    getMyCampaignRequest,
    pageQuery,
    rowQuery,
    sortQuery,
    searchQuery,
    statusQuery,
    userID
  );
  const [dataMyMoocCampaignRequest, setRefreshMyMoocCampaign] = useRefreshToken(
    getMyMoocCampaignRequest,
    pageQuery,
    rowQuery,
    sortQuery,
    searchQuery,
    statusQuery,
    userID
  );

  const [dataRequestCampaignFrom, setRefreshFromCampaign] = useRefreshToken(
    getRequestCampaign,
    pageQuery,
    rowQuery,
    sortQuery,
    searchQuery,
    role,
    account
  );
  const [dataRequestMoocCampaignFrom, setRefreshFromMoocCampaign] =
    useRefreshToken(
      getRequestMoocCampaign,
      pageQuery,
      rowQuery,
      sortQuery,
      searchQuery,
      role,
      account
    );
  const { URLchange } = useReplaceURL(`/campaign/request`);
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
            Download <i className="fas fa-file-arrow-down" />
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
      <Tab.Container
        defaultActiveKey={role !== "Head" ? "ToCampgin" : "CreatedCampaign"}
      >
        <Nav as="ul" className="nav nav-tabs mx-2 border-0">
          {role !== "Head" && (
            <>
              <Nav.Item as="li" className="nav-item" onClick={removeAllquery}>
                <Nav.Link to="#ToCampgin" eventKey="ToCampgin">
                  My Campaign Request
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li" className="nav-item" onClick={removeAllquery}>
                <Nav.Link to="#ToMoocCampgin" eventKey="ToMoocCampgin">
                  My Mooc Campaign Request
                </Nav.Link>
              </Nav.Item>
            </>
          )}

          {dataRequestCampaignFrom === null ? (
            ""
          ) : (
            <>
              {dataRequestCampaignFrom.requestData
                .slice(0, 1)
                .map((data, index) => (
                  <div key={index}>
                    {data.Confirmer === account ? (
                      <>
                        <Nav.Item
                          as="li"
                          className="nav-item"
                          onClick={removeAllquery}
                        >
                          <Nav.Link
                            to="#CreatedCampaign"
                            eventKey="CreatedCampaign"
                            onClick={removeAllquery}
                          >
                            Approve Campaign Requests
                          </Nav.Link>
                        </Nav.Item>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
            </>
          )}
          {dataRequestMoocCampaignFrom === null ? (
            ""
          ) : (
            <>
              {dataRequestMoocCampaignFrom.requestData
                .slice(0, 1)
                .map((data, index) => (
                  <div key={index}>
                    {data.Confirmer === account ? (
                      <>
                        <Nav.Item
                          as="li"
                          className="nav-item"
                          onClick={removeAllquery}
                          key={index}
                        >
                          <Nav.Link
                            to="#CreatedMoocCampaign"
                            eventKey="CreatedMoocCampaign"
                            onClick={removeAllquery}
                          >
                            Approve Mooc Campaign Requests
                          </Nav.Link>
                        </Nav.Item>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
            </>
          )}

          {dataCampaignHistory === null ? (
            ""
          ) : (
            <>
              {dataCampaignHistory.history.slice(0, 1).map((data, index) => (
                <div key={index}>
                  {data.Confirmer === account ? (
                    <>
                      <Nav.Item
                        as="li"
                        className="nav-item"
                        onClick={() => {
                          removeAllquery;

                          setRefreshCampaigndata(new Date());
                        }}
                        key={index}
                      >
                        <Nav.Link
                          to="#CampaignRequest"
                          eventKey="CampaignRequest"
                          onClick={removeAllquery}
                        >
                          Request Campaign History
                        </Nav.Link>
                      </Nav.Item>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </>
          )}

          {dataMoocCampaignHistory === null ? (
            ""
          ) : (
            <>
              {dataMoocCampaignHistory.history
                .slice(0, 1)
                .map((data, index) => (
                  <div key={index}>
                    {data.Confirmer === account ? (
                      <>
                        <Nav.Item
                          as="li"
                          className="nav-item"
                          onClick={() => {
                            removeAllquery;

                            setRefreshMoocCampaigndata(new Date());
                          }}
                          key={index}
                        >
                          <Nav.Link
                            to="#MoocCampaignRequest"
                            eventKey="MoocCampaignRequest"
                            onClick={removeAllquery}
                          >
                            Request Mooc Campaign History
                          </Nav.Link>
                        </Nav.Item>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
            </>
          )}
        </Nav>

        <Tab.Content>
          <>
            <Tab.Pane id="ToCampgin" eventKey="ToCampgin">
              {dataMyCampaignRequest === null ? (
                <Loading />
              ) : (
                <MyCampaignRequestTable
                  currentSearch={searchQuery}
                  pageChange={pageChange}
                  rowChange={rowChange}
                  sortHandle={sortHandle}
                  searchHandle={searchHandle}
                  filterHandle={filterHandle}
                  datas={dataMyCampaignRequest.requestData}
                  status={false}
                  setRefresh={() => {
                    setRefreshMyCampaign(new Date());
                  }}
                  thead={[
                    { Title: "Confirm By", Atribute: "", sort: false },

                    { Title: "Campaign", Atribute: "", sort: false },

                    {
                      Title: "Date",
                      Atribute: "CreatedDate",
                      sort: true,
                      className: "justify-content-center",
                    },

                    {
                      Title: "Status",
                      filter: [
                        { title: "InProgress", value: 1 },
                        { title: "Waiting Approve", value: 2 },
                        { title: "Cancelled", value: 3 },
                        { title: "Rejected", value: 4 },
                        { title: "Approved", value: 5 },
                      ],
                      filterType: "status",
                    },
                  ]}
                  totalPage={dataMyCampaignRequest.totalPage}
                  totalItems={dataMyCampaignRequest.totalItems}
                />
              )}
            </Tab.Pane>
            <Tab.Pane id="ToMoocCampgin" eventKey="ToMoocCampgin">
              {dataMyMoocCampaignRequest === null ? (
                <Loading />
              ) : (
                <MyMoocCampaignRequestTable
                  currentSearch={searchQuery}
                  pageChange={pageChange}
                  rowChange={rowChange}
                  sortHandle={sortHandle}
                  searchHandle={searchHandle}
                  filterHandle={filterHandle}
                  datas={dataMyMoocCampaignRequest.requestData}
                  status={false}
                  setRefresh={() => {
                    setRefreshMyMoocCampaign(new Date());
                  }}
                  thead={[
                    { Title: "Confirm By", Atribute: "", sort: false },

                    { Title: "Campaign", Atribute: "", sort: false },
                    { Title: "Mooc", Atribute: "", sort: false },

                    {
                      Title: "Date",
                      Atribute: "CreatedDate",
                      sort: true,
                      className: "justify-content-center",
                    },

                    {
                      Title: "Status",
                      filter: [
                        { title: "InProgress", value: 1 },
                        { title: "Waiting Approve", value: 2 },
                        { title: "Cancelled", value: 3 },
                        { title: "Rejected", value: 4 },
                        { title: "Approved", value: 5 },
                      ],
                      filterType: "status",
                    },
                  ]}
                  totalPage={dataMyMoocCampaignRequest.totalPage}
                  totalItems={dataMyMoocCampaignRequest.totalItems}
                />
              )}
            </Tab.Pane>
            <Tab.Pane id="CreatedCampaign" eventKey="CreatedCampaign">
              {dataRequestCampaignFrom === null ? (
                <Loading />
              ) : (
                <RequestCampaignTable
                  middleExtra={extraHead}
                  currentSearch={searchQuery}
                  datas={dataRequestCampaignFrom.requestData}
                  status={false}
                  thead={[
                    { Title: "Account", Atribute: "", sort: false },
                    {
                      Title: "Confirm By",
                      Atribute: "",
                      sort: false,
                    },
                    { Title: "Campaign", Atribute: "", sort: false },

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
                  totalPage={dataRequestCampaignFrom.totalPage}
                  totalItems={dataRequestCampaignFrom.totalItems}
                  title={`${role} Request Campaign List`}
                  setRefresh={() => {
                    setRefreshFromCampaign(new Date());
                  }}
                />
              )}
            </Tab.Pane>
            <Tab.Pane id="CreatedMoocCampaign" eventKey="CreatedMoocCampaign">
              {dataRequestMoocCampaignFrom === null ? (
                <Loading />
              ) : (
                <RequestMoocCampaignTable
                  middleExtra={extraHead}
                  currentSearch={searchQuery}
                  datas={dataRequestMoocCampaignFrom.requestData}
                  status={false}
                  thead={[
                    { Title: "Account", Atribute: "", sort: false },
                    {
                      Title: "Confirm By",
                      Atribute: "",
                      sort: false,
                    },
                    { Title: "Campaign", Atribute: "", sort: false },
                    { Title: "Mooc", Atribute: "", sort: false },

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
                  totalPage={dataRequestMoocCampaignFrom.totalPage}
                  totalItems={dataRequestMoocCampaignFrom.totalItems}
                  title={`${role} Request Mooc Campaign List`}
                  setRefresh={() => {
                    setRefreshFromMoocCampaign(new Date());
                  }}
                />
              )}
            </Tab.Pane>
          </>

          <>
            <Tab.Pane id="CampaignRequest" eventKey="CampaignRequest">
              {dataCampaignHistory === null ? (
                <Loading />
              ) : (
                <HistoryRequestCampaignTable
                  currentSearch={searchQuery}
                  pageChange={pageChange}
                  rowChange={rowChange}
                  sortHandle={sortHandle}
                  searchHandle={searchHandle}
                  filterHandle={filterHandle}
                  datas={dataCampaignHistory.history}
                  setRefresh={() => {
                    setRefreshCampaigndata(new Date());
                  }}
                  status={false}
                  thead={[
                    { Title: "Account", Atribute: "", sort: false },

                    { Title: "Confirm By", Atribute: "", sort: false },
                    { Title: "Campaign Name", Atribute: "", sort: false },

                    {
                      Title: PointName,
                      Atribute: "",
                      sort: false,
                      className: "justify-content-center",
                    },

                    {
                      Title: "Status",
                      filter: [
                        { title: "In Progress", value: 1 },
                        { title: "Waiting Approve", value: 2 },
                        { title: "Approved", value: 5 },
                        { title: "Rejected", value: 4 },
                        { title: "Cancelled", value: 3 },
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
                  totalPage={dataCampaignHistory.totalPage}
                  totalItems={dataCampaignHistory.totalItems}
                />
              )}
            </Tab.Pane>
            <Tab.Pane id="MoocCampaignRequest" eventKey="MoocCampaignRequest">
              {dataMoocCampaignHistory === null ? (
                <Loading />
              ) : (
                <HistoryRequestMoocCampaignTable
                  currentSearch={searchQuery}
                  pageChange={pageChange}
                  rowChange={rowChange}
                  sortHandle={sortHandle}
                  searchHandle={searchHandle}
                  filterHandle={filterHandle}
                  datas={dataMoocCampaignHistory.history}
                  setRefresh={() => {
                    setRefreshMoocCampaigndata(new Date());
                  }}
                  status={false}
                  thead={[
                    { Title: "Account", Atribute: "", sort: false },

                    { Title: "Confirm By", Atribute: "", sort: false },
                    { Title: "Campaign", Atribute: "", sort: false },
                    { Title: "Mooc", Atribute: "", sort: false },

                    // {
                    //   Title: PointName,
                    //   Atribute: "",
                    //   sort: false,
                    //   className: "justify-content-center",
                    // },

                    {
                      Title: "Status",
                      filter: [
                        { title: "Waiting Confirm", value: 1 },
                        { title: "Waiting Approve", value: 2 },
                        { title: "Approved", value: 5 },
                        { title: "Rejected", value: 4 },
                        { title: "Cancelled", value: 3 },
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
                  totalPage={dataMoocCampaignHistory.totalPage}
                  totalItems={dataMoocCampaignHistory.totalItems}
                />
              )}
            </Tab.Pane>
          </>
        </Tab.Content>
      </Tab.Container>
    </>
  );
}

export default HistoryCampaignList;
