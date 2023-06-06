import GroupCard from "../../components/Card/GroupCard";
import { useState } from 'react';
import GroupDetailPage from "../Campaign/CampaignDetailPage"
import PersonalCampaignCard from "../../components/Card/PersonalCampaignCard";
const CampaignStats = () =>{
    
    return (
      <div className="d-flex flex-column">
        <div className="d-flex flex-row m-4">
          <h1 className="col-10 text-blue">My Stats</h1>
        </div>

        <div className=" d-flex flex-column border px-4" style={{minHeight: 600}}>
          <div className=" row py-2"> 
            <PersonalCampaignCard/>
            <PersonalCampaignCard/>
            <PersonalCampaignCard/>
            <PersonalCampaignCard/>
            <PersonalCampaignCard/>
            <PersonalCampaignCard/>
            <PersonalCampaignCard/>
          </div>
        </div>
      </div>
    )
  };
  export default CampaignStats