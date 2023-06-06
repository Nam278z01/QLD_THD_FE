import { UserMaster } from "../../../../dataConfig";

const CampaignMemberCheckBox = ({ setUserApplied, data, userApplied }) => {
  const { UserMaster: Person } = data;
  return (
    <div className="card mb-2 p-2">
      <div className="style-1 bg-white form-check d-flex align-items-center">
        <input
          defaultChecked={userApplied.indexOf(Person.ID) > -1}
          type="checkbox"
          id={Person.ID}
          className="me-2 form-check-input"
          onClick={(e) => {
            if (e.target.checked) {
              setUserApplied((state) => [...state, Person.ID]);
            } else {
              setUserApplied((state) => {
                return state.filter((x) => x !== Person.ID);
              });
            }
          }}
        />
        <label htmlFor={Person.ID} className="m-0 w-100 row">
          <div className="m-0 col-6">
            <strong>{Person.Account}</strong> (
            {UserMaster.JobTitle[Person.JobTitle - 1]})
          </div>
          <div className="m-0 col-6">
            <strong>Role: </strong>
            {UserMaster.Role[Person.Role - 1]}
          </div>
        </label>
      </div>
    </div>
  );
};

export default CampaignMemberCheckBox;
