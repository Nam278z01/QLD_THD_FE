import { Link, useLocation, useRouteMatch } from "react-router-dom";
import { getAllCampaignMember } from "../../../../services/CampaignAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";

const UserCampaignCard = ({ datas }) => { 
  const [allCampaignMembers] = useRefreshToken(getAllCampaignMember, datas.ID);
  const [allCompletedCampaignMembers] = useRefreshToken(getAllCampaignMember, datas.ID,5);
  if(allCampaignMembers!==null&&allCompletedCampaignMembers!==null)
  return (
    <div className="col-4 my-2">
      <div className=" py-4 align-items-center  p-2 border bg-light rounded">
        <div className="d-flex flex-row">
          <h4 className="text-primary text-weight ">
            <Link
              className="col-4 my-2 text-decoration-none"
              to={`/campaign-detail/${datas.ID}`}
            > 
              <span  title={datas.Name.length>35?datas.Name:""} className="m-2" style={{fontSize:"1.15vw"}}> {datas.Name.length<=35?datas.Name:datas.Name.substring(0,35)+"..."}</span>
            </Link>
          </h4>
          <p class=" text-xs badge badge-secondary " hidden={datas.Status != 1} >Active</p>
          <p class=" text-xs badge badge-warning " hidden={datas.Status != 3} >Close</p>
        </div>
        <div className="row m-2 text-blue" >
          Description:
          <text title={datas.Description.length>40?datas.Description:""} className="col-10 text-black text-truncate" style={{fontSize:"0.9vw"}}> {datas.Description.length<=40?datas.Description:datas.Description.substring(0,40)+"..."}</text>
        </div>
        {/* <div className="m-2 text-blue" style={{ minHeight: 45 }}>
          Group:
          
        </div> */}
        <h5 className="m-2 text-blue">
          Completed Members:  
          <text className=" m-2 text-ellipsis"> {allCompletedCampaignMembers.total}/{allCampaignMembers.total}  {allCampaignMembers.total!==0?("("+(Math.floor(allCompletedCampaignMembers.total/allCampaignMembers.total*100))+"%)"):""}</text>
        </h5>
        <div className="d-flex flex-row m-2">
          <button className="col-4 mx-2 text-white border-0 bg-blue rounded">
            <text className="m-2">Notice to in-completed</text>
          </button>
          <button className="col-4 mx-2 text-white border-0 bg-blue rounded">
            <text className="m-2">Honor the 3 first member</text>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCampaignCard;
