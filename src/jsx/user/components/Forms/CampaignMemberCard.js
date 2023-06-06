import CampaignMemberCheckBox from "./CampaignMemberCheckBox";

const CampaignMemberCard = () => {
  return (
    <div className="col-4">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Applied for Member</h4>
        </div>

        <div className="card-body">
          {[1, 2, 3, 4, 5].map((x) => (
            <CampaignMemberCheckBox setUserApplied={setUserApplied} data={x} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignMemberCard;
