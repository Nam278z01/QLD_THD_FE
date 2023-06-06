import { useMsal } from '@azure/msal-react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, useHistory, useParams } from 'react-router-dom';
import ThemeContext from './context/ThemeContext';
import './css/style.css';
import useRefreshToken from './Hook/useRefreshToken';
import { setDefaulthead, setDepartmentInfo, setDepartmentSettingInfo } from './store/DepartmentSettingSlice';
import { setUserAvatar, setUserInfo, setUserRoleAndID } from './store/UserSlice';
import './vendor/bootstrap-select/dist/css/bootstrap-select.min.css';
import { getUserRole } from './services/UsermasterAPI';
import { getCurrentDepartment } from './services/DepartmentAPI';
import { getSetting } from './services/SettingAPI';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { SocketContextProvider } from './context/socketContext';
import AdminIndex from './jsx/admin';
import Loading from './jsx/sharedPage/pages/Loading';
import UserIndex from './pages/User';
import { getDefaultHead } from './services/DefaultHeadAPI';

//validate department
function DepartmentLayer() {
    const dispatch = useDispatch();
    const { depaName } = useParams();
    const navigate = useHistory();
    return (
      <ThemeContext>
        <BrowserRouter basename={"FHN.FLT"}>
          <UserIndex />
        </BrowserRouter>
      </ThemeContext>
    );
    // console.log("approuter depaname",depaName);

    /*const [currentDepaData, setCurrentDepaData] = useRefreshToken(getCurrentDepartment, depaName.split('.').join(' '));
    useEffect(() => {
        if (
            currentDepaData !== null &&
            currentDepaData !== undefined &&
            currentDepaData !== 'NO DATA' &&
            depaName.toLowerCase() !== 'admin'
        ) {
            dispatch(
                setDepartmentInfo({
                    Name: currentDepaData.Name,
                    Code: currentDepaData.Code.split(' ').join('.'),
                    View: currentDepaData.View,
                    DepartmentID: currentDepaData?.ID,
                    IsFsu: currentDepaData.IsFsu
                })
            );
        }
    }, [currentDepaData]);

    if (
        (depaName === undefined || currentDepaData === undefined || currentDepaData === 'NO DATA') &&
        depaName.toLowerCase() !== 'admin'
    ) {
        navigate.replace('/page-error-404');
        return <div>Bye</div>;
    }

    return (
        <SocketContextProvider>
            <ThemeContext>
                {currentDepaData === null ? <Loading /> : <UserRoleLayer currentDepaData={currentDepaData} />}
            </ThemeContext>
        </SocketContextProvider>
    );*/
}

// validate user
function UserRoleLayer({ currentDepaData }) {
    const { accounts } = useMsal();
    const account = accounts[0];
    const [DefaultHead] = useRefreshToken(getDefaultHead, currentDepaData?.ID);
    const dispatch = useDispatch();
    const [first, setFirst] = useState(true);
    const [userInfo] = useRefreshToken(getUserRole, account.username.split('@')[0], currentDepaData?.ID || 1000);
    useEffect(() => {
        if (first) {
            dispatch(
                setUserInfo({
                    name: account.name,
                    email: account.username,
                    account: account.username.split('@')[0]
                })
            );

            setFirst(false);
        }

        if (userInfo !== null && userInfo !== 'NO DATA' && currentDepaData !== undefined) {
            const { RoleID, ID, DepartmentID, Department, Avatar, DisplayName } = userInfo;
            dispatch(
                setUserRoleAndID({
                    Role: RoleID,
                    ID,
                    DisplayName,
                    DepartmentID,
                    Code: currentDepaData?.Code
                })
            );

            dispatch(setUserAvatar(Avatar));
        } else if (userInfo !== null && userInfo === 'NO DATA' && currentDepaData !== undefined) {
            dispatch(
                setUserRoleAndID({
                    Role: 5
                })
            );
        } else if (userInfo !== null && userInfo !== 'NO DATA' && currentDepaData === undefined) {
            const { ID, DepartmentID, Avatar, DisplayName } = userInfo;

            dispatch(
                setUserRoleAndID({
                    Role: 1,
                    ID,
                    DisplayName,
                    DepartmentID,
                    Code: currentDepaData?.Code
                })
            );

            dispatch(setUserAvatar(Avatar));
        }
        if (DefaultHead != null) {
            dispatch(
                setDefaulthead({
                    DefaultHead: DefaultHead
                })
            );
        }
    }, [userInfo, DefaultHead]);

    return userInfo === null ? (
        <Loading />
    ) : userInfo.RoleID === 1 ? (
        <BrowserRouter basename="ADMIN">
            <AdminIndex />
        </BrowserRouter>
    ) : (
        <DepartmentSettingLayer currentDepaData={currentDepaData} userInfo={userInfo} />
    );
}
//validate setting
function DepartmentSettingLayer({ currentDepaData, userInfo }) {
    const navigate = useHistory();
    const dispatch = useDispatch();
    const { isLoading } = useSelector((a) => a.LoadingSlice);
    const [currentSettingDepaData] = useRefreshToken(getSetting, currentDepaData?.ID);

    useEffect(() => {
        if (currentSettingDepaData !== null && currentSettingDepaData !== 'NO DATA') {
            dispatch(
                setDepartmentSettingInfo({
                    Logo: currentSettingDepaData.Logo,
                    ConversionRatio: currentSettingDepaData.ConversionRatio,
                    CoinName: currentSettingDepaData.CoinName,
                    PointName: currentSettingDepaData.PointName
                })
            );
        }
    }, [currentSettingDepaData]);

    // validate depa exist
    if (currentDepaData === null || currentDepaData === undefined) {
        navigate.replace('/page-error-404-no-setting');
        return <div>Bye</div>;
    }

    // only default head can access depa that have no setting
    if (
        currentSettingDepaData !== null &&
        (currentDepaData.UserMasters.map((e) => e.ID * 1)[0] !== userInfo.ID * 1 || userInfo.RoleID === undefined) &&
        currentSettingDepaData === 'NO DATA'
    ) {
        navigate.replace('/page-error-404-no-setting');
        return <div>Bye</div>;
    }

    // guest can access or not
    if (
        currentSettingDepaData !== null &&
        userInfo.DepartmentID !== currentDepaData.ID &&
        (currentSettingDepaData.ViewMode !== 'Public' || currentSettingDepaData === 'NO DATA')
    ) {
        navigate.replace('/page-error-404');
        return <div>Bye</div>;
    }

    return (
        currentSettingDepaData && (
            <BrowserRouter basename={'/hoadt36'}>
                <Spin spinning={isLoading} size="large" style={{ maxHeight: '100%', zIndex: 1001 }}>
                    <UserIndex />
                </Spin>
            </BrowserRouter>
        )
    );
}

export default DepartmentLayer;
