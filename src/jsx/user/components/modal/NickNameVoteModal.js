import { useRef } from "react";
import { Modal } from "react-bootstrap";
import useRefreshToken from "../../../../Hook/useRefreshToken";

import {
  findAllUserNickname,
  createNickName,
  getWhatIVote,
  deleteNickname,
} from "../../../../services/NicknameAPI";

import Loading from "../../../sharedPage/pages/Loading";
import VotePage from "../../pages/Vote/VotePage";
import { useMsal } from "@azure/msal-react";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";

export default function NickNameVoteModal({
  show,
  setShow,
  userID,
  account,
  setRefresh,
}) {
  const myUserID = useSelector((a) => a.UserSlice.userID);
  const nickNameRef = useRef();
  const [nickNameData, setRefresh3] = useRefreshToken(
    findAllUserNickname,
    userID
  );
  const [whatIVoted, setRefresh2] = useRefreshToken(
    getWhatIVote,
    userID,
    myUserID
  );

  const { getToken } = useContext(GetTokenContext);

  const success = () => {
    setRefresh3(new Date());
    setRefresh2(new Date());
    setRefresh(new Date());
  };

  const addNickName = (Name) => {
    const body = { UserMasterID: userID, Name };

    getToken(createNickName, "Nickname has been created", success, false, body);
  };

  const deleteNickName = (nicknameID) => {
    getToken(
      deleteNickname,
      "Nickname has been deleted",
      success,
      false,
      nicknameID
    );
  };

  return (
    <Modal
      show={show}
      centered
      onHide={() => {
        setShow(false);
      }}
      size="md"
      scrollable={true}
    >
      <Modal.Header closeButton>
        <h6 className="m-0"> {account} Nickname</h6>
      </Modal.Header>

      {nickNameData === null || whatIVoted === null ? (
        <Modal.Body>
          <Loading />
        </Modal.Body>
      ) : (
        nickNameData.length !== 0 && (
          <Modal.Body>
            <VotePage
              nickNameData={nickNameData}
              whatIVoted={whatIVoted}
              getToken={getToken}
              deleteNickName={deleteNickName}
              success={success}
            />
          </Modal.Body>
        )
      )}

      {nickNameData !== null &&
        myUserID !== userID &&
        nickNameData.length < 10 && (
          <Modal.Footer className="bg-gray">
            <form
              className="align-items-center d-flex w-100 gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                addNickName(nickNameRef.current.value);
              }}
            >
              <input
                type="text"
                className="form-control h-25 m-0"
                ref={nickNameRef}
              />
              <button className="btn btn-primary" type="submit">
                Add
              </button>
            </form>
          </Modal.Footer>
        )}
    </Modal>
  );
}
