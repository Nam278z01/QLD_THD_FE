import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import BUlInfoCard from "./BULInfoCard";

function BULListCard({ depaDetail, setShow, BUList, setRefresh }) {
  const { DefaultHead } = useSelector((a) => a.DepartmentSettingSlice);
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="m-0">{depaDetail.Code} Head List </h5>
      </div>

      <div className="card-body">
        {BUList.length === 0 ? (
          <h6 className="text-center text-secondary">EMPTY</h6>
        ) : (
          BUList.map((BUL, i) => (
            <BUlInfoCard
              info={BUL}
              key={i}
              setRefresh={setRefresh}
              isDefault={BUL.ID === DefaultHead.HeadID}
            />
          ))
        )}
      </div>

      <div className="card-footer">
        <Button
          onClick={(e) => {
            e.target.blur();
            setShow(true);
          }}
        >
          Add Head <i className="far fa-plus" />
        </Button>
      </div>
    </div>
  );
}

export default BULListCard;
