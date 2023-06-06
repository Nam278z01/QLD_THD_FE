import { useContext, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { Link, useLocation } from 'react-router-dom';
/// Scroll
import { ThemeContext } from '../../../../context/ThemeContext';
/// Image
import defaultimg from '../../../../images/Default.png';
import { Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { imgServer } from '../../../../dataConfig';
import ChangeRoleButton from '../../../user/layouts/nav/ChangeRoleButton';
import { AkaLogoIcon } from '../../../../components/Icons';
import { theme, Select, Space } from 'antd';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import useRefreshToken from '../../../../Hook/useRefreshToken';
import { getAllDepartment } from '../../../../services/DepartmentAPI';
import { useEffect } from 'react';
const Header = () => {
    const navigate = useHistory();
    const { role } = useSelector((state) => state.UserSlice);
    const redirectToPage = (path) => {
        navigate.push(path);
    };
    const {
        token: { colorPrimary }
    } = theme.useToken();
    const { navigationHader, background } = useContext(ThemeContext);
    const { instance } = useMsal();
    const userImgUrl = useSelector((state) => state.UserSlice.imgurl);
    const depaCode = window.location.pathname.split('/')[1].split('.').join(' ');
    const [department, setDepartment] = useState([]);
    const [depData] = useRefreshToken(getAllDepartment, true);
    const onDepChange = (depValue) => {
        const depCode = depValue.split(',')[0].split(' ').join('.');
        const isAuthorized = depValue.split(',')[1];
        localStorage.setItem('deptAuth', isAuthorized);
        window.location.assign(`/${depCode}`);
    };
    useEffect(() => {
        setDepartment(depData ? depData : []);
    }, [depData]);
    return (
        <div className="header border-bottom p-0 px-3" style={{ backgroundColor: colorPrimary, height: '7%' }}>
            <nav className="navbar navbar-expand">
                <div className="collapse navbar-collapse justify-content-between">
                    <div className="dashboard_bar">
                        {background.value === 'dark' || navigationHader !== 'color_1' ? (
                            <AkaLogoIcon
                                onClick={() => redirectToPage('/')}
                                style={{ padding: '0 1rem 0.1rem 0.5rem', cursor: 'pointer' }}
                            />
                        ) : (
                            <AkaLogoIcon
                                onClick={() => redirectToPage('/')}
                                style={{ padding: '0 1rem 0.1rem 0.5rem', cursor: 'pointer' }}
                            />
                        )}
                    </div>
                    <Select
                        defaultValue={depaCode}
                        dropdownMatchSelectWidth={false}
                        className="select-navbar"
                        optionLabelProp="label"
                        onChange={onDepChange}
                    >
                        {department.map((depItem) => (
                            <Select.Option
                                key={depItem.Code}
                                value={`${depItem.Code},${depItem.isAuthorized}`}
                                label={
                                    <Space>
                                        <img
                                            style={{ marginBottom: '0.25rem', maxWidth: 64, height: 24 }}
                                            src={`${imgServer}${depItem.Logo}`}
                                        />
                                        {depItem.Code}
                                    </Space>
                                }
                            >
                                <Space>
                                    <img style={{ maxWidth: 64, height: 24 }} src={`${imgServer}${depItem.Logo}`} />
                                    {depItem.Code}
                                </Space>
                            </Select.Option>
                        ))}
                    </Select>
                    <ul className="navbar-nav header-right ">
                        {/* <Notification /> */}
                        <div className="nav-item d-none d-md-flex">{role !== 'Admin' ? <ChangeRoleButton /> : ''}</div>
                        <Dropdown as="li" className="nav-item dropdown header-profile">
                            <Dropdown.Toggle as="a" className="nav-link i-false c-pointer">
                                <img
                                    src={userImgUrl ? `${imgServer}${userImgUrl}` : defaultimg}
                                    style={{ width: '100%' }}
                                    alt="avatar"
                                />
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="right" className="mt-3 dropdown-menu dropdown-menu-end">
                                <Link
                                    className="dropdown-item ai-icon"
                                    to="#"
                                    onClick={() => instance.logoutRedirect({ postLogoutRedirectUri: '/' })}
                                >
                                    <i className="fas fa-regular fa-right-from-bracket text-danger me-1" />
                                    <span className="ms-2">Sign Out</span>
                                </Link>
                            </Dropdown.Menu>
                        </Dropdown>
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default Header;
