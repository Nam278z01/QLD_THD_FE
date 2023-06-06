import CampaignList from "../../components/table/campaignTable/CampaignList";
import {
  getAllCampaign,
  getAllActiveCampaign,
  getAllUserCampaign,
  activeCampaign,
} from "../../../../services/CampaignAPI";
import useQuery from "../../../../Hook/useQuery";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import useReplaceURL from "../../../../Hook/useReplaceURL";
import Loading from "../../../sharedPage/pages/Loading";
import { Card } from "react-bootstrap";
import CampaignCard from "../../components/Card/CampaignCard";
import { useState, useEffect } from "react";
import CampaignDetailPage from "../Campaign/CampaignDetailPage";
import { Button } from "@mui/material";
import { Link, useLocation, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomPagination from "../../components/Shared/CustomPagination";
import CardTitleWithSearch from "../../components/Card/CardTitleWithSearch";
import { Tab, Nav } from "react-bootstrap";
import AllCampaign from "../../components/Card/ListCampaign/AllCampaign";
import UserCampaign from "../../components/Card/ListCampaign/UserCampaign";

//   return data === null ? (
//     <Loading />
//   ) : (
//     <CampaignList
//       pageChange={pageChange}
//       totalPage={data.totalPage}
//       datas={data.campaignData}
//       page={pageQuery * 1}
//       searchHandle={searchHandle}
//       rowChange={rowChange}
//     />
//   );
// };

const defaultData = {
  statusCode: 200,
  data: {
    ID: null,
    Name: null,
    ImageURL: null,
    Description: "description",
    DepartmentID: null,
    ProjectID: null,
    Budget: 0,
    MaximumReceiver: 0,
    CoinNumber: 0,
    StartDate: new Date().toLocaleDateString(),
    EndDate: new Date().toLocaleDateString(),
    Deadline: new Date().toLocaleDateString(),
    Status: 1,
    CreatedBy: null,
    UpdatedBy: null,
    CreatedDate: new Date().toLocaleDateString(),
    UpdatedDate: new Date().toLocaleDateString(),
    MoocCampaigns: [],
    Groups: [],
    UserMasters: [],
  },
  message: "Success",
};

const CampaignListRemake = () => {
  const query = useQuery();
  const searchQuery = query.get("search");
  const rowQuery = query.get("row") || 9;
  const pageQuery = query.get("page") || 1;
  const { role } = useSelector((state) => state.UserSlice);
  const { URLchange } = useReplaceURL("/campaign-list/");
  const { url } = useRouteMatch();
  const { userID } = useSelector((state) => state.UserSlice);
  const path = useLocation().pathname;
  const { account } = useSelector((state) => state.UserSlice);
  function pageChange(page) {
    URLchange(page, rowQuery, searchQuery);
  }
  function rowChange(row) {
    URLchange(1, row, searchQuery);
  }
  function searchHandleUtil(search) {
    URLchange(1, rowQuery, "", search);
  }

  const [data] = useRefreshToken(
    getAllCampaign,
    pageQuery,
    rowQuery,
    searchQuery
  );
  const [dataActive] = useRefreshToken(
    getAllActiveCampaign,
    pageQuery,
    rowQuery,
    searchQuery
  );
  const [userCampaign] = useRefreshToken(
    getAllUserCampaign,
    userID,
    pageQuery,
    rowQuery,
    searchQuery
  );

  const [pageNum, setPageNum] = useState(1);
  const [test, setTest] = useState(1);
  if (data != null)
    if (data.totalPage == null || data.totalPage == 0) {
      data.totalPage = 1;
    }
  if (dataActive != null)
    if (dataActive.totalPage == null || dataActive.totalPage == 0) {
      dataActive.totalPage = 1;
    }
  if (userCampaign != null)
    if (userCampaign.totalPage == null || userCampaign.totalPage == 0) {
      userCampaign.totalPage = 1;
    }
  useEffect(() => {
    if (data != null && test == 1 && role == "Head") {
      setPageNum(data.totalPage);
    }
    if (dataActive != null && test == 1 && role != "Head") {
      setPageNum(dataActive.totalPage);
    }
    if (userCampaign != null && test == 2) {
      setPageNum(userCampaign.totalPage);
    }
  }, [data, dataActive, userCampaign]);
  const [header, setHeader] = useState("All Campaign");
  const [searchStatus, setSearchStatus] = useState("block");
  if (role == "Head") {
    return data === null ? (
      <Loading />
    ) : (
      <>
        <h1 style={{ textAlign: "center", color: "blue" }}>{header}</h1>
        <div className=" row m-4" style={{ height: "100px" }}>
          <div className="mx-4 col-4  " style={{ marginTop: "1%" }}>
            <Button
              className=" mx-4 py-2 px-4 bg-primary text-white border-0 rounded "
              variant="contained"
              hidden={role !== "Head"}
            >
              <Link
                className={`${path === `/campaign-detail/${0}`}`}
                to={`/campaign-detail/${0}`}
              >
                <span className="text-white">Create new</span>
              </Link>
            </Button>
          </div>
          <div style={{ display: `${searchStatus}` }} className="col-12">
            <CardTitleWithSearch
              searchHandle={searchHandleUtil}
              currentSearch={searchQuery}
            />
          </div>
        </div>

        <Tab.Container defaultActiveKey={"AllCampaign"}>
          <Nav as="ul" className="nav nav-tabs">
            <Nav.Item
              as="li"
              className="nav-item"
              onClick={() => {
                setPageNum(data.totalPage);
                setHeader("All Campaign");
                setSearchStatus("block"), setTest(1);
              }}
            >
              <Nav.Link to="#AllCampaign" eventKey="AllCampaign">
                All Campaign
              </Nav.Link>
            </Nav.Item>

            <Nav.Item
              as="li"
              className="nav-item"
              onClick={() => {
                setPageNum(userCampaign.totalPage),
                  setHeader("My Campaign"),
                  setSearchStatus("none"),
                  setTest(2);
              }}
            >
              <Nav.Link to="#YourCampaign" eventKey="YourCampaign">
                My Campaign
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane id="AllCampaign" eventKey="AllCampaign">
              {data !== null && (
                <>
                  {data.campaignListData.length === 0 ? (
                    <p style={{ textAlign: "center" }}>No Data</p>
                  ) : (
                    <AllCampaign AllCampaign={data} />
                  )}
                </>
              )}
            </Tab.Pane>
            <Tab.Pane id="YourCampaign" eventKey="YourCampaign">
              {userCampaign !== null && (
                <>
                  {userCampaign.campaignListData.length === 0 ? (
                    <p style={{ textAlign: "center" }}>No Data</p>
                  ) : (
                    <UserCampaign UserCampaign={userCampaign} />
                  )}
                </>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        <div className="col-12 mt-2 ">
          <div className="card-footer  bg-transparent border-0 border">
            <CustomPagination
              pageChange={pageChange}
              totalPage={pageNum}
              rowChange={rowChange}
            />
          </div>
        </div>
      </>
    );
  } else {
    return dataActive === null ? (
      <Loading />
    ) : (
      <>
        <h1 style={{ textAlign: "center", color: "blue" }}>{header}</h1>
        <div className="d-flex flex-row m-4">
          <div className="mx-4 col-2  ">
            <Button
              className=" mx-4 py-2 px-4 bg-primary text-white border-0 rounded "
              variant="contained"
              hidden={role !== "Head"}
            >
              <Link
                className={`${path === `/campaign-detail/${0}`}`}
                to={`/campaign-detail/${0}`}
              >
                <span className="text-white">Create new</span>
              </Link>
            </Button>
          </div>
        </div>
        <div
          style={{ display: `${searchStatus}` }}
          className="col-12 text-start"
        >
          <CardTitleWithSearch
            searchHandle={searchHandleUtil}
            currentSearch={searchQuery}
          />
        </div>
        <Tab.Container defaultActiveKey={"AllCampaign"}>
          <Nav as="ul" className="nav nav-tabs">
            <Nav.Item
              as="li"
              className="nav-item"
              onClick={() => {
                setPageNum(dataActive.totalPage),
                  setHeader("All Campaign"),
                  setSearchStatus("block"),
                  setTest(1);
              }}
            >
              <Nav.Link to="#AllCampaign" eventKey="AllCampaign">
                All Campaign
              </Nav.Link>
            </Nav.Item>

            <Nav.Item
              as="li"
              className="nav-item"
              onClick={() => {
                setPageNum(userCampaign.totalPage),
                  setHeader("My Campaign"),
                  setSearchStatus("none"),
                  setTest(2);
              }}
            >
              <Nav.Link to="#YourCampaign" eventKey="YourCampaign">
                My Campaign
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane id="AllCampaign" eventKey="AllCampaign">
              {dataActive !== null && (
                <>
                  {dataActive.campaignListData.length === 0 ? (
                    <p style={{ textAlign: "center" }}>No Data</p>
                  ) : (
                    <AllCampaign AllCampaign={dataActive} />
                  )}
                </>
              )}
            </Tab.Pane>
            <Tab.Pane id="YourCampaign" eventKey="YourCampaign">
              {userCampaign !== null && (
                <>
                  {userCampaign.campaignListData.length === 0 ? (
                    <p style={{ textAlign: "center" }}>No Data</p>
                  ) : (
                    <UserCampaign UserCampaign={userCampaign} />
                  )}
                </>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        <div className="col-12 mt-2 ">
          <div className="card-footer  bg-transparent border-0 border">
            <CustomPagination
              pageChange={pageChange}
              totalPage={pageNum}
              rowChange={rowChange}
            />
          </div>
        </div>
      </>
    );
  }

  // if(role !== "Member"){
  //   return data === null ? (
  //     <Loading />
  //   ) : (
  // <div className="d-flex flex-column">
  //   <div className="d-flex flex-row m-4">
  //     <h1 className="col-10 text-blue">All Campaign</h1>
  //     <div className="mx-4 col-2  ">
  //       <Button
  //         className=" mx-4 py-2 px-4 bg-primary text-white border-0 rounded "
  //         variant="contained"
  //         hidden={role !== "Head"}
  //       >
  //         <Link
  //           className={`${path === `/campaign-detail/${0}`}`}
  //           to={`/campaign-detail/${0}`}

  //         >
  //           <span className="text-white">Create new</span>
  //         </Link>
  //       </Button>
  //     </div>

  //   </div>
  //   <div className="col-12 text-start">
  //         <CardTitleWithSearch
  //           searchHandle={searchHandleUtil}
  //           currentSearch={searchQuery}
  //         />
  //       </div>
  //   <div
  //     className=" d-flex flex-column border px-4 "
  //     style={{ minHeight: 600 }}
  //   >
  //     <div className=" row py-2">
  //       {data.campaignListData.map((i) =>
  //         (i.Status !== 3 || role === "Head" ) ? (
  //           <CampaignCard className="" datas={i} key={i.ID} />
  //         ) : (
  //           <></>
  //         )
  //       )}
  //     </div>
  //   </div>
  //   <div className="col-12 mt-2 ">
  //       <div className="card-footer  bg-transparent border-0 border">
  //         <CustomPagination
  //           pageChange={pageChange}
  //           totalPage={data.totalPage}
  //           rowChange={rowChange}
  //         />
  //       </div>
  //     </div>
  // </div>
  //   );
  // }
  // else{
  //   return dataActive === null ? (
  //     <Loading />
  //   ) : (

  //     <div className="d-flex flex-column">
  //       <div className="d-flex flex-row m-4">
  //         <h1 className="col-10 text-blue">All Campaign</h1>
  //         <div className="mx-4 col-2  ">
  //           <Button
  //             className=" mx-4 py-2 px-4 bg-primary text-white border-0 rounded "
  //             variant="contained"
  //             hidden={role !== "Head"}
  //           >
  //             <Link
  //               className={`${path === `/campaign-detail/${0}`}`}
  //               to={`/campaign-detail/${0}`}

  //             >
  //               <span className="text-white">Create new</span>
  //             </Link>
  //           </Button>
  //         </div>

  //       </div>
  //       <div className="col-12 text-start">
  //             <CardTitleWithSearch
  //               searchHandle={searchHandleUtil}
  //               currentSearch={searchQuery}
  //             />
  //           </div>
  //       <div
  //         className=" d-flex flex-column border px-4 "
  //         style={{ minHeight: 600 }}
  //       >
  //         <div className=" row py-2">
  //           {dataActive.campaignListData.map((i) =>
  //             (i.Status !== 3 || role === "Head" ) ? (
  //               <CampaignCard className="" datas={i} key={i.ID} />
  //             ) : (
  //               <></>
  //             )
  //           )}
  //         </div>
  //       </div>
  //       <div className="col-12 mt-2 ">
  //           <div className="card-footer  bg-transparent border-0 border">
  //             <CustomPagination
  //               pageChange={pageChange}
  //               totalPage={dataActive.totalPage}
  //               rowChange={rowChange}
  //             />
  //           </div>
  //         </div>
  //     </div>
  //   );
  // }
};
export default CampaignListRemake;
