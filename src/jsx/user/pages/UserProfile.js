import { Button, Tab, Nav } from "react-bootstrap";
import "../../../css/user-profile.css";
import defaultBadge from "../../../images/badge/badge(2).png";

//** Import Image */
import useRefreshToken from "../../../Hook/useRefreshToken";
import { getOneUserMasterByAccount } from "../../../services/UsermasterAPI";

import {
  getUserBadgeInOrder,
  get3UserBadge,
  getUserBadgeAll,
} from "../../../services/BadgeAPI";

import defaultImg from "../../../images/Default.png";
import AvatarEditModal from "../components/modal/AvatarEditModal";
import { useState } from "react";
import cover from "../../../images/cover.jpg";
import { useParams } from "react-router-dom";
import InfoTab from "../components/userProfileComp/InfoTab";
import MoreInfoTab from "../components/userProfileComp/MoreInfoTab";
import { useSelector } from "react-redux";
import SkillTab from "../components/userProfileComp/SkillTab";
import { imgServer } from "../../../dataConfig";
import Loading from "../../sharedPage/pages/Loading";
import NickNameVoteModal from "../components/modal/NickNameVoteModal";
import BadgesEditToShowModal from "../components/modal/BadgesEditToShowModal";
import { badgeClasses } from "@mui/material";
import { findAllUserNickname } from "../../../services/NicknameAPI";

const UserProfile = () => {
  const { account } = useParams();
  const userAccount = useSelector((state) => state.UserSlice.account);
  const departmentID = useSelector((state) => state.UserSlice.userDepartmentID);
  const [data, setRefresh] = useRefreshToken(
    getOneUserMasterByAccount,
    account
  );

  const [votedNickname] = useRefreshToken(
    findAllUserNickname,
    data != null ? data.ID : 1000,
    departmentID
  );

  const [badges3, setRefresh3] = useRefreshToken(
    getUserBadgeInOrder,
    data !== null ? data.ID : 1000
  );
  const [badges] = useRefreshToken(
    getUserBadgeAll,
    data !== null ? data.ID : 1000
  );

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);

  return data === null ||
    data === undefined ||
    badges === null ||
    badges3 === null ||
    votedNickname === null ||
    account !== data.Account ? (
    <Loading />
  ) : (
    <>
      <AvatarEditModal show={show} setShow={setShow} setRefresh={setRefresh} />
      <NickNameVoteModal
        userID={data.ID}
        account={data.Account}
        show={show2}
        setShow={setShow2}
      />
      <BadgesEditToShowModal
        show={show3}
        setShow={setShow3}
        setRefresh={setRefresh3}
        Badges={badges}
      />
      <div className="position-relative vh-100">
        <div className="w-100" style={{ paddingTop: "12%" }}>
          <div className="row justify-content-center">
            <div className="col-md-3 col-12">
              <div className=" bg-white p-3 rounded border-1 border">
                <div className="profile-photo">
                  <div className=" d-flex justify-content-center">
                    <div className="position-relative mb-2">
                      <img
                        src={
                          data.Avatar
                            ? `${imgServer}${data.Avatar}`
                            : defaultImg
                        }
                        className="rounded-circle"
                        alt="profile"
                        style={{ minHeight: "150px", minWeight: "150px" }}
                        height="150px"
                        width="150px"
                      ></img>

                      {userAccount === account && (
                        <label
                          className="fas fa-camera fs-5 position-absolute bottom-0 end-0 bg-primary p-2 rounded-circle text-white border-5 border-white border uploadAvatar"
                          htmlFor="avatar"
                          title="upload Avatar"
                          onClick={() => {
                            setShow(true);
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <h3>{data.Account}</h3>
                  </div>
                  <div className="text-center  mousePointer">
                    <h5
                      onClick={() => {
                        setShow2(true);
                      }}
                      className="text-secondary hoverWithLine"
                    >
                      {votedNickname.length > 0
                        ? votedNickname[0].Name
                        : "No Nickname"}
                    </h5>
                  </div>
                </div>
                <hr />
                <div>
                  <h4 className="text-center">Badge</h4>
                  {badges.length > 0 ? (
                    <>
                      <div className="d-flex row">
                        {badges3.length > 0
                          ? badges3.map((badge, i) =>
                              i <= 3 ? (
                                <div
                                  className="p-1 d-flex col-4  justify-content-center"
                                  key={i}
                                >
                                  <img
                                    src={
                                      badge
                                        ? `${imgServer}${badge.ImageURL}`
                                        : defaultBadge
                                    }
                                    title={badge.Description}
                                    className="w-50"
                                  />
                                </div>
                              ) : (
                                ""
                              )
                            )
                          : badges.map((badge, i) =>
                              i < 3 ? (
                                <div
                                  className="p-1 d-flex col-4  justify-content-center"
                                  key={i}
                                >
                                  <img
                                    src={
                                      badge
                                        ? `${imgServer}${badge.ImageURL}`
                                        : defaultBadge
                                    }
                                    title={badge.Description}
                                    className="w-50"
                                  />
                                </div>
                              ) : (
                                ""
                              )
                            )}
                      </div>
                    </>
                  ) : (
                    <div
                      style={{ fontWeight: "bold" }}
                      className="text-align-center d-flex  justify-content-center"
                    >
                      NO BADGE TO DISPLAY
                    </div>
                  )}

                  {userAccount === account && badges.length > 3 && (
                    <div className="d-flex justify-content-center">
                      <Button
                        as="a"
                        href="#"
                        className="btn mt-3 btn-primary"
                        size="sm"
                        onClick={() => {
                          setShow3(true);
                        }}
                      >
                        Edit Badge
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-8 col-12">
              <div className="bg-white rounded border-1 border p-3">
                <div className="profile-tab">
                  <div className="custom-tab-1">
                    <Tab.Container defaultActiveKey={"Info"}>
                      <Nav as="ul" className="nav nav-tabs">
                        <Nav.Item as="li" className="nav-item">
                          <Nav.Link to="#info" eventKey="Info">
                            FSOFT Info
                          </Nav.Link>
                        </Nav.Item>

                        <Nav.Item as="li" className="nav-item">
                          <Nav.Link to="#moreinfo" eventKey="MoreInfo">
                            Personal Info
                          </Nav.Link>
                        </Nav.Item>

                        {/* <Nav.Item as="li" className="nav-item">
                          <Nav.Link to="#skill" eventKey="Skill">
                            Skills & Certificate
                          </Nav.Link>
                        </Nav.Item> */}
                      </Nav>
                      <Tab.Content>
                        <Tab.Pane id="info" eventKey="Info">
                          <InfoTab
                            data={data}
                            account={account}
                            userAccount={userAccount}
                          />
                        </Tab.Pane>

                        <Tab.Pane id="moreinfo" eventKey="MoreInfo">
                          <MoreInfoTab
                            data={data}
                            account={account}
                            userAccount={userAccount}
                          />
                        </Tab.Pane>
                        <Tab.Pane id="skill" eventKey="Skill">
                          <SkillTab
                            data={data}
                            account={account}
                            userAccount={userAccount}
                          />
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="h-100 position-absolute top-0 start-50 translate-middle-x w-100 d-none d-md-block"
          style={{ zIndex: "-999" }}
        >
          <img
            src={cover}
            style={{ zIndex: "-999", height: "40%" }}
            className="w-100"
          />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
