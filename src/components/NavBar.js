import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { useMsal } from '@azure/msal-react';
import { Avatar, Button, Dropdown, Layout, Modal, Select, Space, theme, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import CreateRequest from '../components/User/CreateRequest';
import { itemProfiles, itemSettings, langs, roles } from '../constants/navbar';
import userRole from '../constants/role';
import { routes } from '../constants/routes';
import { GetTokenV2Context } from '../context/GetTokenV2Context';
import { imgServer } from '../dataConfig';
import useAuth from '../Hook/useAuth';
import useRefreshToken from '../Hook/useRefreshToken';
import { getAllDepartment } from '../services/DepartmentAPI';
import { changeUserRole1 } from '../services/UsermasterAPI';
import { AkaLogoIcon, BookIcon, NotifyIcon, ShopIcon, WalletIcon } from './Icons';

const { Text } = Typography;
const { Header } = Layout;
const headerStyle = {
    height: 46,
    display: 'flex',
    padding: 0
};

function NavBar() {
    const history = useHistory();
    const {
        token: { colorPrimary }
    } = theme.useToken();
    const [currentRoute, setCurrentRoute] = useState('');
    const [modalNewRequest, setModalNewRequest] = useState(false);
    const { instance } = useMsal();
    const location = useLocation();
    const depaCode = window.location.pathname.split('/')[1].split('.').join(' ');
    const [department, setDepartment] = useState([]);
    const { account, userDepartmentCode, imgurl, role, userID } = useSelector((state) => state.UserSlice);
    const { DepartmentID } = useSelector((state) => state.DepartmentSettingSlice);
    const { isHead, isPM, isMember, isDefaultHead } = useAuth();
    const [depData] = useRefreshToken(getAllDepartment, true);
    const { t, i18n } = useTranslation();
    const { getToken } = useContext(GetTokenV2Context);

    useEffect(() => {
        setDepartment(depData ? depData : []);
    }, [depData]);

    useEffect(() => {
        const currentPath = location.pathname;
        setCurrentRoute(currentPath);
    }, [location]);

    const onDepChange = (depValue) => {
        const depCode = depValue.split(',')[0].split(' ').join('.');
        const isAuthorized = depValue.split(',')[1];
        localStorage.setItem('deptAuth', isAuthorized);
        window.location.assign(`/${depCode}`);
    };

    const handleRouteChange = (menuId) => {
        setCurrentRoute(menuId);
    };

    const handleMenuClick = (key, data) => {
        const routePath = data.find((item) => item.key == key).path;
        switch (parseInt(key)) {
            case 0:
                setModalNewRequest(true);
                break;
            case 1:
                routePath && history.push(routePath);
                break;
            default:
                break;
        }
    };

    const handleProfileClick = (key, data) => {
        const routePath = data.find((item) => item.key == key).path;
        switch (parseInt(key)) {
            case 0:
                routePath && history.push(routePath);
                break;
            case 1:
                instance.logoutRedirect({ postLogoutRedirectUri: '/' });
                break;
            default:
                break;
        }
    };

    const redirectToPage = (path) => {
        history.push(path);
    };

    const handleChangeLng = (value) => {
        i18n.changeLanguage(value);
    };

    const handleChangeRole = (value) => {
        const body = { RoleID: value };
        getToken(
            changeUserRole1,
            `Change role to ${roles.find((item) => item.value === value).label}`,
            window.location.reload(false),
            null,
            body,
            DepartmentID,
            account
        );
    };

    const getVisibleItem = (item, keys) => {
        if (!item.role) {
            keys.push(item.key);
            return item;
        } else {
            if (item.role.includes(role)) {
                keys.push(item.key);
                return item;
            }
            if (item.role.includes(userRole.DEFAULT_HEAD) && isHead && isDefaultHead) {
                keys.push(item.key);
                return item;
            }
        }
    };

    const getVisibleWithDivider = (items, keys) => {
        let result = [];
        items &&
            items.map((item) => {
                if (item?.type === 'divider' && !keys.filter((item) => !!item).includes(item?.keyLevel)) {
                    return;
                }
                result.push(item);
            });
        return result;
    };

    const getSettingMenu = () => {
        let result = [];
        let keys = [];
        let keysChild = [];
        result = itemSettings
            .map((item) => {
                return getVisibleItem(item, keys);
            })
            .filter((item) => !!item);
        result = getVisibleWithDivider(result, keys);

        result = result.map((itemP) => {
            if (itemP.children) {
                let child = [];
                child = itemP.children
                    .map((menu) => {
                        return getVisibleItem(menu, keysChild);
                    })
                    .filter((i) => !!i);
                child = getVisibleWithDivider(child, keysChild);
                itemP.children = child;
                return itemP;
            }
            return itemP;
        });

        keys = result
            .filter((item) => !item.children || (item.children && item.children.length > 0))
            .map((item) => item.key);
        result = result.filter((item) => {
            if (item.children && item.children.length === 0) return;
            return item;
        });
        result = getVisibleWithDivider(result, keys);

        return result;
    };

    const handleSettingMenuClick = (key, data) => {
        let routes = [];
        data.forEach((item) => {
            if (item.children) {
                item.children.map((iC) => {
                    routes.push(iC);
                });
            } else {
                routes.push(item);
            }
        });
        const routePath = routes.find((item) => item.key == key).path;

        switch (key) {
            case '1-1':
            case '1-2':
            case '2-1':
            case '2-2':
            case '2-3':
            case '3':
            case '4':
                routePath && history.push(routePath);
                break;
            default:
                break;
        }
    };

    const handleRoutesChildren = (routesChild) => {
        let result = [];
        let keys = [];
        let items = routesChild.map((item) => {
            if (item.roles) {
                if (item.roles.includes(role)) {
                    keys.push(item.key);
                    return item;
                }
            } else {
                keys.includes(0) && keys.push(item.key);
                return item;
            }
        });

        items.map((item) => {
            if (item?.type === 'divider' && !keys.filter((item) => !!item).includes(item?.keyLevel)) {
                return;
            }
            result.push(item);
        });
        return result;
    };

    return (
        <Header style={{ ...headerStyle, background: colorPrimary }}>
            <AkaLogoIcon
                onClick={() => redirectToPage('/')}
                style={{ padding: '0 1rem 0.1rem 0.5rem', cursor: 'pointer' }}
            />
            <Space>
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
                {/* <Text style={{ color: '#fff' }}>Role</Text>
                <Select
                    defaultValue={roles.find((item) => item.label === role).value}
                    onChange={handleChangeRole}
                    className="select-navbar"
                    options={roles}
                /> */}
                {/*
                <Select
                    defaultValue="en"
                    className="select-navbar"
                    options={langs}
                    onChange={handleChangeLng}
                /> */}
            </Space>
            <Space style={{ marginLeft: 'auto' }}>
                <Space style={{ margin: '0 0.5rem', display: 'flex' }}>
                    <Space>
                        {routes
                            .filter((item) => item?.visible)
                            .map((route, i) => (
                                <div
                                    className={currentRoute === route.path ? 'menu-item selected' : 'menu-item'}
                                    key={i}
                                >
                                    {route.routes && route.routes.length > 0 ? (
                                        <Dropdown
                                            className="dropdown-navbar"
                                            placement="bottom"
                                            menu={{
                                                items: handleRoutesChildren(route.routes),
                                                onClick: (event) => handleMenuClick(event.key, route.routes)
                                            }}
                                            trigger={['click']}
                                        >
                                            <a onClick={(e) => e.preventDefault()}>
                                                <Space>
                                                    {route.label}
                                                    <DownOutlined />
                                                </Space>
                                            </a>
                                        </Dropdown>
                                    ) : (
                                        <Link className="item" onClick={() => handleRouteChange(i)} to={route.path}>
                                            {route.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                    </Space>
                    <Space style={{ display: 'flex', marginLeft: '2rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button
                                className="btn-navbar"
                                shape="round"
                                icon={<ShopIcon />}
                                onClick={() => redirectToPage('/shop')}
                            >
                                Shop
                            </Button>
                            <Button
                                className="btn-navbar"
                                shape="round"
                                icon={<WalletIcon />}
                                onClick={() => redirectToPage('/wallet')}
                            >
                                My Wallet
                            </Button>
                            {isHead && (
                                <Button
                                    className="btn-navbar"
                                    shape="round"
                                    onClick={() => redirectToPage('/dashboard')}
                                >
                                    Dashboard
                                </Button>
                            )}
                        </div>
                    </Space>
                    <Space style={{ display: 'flex', marginLeft: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <NotifyIcon />
                            <Dropdown
                                className="dropdown-navbar"
                                placement="bottom"
                                menu={{
                                    items: getSettingMenu(),
                                    onClick: (event) => handleSettingMenuClick(event.key, itemSettings)
                                }}
                                trigger={['click']}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <BookIcon />
                                </a>
                            </Dropdown>
                        </div>
                    </Space>
                    <Dropdown
                        className="dropdown-navbar"
                        menu={{ items: itemProfiles, onClick: (event) => handleProfileClick(event.key, itemProfiles) }}
                        trigger={['click']}
                    >
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <Avatar
                                    style={{ marginBottom: '0.25rem', marginLeft: '1rem' }}
                                    icon={<UserOutlined />}
                                    src={`${imgServer}${imgurl}`}
                                />
                                <span>
                                    {userDepartmentCode ? userDepartmentCode.split(' ').join('.') : ''} {account}{' '}
                                </span>
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </Space>
            </Space>
            <Modal
                title="Create Request"
                centered
                width={1000}
                open={modalNewRequest}
                onCancel={() => {
                    setModalNewRequest(false);
                }}
                destroyOnClose={true}
                footer={null}
            >
                <CreateRequest setModal={setModalNewRequest} />
            </Modal>
        </Header>
    );
}

export default NavBar;
