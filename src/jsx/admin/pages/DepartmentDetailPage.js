import { useParams } from 'react-router-dom';
import useRefreshToken from '../../../Hook/useRefreshToken';
import { getSetting } from '../../../services/SettingAPI';
import { getOneDepartmentDetail } from '../../../services/DepartmentAPI';

import { getAllUserMasterNoPageWithDepartmentID } from '../../../services/UsermasterAPI';
import Loading from '../../sharedPage/pages/Loading';
import DepartmentDetail from '../components/detail/DepartmentDetail';
import { getDefaultHead } from '../../../services/DefaultHeadAPI';

const DepartmentDetailPage = () => {
    const { departmentID } = useParams();

    const [depaSetting, setRefresh3] = useRefreshToken(getSetting, departmentID);
    const [defaultHead] = useRefreshToken(getDefaultHead, departmentID);

    const [allBU, setRefresh] = useRefreshToken(getAllUserMasterNoPageWithDepartmentID, 2, departmentID);

    const [depaDetail, setRefresh2] = useRefreshToken(getOneDepartmentDetail, departmentID);

    const resfreshAll = () => {
        setRefresh(new Date());
        setRefresh2(new Date());
        setRefresh3(new Date());
    };

    return depaSetting === null || allBU === null || depaDetail === null || defaultHead === null ? (
        <Loading />
    ) : (
        <DepartmentDetail
            defaultHead={defaultHead}
            depaSetting={depaSetting}
            BUList={allBU}
            depaDetail={depaDetail}
            setRefresh={resfreshAll}
        />
    );
};

export default DepartmentDetailPage;
