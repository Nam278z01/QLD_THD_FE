import { useSelector } from 'react-redux';
import userRole from '../constants/role';

function useAuth() {
    const { userID, role } = useSelector((state) => state.UserSlice);
    const { DefaultHead } = useSelector((state) => state.DepartmentSettingSlice);

    const isHead = role === userRole.HEAD;
    const isPM = role === userRole.PM;
    const isMember = role === userRole.MEMBER;
    const isDefaultHead = DefaultHead.HeadID === userID;

    return {
        isHead,
        isPM,
        isMember,
        isDefaultHead
    };
}

export default useAuth;
