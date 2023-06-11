import { Layout, Menu, theme, Button, Dropdown, Space, Avatar, Row, Col } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import FooterContent from '../../components/Footer';
import NavBar from '../../components/NavBar';
import { routes } from '../../constants/routes';
import { GetTokenV2ContextProvider } from '../../context/GetTokenV2Context';
import './index.css';
import bgMainContent from '../../assets/images/bg_main.svg';
import HomePage from './HomePage';
import Class from './Class';
import TeacherManage from './TeacherManage';
import SupjectManage from './SupjectManage';
import {
    ApartmentOutlined,
    DownOutlined,
    FormOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SolutionOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    AuditOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import userRole from '../../constants/role';
import StudentManage from './StudentManage';
import Block from './Block';
import ScopeManage from './ScopeManage';

const { Header, Content, Footer, Sider } = Layout;
const itemProfiles = [
    {
        key: 0,
        label: 'User Profile',
        path: '/profile'
    },
    {
        type: 'divider'
    },
    {
        label: 'Sign out',
        key: 1
    }
];
const items = [
    {
        key: '1',
        icon: <HomeOutlined />,
        label: 'Trang chủ',
        path: '/home',
        role: [userRole.ADMIN]
    },
    {
        key: '2',
        icon: <ApartmentOutlined />,
        label: 'Quản lý lớp học',
        path: '/class',
        role: [userRole.ADMIN]
    },
    {
        key: '3',
        icon: <SolutionOutlined />,
        label: 'Quản lý giáo viên',
        path: '/teacher',
        role: [userRole.ADMIN]
    },
    {
        key: '4',
        icon: <TeamOutlined />,
        label: 'Quản lý học sinh',
        path: '/student',
        role: [userRole.ADMIN]
    },
    {
        key: '5',
        icon: <FormOutlined />,
        label: 'Quản lý môn học',
        path: '/supject',
        role: [userRole.ADMIN]
    },
    {
        key: '6',
        icon: <AuditOutlined />,
        label: 'Quản lý điểm',
        path: '/scope'
    },
]

const UserIndex = () => {
    const history = useHistory();
    const [collapsed, setCollapsed] = useState(false);
    const { account, userDepartmentCode, imgurl, role, userID } = useSelector((state) => state.UserSlice);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    console.log(account, role);
    const getVisibleItem = (item, keys) => {
        if (!item.role) {
            keys.push(item.key);
            return item;
        } else {
            if (item.role.includes(role)) {
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
        result = itemSettings
            .map((item) => {
                return getVisibleItem(item, keys);
            })
            .filter((item) => !!item);

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
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
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
                localStorage.clear();
                window.location.href = '/';
                break;
            default:
                break;
        }
    };
    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" >
                    hi
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={items}
                    onClick={e => handleSettingMenuClick(e.key, items)}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Row>
                        <Col md={12}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                        </Col>
                        <Col md={12} >
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
                                        />
                                        <span>
                                            {account}{' '}
                                        </span>
                                        <DownOutlined />
                                    </Space>
                                </a>
                            </Dropdown>
                        </Col>
                    </Row>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: '80vh',
                        background: colorBgContainer,
                    }}
                >
                    <Switch>
                        <Route exact path={'/'} component={HomePage} />
                        <Route exact path={'/home'} component={HomePage} />
                        <Route exact path={'/class'} component={Block} />
                        <Route exact path={'/teacher'} component={TeacherManage} />
                        <Route exact path={'/student'} component={StudentManage} />
                        <Route exact path={'/supject'} component={SupjectManage} />
                        <Route exact path={'/scope'} component={ScopeManage} />
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    );
};

export default UserIndex;

{
    // <GetTokenV2ContextProvider>
    //     <Layout style={{ overflow: 'hidden' }}>
    //         {<NavBar />}
    //         <Content style={contentStyle}>
    //             <Switch>
    //                 <Route exact path={'/'} component={HomePage} />
    //                 <Route exact path={'/home'} component={HomePage} />
    //                 <Route exact path={'/member'} component={Member} />
    //                 <Route exact path={'/teacher'} component={TeacherManage} />
    //                 <Route exact path={'/supject'} component={SupjectManage} />
    //                 {/* {routes.map((data, i) => (
    //                         <Route key={i} exact path={data.path} component={data.component} />
    //                     ))} */}
    //             </Switch>
    //         </Content>
    //         {(
    //             <Footer style={footerStyle}>
    //                 <FooterContent />
    //             </Footer>
    //         )}
    //     </Layout>
    // </GetTokenV2ContextProvider>
}