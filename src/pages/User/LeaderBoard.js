import { Grid } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LeaderboardStatistic from '../../components/User/LeaderboardStatistic';
import LeaderboardUserList from '../../components/User/LeaderboardUserList';
import { PAGE_INDEX, PAGE_SIZE } from '../../constants/pagination';
import { Server } from '../../dataConfig';
import useRefreshToken from '../../Hook/useRefreshToken';
import { getLeaderboardData, getYearList } from '../../services/LeaderBoardAPI';

const { useBreakpoint } = Grid;

function LeaderBoard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [pageIndex, setPageIndex] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(0);
    const [keyword, setKeyword] = useState(null);
    const [kper, setKper] = useState('');
    const { userID } = useSelector((state) => state.UserSlice);
    const { DepartmentID, PointName, Code } = useSelector((a) => a.DepartmentSettingSlice);
    const maxBadge = 4;

    const [yearList] = useRefreshToken(getYearList);
    const [data, setRefresh] = useRefreshToken(
        getLeaderboardData,
        userID,
        year,
        month,
        keyword,
        pageIndex,
        pageSize,
        kper
    );

    useEffect(() => {
        if (data) {
            data.LeaderBoard = data.LeaderBoard.map((item) => ({
                ...item,
                more_slot: item.badge_names && item.badge_names.split('|').length - maxBadge
            }));
            setLeaderboardData(data);
        }
    }, [data]);

    return (
        <>
            <LeaderboardStatistic data={leaderboardData} setRefreshLeaderboard={setRefresh} pointName={PointName} />
            <LeaderboardUserList
                data={leaderboardData}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                year={year}
                setYear={setYear}
                yearList={yearList}
                month={month}
                setMonth={setMonth}
                setKeyword={setKeyword}
                pageIndex={pageIndex}
                pageSize={pageSize}
                pointName={PointName}
                setKper={setKper}
                keyword={keyword}
                maxBadge={maxBadge}
                departmentID={DepartmentID}
                departmentName={Code}
                userID={userID}
            />
        </>
    );
}

export default LeaderBoard;
