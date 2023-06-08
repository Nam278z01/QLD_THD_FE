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
        label: 'Môn học',
        children: [
            {
                key: '1-1',
                label: 'Toán',
                path: '/rule'
            },
            {
                type: 'divider',
                keyLevel: '1-2'
            },
            {
                key: '1-2',
                label: 'Văn',
                path: '/rule'
            },
            {
                type: 'divider',
                keyLevel: '1-3'
            },
            {
                key: '1-3',
                label: 'Anh',
                path: '/rule'
            },
            {
                type: 'divider',
                keyLevel: '1-4'
            },
            {
                key: '1-4',
                label: 'Ngoại ngữ',
                path: '/rule'
            },
            {
                type: 'divider',
                keyLevel: '1-5'
            },
            {
                key: '1-5',
                label: 'Địa',
                path: '/rule'
            },
            {
                type: 'divider',
                keyLevel: '1-6'
            },
        ]
    },
    // {
    //     type: 'divider',
    //     keyLevel: '2'
    // },
    // {
    //     key: '2',
    //     label: 'List',
    //     children: [
    //         {
    //             key: '2-1',
    //             label: 'Project List',
    //             path: '/project',
    //         },
    //         {
    //             type: 'divider',
    //             keyLevel: '2-2'
    //         },
    //         {
    //             key: '2-2',
    //             label: 'Member List',
    //             path: '/member'
    //         },
    //         {
    //             type: 'divider',
    //             keyLevel: '2-3'
    //         }
            // {
            //     key: '2-3',
            //     label: 'Working Time',
            //     path: '/working-time',
            //     role: [userRole.HEAD, userRole.PM]
            // }
    //     ]
    // },
    // {
    //     type: 'divider',
    //     keyLevel: '3'
    // },
    // {
    //     key: '3',
    //     label: 'Sync',
    //     path: '/sync'
    // },
    // {
    //     type: 'divider',
    //     keyLevel: '4'
    // },
    // {
    //     key: '4',
    //     label: 'Setting',
    //     path: '/setting'
    // }
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
