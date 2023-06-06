import axios from 'axios';
import moment from 'moment';
import { Server, Status, UserMaster } from '../dataConfig';

export const getYearData = async (token, DepartmentID, page, row, search, year) => {
    try {
        const res = await axios.get(
            `${Server}/rankings/leaderboard?year=${year}&page=${page}${row === 'All' ? '' : `&size=${row}`}${
                search ? `&keyword=${search}` : ''
            }&departmentID=${DepartmentID}`,
            token
        );

        const datas = res.data.data.LeaderBoard;
        const totalPage = Math.ceil(res.data.data.total / row);

        const yearData = datas.map((data) => {
            const { ID, Account, point_per_day, Avatar, DisplayName, total_point, total_work, user_rank } = data;

            return {
                Avatar,
                Account,
                DisplayName,
                point_per_day,
                total_point,
                total_work,
                user_rank,
                ID
            };
        });

        return { yearData, totalPage };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getTOP5 = async (token, DepartmentID, year, size) => {
    try {
        const res = await axios.get(
            `${Server}/rankings/leaderboard?year=${year}&size=${size}&departmentID=${DepartmentID}`,
            token
        );

        const datas = res.data.data.LeaderBoard;

        const top5Data = datas.map((data) => {
            const {
                ID,
                Account,
                point_per_day,
                total_point,
                user_nickname,
                Avatar,
                DisplayName,
                badge_names,
                user_rank
            } = data;

            return {
                ID,
                Account,
                Avatar,
                DisplayName,
                total_point,
                point_per_day,
                user_nickname,
                badge: badge_names != null ? badge_names.split(',') : [],
                user_rank
            };
        });

        return top5Data;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getMonthData = async (token, DepartmentID, page, row, search, month, year) => {
    try {
        const res = await axios.get(
            `${Server}/rankings/leaderboard?month=${month}&year=${year}&page=${page}${
                row === 'All' ? '' : `&size=${row}`
            }${search ? `&keyword=${search}` : ''}&departmentID=${DepartmentID}`,
            token
        );

        const datas = res.data.data.LeaderBoard;
        const totalPage = Math.ceil(res.data.data.total / row);

        const monthData = datas.map((data) => {
            const { point_per_day, total_point, Account, ID, Avatar, DisplayName, total_work, user_rank } = data;

            return {
                Avatar,
                DisplayName,
                total_point,
                point_per_day,
                total_work,
                user_rank,
                Account,
                ID
            };
        });

        return { monthData, totalPage };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getSelfRank = async (token, DepartmentID, month, year, userID) => {
    try {
        const res = await axios.get(
            `${Server}/rankings/myranking?year=${year}&month=${month}&ID=${userID}&departmentID=${DepartmentID}`,
            token
        );

        const datas = res.data.data.MyRanking[0];

        if (datas !== undefined) {
            const { point_per_day, total_point, total_work, ID, Avatar, DisplayName, user_rank, Account } = datas;

            const selfData = {
                Avatar,
                Account,
                DisplayName,
                total_point,
                total_work,
                point_per_day,
                ID,
                user_rank,
                badge: ['bug.png', 'bug.png', 'bug.png']
            };

            return selfData;
        }

        return 'NO DATA';
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getSelfRankYear = async (token, DepartmentID, year, userID) => {
    try {
        const res = await axios.get(
            `${Server}/rankings/myranking?year=${year}&ID=${userID}&departmentID=${DepartmentID}`,
            token
        );

        const datas = res.data.data.MyRanking[0];

        if (datas !== undefined) {
            const { point_per_day, total_point, total_work, ID, Avatar, DisplayName, user_rank, Account } = datas;

            const selfData = {
                Avatar,
                Account,
                DisplayName,
                total_point,
                total_work,
                point_per_day,
                ID,
                user_rank,
                badge: ['bug.png', 'bug.png', 'bug.png']
            };

            return selfData;
        }

        return 'NO DATA';
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getLastPoint = async (token, DepartmentID, month, year, userID) => {
    try {
        let res;

        res = await axios.get(
            `${Server}/points?UserMasterID=${userID}&sort=CreatedDate:DESC${
                month !== undefined ? `&Month=${month}` : ''
            }&Year=${year}&DepartmentID=${DepartmentID}}&Status=3`,
            token
        );
        if (res.data.data.total !== 0) return res.data.data.points[0].PointOfRule;
        return 0;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getYearList = async (token, DepartmentID) => {
    try {
        let res;
        res = await axios.get(`${Server}/points/year-point/${DepartmentID}`, token);

        if (res.data.data.length == 0) return [new Date().getFullYear()];

        return res.data.data;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getLeaderboardData = async (token, departmentID, UserMasterID, year, month, keyword, page, size, kper) => {
    try {
        let res;
        res = await axios.get(
            `${Server}/rankings/leaderboard?page=${page}&size=${size}&year=${year}${month ? '&month=' + month : ''}${
                kper ? '&kper=' + encodeURIComponent(kper) : ''
            }${keyword ? '&keyword=' + keyword : ''}&UserMasterID=${UserMasterID}&departmentID=${departmentID}`,
            token
        );

        return res.data.data;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const exportLeaderboardData = async (
    token,
    departmentID,
    UserMasterID,
    year,
    month,
    keyword,
    page,
    size,
    kper
) => {
    try {
        return await axios.get(
            `${Server}/exports/leaderboard-excel?year=${year}${month ? '&month=' + month : ''}&size=${size}&page=${page}
          &departmentID=${departmentID}&UserMasterID=${UserMasterID}${kper ? '&kper=' + kper : ''}${
                keyword ? '&keyword=' + keyword : ''
            }`,
            token
        );
    } catch (err) {
        return 'NO DATA';
    }
};
export const getYearListSync = async (token, DepartmentID) => {
  try {
    let res;
    res = await axios.get(`${Server}/points/year-point/${DepartmentID}`, token);
    if (res.data.data.length === 0) {
      return [new Date().getFullYear()];
    } else if (
      res.data.data.length > 0 &&
      res.data.data[res.data.data.length - 1] !== new Date().getFullYear()
    ) {
      return res.data.data.push(new Date().getFullYear());
    } else {
      return res.data.data;
    }
  } catch (err) {
    throw err.response.data.error;
  }
};
export const getYearListWorkingTime = async (token, DepartmentID) => {
  try {
    let res;
    res = await axios.get(`${Server}/points/year-point/${DepartmentID}`, token);

    if (res.data.data.length === 0) {
      return [
        { label: new Date().getFullYear(), value: new Date().getFullYear() },
      ];
    } else if (
      res.data.data.length > 0 &&
      res.data.data[res.data.data.length - 1] !== new Date().getFullYear()
    ) {
      res.data.data.push(new Date().getFullYear());
      return res.data.data.map((year) => ({ label: year, value: year }));
    } else {
      return res.data.data.map((year) => ({ label: year, value: year }));
    }
  } catch (err) {
    throw err.response.data.error;
  }
};
export const getYearListWorkingTimeSelect = async (token, DepartmentID) => {
  try {
    let res;
    res = await axios.get(`${Server}/points/year-point/${DepartmentID}`, token);

    if (res.data.data.length === 0) {
      return [
        {
          title: new Date().getFullYear().toString(),
          value: new Date().getFullYear(),
        },
      ];
    } else if (
      res.data.data.length > 0 &&
      res.data.data[res.data.data.length - 1] !== new Date().getFullYear()
    ) {
      res.data.data.push(new Date().getFullYear());
      return res.data.data.map((year) => ({
        title: year.toString(),
        value: year,
      }));
    } else {
      return res.data.data.map((year) => ({
        title: year.toString(),
        value: year,
      }));
    }
  } catch (err) {
    throw err.response.data.error;
  }
};
