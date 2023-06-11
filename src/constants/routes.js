import HomePage from '../pages/User/HomePage';
import LeaderBoard from '../pages/User/LeaderBoard';
import Request from '../pages/User/Request';
import Rule from '../pages/User/Rule';
import Badge from '../pages/User/Badge';
import UserProfile from '../pages/User/UserProfile';
import Wallet from '../pages/User/Wallet';
import Shop from '../pages/User/Shop';
import ErrorPage from '../pages/ErrorPage';
import ProductDetail from '../pages/User/ProductDetail';
import Project from '../pages/User/Project';
import Class from '../pages/User/Class';
import Setting from '../pages/User/Setting';
import SyncData from '../pages/User/SyncData';
import WorkingTime from '../pages/User/WorkingTime';
import userRole from './role';
import CallData from '../jsx/user/pages/Point/Dashboard/callData';

const routes = [
    {
        path: '/',
        component: HomePage,
        label: 'Home',
        visible: false
    },
    {
        path: '/home',
        component: HomePage,
        label: 'Home',
        visible: true
    },
    {
        path: '/request',
        component: Request,
        label: 'Request',
        visible: true,
        routes: [
            {
                key: 0,
                label: 'Create Request',
                roles: [userRole.PM, userRole.MEMBER]
            },
            {
                type: 'divider',
                keyLevel: 1
            },
            {
                key: 1,
                path: '/request',
                label: 'List Request'
            }
        ]
    },
    {
        path: '/rule',
        component: Rule,
        label: 'Rules list'
    },
    {
        path: '/medal',
        component: Badge,
        label: 'Medals List'
    },
    {
        path: ['/profile', '/profile/:id'],
        component: UserProfile,
        label: 'Profile'
    },
    {
        path: '/dashboard',
        component: CallData,
        label: 'Dashboard'
    },
    {
        path: '/wallet',
        component: Wallet,
        label: 'My Wallet'
    },
    {
        path: '/shop',
        component: Shop,
        label: 'Shop'
    },
    {
        path: '/product/:id',
        component: ProductDetail,
        label: 'Product Detail'
    },
    {
        path: '/project',
        component: Project,
        label: 'Project List'
    },
    {
        path: '/member',
        component: Class,
        label: 'Member List'
    },
    {
        path: '/working-time',
        component: WorkingTime,
        label: 'Working Time'
    },
    {
        path: '/sync',
        component: SyncData,
        label: 'Sync'
    },
    {
        path: '/setting',
        component: Setting,
        label: 'Setting'
    },
    {
        path: '*',
        component: ErrorPage
    }
];

export { routes };
