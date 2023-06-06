import { imgServer, scopes } from "../../../../dataConfig";
import { useMsal } from "@azure/msal-react";
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import {
  getUserBadgeAll,
  giveBadge,
  removeBadge,
} from "../../../../services/BadgeAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { useState } from "react";
import "./TheBadgeCard.css";
import { useEffect } from "react";
import Loading from "../../../sharedPage/pages/Loading";
import Swal from "sweetalert2";
import LoadingModal from "../modal/LoadingModal";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useContext } from "react";

const TheBadgeCard = ({ badges, userID }) => {
  const { instance, inProgress, accounts } = useMsal();

  const [show, setShow] = useState(false);

  const [draggedHad, setDraggedHad] = useState();
  const [draggedNotHad, setDraggedNotHad] = useState();

  const [userBadge] = useRefreshToken(getUserBadgeAll, userID);

  const [hadBadge, setHadBadge] = useState(userBadge);
  const [notHadBadge, setNotHadBadge] = useState([]);

  const { getToken } = useContext(GetTokenContext);

  useEffect(() => {
    setHadBadge(userBadge);

    if (userBadge !== null) {
      setNotHadBadge(
        badges.filter(
          (x) => userBadge.findIndex((badges) => badges.ID === x.ID) === -1
        )
      );
    }
  }, [userBadge]);

  function success() {
    setShow(false);
  }

  function getTokenDelete(api, para) {
    setShow(true);
    if (inProgress === InteractionStatus.None) {
      const accessTokenRequest = {
        scopes: scopes,
        account: accounts[0],
      };
      instance
        .acquireTokenSilent(accessTokenRequest)
        .then((accessTokenResponse) => {
          // Acquire token silent success
          let accessToken = accessTokenResponse.accessToken;
          let token = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            data: para,
          };

          // Call your API with token
          api(token)
            .then((res) => {
              setShow(false);
            })
            .catch(function (error) {
              Swal.fire({
                icon: "error",
                title: error,
              });
              setShow(false);
              // Acquire token interactive failure
            });
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance
              .acquireTokenPopup(accessTokenRequest)
              .then(function (accessTokenResponse) {
                // Acquire token interactive success
                let accessToken = accessTokenResponse.accessToken;
                let token = {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                  data: para,
                };

                api(token)
                  .then((res) => {
                    setShow(false);
                  })
                  .catch(function (error) {
                    Swal.fire({
                      icon: "error",
                      title: error,
                    });
                    setShow(false);
                    // Acquire token interactive failure
                  });
              })
              .catch(function (error) {
                Swal.fire({
                  icon: "error",
                  title: error,
                });
                setShow(false);
                // Acquire token interactive failure
              });
          } else {
            Swal.fire({
              icon: "error",
              title: error,
            });
            setShow(false);
          }
        });
    }
  }

  function giveBadges(BadgeID) {
    const userBadgeArray = BadgeID;

    const body = { BadgeID: userBadgeArray, UserMasterID: userID };

    getToken(giveBadge, false, success, success, body);
  }

  function removeBadges(IDLink) {
    const userBadgeArray = [IDLink];

    const body = { UserBadgeID: userBadgeArray };

    getTokenDelete(removeBadge, body);
  }

  const onDragStartHad = (e, index) => {
    setDraggedHad(hadBadge[index]);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const onDragStartNotHad = (e, index) => {
    setDraggedNotHad(notHadBadge[index]);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const onDragOverHad = (e) => {
    e.preventDefault();
    if (draggedHad) {
      return;
    }
    document.getElementById("had").classList.add("badgeCard");
  };

  const onDragOverNotHad = (e) => {
    e.preventDefault();
    if (draggedNotHad) {
      return;
    }
    document.getElementById("nothad").classList.add("badgeCard");
  };

  const onDropHad = (e) => {
    e.preventDefault();
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
    if (draggedHad) {
      return;
    }

    giveBadges(draggedNotHad.ID);

    // filter out the currently dragged item
    const items = hadBadge.filter((item) => item.ID !== draggedNotHad.ID);

    // add the dragged item after the dragged over item
    items.push(draggedNotHad);
    setNotHadBadge(notHadBadge.filter((item) => item.ID !== draggedNotHad.ID));
    setHadBadge(items);
  };

  const onDropNotHad = (e) => {
    e.preventDefault();
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
    if (draggedNotHad) {
      return;
    }

    removeBadges(draggedHad.IDLink);

    // filter out the currently dragged item

    const items = notHadBadge.filter((item) => item.ID !== draggedHad.ID);

    // add the dragged item after the dragged over item
    items.push(draggedHad);
    setHadBadge(hadBadge.filter((item) => item.ID !== draggedHad.ID));
    setNotHadBadge(items);
  };

  const onDragEnd = () => {
    setDraggedHad();
    setDraggedNotHad();
  };

  return hadBadge === null || userBadge === null ? (
    <Loading />
  ) : (
    <>
      <LoadingModal show={show} setShow={setShow} />
      <div className="mt-3">
        <h6 className="text-center">The Badge Giver</h6>
        <div className="row">
          <div className="col-6">
            <div
              className="card m-0 pt-2"
              style={{ minHeight: "100%" }}
              onDragOver={(e) => {
                onDragOverNotHad(e);
              }}
              onDragLeave={(e) => {
                document.getElementById("nothad").classList.remove("badgeCard");
              }}
              onDrop={onDropNotHad}
            >
              <div className="card p-2 text-center border border-1 border-secondary position-absolute top-0 start-50 translate-middle user-select-none">
                <h6 className="m-0">Not Recived</h6>
              </div>
              <div className="card-body h-100" id="nothad">
                <div className=" d-flex flex-wrap gap-2 justify-content-center">
                  {notHadBadge.map((badge, i) => {
                    return (
                      <div
                        draggable
                        onDragStart={(e) => {
                          onDragStartNotHad(e, i);
                        }}
                        onDragEnd={onDragEnd}
                        className="d-inline border border-2 rounded-2 mousePointer"
                        key={i}
                        badgeid={badge.ID}
                        title={badge.description}
                      >
                        <img
                          src={`${imgServer}${badge.ImageURL}`}
                          style={{ height: "50px", width: "50px" }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div
              className="card m-0 pt-2 "
              style={{ minHeight: "100%" }}
              onDragOver={(e) => {
                onDragOverHad(e);
              }}
              onDragLeave={(e) => {
                document.getElementById("had").classList.remove("badgeCard");
              }}
              onDrop={onDropHad}
            >
              <div className="card p-2 text-center border border-1 border-secondary position-absolute top-0 start-50 translate-middle user-select-none">
                <h6 className="m-0">Recived</h6>
              </div>
              <div className="card-body h-100" id="had">
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  {hadBadge.map((badge, i) => (
                    <div
                      id="the_badge"
                      draggable
                      onDragStart={(e) => {
                        onDragStartHad(e, i);
                      }}
                      onDragEnd={onDragEnd}
                      className="d-inline border border-2 rounded-2 mousePointer"
                      key={i}
                      badgeid={badge.ID}
                      title={badge.Description}
                    >
                      <img
                        src={`${imgServer}${badge.ImageURL}`}
                        style={{ height: "50px", width: "50px" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TheBadgeCard;
