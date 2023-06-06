import { Top3LeaderBoard } from "../components/Card/Top3LeaderBoard";
import useQuery from "../../../Hook/useQuery";
import {
  getYearData,
  getMonthData,
  getTOP5,
  getSelfRank,
  getSelfRankYear,
} from "../../../services/LeaderBoardAPI";
import useRefreshToken from "../../../Hook/useRefreshToken";
import useReplaceURL from "../../../Hook/useReplaceURL";
import { Fragment, useState } from "react";
import LeaderBoardTable from "../components/table/LeaderBoardTable";
import HistoryModal from "../components/modal/HistoryModal";
import { useSelector } from "react-redux";
import Loading from "../../sharedPage/pages/Loading";
import { useHistory } from "react-router-dom";
import { getLastPoint } from "../../../services/LeaderBoardAPI";
import { getSettingTop } from "../../../services/SettingAPI";
import { getYearList } from "../../../services/LeaderBoardAPI";
import { useEffect } from "react";
const Leaderboard = () => {
  const btnMonthDOM = document.querySelectorAll(".btoToFind:checked");
  const [showMonth, setShowMonth] = useState(false);
  const [showYear, setShowYear] = useState(false);
  const myUserID = useSelector((state) => state.UserSlice.userID);

  const navigate = useHistory();

  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");

  const { Code, DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);

  const query = useQuery();
  const monthQuery = query.get("month") || new Date().getMonth() + 1;
  const yearQuery = query.get("year") || new Date().getFullYear();
  const monthPageQuery = query.get("monthPage") || 1;
  const yearPageQuery = query.get("yearPage") || 1;
  const rowMonthQuery = query.get("rowMonth") || 10;
  const rowYearQuery = query.get("rowYear") || 10;

  const monthSearchQuery = query.get("monthSearch");
  const yearSearchQuery = query.get("yearSearch");

  const { leaderBoardURLchange } = useReplaceURL(`/leaderboard`);

  const yearHandle = (e) => {
    leaderBoardURLchange(
      1,
      1,
      rowMonthQuery,
      rowYearQuery,
      monthSearchQuery,
      yearSearchQuery,
      1,
      e.target.value
    );
  };

  const monthHandle = (e) => {
    leaderBoardURLchange(
      1,
      yearPageQuery,
      rowMonthQuery,
      rowYearQuery,
      monthSearchQuery,
      yearSearchQuery,
      e.target.value,
      yearQuery
    );
  };

  const rowHandleMonth = (row) => {
    leaderBoardURLchange(
      1,
      1,
      row,
      rowYearQuery,
      monthSearchQuery,
      yearSearchQuery,
      monthQuery,
      yearQuery
    );
  };

  const rowHandleYear = (row) => {
    leaderBoardURLchange(
      1,
      1,
      rowMonthQuery,
      row,
      monthSearchQuery,
      yearSearchQuery,
      monthQuery,
      yearQuery
    );
  };

  const pageMonthChange = (page) => {
    leaderBoardURLchange(
      page,
      yearPageQuery,
      rowMonthQuery,
      rowYearQuery,
      monthSearchQuery,
      yearSearchQuery,
      monthQuery,
      yearQuery
    );
  };

  const pageYearChange = (page) => {
    leaderBoardURLchange(
      monthPageQuery,
      page,
      rowMonthQuery,
      rowYearQuery,
      monthSearchQuery,
      yearSearchQuery,
      monthQuery,
      yearQuery
    );
  };

  const monthSearchHandle = (search) => {
    leaderBoardURLchange(
      1,
      yearPageQuery,
      rowMonthQuery,
      rowYearQuery,
      search,
      yearSearchQuery,
      monthQuery,
      yearQuery
    );
  };

  const yearSearchHandle = (search) => {
    leaderBoardURLchange(
      1,
      1,
      rowMonthQuery,
      rowYearQuery,
      monthSearchQuery,
      search,
      monthQuery,
      yearQuery
    );
  };

  const [dataMonth] = useRefreshToken(
    getMonthData,
    monthPageQuery,
    rowMonthQuery,
    monthSearchQuery,
    monthQuery,
    yearQuery
  );

  const [dataYear] = useRefreshToken(
    getYearData,
    yearPageQuery,
    rowYearQuery,
    yearSearchQuery,
    yearQuery
  );
  const [sizetop] = useRefreshToken(getSettingTop);

  const [dataTOP5, setRefresh] = useRefreshToken(
    getTOP5,
    yearQuery,
    sizetop ? sizetop : 0
  );

  const [myRankMonth] = useRefreshToken(
    getSelfRank,
    monthQuery,
    yearQuery,
    myUserID
  );
  const [first, setFirst] = useState(true);

  const [year] = useRefreshToken(getYearList, DepartmentID);
  const [items, setItems] = useState(
    useRefreshToken(getYearList, DepartmentID)
  );

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const [myRankYear] = useRefreshToken(getSelfRankYear, yearQuery, myUserID);

  const yearHead = (
    <div>
      <div
        className="btn-group btn-group-toggle mr-2 pb-0 d-none d-sm-block "
        role="group"
      >
        {year !== null &&
          year.map((x, i) => (
            <Fragment key={i}>
              <input
                type="radio"
                className="btn-check"
                name="year"
                id={`year${x}`}
                autoComplete="off"
                value={x}
                onClick={(e) => {
                  yearHandle(e);
                  btnMonthDOM.forEach((x) => {
                    x.checked = false;
                  });
                }}
              />
              <label
                className={`btn btn-primary m-0 ${
                  yearQuery == x && "active pe-none"
                }`}
                htmlFor={`year${x}`}
              >
                {x}
              </label>
            </Fragment>
          ))}
        {}
      </div>
      <div className="d-sm-none col-3 mx-auto">
        <select
          onChange={yearHandle}
          value={yearQuery}
          className="form-select form-select-sm m-0"
        >
          {year !== null &&
            year.map((x, i) => (
              <option value={x} key={i}>
                {x}
              </option>
            ))}
        </select>
      </div>
    </div>
  );

  const monthHead =
    yearQuery < new Date().getFullYear() ? (
      <div>
        <div className="d-sm-none">
          <select
            onChange={monthHandle}
            value={monthQuery}
            className="form-select"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((x, i) => (
              <option value={x} key={i}>
                {x}
              </option>
            ))}
          </select>
        </div>
        <div
          className="btn-group mr-2 pb-0 d-none d-sm-block"
          role="group"
          aria-label="First group"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((x, i) => (
            <Fragment key={i}>
              <input
                type="radio"
                className="btn-check btoToFind "
                name="month"
                id={`month${x}`}
                autoComplete="off"
                value={x}
                onClick={monthHandle}
              />
              <label
                className={`btn btn-primary m-0 ${
                  monthQuery == x && "active pe-none"
                } `}
                htmlFor={`month${x}`}
              >
                {x}
              </label>
            </Fragment>
          ))}
        </div>
      </div>
    ) : (
      <div>
        <div className="d-sm-none col-3 mx-auto">
          <select
            onChange={monthHandle}
            value={monthQuery}
            className="form-select form-select-sm m-0"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((x, i) =>
              x <= new Date().getMonth() + 1 ? (
                <option value={x} key={i}>
                  {x}
                </option>
              ) : (
                ""
              )
            )}
          </select>
        </div>
        <div
          className="btn-group mr-2 pb-0 d-none d-sm-block"
          role="group"
          aria-label="First group"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((x, i) =>
            x <= new Date().getMonth() + 1 ? (
              <Fragment key={i}>
                <input
                  type="radio"
                  className="btn-check btoToFind"
                  name="month"
                  id={`month${x}`}
                  autoComplete="off"
                  value={x}
                  key={i}
                  onClick={monthHandle}
                />
                <label
                  className={`btn btn-primary m-0 ${
                    monthQuery == x && "active pe-none"
                  }`}
                  htmlFor={`month${x}`}
                >
                  {x}
                </label>
              </Fragment>
            ) : (
              ""
            )
          )}
        </div>
      </div>
    );

  function historyHandleMonth(e) {
    setShowMonth(true);
    setUserID(e.target.value);
    setUserName(e.target.name);
  }

  function historyHandleYear(e) {
    setShowYear(true);
    setUserID(e.target.value);
    setUserName(e.target.name);
  }

  return dataMonth === null ||
    dataYear === null ||
    dataTOP5 === null ||
    myRankMonth === null ||
    myRankYear === null ? (
    <Loading />
  ) : (
    <>
      <HistoryModal
        show={showMonth}
        setShow={setShowMonth}
        month={monthQuery}
        year={yearQuery}
        name={userName}
        userID={userID}
        MonthOnly={true}
      />

      <HistoryModal
        show={showYear}
        setShow={setShowYear}
        year={yearQuery}
        name={userName}
        userID={userID}
      />

      <Top3LeaderBoard
        className="mb-2"
        dataYear={dataTOP5}
        setRefresh={setRefresh}
      />

      <div className="text-center my-4 mb-5 border-5">
        <h1 className="text-warning">Leader Board</h1>
      </div>

      <div className="row mb-3">
        <div
          className={`col-xl-6 col-sm-12 ${
            dataMonth.monthData.length === 0 && "d-flex align-items-stretch"
          }`}
        >
          <LeaderBoardTable
            data={dataMonth.monthData}
            title="Month"
            header={monthHead}
            historyHandle={historyHandleMonth}
            page={monthPageQuery * 1}
            row={rowMonthQuery}
            rowChange={rowHandleMonth}
            pageChange={pageMonthChange}
            searchHandle={monthSearchHandle}
            currentSearch={monthSearchQuery}
            totalPage={dataMonth.totalPage}
            myRank={myRankMonth}
            month={monthQuery}
            year={yearQuery}
          />
        </div>
        <div
          className={`col-xl-6 col-sm-12 ${
            dataYear.yearData.length === 0 && "d-flex align-items-stretch"
          }`}
        >
          <LeaderBoardTable
            data={dataYear.yearData}
            title="Year"
            header={yearHead}
            historyHandle={historyHandleYear}
            page={yearPageQuery * 1}
            row={rowYearQuery}
            rowChange={rowHandleYear}
            pageChange={pageYearChange}
            searchHandle={yearSearchHandle}
            currentSearch={yearSearchQuery}
            totalPage={dataYear.totalPage}
            myRank={myRankYear}
            year={yearQuery}
          />
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
