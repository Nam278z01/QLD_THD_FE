import React from "react";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getGroupCampaignDetail } from "../../../../services/GroupCampaignAPI";
const GroupTotalMembers = ({
  id
}) => {
 
  
  
    const [group] = useRefreshToken(
        getGroupCampaignDetail,
      id,
    );
    
  return group===null ?<></>  : (
    <><h5 className="m-2 text-blue">
    Total Member:
    <text className=" m-2 text-ellipsis">
      {" "}
      {group.UserMasters.length}
    </text>
  </h5></>
  );
};

export default GroupTotalMembers;
