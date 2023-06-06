import React from "react";
import defaultImg from "../../../../images/Default.png";
import "./LeaderBoardTable.scss";
import top1 from "../../../../images/top/top1.png";
import top2 from "../../../../images/top/top2.png";
import top3 from "../../../../images/top/top3.png";
import { Button, Table } from "react-bootstrap";
import "../../../../scss/components/card/card.scss";
import CustomPagination from "../Shared/CustomPagination";
import CardTitleWithSearchLeaderBoard from "../Card/CardTitleWithSearchLeaderBoard";
import { Link, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import { imgServer } from "../../../../dataConfig";
import { getLastPoint } from "../../../../services/LeaderBoardAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { useState } from "react";
import PointStatus from "../Detail/PointStatus";
const LeaderBoardTable = ({
  data,
  title,
  header,
  historyHandle,
  page,
  totalPage,
  totalItems,
  pageChange,
  rowChange,
  searchHandle,
  currentSearch,
  row,
  myRank,
  month,
  year,
}) => {
  const { account, displayName, imgurl, role } = useSelector(
    (a) => a.UserSlice
  );
  const [listPoint, setListPoint] = useState([]);
  const { PointName } = useSelector((a) => a.DepartmentSettingSlice);
  const { url } = useRouteMatch();

  function getPoint(userID) {
    let [point] = useRefreshToken(getLastPoint, month, year, userID);
    return point;
  }
  return (
    <div
      className={`card border border-2 border-primary position-relative w-100`}
    >
      <div className="card p-2 text-center border border-2 border-primary position-absolute top-0 start-50 translate-middle user-select-none">
        <h4 className="m-0">{title}</h4>
      </div>
      <CardTitleWithSearchLeaderBoard
        title={header}
        searchHandle={searchHandle}
        currentSearch={currentSearch}
        searchClass="mt-3"
      />

      <div className="card-body px-3 py-0 mt-3">
        <div className="w-100">
          <Table responsive className="dataTable">
            <tbody>
              {role !== "Guest" &&
                role !== "Head" &&
                (myRank !== "NO DATA" ? (
                  <>
                    <tr>
                      <td
                        className="d-flex align-items-center gap-3 p-0 py-1 rounded"
                        style={{ backgroundColor: "#a58efe" }}
                      >
                        <div style={{ width: "4rem" }} className="text-center">
                          {myRank.user_rank === 1 ? (
                            <img src={top1} alt="" className="img-fluid" />
                          ) : myRank.user_rank === 2 ? (
                            <img src={top2} alt="" className="img-fluid" />
                          ) : myRank.user_rank === 3 ? (
                            <img src={top3} alt="" className="img-fluid" />
                          ) : (
                            <h5 className="m-0 text-white ">
                              {myRank.user_rank}
                            </h5>
                          )}
                        </div>

                        <div className="text-center" style={{ width: "5rem" }}>
                          <img
                            src={
                              myRank.Avatar != null
                                ? `${imgServer}${myRank.Avatar}`
                                : defaultImg
                            }
                            style={{
                              borderRadius: "50%",
                              width: "3.25rem",
                              height: "3.25rem",
                            }}
                            alt="avatar"
                            className="img-fluid "
                          />
                        </div>

                        <div className="mb-0 w-100 p-2">
                          <div className="d-flex gap-auto align-items-center text-white">
                            <div style={{ width: "11.5rem" }}>
                              <Link
                                to={`/user-profile/${myRank.Account}`}
                                className="text-black text-decoration-none "
                              >
                                <h6 className="mb-1 h6 hoverWithLine  text-white">
                                  {myRank.DisplayName}
                                </h6>
                              </Link>
                              <h6 className="mb-0 text-secondary font-weight-bold  text-white">
                                {myRank.Account}
                              </h6>
                            </div>
                            {myRank.total_point !== undefined && (
                              <div
                                style={{ width: "5rem" }}
                                className="text-center m-auto"
                              >
                                <h6 className="m-0  text-white">{PointName}</h6>
                                <p className="m-0  text-white">
                                  {myRank.total_point === null
                                    ? 0
                                    : myRank.total_point}
                                  <PointStatus
                                    userID={myRank.ID}
                                    month={month}
                                    year={year}
                                  ></PointStatus>
                                </p>
                              </div>
                            )}
                            {myRank.point_per_day !== undefined && (
                              <div
                                style={{ width: "5rem" }}
                                className="text-center m-auto  text-white"
                              >
                                <h6 className="m-0  text-white">AVG</h6>
                                <p className="m-0  text-white">
                                  {myRank.point_per_day === null
                                    ? 0
                                    : myRank.point_per_day}
                                </p>
                              </div>
                            )}
                            {myRank.total_work !== undefined && (
                              <div
                                style={{ width: "5rem" }}
                                className="text-center m-auto"
                              >
                                <h6 className="m-0  text-white">Work Days</h6>
                                <p className="m-0  text-white">
                                  {myRank.total_work === null
                                    ? 0
                                    : myRank.total_work}
                                </p>
                              </div>
                            )}

                            <div
                              style={{ width: "5rem" }}
                              className=" text-center m-auto"
                            >
                              <Button
                                onClick={historyHandle}
                                value={myRank.ID}
                                name={myRank.Account}
                              >
                                History
                              </Button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <hr className="text-success mt-4"></hr>
                  </>
                ) : (
                  <tr>
                    <td
                      className="d-flex align-items-center gap-3 p-0 py-1 rounded"
                      style={{ backgroundColor: "#a58efe" }}
                    >
                      <div style={{ width: "4rem" }} className="text-center">
                        {myRank.user_rank === 1 ? (
                          <img src={top1} alt="" className="img-fluid" />
                        ) : myRank.user_rank === 2 ? (
                          <img src={top2} alt="" className="img-fluid" />
                        ) : myRank.user_rank === 3 ? (
                          <img src={top3} alt="" className="img-fluid" />
                        ) : (
                          <h5 className="m-0 text-white">{myRank.user_rank}</h5>
                        )}
                      </div>
                      <div className="text-center" style={{ width: "5rem" }}>
                        <img
                          src={
                            imgurl != null
                              ? `${imgServer}${imgurl}`
                              : defaultImg
                          }
                          alt="avatar"
                          className="img-fluid rounded-circle"
                        />
                      </div>
                      <div className=" mb-0 w-100 p-2 ">
                        <div className="d-flex gap-auto align-items-center text-white">
                          <div style={{ width: "11.5rem" }}>
                            <Link
                              to={`/user-profile/${account}`}
                              className="text-decoration-none "
                            >
                              <h6 className="mb-1 hoverWithLine text-white">
                                {displayName}
                              </h6>
                            </Link>
                            <h6 className="mb-0 font-weight-bold text-white">
                              {account}
                            </h6>
                          </div>

                          <div
                            style={{ width: "5rem" }}
                            className="text-center m-auto text-white"
                          >
                            <h6 className="m-0 text-white">{PointName}</h6>
                            <p className="m-0 fw-bold">-</p>
                          </div>

                          <div
                            style={{ width: "5rem" }}
                            className="text-center m-auto text-white"
                          >
                            <h6 className="m-0 text-white">AVG</h6>
                            <p className="m-0 fw-bold">-</p>
                          </div>

                          <div
                            style={{ width: "5rem" }}
                            className="text-center m-auto text-white"
                          >
                            <h6 className="m-0 text-white">Work Days</h6>
                            <p className="m-0 fw-bold">-</p>
                          </div>

                          <div
                            style={{ width: "5rem" }}
                            className=" text-center m-auto"
                          >
                            <Button disabled={true}>History</Button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}

              {data.length > 0 ? (
                data.map((d, index) => (
                  <tr key={index}>
                    <td className="d-flex align-items-center gap-3 py-2 px-0">
                      <div style={{ width: "4rem" }} className="text-center">
                        {d.user_rank === 1 ? (
                          <img src={top1} alt="" className="img-fluid" />
                        ) : d.user_rank === 2 ? (
                          <img src={top2} alt="" className="img-fluid" />
                        ) : d.user_rank === 3 ? (
                          <img src={top3} alt="" className="img-fluid" />
                        ) : (
                          <h5 className="m-0">{d.user_rank}</h5>
                        )}
                      </div>
                      <div className="text-center" style={{ width: "5rem" }}>
                        <img
                          src={
                            d.Avatar != null
                              ? `${imgServer}${d.Avatar}`
                              : defaultImg
                          }
                          style={{
                            borderRadius: "50%",
                            width: "4rem",
                            height: "4rem",
                          }}
                          alt="avatar"
                          className="img-fluid "
                        />
                      </div>
                      <div
                        className="card mb-0 p-2 w-100"
                        style={{
                          background:
                            d.user_rank === 1
                              ? "#FFE69A"
                              : d.user_rank === 2
                              ? "#F9CEEE"
                              : d.user_rank === 3
                              ? "#EAF6F6"
                              : "",
                        }}
                      >
                        <div className="d-flex gap-auto align-items-center">
                          <div style={{ width: "11.5rem" }}>
                            <h6 className="mb-1 h6">
                              <Link
                                to={`/user-profile/${d.Account}`}
                                className={`text-black text-decoration-none hoverWithLine ${
                                  role === "Guest" ? "pe-none" : ""
                                }`}
                              >
                                <h6 className="mb-1 hoverWithLine">
                                  {d.DisplayName}
                                </h6>
                              </Link>
                            </h6>
                            <h6 className="mb-0 text-secondary font-weight-bold">
                              {d.Account}
                            </h6>
                          </div>
                          {d.total_point !== undefined && (
                            <div
                              style={{ width: "5rem" }}
                              className="text-center m-auto"
                            >
                              <h6 className="m-0">{PointName}</h6>
                              <p className="m-0">
                                {d.total_point === null ? 0 : d.total_point}
                                <PointStatus
                                  userID={d.ID}
                                  month={month}
                                  year={year}
                                ></PointStatus>
                              </p>
                            </div>
                          )}
                          {d.point_per_day !== undefined && (
                            <div
                              style={{ width: "5rem" }}
                              className="text-center m-auto"
                            >
                              <h6 className="m-0">AVG</h6>
                              <p className="m-0">
                                {d.point_per_day === null ? 0 : d.point_per_day}
                              </p>
                            </div>
                          )}
                          {d.total_work !== undefined && (
                            <div
                              style={{ width: "5rem" }}
                              className="text-center m-auto"
                            >
                              <h6 className="m-0 ">Work Days</h6>
                              <p className="m-0">
                                {d.total_work === null ? 0 : d.total_work}
                              </p>
                            </div>
                          )}

                          {role !== "Guest" && (
                            <div
                              style={{ width: "5rem" }}
                              className=" text-center m-auto"
                            >
                              <Button
                                onClick={historyHandle}
                                value={d.ID}
                                name={d.Account}
                              >
                                History
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center">
                  <td>
                    <h4 className="text-center">No Data</h4>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="row">
        <div className="col-9 card-footer w-100 bg-transparent border-0 border">
          <CustomPagination
            rowChange={rowChange}
            pageChange={pageChange}
            totalPage={totalPage}
            page={page}
            noGoTop={true}
            row={row}
          />
        </div>
      </div>
    </div>
  );
};

export default LeaderBoardTable;
