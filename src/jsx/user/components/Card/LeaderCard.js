import "../../../../scss/components/card/card.scss";
import "./triagle.css";
import defaultImg from "../../../../images/Default.png";
import { imgServer } from "../../../../dataConfig";
import { Link, useRouteMatch } from "react-router-dom";
import { useState } from "react";
import NickNameVoteModal from "../modal/NickNameVoteModal";
import { useSelector } from "react-redux";

const LeaderCard = ({ data, rank, setRefresh }) => {
  const [show, setShow] = useState(false);
  const { role } = useSelector((a) => a.UserSlice);

  const { PointName, Code } = useSelector((a) => a.DepartmentSettingSlice);

  return (
    <>
      <NickNameVoteModal
        show={show}
        setShow={setShow}
        userID={data.ID}
        account={data.Account}
        setRefresh={setRefresh}
      />
      <div
        style={{
          backgroundColor:
            rank === 1
              ? "#fb7185"
              : rank === 2
              ? "#fbbf24"
              : rank === 3
              ? "#fef08a"
              : rank === 4
              ? "#bef264"
              : rank === 5
              ? "#d8b4fe"
              : rank === 6
              ? "#f584c4"
              : rank === 7
              ? "#f2d82c"
              : rank === 8
              ? "#91a2ed"
              : rank === 9
              ? "#d998ed"
              : "#e68cb3",
        }}
        className={`card position-relativ overflow-hidden`}
      >
        <div className="card-body" style={{ zIndex: "2", height: "22vw" }}>
          <h6 className="text-center">Top {rank}</h6>
          <div
            style={{ height: "55%", maxHeight: "55%" }}
            className="d-flex justify-content-center w-100 mb-2 "
          >
            <img
              src={data.Avatar ? `${imgServer}${data.Avatar}` : defaultImg}
              alt=""
              height="100%"
              width="100%"
              className=" rounded-circle  p-2 bg-white"
            />
          </div>
          <div className="text-center">
            <div className="d-flex justify-content-center gap-1 mb-2">
              {data.badge.map((badges, i) => (
                <img
                  src={`${imgServer}${badges}`}
                  key={i}
                  className="img-fluid"
                  style={{ width: "2.25vw", height: "2.25vw" }}
                />
              ))}
              {data.badge.length < 1 && (
                <div style={{ height: "2.25vw", width: "2.25vw" }}></div>
              )}
            </div>
            <Link
              to={`/user-profile/${data.Account}`}
              className={`text-black text-decoration-none ${
                role === "Guest" ? "pe-none" : ""
              }`}
            >
              <h6
                className="username mb-1 hoverWithLine"
                style={{ fontSize: "1vw" }}
              >
                {data.DisplayName}
              </h6>
            </Link>
            <h6
              className={`mb-1 mousePointer hoverWithLine ${
                role === "Guest" ? "pe-none" : ""
              }`}
              onClick={() => {
                setShow(true);
              }}
              style={{ color: "#475569", fontSize: "0.8vw" }}
            >
              {data.user_nickname || "NickName"}
            </h6>
            <h6
              className=" m-0"
              style={{ color: "#1e3a8a", fontSize: "0.8vw" }}
            >
              {data.point_per_day || 0} {PointName}/Day
            </h6>
          </div>
        </div>
        <div
          className="arrow-up position-absolute top-50 start-50 translate-middle w-100 h-100"
          style={{ zIndex: "1" }}
        />
      </div>
    </>
  );
};

export default LeaderCard;
