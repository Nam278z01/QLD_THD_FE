import { useState,useEffect } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useContext } from "react";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getGroupList,getUserGroupList } from "../../../../services/GroupCampaignAPI";
import Loading from "../../../sharedPage/pages/Loading";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import GroupCampaignDetailModal from "../../components/modal/GroupCampaignDetailModal";
import { useSelector } from "react-redux";
import { Dropdown } from "react-bootstrap";
import { updateGroupCampaign } from "../../../../services/GroupCampaignAPI";
import useQuery from "../../../../Hook/useQuery";
import CustomPagination from "../../components/Shared/CustomPagination";
import useReplaceURL from "../../../../Hook/useReplaceURL";
import CardTitleWithSearch from "../../components/Card/CardTitleWithSearch";
import { Tab, Nav } from "react-bootstrap";
import GroupListCard from "../../components/Card/GroupListCard";
import GroupCard from "../../components/Card/GroupCard";
const GroupList = (searchHandle) => {
  const query = useQuery();
  const { URLchange } = useReplaceURL(`/group-list`);
  const searchQuery = query.get("search");
  const pageQuery = query.get("page") || 1;
  const rowQuery = query.get("row") || 9;
  const navigate = useHistory();
  const [show, setShow] = useState(false);
  const [groupcampaignID, setgroupcampaignID] = useState(null);
  const { role } = useSelector((state) => state.UserSlice);
  const { userID } = useSelector((state) => state.UserSlice);

  const { getToken, getTokenFormData } = useContext(GetTokenContext);
  const [ListGroup, setRefresh] = useRefreshToken(
    getGroupList,
    pageQuery,
    rowQuery,
    searchQuery
  );

  const [ListUserGroup, setRefresh2] = useRefreshToken(
    getUserGroupList,
    userID,
    pageQuery,
    rowQuery,
    searchQuery
  );
  const goToDetail = (id) => {
    setgroupcampaignID(id);
    setShow(true);
  };
  function pageChange(page) {
    URLchange(page, rowQuery, searchQuery);
  }
  function rowChange(row) {
    URLchange(1, row, searchQuery);
  }
  function searchHandleUtil(search) {
    URLchange(1, rowQuery, "", search);
  }
  const changeStatusgroup = (number, ID) => {
    const success = () => {
      setRefresh(new Date());
    };

    getToken(updateGroupCampaign, "Update success", success, false, ID, {
      GroupData: { Status: number },
    });
  };

  const [pageNum, setPageNum] = useState(1);
  const [test, setTest] = useState(1);
  if (ListGroup != null)
  if (ListGroup.totalPage == null || ListGroup.totalPage == 0) {
    ListGroup.totalPage = 1;
  }
if (ListUserGroup != null)
  if (ListUserGroup.totalPage == null || ListUserGroup.totalPage == 0) {
    ListUserGroup.totalPage = 1;
  }
  const[header,setHeader] = useState("All Group");
  const[searchStatus,setSearchStatus] = useState("block");
  useEffect(() => {
    if (ListGroup != null && test == 1) {
      setPageNum(ListGroup.totalPage);
    }
    if (ListUserGroup != null && test == 2) {
      setPageNum(ListUserGroup.totalPage);
    }
  }, [ListGroup,ListUserGroup]);
  
  return <>
<h1 style={{textAlign:"center",color:"blue"}}>{header}</h1>
<div  className=" row"  style={{height:"100px"}}>

              <div className="col-2 text-start mt-3 " >
                {role === "Head" && (
                  <Button
                    onClick={(e) => {
                      e.target.blur();
                      navigate.push("/create-groupcampaign");
                    }}
                  >
                    New Group <i className="fas fa-plus" />
                  </Button>
                )}
              </div>
          <div style={{display:`${searchStatus}`}}  className="col-12">
          <CardTitleWithSearch
            searchHandle={searchHandleUtil}
            currentSearch={searchQuery}
          />
          </div>
          
        </div>

  <Tab.Container defaultActiveKey={"AllGroup"}>
          <Nav as="ul" className="nav nav-tabs">
            <Nav.Item
              as="li"
              className="nav-item"
              onClick={() => {setPageNum(ListGroup.totalPage),setHeader("All Group"),setSearchStatus("block"),setTest(1)}}
            >
              <Nav.Link to="#AllGroup" eventKey="AllGroup">
              All Group
              </Nav.Link>
            </Nav.Item>

            <Nav.Item
              as="li"
              className="nav-item"
              onClick={() => {setPageNum(ListUserGroup.totalPage),setHeader("My Group"),setSearchStatus("none"),setTest(2)}}
            >
              <Nav.Link to="#YourGroup" eventKey="YourGroup">
              My Group
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane id="AllGroup" eventKey="AllGroup">
            <GroupListCard ListGroup={ListGroup} setRefresh={setRefresh} />
            </Tab.Pane>
            <Tab.Pane id="YourGroup" eventKey="YourGroup">
            <GroupListCard ListGroup={ListUserGroup} setRefresh={setRefresh2} />
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
};
export default GroupList;
