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

const cloneCampaign = () => {
  const { role } = useSelector((state) => state.UserSlice);
  const { DepartmentID } = useSelector((state) => state.DepartmentSettingSlice);
  const [first, setFirst] = useState(true);
  const navigate = useHistory();
  const [defaultData, setDefaultData] = useState(null);
  const id = useParams().ID;
  const ID = parseInt(id);
  var date = new Date();
  date.setDate(date.getDate() + 1);
  const [data, setRefresh, setData] = useRefreshToken(getOneCampaign, ID);

  const { getToken } = useContext(GetTokenContext);

  const closeCampaign = (ID) => {
    function success() {
      navigate.replace(`/campaign-list`);
    }

    getToken(deleteCampaign, "Campaign has been close", success, false, ID);
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

  useEffect(() => {
    if (data !== null)
      if (data.UserMasters !== null)
        setDefaultData({
          ID: 0,
          Name: data.Name,
          ImageURL: data.ImageURL,
          Description: data.Description,
          DepartmentID: data.DepartmentID,
          ProjectID: data.ProjectID,
          Budget: data.Budget,
          MaximumReceiver: data.MaximumReceiver,
          CoinNumber: data.CoinNumber,
          StartDate: new Date().toJSON(),
          EndDate: date.toJSON(),
          Deadline: date.toJSON(),
          Status: 1,
          CreatedBy: data.CreatedBy,
          UpdatedBy: null,
          CreatedDate: new Date().toJSON(),
          UpdatedDate: new Date().toJSON(),
          MoocCampaigns: [],
          Groups: [],
          UserMasters: [],
        });
  }, [data]);

  return defaultData === null ? (
    <Loading />
  ) : (
    <div className="col">
      <div className="row">
        <h1 className="col-10 text-blue" hidden={defaultData.ID === 0}>
          Campaign Detail
        </h1>
        <h1 className="col-10 text-blue" hidden={defaultData.ID != 0}>
          Create Campaign
        </h1>
        <div className="col">
          <button
            className="mx-4 py-2 px-4 bg-warning text-dark border-0 rounded"
            hidden={
              defaultData.ID === 0 ||
              role !== "Head" ||
              defaultData.Status !== 1
            }
            onClick={() => {
              closeCampaign(defaultData.ID);
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
        </div>
      </div>

      <div className="col border">
        <BasicInfo basicDatas={defaultData}></BasicInfo>
        <hr hidden={defaultData.ID == 0}></hr>
        <div className="row m-4">
          <CampaignGroupList datas={defaultData}></CampaignGroupList>
          <CampaignMemberList datas={defaultData}></CampaignMemberList>
        </div>
        <CampaignMoocList datas={defaultData}></CampaignMoocList>
      </div>
    </div>
  );
};

export default cloneCampaign;
