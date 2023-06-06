import { useSelector } from 'react-redux';
import useAuth from '../../Hook/useAuth';
import useRefreshToken from '../../Hook/useRefreshToken';
import SyncTableNew from '../../components/User/SyncTableNew';
import { getYearListSync } from '../../services/LeaderBoardAPI';
import ErrorPage from '../ErrorPage';

function SyncData() {
    const { isHead, isPM } = useAuth();
    const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);
    const [year] = useRefreshToken(getYearListSync, DepartmentID);

    return (
        <>
            {isHead || isPM ? (
                <SyncTableNew year={year} />
            ) : (
                <ErrorPage
                    title="The page you were looking for is not found!"
                    desc="You may have mistyped the address or the page may have moved."
                />
            )}
            s
        </>
    );
}

export default SyncData;
