import './style.scss';
export const formFsofterInfomationConfig = [
    {
        type: 'input',
        name: 'DisplayName',
        label: 'Name',
        placeholder: 'Enter your name',
        span: 10,
        offset: 1,
        readOnly: true
    },
    {
        type: 'input',
        name: 'Email',
        label: 'Email',
        placeholder: 'Enter your email address',
        span: 10,
        offset: 1,
        readOnly: true
    },
    {
        type: 'input',
        name: 'Account',
        label: 'Account',
        placeholder: 'Enter your account',
        span: 10,
        offset: 1,
        readOnly: true
    },
    // {
    //     type: 'hidden',
    //     name: '',
    //     label: '',
    //     placeholder: '',
    //     span: 12
    // },
    // {
    //     type: 'title',
    //     title:'Personal Information',
    //     span: 24

    // },
    {
        type: 'select',
        options: [
            {
                label: 'Male',
                value: 'Male'
            },
            {
                label: 'Female',
                value: 'Female'
            },
            {
                label: 'Other',
                value: 'Other'
            }
        ],
        name: 'Gender',
        label: 'Gender',
        placeholder: 'You choose your gender',
        span: 10,
        offset: 1
    },
    {
        type: 'input',
        name: 'Location',
        label: 'Address',
        placeholder: 'Enter your address',
        span: 10,
        offset: 1
    },
    {
        type: 'input',
        name: 'PhoneNumber',
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        span: 10,
        offset: 1
    },
    {
        type: 'input',
        name: 'Favorite',
        label: 'Hobbies',
        placeholder: 'Enter your Hobbies',
        span: 10,
        offset: 1
    },
    {
        type: 'input',
        name: 'MaritalStatus',
        label: 'Relationship Status',
        placeholder: 'Enter your Relationship Status',
        span: 10,
        offset: 1
    },
    {
        type: 'input',
        name: 'LinkFacebook',
        label: 'Facebook',
        placeholder: 'Enter your Facebook',
        span: 10,
        offset: 1
    },
    {
        type: 'input',
        name: 'ForeignLanguage',
        label: 'Languages',
        placeholder: 'Enter your languages',
        span: 10,
        offset: 1
    },
    {
        type: 'input',
        name: 'Linkedin',
        label: 'LinkedIn',
        placeholder: 'Enter your linkedIn',
        span: 10,
        offset: 1
    }
];

// export const validateMessage = [

// ]
