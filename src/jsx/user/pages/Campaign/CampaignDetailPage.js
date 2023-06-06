import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import {
  getOneCampaign,
  deleteCampaign,
  activeCampaign,
} from "../../../../services/CampaignAPI";
import Loading from "../../../sharedPage/pages/Loading";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import BasicInfo from "./BasicInfo";
import CampaignGroupList from "./CampaignGroupList";
import CampaignMemberList from "./CampaignMemberList";
import CampaignMoocList from "./CampaignMoocList";


const CampaignDetailPage = () => {
  const { DepartmentID } = useSelector((state) => state.DepartmentSettingSlice);


  const [defaultData,setDefaultData] =useState({
    ID: 0,
    Name: null,
    ImageURL: null,
    Description: "",
    DepartmentID: DepartmentID,
    ProjectID: null,
    Budget: 0,
    MaximumReceiver: 0,
    CoinNumber: 0,
    StartDate: new Date().toJSON(),
    EndDate: new Date().toJSON(),
    Deadline: new Date().toJSON(),
    Status: 1,
    CreatedBy: null,
    UpdatedBy: null,
    CreatedDate: new Date().toJSON(),
    UpdatedDate: new Date().toJSON(),
    MoocCampaigns: [],
    Groups: [],
    UserMasters: [],
  });
  // console.log("default data: ",defaultData);
  const { role } = useSelector((state) => state.UserSlice);
  const [first, setFirst] = useState(true);
  const navigate = useHistory();
  const id = useParams().ID;
  const ID = parseInt(id);

  const [data, setRefresh, setData] = useRefreshToken(getOneCampaign, ID);
  const { getToken } = useContext(GetTokenContext);

  const closeCampaign = (ID) => {

    function success() {
      navigate.replace(`/campaign-list`);
    }

    getToken(
      deleteCampaign,
      "Campaign has been close",
      success,
      false,
      ID
    );
  };

  // const reactiveCampaign = (ID) => {

  //   function success() {
  //     navigate.replace(`/campaign-list`);
  //   }

  //   getToken(
  //     activeCampaign,
  //     "Campaign Has Been Reactive",
  //     success,
  //     false,
  //     ID
  //   );
  // };
  const cloneCampaign = (ID) => {

      navigate.replace(`/campaign-clone/${ID}`);
  
  };

  useEffect(() => {
    
    if (first && data !== null) {
      setFirst(false);
    } else if (first && ID === 0) {
      setData(defaultData);
      setFirst(false);
    }
  }, [data]);

  return data === null ? (
    <Loading />
  ) : (
    <div className="col">
      <div className="row">
        <h1 className="col-10 text-blue" hidden={ID === 0}>Campaign Detail</h1>
        <h1 className="col-10 text-blue" hidden={ID != 0}>Create Campaign</h1>
        <div className="col">
          <button
            className="mx-4 py-2 px-4 bg-warning text-dark border-0 rounded"
            hidden={ID === 0 || role !== "Head" || data.Status !==1}
            onClick={() => {
              closeCampaign(ID);
            }}
          >
            <h5 className="text-white">End Campaign</h5>
          </button>
          {/* <button
            className="mx-4 py-2 px-4 bg-success text-dark border-0 rounded"
            hidden={ID === 0 || role !== "Head" || data.Status !== 3}
            onClick={() => {
              reactiveCampaign(ID);
            }}
          >
            <h5 className="text-white">Reactive Campaign</h5>
          </button> */}
          <button
            className="mx-4 py-2 px-4 bg-success text-dark border-0 rounded"
            hidden={ID === 0 || role !== "Head" || data.Status !== 3}
            onClick={() => {
              cloneCampaign(ID);
            }}
          >
            <h5 className="text-white">Clone Campaign</h5>
          </button>
        </div>
      </div>
      
      <div className="col border">

        <BasicInfo basicDatas={data} ></BasicInfo>
        <hr hidden={ID == 0}></hr>
        <div className="row m-4">
            <CampaignGroupList datas={data}></CampaignGroupList> 
            <CampaignMemberList datas={data}></CampaignMemberList>
        </div>
        <CampaignMoocList datas={data}></CampaignMoocList>
        
      </div>
    </div>
  );
};

export default CampaignDetailPage;
