import "./App.css";
import Vote from "./VoteCard";

const VotePage = ({
  nickNameData,
  whatIVoted,
  getToken,
  deleteNickName,
  success,
}) => {
  const totalVote = nickNameData.reduce((pre, current) => {
    return pre + +current.total_vote;
  }, 0);

  return (
    <div className="w-100">
      {nickNameData.map((nickname, i) => (
        <Vote
          success={success}
          nickname={nickname}
          key={`flexCheckDefault ${nickname.Name}`}
          totalVote={totalVote}
          whatIVoted={whatIVoted}
          getToken={getToken}
          className={i < nickNameData.length - 1 && "mb-2"}
          deleteNickName={deleteNickName}
        />
      ))}
    </div>
  );
};

export default VotePage;
