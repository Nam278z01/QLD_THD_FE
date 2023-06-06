import { useHistory } from 'react-router-dom';

const useReplaceURL = (path) => {
    const navigate = useHistory();

    const URLchange = (page, row, sort, search, month, year, ...extra) => {
        navigate.replace(
            `${path}?page=${page}&row=${row}${month ? `&month=${month}` : ''}${year ? `&year=${year}` : ''}${
                search ? `&search=${search}` : ''
            }${sort ? `&sort=${sort}` : ''}${extra.join('')}`
        );
    };

    const leaderBoardURLchange = (monthPage, yearPage, rowMonth, rowYear, monthSearch, yearSearch, month, year) => {
        navigate.replace(
            `${path}?monthPage=${monthPage}&yearPage=${yearPage}&rowMonth=${rowMonth}&rowYear=${rowYear}${
                monthSearch ? `&monthSearch=${monthSearch}` : ''
            }${yearSearch ? `&yearSearch=${yearSearch}` : ''}&month=${month}&year=${year}`
        );
    };

    return { URLchange, leaderBoardURLchange };
};

export default useReplaceURL;
