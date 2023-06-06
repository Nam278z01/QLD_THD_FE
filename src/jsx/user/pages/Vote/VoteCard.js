import { ProgressBar } from "react-bootstrap";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import {
  voteForNickname,
  voteForNicknameFirst,
} from "../../../../services/NicknameAPI";

const Vote = ({
  nickname,
  totalVote,
  whatIVoted,
  getToken,
  className,
  deleteNickName,
  success,
}) => {
  const percentVote =
    +nickname.total_vote === 0
      ? 0
      : Math.round((+nickname.total_vote / totalVote) * 100);

  const { account, userID } = useSelector((a) => a.UserSlice);

  const found = whatIVoted.find((vote) => {
    return vote.NicknameID === nickname.ID;
  });

  function SetVote(voteType, nicknameID) {
    const body = {
      UserMasterID: userID,
      NicknameID: nickname.ID,
      Vote: voteType,
    };

    if (whatIVoted.findIndex((vote) => vote.NicknameID === nicknameID) > -1) {
      getToken(voteForNickname, false, success, false, body);
    } else {
      getToken(voteForNicknameFirst, false, success, false, body);
    }
  }

  return (
    <div
      className={`d-flex justify-content-center align-items-center ${className} w-100 border border-1 rounded-3 p-2`}
      style={{
        backgroundColor:
          found && found.Vote !== 2 && found.Vote === true
            ? "#bfdbfe"
            : " #fafafa",
      }}
    >
      <div className="col-11">
        <label
          className="align-items-center d-flex mousePointer m-0 w-100"
          htmlFor={`flexCheckDefault ${nickname.Name}`}
        >
          <input
            type="checkbox"
            className="form-check-input d-none"
            defaultChecked={found && found.Vote !== 2 && found.Vote === true}
            id={`flexCheckDefault ${nickname.Name}`}
            onChange={(e) => {
              if (e.target.checked) {
                SetVote(1, nickname.ID);
              } else {
                SetVote(2, nickname.ID);
              }
            }}
          />
          <div className="row justify-content-between align-items-center w-100 p-0">
            <div className="col-9 p-0 ps-3">
              <h6 className="mb-1 m-0 text-cyan ms-1 mb-2">{nickname.Name}</h6>
              <div className="w-100">
                <ProgressBar
                  striped
                  now={percentVote}
                  style={{ height: "1.25rem" }}
                />
                {/* <p className="m-0 text-cyan ms-1" style={{ fontSize: "13px" }}>
                  VietCD1,...
                </p> */}
              </div>
            </div>

            <div className="col-3 p-0 text-end">
              <h6 className="m-0 ms-3 user-select-none text-cyan">
                {percentVote}%{" "}
                {nickname.total_vote === null
                  ? "(0)"
                  : `(${nickname.total_vote})`}
              </h6>
            </div>
          </div>
        </label>
      </div>
      <div className="col-1 justify-content-center d-flex">
        {account === nickname.CreatedBy ? (
          <a
            className="btn btn-secondary btn-xs sharp d-flex align-items-center justify-content-center"
            onClick={() =>
              swal({
                title: "Are you sure?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              }).then((willDelete) => {
                if (willDelete) {
                  deleteNickName(nickname.ID);
                }
              })
            }
          >
            <i className="fa fa-trash"></i>
          </a>
        ) : (
          <a className="btn btn-secondary btn-xs sharp d-flex align-items-center justify-content-center bg-transparent border-0 pe-none">
            <i className="fa fa-trash opacity-0"></i>
          </a>
        )}
      </div>
    </div>
  );
};
export default Vote;
