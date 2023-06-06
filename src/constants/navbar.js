import userRole from '../constants/role';

const menus = [
    { id: 1, key: 'home', label: 'Home' },
    { id: 2, key: 'leaderboard', label: 'Leaderboard' },
    { id: 3, key: 'request', label: 'Request' }
];

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

const itemSettings = [
    {
        key: '1',
        label: 'Rule & Medal',
        children: [
            {
                key: '1-1',
                label: 'Rule List',
                path: '/rule'
            },
            {
                type: 'divider',
                keyLevel: '1-2'
            },
            {
                key: '1-2',
                label: 'Medal List',
                path: '/medal'
            }
        ]
    },
    {
        type: 'divider',
        keyLevel: '2'
    },
    {
        key: '2',
        label: 'List',
        children: [
            {
                key: '2-1',
                label: 'Project List',
                path: '/project',
                role: [userRole.HEAD, userRole.PM]
            },
            {
                type: 'divider',
                keyLevel: '2-2'
            },
            {
                key: '2-2',
                label: 'Member List',
                path: '/member',
                role: [userRole.HEAD, userRole.PM]
            },
            {
                type: 'divider',
                keyLevel: '2-3'
            }
            // {
            //     key: '2-3',
            //     label: 'Working Time',
            //     path: '/working-time',
            //     role: [userRole.HEAD, userRole.PM]
            // }
        ]
    },
    {
        type: 'divider',
        keyLevel: '3'
    },
    {
        key: '3',
        label: 'Sync',
        path: '/sync',
        role: [userRole.HEAD]
    },
    {
        type: 'divider',
        keyLevel: '4'
    },
    {
        key: '4',
        label: 'Setting',
        path: '/setting',
        role: [userRole.DEFAULT_HEAD]
    }
];

const roles = [
    { value: 2, label: 'Head' },
    { value: 3, label: 'PM' },
    { value: 4, label: 'Member' }
];

const langs = [
    { value: 'en', label: 'English' },
    { value: 'vi', label: 'Tiếng Việt' }
];

export { menus, itemProfiles, itemSettings, roles, langs };
